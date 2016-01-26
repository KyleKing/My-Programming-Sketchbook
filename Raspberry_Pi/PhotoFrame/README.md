#!/bin/sh
### BEGIN INIT INFO
# Provides:          PhotoFrameStart
# Required-Start:    $remote_fs $syslog
# Required-Stop:     $remote_fs $syslog
# Default-Start:     5
# Default-Stop:      6
# Short-Description: Will this work?
# Description:       This file should be used to construct scripts to be
#                    placed in /etc/init.d.  This example start a
#                    single forking daemon capable of writing a pid
#                    file.  To get other behavoirs, implemend
#                    do_start(), do_stop() or other functions to
#                    override the defaults in /lib/init/init-d-script.
### END INIT INFO
# cd /home/pi/Raspberry_Pi/Aloo/node/; node PhotoFrame.js
