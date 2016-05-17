# My Applescripts

Sort of unorganized, but the compile.bash function is really useful. Just run `bash compile.bash' and the function will recursively search for any file with a `.applescript` extension and compile the file into a `.scpt` file ready to be run by `osascript`. The compiled file is placed into its own `compiled/` directory in the same directory as the original file. Make sure to run the file any time the applescript files change. 
