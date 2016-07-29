# Echo demo
# var pyshell = new PythonShell('echo.py');
# # sends a message to the Python script via stdin
# pyshell.send('hello');

import sys

# simple JSON echo script
for line in sys.stdin:
    print line[:-1]
