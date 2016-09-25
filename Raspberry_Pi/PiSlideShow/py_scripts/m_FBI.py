# -*- coding: utf-8 -*-
import time
import subprocess
import config as cg


def close():
    """Kill all FBI processes"""
    cg.send('\nClosing (killing all FBI) m_FBI')
    FBIPIDs = listPID('fbi', '\n')
    if len(FBIPIDs[0]) > 1:
        for PID in FBIPIDs:
            kill_cmd = 'sudo kill ' + PID
            cg.send(kill_cmd)
            subprocess.call(kill_cmd, shell=True)
        time.sleep(3)
    else:
        cg.send('No running FBI processes to kill')


def new_FBI():
    cg.send('\nConfiguring (booting) m_FBI')
    # Start wanted FBI processes:
    opt = ' --blend 2 -noverbose --random --noonce '
    imgPath = '/home/pi/PiSlideShow/images/*'
    cmd = 'sudo fbi -T 1 -a -u -t 1' + opt + imgPath
    cg.send('Now calling: ' + cmd)
    output = subprocess.check_output(cmd, shell=True)
    cg.send(output)


def configure():
    close()


def listPID(task, split):
    cmd = "ps aux | grep [" + task[0] + "]" + \
        task[1:] + " | awk '{print $2}'"
    cg.send('Calling: ' + cmd)
    output = subprocess.check_output(cmd, shell=True)
    values = output.strip().split(split)
    print values
    return values


def refresh_task():
    close()
    new_FBI()


def check_node():
    listPID('node', '\n')
