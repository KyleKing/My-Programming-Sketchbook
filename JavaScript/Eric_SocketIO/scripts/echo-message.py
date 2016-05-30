import sys
import json

# simple JSON echo script
for line in sys.stdin:
    print line[:-1]

# use: pyshell.send('message') and:
# pyshell.on('message', function (message) {
#   console.log(message);
# });
# See example: https://github.com/extrabacon/python-shell/blob/master/test/test-python-shell.js#L173
