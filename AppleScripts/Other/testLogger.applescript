tell application "SnappyApp"
	try
		launch
		my logit("success", "launch_order")
	on error e number n
		my logit("failed", "launch_order")
		my logit("OOPs: " & e & " " & n, "launch_order")
	end try
end tell

to logit(log_string, log_file)
	do shell script ¬
		"echo `date '+%Y-%m-%d %T: '`\"" & log_string & ¬
		"\" >> $HOME/Library/Logs/" & log_file & ".log"
end logit


