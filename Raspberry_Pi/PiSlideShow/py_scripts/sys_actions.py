# -*- coding: utf-8 -*-
import sys
import m_FBI
import m_TFT
import config as cg

cg.send("Initializing Sys Actions through Python")
m_FBI.configure()
m_TFT.configure()

line = ' '
while line:
    # Parse STDIN
    line = sys.stdin.readline().strip().lower()
    cg.send('Received: ' + line)
    try:
        task, term = line.split(' ')
    except:
        task = line
        term = ''
    # Pick sub-module to run based on STDIN:
    if 'tft' in task:
        cg.send('\nRunning m_TFT')
        m_TFT.toggle(term)
    elif 'fbi' in task:
        cg.send('\nRunning m_FBI')
        m_FBI.refresh_task(term)
    elif 'status' in task:
        if 'true' in term or 'false' in term:
            cg.send('Setting refresh FBI status to: ' + term)
            cg.write_ini('Status', 'refresh_fbi', term)
        else:
            cg.send('Not a valid term to update status: ' + term)
    elif 'close' in task:
        cg.send('\nClosing everything:')
        m_FBI.close()
        m_TFT.close()
        sys.exit()
    else:
        cg.send('Error: unrecognized command: ' + task)
