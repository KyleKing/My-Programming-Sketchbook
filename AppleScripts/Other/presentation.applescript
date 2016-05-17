# Script to prepare the laptop for a presentation
# It switches off all unneccesary applications, mute volume and switches on Caffeine
#
# Make sure you have also switched on "Do not disturb" for 
# "when mirroring to TVs and projectors" (in  Preferences/Notification)
#
# Latest update: October 27, 2014
# hhauser@ifi.uzh.ch
# www.helmuthauser.com


set question to display dialog "Ready to switch to presenation mode?" buttons {"Yes", "Cancel"} default button 1
set answer to button returned of question

if answer is equal to "Yes" then
	
	#	tell application "Dropbox" to quit
	#	tell application "OmniFocus" to quit
	#	tell application "TextExpander" to quit
	#	tell application "Pomodoro Timer" to quit
	#	tell application "nvALT" to quit
	#	tell application "Mail" to quit
	# add here your applications that you want to switch off
	# if you are not sure about the exact name, start "Activity Monitor" (e.g. search it with Spotlight)
	# and look up the "Process Name" (first column) in the list of running processes
	
	# kill Hazle separately, since it does not run as an application
	# thanks to Hazle support for their help here
	# the script basically looks for the process named "HazelHelper" in the list of running processes
	# gets the process ID and stops it
	#	set app_name to "HazelHelper"
	#	set the_pid to (do shell script "ps ax | grep " & (quoted form of app_name) & " | grep -v grep | awk '{print $1}'")
	#	if the_pid is not "" then do shell script ("kill -9 " & the_pid)
	
	
	#- sound
	# Note only mute if you don't use sound for your presentations
	#	set volume with output muted
	#- calendar alarms
	
	
	# switch on
	#	tell application "Caffeine" to activate
	
	
	
end if
