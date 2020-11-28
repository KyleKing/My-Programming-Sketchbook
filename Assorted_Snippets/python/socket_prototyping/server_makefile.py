"""Based on https://stackoverflow.com/q/59978887/3219667.

Update: not working. May want to revisit

"""

import socket

from loguru import logger

HOST = '127.0.0.1'
PORT = 65439

ACK_TEXT = 'text_received'


def main():
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
        sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        sock.bind((HOST, PORT))

        logger.debug(f'Waiting for connection on port {sock.getsockname()[1]}')
        sock.listen(1)

        while True:
            conn, addr = sock.accept()
            logger.debug(f'Connected by {addr}')
            with conn:
                sock_file = conn.makefile(mode='rw')
                logger.debug('> before sock_file.readline()')
                msg = sock_file.readline()
                logger.debug('< after sock_file.readline()')
                logger.debug(f'msg: {msg!r}')

                if not msg:
                    exit(0)

                sock_file.write(msg)
                sock_file.flush()


if __name__ == '__main__':
    main()
