/**
 * Copyright (c) 2011 Daniel Berenguer <dberenguer@usapiens.com>
 * 
 * swquery.cpp
 *
 * This file is part of the panStamp project.
 * 
 * panStamp  is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * any later version.
 * 
 * panLoader is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with panLoader; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301 
 * USA
 * 
 * Author: Daniel Berenguer
 * Creation date: 03/03/2011
 */

#include "swquery.h"
#include "panstamp.h"

/**
 * SWQUERY
 * 
 * Class constructor
 * 
 * 'dAddr'	Destination address
 * 'rAddr'	Register address
 * 'rId'	  Register id
 */
SWQUERY::SWQUERY(byte dAddr, byte rAddr, byte rId)
{
  destAddr = dAddr;
  srcAddr = panstamp.cc1101.devAddress;
  hop = 0;
  security = panstamp.security & 0x0F;
  nonce = 0;
  function = SWAPFUNCT_QRY;
  regAddr = rAddr;
  regId = rId;
  value.data = NULL;
  value.length = 0;
}

