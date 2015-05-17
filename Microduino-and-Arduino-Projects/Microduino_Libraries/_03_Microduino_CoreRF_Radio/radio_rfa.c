/* Copyright (c) 2009 Axel Wachtler
   All rights reserved.

   Redistribution and use in source and binary forms, with or without
   modification, are permitted provided that the following conditions
   are met:

   * Redistributions of source code must retain the above copyright
     notice, this list of conditions and the following disclaimer.
   * Redistributions in binary form must reproduce the above copyright
     notice, this list of conditions and the following disclaimer in the
     documentation and/or other materials provided with the distribution.
   * Neither the name of the authors nor the names of its contributors
     may be used to endorse or promote products derived from this software
     without specific prior written permission.

   THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
   AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
   IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
   ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
   LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
   CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
   SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
   INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
   CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
   ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
   POSSIBILITY OF SUCH DAMAGE. */

/* $Id: radio_rfa.c,v 1.7 2010/11/17 16:17:54 awachtler Exp $ */
/**
 * @file
 * @brief
 * Implementation of high level radio functions for AT86RF230 chip
 *
 */

/* === includes ============================================================ */
#include <stdbool.h>
#include <avr/io.h>
#include <avr/pgmspace.h>
#include "ZigduinoRadioCfg.h"
#include "radio.h"
#include "transceiver.h"

#if defined(TRX_IF_RFA1)
/* === globals ============================================================= */
static radio_status_t radiostatus;
extern uint8_t temprssi;
uint8_t temprssi;
//trx_param_t PROGMEM radio_cfg_flash = RADIO_CFG_DATA;

/* === prototypes ========================================================== */
void radio_irq_handler(uint8_t cause);


/* === functions ============================================================ */

/* === internal functions ====================================================*/
/**
 * @brief Error handler
 *
 * @param  err error value (see enumeration radio_error_t)
 * @ingroup grpRadio
 */

void radio_error(radio_error_t err)
{
    usr_radio_error(err);
}

/**
 * @brief Frame reception
 *
 */
void radio_receive_frame(void)
{
    uint8_t len, lqi, crc_fail;
    
    crc_fail = trx_bit_read(SR_RX_CRC_VALID) ? 0 : 1;
    len = trx_frame_read(radiostatus.rxframe, radiostatus.rxframesz, &lqi);
    len &= ~0x80;
	
    radiostatus.rxframe = usr_radio_receive_frame(len, radiostatus.rxframe,
                                                  lqi, crc_fail);
}

/**
 * @brief IRQ handler for radio functions.
 *
 * This function is called in the transceiver interrupt routine.
 * Keep the implementation of the callback functions
 * (usr_radio_irq, usr_radio_receive_frame) short and efficient.
 *
 * @parm cause  value of the interrupt status register
 *
 */
ISR(TRX24_RX_END_vect)
{
	ZR_RFRX_LED_OFF();
	
    radio_receive_frame();
} 

ISR(TRX24_RX_START_vect)
{
	ZR_RFRX_LED_ON();
	temprssi = trx_reg_read(RG_PHY_RSSI);
}



ISR(TRX24_TX_END_vect)
{
	ZR_RFTX_LED_OFF();
	
    if (radiostatus.state == STATE_TX)
    {
        usr_radio_tx_done(TX_OK);
        radio_set_state(radiostatus.idle_state);
    }
    else if (radiostatus.state == STATE_TXAUTO)
    {
        uint8_t trac_status = trx_bit_read(SR_TRAC_STATUS);
        uint8_t result;
        switch (trac_status)
        {
        case TRAC_SUCCESS:
        case TRAC_SUCCESS_DATA_PENDING:
        case TRAC_SUCCESS_WAIT_FOR_ACK:
            result = TX_OK;
            break;

        case TRAC_CHANNEL_ACCESS_FAILURE:
            result = TX_CCA_FAIL;
            break;

        case TRAC_NO_ACK:
            result = TX_NO_ACK;
            break;

        default:
            result = TX_FAIL;
        }
        usr_radio_tx_done(result);
        radio_set_state(radiostatus.idle_state);
    }
} 

/* === external functions ====================================================*/

