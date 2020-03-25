# Example running a shell script from python

# Source: http://stackoverflow.com/a/13745968/3219667
# Make sure to call: chmod +x sleep.sh
import subprocess

print("start")
subprocess.call("./compile.sh", shell=True)
# subprocess.call("./sleep.sh", shell=True)
# Only: sleep 5
print("end")
