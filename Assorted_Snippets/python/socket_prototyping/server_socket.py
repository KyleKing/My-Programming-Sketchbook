"""Server Socket.

Adapted from: https://medium.com/python-pandemonium/python-socket-communication-e10b39225a4c

"""

import socket

from loguru import logger

BUF_SIZE = 16
HOST, PORT = ('localhost', 8081)

# Create a TCP/IP socket
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
        # Receive the data in small chunks and retransmit it
        while True:
            data = connection.recv(BUF_SIZE)
            logger.info(f'> Received {data!r}')
            if data:
                logger.info('< Sending data back to the client')
                connection.sendall(data)
            else:
                logger.info('No data from', client_address)
                break
    finally:
        # Clean up the connection
        logger.info('Closing current connection')
        connection.close()
