"""Server Socket.

Adapted from: https://medium.com/python-pandemonium/python-socket-communication-e10b39225a4c

"""

import socket

from loguru import logger

# Create a TCP/IP socket
sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

# Bind the socket to the port
server_address = ('localhost', 10000)
logger.info('Starting up on {} port {}'.format(*server_address))
sock.bind(server_address)

# Listen for incoming connections
sock.listen(1)

while True:
    # Wait for a connection
    logger.info('waiting for a connection')
    connection, client_address = sock.accept()
    try:
        logger.info('connection from', client_address)
        # Receive the data in small chunks and retransmit it
        while True:
            data = connection.recv(16)
            logger.info('received {!r}'.format(data))
            if data:
                logger.info('sending data back to the client')
                connection.sendall(data)
            else:
                logger.info('no data from', client_address)
                break
    finally:
        # Clean up the connection
        logger.info("Closing current connection")
        connection.close()
