# -*- coding: utf-8 -*-
import time
import subprocess
import config as cg


def listPID(task, split):
    cmd = "ps aux | grep [" + task[0] + "]" + \
        task[1:] + " | awk '{print $2}'"
    cg.send('> Calling: ' + cmd)
    output = subprocess.check_output(cmd, shell=True)
    cg.send('< Received: ' + output.strip())
    values = output.strip().split(split)
    return values


def kill_old_FBI():
    """Kill all old FBI processes"""
    cg.send('** Killing all old FBI processes (m_FBI)')
    FBIPIDs = listPID('fbi', '\n')
    for PID in FBIPIDs:
        if len(PID.strip()) > 0:
            kill_PID = 'sudo kill ' + PID
            cg.send('> Now calling: ' + kill_PID)
            subprocess.call(kill_PID, shell=True)
            time.sleep(0.5)
        else:
            cg.send('No FBI processes to kill')


def new_FBI():
    """Start fresh FBI processes:"""
    cg.send('** Start fresh FBI processes (m_FBI)')
    opt = ' --blend 2 -noverbose --random --noonce '
    imgPath = '/home/pi/PiSlideShow/images/*'
    cmd = 'sudo fbi -T 1 -a -u -t 1' + opt + imgPath
    cg.send('> Now calling: ' + cmd)
    output = subprocess.check_output(cmd, shell=True)
    cg.send('< Received: ' + output.strip())


def configure():
    kill_old_FBI()
    cg.send('< DONE configuring m_FBI')


def refresh_task(term):
    if term is not 'na':
        kill_old_FBI()
        time.sleep(10)
    new_FBI()
    cg.send('< DONE refreshing m_FBI')


def check_node():
    listPID('node', '\n')


def close():
    kill_old_FBI()
    cg.send('< DONE closing m_FBI')
