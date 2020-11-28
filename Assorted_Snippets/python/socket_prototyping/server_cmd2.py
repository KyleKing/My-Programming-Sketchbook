"""Create cmd2 app server.

Based on ticket: https://github.com/python-cmd2/cmd2/issues/1020
And cmd2 example: https://cmd2.readthedocs.io/en/latest/examples/first_app.html

"""

import socket

import cmd2
from cmd2 import Cmd, Cmd2ArgumentParser
from loguru import logger

BUFF_SIZE = 4096
HOST, PORT = ('localhost', 8085)
EOL = '\n'

echo_parser = Cmd2ArgumentParser()
echo_parser.add_argument('words', nargs='+', help='words to say')


class FirstApp(Cmd):

    def __init__(self, fd):
        super().__init__(stdin=fd, stdout=fd)
        self.use_rawinput = False
        self.feedback_to_output = True

    @cmd2.with_argparser(echo_parser)
    def do_echo(self, statement):
        """Repeats what you tell me to."""
        logger.info(statement.words)
        self.poutput(' '.join(statement.words))


class FileLikeSocket:
    """Simple Implementation.

    Based on: https://python-patterns.guide/gang-of-four/composition-over-inheritance/
    And: https://github.com/explorigin/Rocket/blob/master/rocket/filelike.py

    """

    def __init__(self, conn):
        self.conn = conn

    def isatty(self):
        return True

    def readline(self, *, _buff_size=1):
        # Look for the response
        logger.info('Called readline')
        data = ''
        while EOL not in data:
            data += self.conn.recv(_buff_size).decode()
        logger.info(f'Received ({type(data)}) `{data}`')
        return data

    def read(self):
        logger.info('Called read')
        return self.readline(_buff_size=BUFF_SIZE)

    def write(self, message_and_newline):
        logger.info('Called write')
        # self.conn.sendall((message_and_newline.strip() + EOL).encode('ascii'))
        self.conn.sendall(message_and_newline.encode('ascii'))

    def flush(self):
        logger.info('Called flush')
        pass


# import sys
# from functools import partial
# from io import StringIO


# def send_err(message, conn):
#     print(message)
#     conn.sendall(message.encode('ascii'))


# def stderr_capture(conn):
#     # tmp_err = StringIO()
#     # sys.stderr = tmp_err
#     # # The original `sys.stderr` is kept in a special dunder named `sys.__stderr__`
#     # # So you can restore the original errput stream to the terminal
#     # sys.stderr = sys.__stderr__
#     sys.stderr.__write = sys.stderr.write
#     sys.stderr.write = partial(send_err, conn=connection)
#     # return tmp_err


# def stderr_restore():
#     # sys.stderr = sys.__stderr__
#     sys.stderr.write = sys.stderr.__write


if __name__ == '__main__':
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    # Bind the socket to the port
    logger.info(f'Starting Server on {HOST} port {PORT}')
    sock.bind((HOST, PORT))
    # Listen for incoming connections
    sock.listen(1)

    clean_exit = False
    while not clean_exit:
        # Wait for a connection
        logger.info('Waiting for a connection')
        connection, client_address = sock.accept()
        try:
            logger.info(f'Connection from: {client_address}')
            # tmp_err = stderr_capture(connection)
            file_like_socket = FileLikeSocket(connection)
            app = FirstApp(file_like_socket)
            app.cmdloop()
            clean_exit = True
        finally:
            # Clean up the connection
            logger.info('Closing current connection')
            connection.close()
            # stderr_restore()
