#!/bin/bash

# Modified from: http://stackoverflow.com/a/1957258/3219667
# Recursive compile of all .applescript files
# bash /Users/kyleking/Developer/My-Programming-Sketchbook/AppleScripts/compile.bash
while IFS= read -r -d $'\0' file; do
  dirname="${file%/*}/"
  basename="${file:${#dirname}}"

  # Modify only .applescript files by checking last 12 chars
  if [[ ${basename: -12} == ".applescript" ]]; then
	  # Make sure compiled directory exists
	  compiledDir="$dirname""compiled/"
	  if [ ! -d "$compiledDir" ]; then
	  	mkdir $compiledDir
	  fi

	  # Compile the '.applescript' file to a '.scpt' in the 'compiled' dir
	  oldName="$dirname$basename"
	  newName="$dirname""compiled/${basename%.applescript*}.scpt"
	  echo Compiling ${basename%.applescript*}
	  osacompile -o $newName $oldName
	  tput bel
  fi
done < <(find . -type f -print0)

# /usr/local/bin/hs -c 'AlertUser("Finished compile.bash")'
# echo $PWD
# /usr/local/bin/hs -c 'AlertUser("'$PWD'")'