void radio_init(uint8_t * rxbuf, uint8_t rxbufsz)
{
trx_regval_t status;
    /* init cpu peripherals and global IRQ enable */
    radiostatus.rxframe = rxbuf;
    radiostatus.rxframesz = rxbufsz;
    //trx_set_irq_handler(radio_irq_handler);
    /* transceiver initialization */

    TRX_RESET_LOW();
    TRX_SLPTR_LOW();
    DELAY_US(TRX_RESET_TIME_US);
    #if defined(CUSTOM_RESET_TIME_MS)
        DELAY_MS(CUSTOM_RESET_TIME_MS);
    #endif
    TRX_RESET_HIGH();

    /* disable IRQ and clear any pending IRQs */
    trx_reg_write(RG_IRQ_MASK, 0);
    trx_reg_read(RG_IRQ_STATUS);
    trx_bit_write(SR_TRX_CMD, CMD_TRX_OFF);
    DELAY_US(510);
    status = trx_bit_read(SR_TRX_STATUS);
    if (status != TRX_OFF)
    {
        radio_error(STATE_SET_FAILED);
    }
    trx_bit_write(SR_TX_AUTO_CRC_ON, 1);
    trx_reg_write(RG_IRQ_MASK, TRX_IRQ_RX_START | TRX_IRQ_RX_END | TRX_IRQ_TX_END);

    radiostatus.state = STATE_OFF;
    radiostatus.idle_state = STATE_OFF;
}


void radio_force_state(radio_state_t state)
{
    trx_bit_write(SR_TRX_CMD, CMD_FORCE_TRX_OFF);
    radio_set_state(state);
}

void radio_set_state(radio_state_t state)
{
volatile trx_regval_t cmd, expstatus, currstatus;
uint8_t retries;
bool do_sleep = false;

    switch(state)
    {
        case STATE_OFF:
            expstatus = TRX_OFF;
            cmd = CMD_TRX_OFF;
            break;

        case STATE_RX:
            expstatus = RX_ON;
            cmd = CMD_RX_ON;
            break;

        case STATE_TX:
            expstatus = PLL_ON;
            cmd = CMD_PLL_ON;
            break;

        case STATE_RXAUTO:
            expstatus = RX_AACK_ON;
            cmd = CMD_RX_AACK_ON;
            break;

        case STATE_TXAUTO:
            expstatus = TX_ARET_ON;
            cmd = CMD_TX_ARET_ON;
            break;

        case STATE_SLEEP:
            expstatus = TRX_OFF;
            cmd = CMD_FORCE_TRX_OFF;
            do_sleep = true;
            break;

        default:
            radio_error(GENERAL_ERROR);
            expstatus = TRX_OFF;
            cmd = CMD_TRX_OFF;
            break;

     }

    if (radiostatus.state == STATE_SLEEP)
    {
        if (do_sleep)
        {
            return;
        }
        TRX_SLPTR_LOW();
        /*
         * Give the xosc some time to start up.  Once it started, the
         * SPI interface is operational, and the transceiver state can
         * be polled.  The state reads as 0b0011111 ("state transition
         * in progress") while the transceiver is still in its startup
         * phase, which does not match any of the "expstatus" values,
         * so polling just continues.
         */
        DELAY_US(500);
    }
    trx_bit_write(SR_TRX_CMD, cmd);

    retries = 140;              /* enough to await an ongoing frame
                                 * reception */
    do
    {
        currstatus = trx_bit_read(SR_TRX_STATUS);
        if (expstatus == currstatus)
        {
            break;
        }
        /** @todo must wait longer for 790/868/900 MHz radios */
        DELAY_US(32);
    }
    while (retries--);

    if (expstatus != currstatus)
    {
        radio_error(STATE_SET_FAILED);
    }

    if (do_sleep)
    {
        TRX_SLPTR_HIGH();
    }

    radiostatus.state = state;
}

