"""Create cmd2 app server.

Based on ticket: https://github.com/python-cmd2/cmd2/issues/1020
And cmd2 example: https://cmd2.readthedocs.io/en/latest/examples/first_app.html

"""

import argparse
import socket

from loguru import logger

import cmd2
from cmd2 import Cmd

BUF_SIZE = 16
HOST, PORT = ('localhost', 8081)

echo_parser = argparse.ArgumentParser()
echo_parser.add_argument('words', nargs='+', help='words to say')


class FirstApp(Cmd):

    def __init__(self, fd):
        super().__init__(stdin=fd, stdout=fd)
        # super().__init__(stdout=fd)
        # self.use_rawinput = False

    @cmd2.with_argparser(echo_parser)
    def do_echo(self, statement):
        """Repeats what you tell me to."""
        self.poutput(' '.join(statement.words))


if __name__ == '__main__':
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    # Bind the socket to the port
    logger.info(f'Starting Server on {HOST} port {PORT}')
    sock.bind((HOST, PORT))
    # srv.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)

    # Listen for incoming connections
    sock.listen(1)
    # srv.listen(0)

    # Wait for a connection
    logger.info('Waiting for a connection')
    sock_resp, addr_resp = sock.accept()
    sock_file = sock_resp.makefile('rw', None)
    app = FirstApp(sock_file)
    app.cmdloop()
