"""Based on https://stackoverflow.com/q/59978887/3219667.

Update: not working. May want to revisit

"""

import socket
import time

from loguru import logger

HOST = '127.0.0.1'
PORT = 65439

ACK_TEXT = 'text_received'


def main():
    # instantiate a socket object
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

    # connect the socket
    logger.info(f'Connecting to {HOST} port {PORT}')
    sock.connect((HOST, PORT))

    sock_file = sock.makefile(mode='w')
    try:
        counter = 0
        while True:
            message = f'message {counter}\n'
            logger.debug(f'Sending: `{message}`')
            sock_file.write(message)

            # msg = sock_file.readline()
            # logger.debug(f'Received: `{msg}`')

            counter += 1
            time.sleep(1)       # wait for 1 sec before sending next text message
    finally:
        logger.info('Closing socket')
        sock.close()


if __name__ == '__main__':
    main()
