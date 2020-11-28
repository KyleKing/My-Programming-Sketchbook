"""Create a STDOUT/STDIN FileLikeSocket for working with cmd2.

- Ticket1: https://github.com/python-cmd2/cmd2/issues/11#issuecomment-182429108
- Ticket2: https://github.com/python-cmd2/cmd2/issues/1020

"""

import socket
import sys
from io import StringIO

import cmd2


class FileLikeSocket:
    """Simple Implementation.

    Source: https://python-patterns.guide/gang-of-four/composition-over-inheritance/

    """

    def __init__(self, sock):
        self.sock = sock

    def write(self, message_and_newline):
        self.sock.sendall(message_and_newline.encode('ascii'))

    def flush(self):
        pass

# Full Blown Mock. Source: https://github.com/explorigin/Rocket/blob/master/rocket/filelike.py


class FullFileLikeSocket:

    def __init__(self, conn, buf_size=4096):
        self.conn = conn
        self.buf_size = buf_size
        self.buffer = StringIO()
        self.content_length = None

        if self.conn.socket.gettimeout() == 0.0:
            self.read = self.non_blocking_read
        else:
            self.read = self.blocking_read

    def __iter__(self):
        return self

    def recv(self, size):
        while True:
            try:
                return self.conn.recv(size)
            except socket.error:
                exc = sys.exc_info()
                e = exc[1]
                # FIXME - Don't raise socket_errors_nonblocking or socket_error_eintr
                if (e.args[0] not in set()):
                    raise

    def next(self):
        data = self.readline()
        if data == '':
            raise StopIteration
        return data

    def non_blocking_read(self, size=None):
        # Shamelessly adapted from Cherrypy!
        bufr = self.buffer
        bufr.seek(0, 2)
        if size is None:
            while True:
                data = self.recv(self.buf_size)
                if not data:
                    break
                bufr.write(data)

            self.buffer = StringIO()

            return bufr.getvalue()
        else:
            buf_len = self.buffer.tell()
            if buf_len >= size:
                bufr.seek(0)
                data = bufr.read(size)
                self.buffer = StringIO(bufr.read())
                return data

            self.buffer = StringIO()
            while True:
                remaining = size - buf_len
                data = self.recv(remaining)

                if not data:
                    break

                n = len(data)
                if n == size and not buf_len:
                    return data

                if n == remaining:
                    bufr.write(data)
                    del data
                    break

                bufr.write(data)
                buf_len += n
                del data

            return bufr.getvalue()

    def blocking_read(self, length=None):
        if length is None:
            if self.content_length is not None:
                length = self.content_length
            else:
                length = 1

        try:
            data = self.conn.recv(length)
        except:
            data = b''

        return data

    def readline(self):
        data = b""
        char = self.read(1)
        while char != b'\n' and char is not b'':
            line = repr(char)
            data += char
            char = self.read(1)
        data += char
        return data

    def readlines(self, hint="ignored"):
        return list(self)

    def close(self):
        self.conn = None
        self.content_length = None
