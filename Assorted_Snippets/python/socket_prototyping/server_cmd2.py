"""Create cmd2 app server.

Based on ticket: https://github.com/python-cmd2/cmd2/issues/1020
And cmd2 example: https://cmd2.readthedocs.io/en/latest/examples/first_app.html

```
I worked around this by making a class called FilelikeSocket that was just a socket with read, write, etc. methods defined so that I could pass the connection object to Cmd's stdin and stdout arguments, but it'd be nice if Cmd could just take a standard connection object for those args and magically do the conversion from read()/readlines() to recv() and write() to send().
```

"""

import argparse
import socket

import cmd2
from cmd2 import Cmd
from loguru import logger

BUF_SIZE = 4096
HOST, PORT = ('localhost', 8081)
EOL = '\n'

echo_parser = argparse.ArgumentParser()
echo_parser.add_argument('words', nargs='+', help='words to say')


class FirstApp(Cmd):

    def __init__(self, fd):
        super().__init__(stdin=fd, stdout=fd)
        self.use_rawinput = False

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

    def readline(self, *, _buf_size=1):
        # Look for the response
        logger.info('Called readline')
        data = ''
        while EOL not in data:
            data += self.conn.recv(_buf_size).decode()
        logger.info(f'Received ({type(data)}) `{data}`')
        return data

    def read(self):
        logger.info('Called read')
        return self.readline(_buf_size=BUF_SIZE)

    def write(self, message_and_newline):
        logger.info('Called write')
        self.conn.sendall(message_and_newline.encode('ascii'))

    def flush(self):
        logger.info('Called flush')
        pass


if __name__ == '__main__':
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    # Bind the socket to the port
    logger.info(f'Starting Server on {HOST} port {PORT}')
    sock.bind((HOST, PORT))
    # Listen for incoming connections
    sock.listen(1)

    while True:
        # Wait for a connection
        logger.info('Waiting for a connection')
        connection, client_address = sock.accept()
        try:
            logger.info(f'Connection from: {client_address}')
            # STDIN: data = connection.recv(BUF_SIZE)
            # STDOUT: connection.sendall(data)
            file_like_socket = FileLikeSocket(connection)
            app = FirstApp(file_like_socket)
            app.cmdloop()
        finally:
            # Clean up the connection
            logger.info('Closing current connection')
            connection.close()
