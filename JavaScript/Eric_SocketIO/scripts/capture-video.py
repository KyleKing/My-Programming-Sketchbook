from picamera.array import PiRGBArray
from picamera import PiCamera
import sys

# simple JSON echo script
for line in sys.stdin:
    print line[:-1]
    camera = PiCamera()
    rawCapture = PiRGBArray(camera)
    camera.start_recording(line[:-1])

    camera.stop_recording()
