"""Client Socket.

Adapted from: https://medium.com/python-pandemonium/python-socket-communication-e10b39225a4c

"""

import socket

from loguru import logger

BUF_SIZE = 4096
HOST, PORT = ('localhost', 8081)
EOL = '\n'

# Connect the socket to the port where the server is listening
timeout = 5
logger.info(f'Connecting to {HOST} port {PORT}')
sock = socket.create_connection((HOST, PORT), timeout)

try:
    # Send data
    messages = ['echo Hello World!', 'exit']
    for message in messages:
        logger.info(f'Sending {message!r}')
        sock.sendall((message + EOL).encode('ascii'))

        # Look for the response
        logger.info('Waiting for response')
        data = ''
        while EOL not in data:
            data += sock.recv(BUF_SIZE).decode()
        logger.info(f'Received ({type(data)}) `{data}`')

    sock.sendall(('quit' + EOL).encode('ascii'))
finally:
    logger.info('Closing socket')
    sock.close()
