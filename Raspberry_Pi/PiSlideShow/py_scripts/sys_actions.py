# -*- coding: utf-8 -*-
import sys
import m_FBI
import m_LCD
import config as cg

cg.send("Initializing Sys Actions Python Script")
m_FBI.configure()
m_LCD.configure()

line = ' '
while line:
    # Parse STDIN
    line = sys.stdin.readline().strip().lower()
    print 'Received: ' + line
    try:
        task, term = line.split(' ')
    except:
        task = line
        term = ''
    # Pick sub-module to run based on STDIN:
    if 'lcd' == task:
        cg.send('\nRunning m_LCD')
        m_LCD.toggle(term)
    elif 'fbi' == task:
        cg.send('\nRunning m_FBI')
        m_FBI.refresh_task()
    elif 'close' == task:
        cg.send('\nClosing everything down')
        m_FBI.close()
        m_LCD.close()
        sys.exit()
    else:
        cg.send('Unrecognized command')
