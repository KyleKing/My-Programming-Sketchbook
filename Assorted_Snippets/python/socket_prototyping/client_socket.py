"""Client Socket.

Adapted from: https://medium.com/python-pandemonium/python-socket-communication-e10b39225a4c

"""

import socket

from loguru import logger

# Create a TCP/IP socket
sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

# Connect the socket to the port where the server is listening
server_address = ('localhost', 10000)
logger.info('connecting to {} port {}'.format(*server_address))
sock.connect(server_address)

try:
    # Send data
    message = b'This is our message. It is very long but will only be transmitted in chunks of 16 at a time'
    logger.info('sending {!r}'.format(message))
    sock.sendall(message)

    # Look for the response
    amount_received = 0
    amount_expected = len(message)

    while amount_received < amount_expected:
        data = sock.recv(16)
        amount_received += len(data)
        logger.info('received {!r}'.format(data))
finally:
    logger.info('closing socket')
    sock.close()
