"""Client Socket.

Adapted from: https://medium.com/python-pandemonium/python-socket-communication-e10b39225a4c

"""

import socket

from loguru import logger

BUF_SIZE = 16
HOST, PORT = ('localhost', 8081)

# Create a TCP/IP socket
# sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

# Connect the socket to the port where the server is listening
timeout = 5
logger.info(f'Connecting to {HOST} port {PORT}')
# sock.connect((HOST, PORT))
sock = socket.create_connection((HOST, PORT), timeout)

try:
    # Send data
    message = b'This is our long message that will only be transmitted in chunks of BUF_SIZE at a time\n'
    logger.info(f'Sending {message!r}')
    sock.sendall(message)

    # Look for the response
    data = ''
    matched_eol = False
    while not matched_eol:
        data += sock.recv(BUF_SIZE).decode()
        matched_eol = '\n' in data
        if not matched_eol:
            data += '|'
    logger.info(f'Received ({type(data)}) `{data}`')
finally:
    logger.info('Closing socket')
    sock.close()