void radio_set_param(radio_attribute_t attr, radio_param_t parm)
{
    switch (attr)
    {
        case phyCurrentChannel:
            if (((int)parm.channel >= TRX_MIN_CHANNEL) &&
                ((int)parm.channel <= TRX_MAX_CHANNEL))
            {
                trx_bit_write(SR_CHANNEL, parm.channel);
                radiostatus.channel = parm.channel;
            }
            else
            {
                radio_error(SET_PARM_FAILED);
            }
            break;

        case phyTransmitPower:
            if (parm.tx_pwr >= -17 && parm.tx_pwr <= 3)
            {
                /** @todo move this into a radio-specific header file */
                static const prog_uint8_t pwrtable[] =
                {
                    0x0F, 0x0F, 0x0F, 0x0F, 0x0F, /* -17...-13 dBm */
                    0x0E, 0x0E, 0x0E,             /* -12...-10 dBm */
                    0x0D, 0x0D,                   /* -9...-8 dBm */
                    0x0C, 0x0C,                   /* -7...-6 dBm */
                    0x0B,                         /* -5 dBm */
                    0x0A,                         /* -4 dBm */
                    0x09,                         /* -3 dBm */
                    0x08,                         /* -2 dBm */
                    0x07,                         /* -1 dBm */
                    0x06,                         /* 0 dBm */
                    0x04,                         /* 1 dBm */
                    0x02,                         /* 2 dBm */
                    0x00                          /* 3 dBm */
                };
                radiostatus.tx_pwr = parm.tx_pwr;
                uint8_t idx = parm.tx_pwr + 17;
                uint8_t pwrval = pgm_read_byte(pwrtable[idx]);
                trx_bit_write(SR_TX_PWR, pwrval);
            }
            else
            {
                radio_error(SET_PARM_FAILED);
            }
            break;

        case phyCCAMode:
            if (parm.cca_mode <= 3)
            {
                radiostatus.cca_mode = parm.cca_mode;
                trx_bit_write(SR_CCA_MODE, radiostatus.cca_mode);
            }
            else
            {
                radio_error(SET_PARM_FAILED);
            }
            break;

        case phyIdleState:
            radiostatus.idle_state = parm.idle_state;
            radio_set_state(parm.idle_state);
            break;

        case phyChannelsSupported:
            break;

        case phyPanId:
            trx_set_panid(parm.pan_id);
            break;

        case phyShortAddr:
            trx_set_shortaddr(parm.short_addr);
            break;

        case phyLongAddr:
        {
            uint8_t regno, *ap;
            for (regno = RG_IEEE_ADDR_0, ap = (uint8_t *)parm.long_addr;
                 regno <= RG_IEEE_ADDR_7;
                 regno++, ap++)
                trx_reg_write(regno, *ap);
            break;
        }

        case phyDataRate:
            trx_set_datarate(parm.data_rate);
            break;

        default:
            radio_error(SET_PARM_FAILED);
            break;
    }
}


void radio_send_frame(uint8_t len, uint8_t *frm, uint8_t compcrc)
{
    trx_frame_write(len, frm);
    TRX_SLPTR_HIGH();
    TRX_SLPTR_LOW();
}

radio_cca_t radio_do_cca(void)
{
uint8_t tmp, trxcmd, trxstatus;
radio_cca_t ret = RADIO_CCA_FREE;

    trxcmd = trx_reg_read(RG_TRX_STATE);
    trx_reg_write(RG_TRX_STATE, CMD_RX_ON);
    tmp = 130;
    do
    {
         trxstatus = trx_bit_read(SR_TRX_STATUS);
         if ((trxstatus == RX_ON) || (trxstatus == BUSY_RX))
         {
            break;
         }
         DELAY_US(32); /* wait for one octett */
    }
    while(tmp-- > 0);

    trx_reg_write(RG_TRX_STATE, CMD_PLL_ON);
    trx_reg_write(RG_TRX_STATE, CMD_RX_ON);

    trx_bit_write(SR_CCA_REQUEST,1);
    DELAY_US(140);
    /* we need to read the whole status register
     * because CCA_DONE and CCA_STATUS are valid
     * only for one read, after the read they are reset
     */
    tmp = trx_reg_read(RG_TRX_STATUS);

    if((tmp & 0x80) == 0)
    {
        ret = RADIO_CCA_FAIL;
    }
    else if (tmp & 0x40)
    {
        ret = RADIO_CCA_FREE;
    }
    else
    {
        ret = RADIO_CCA_BUSY;
    }

    trx_reg_write(RG_TRX_STATE, trxcmd);

    return ret;
}
#endif /*if defined(TRX_IF_RFA1) */
/* EOF */
