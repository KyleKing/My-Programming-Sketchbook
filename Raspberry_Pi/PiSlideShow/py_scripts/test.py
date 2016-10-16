import time
import subprocess
import config as cg

print 'Starting'


def listPID(task, split):
    cmd = "ps aux | grep [" + task[0] + "]" + \
        task[1:] + " | awk '{print $2}'"
    cg.send('> Calling: ' + cmd)
    output = subprocess.check_output(cmd, shell=True)
    cg.send('< Received: ' + output.strip())
    values = output.strip().split(split)
    return values


# Kill unwanted processes:
listPID('node', '\n')
FBIPIDs = listPID('fbi', '\n')
for PID in FBIPIDs:
    kill_PID = 'sudo kill ' + PID
    cg.send('> Now calling: ' + kill_PID)
    subprocess.call(kill_PID, shell=True)

time.sleep(30)

# Start fresh FBI processes:
opt = ' --blend 2 -noverbose --random --noonce '
imgPath = '/home/pi/PiSlideShow/images/*'
cmd = 'sudo fbi -T 1 -a -u -t 1' + opt + imgPath
cg.send('> Now calling: ' + cmd)
output = subprocess.check_output(cmd, shell=True)
cg.send('< Received: ' + output.strip())

cg.send('< DONE test.py')
