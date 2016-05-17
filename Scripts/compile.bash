#!/bin/bash

# Modified from: http://stackoverflow.com/a/1957258/3219667
while IFS= read -r -d $'\0' file; do
	# echo *.applescript
  dirname="${file%/*}/"
  basename="${file:${#dirname}}"
  # echo mv "$file" "$dirname${basename%.*}_$basename"
  # echo ${basename: -12} # get last 12 characters
  if [[ ${basename: -12} == ".applescript" ]]; then
	  oldName="$dirname$basename"
	  echo $oldName
	  newName="$dirname${basename%.applescript*}.scpt"
	  echo $newName
	  echo osacompile -o $newName $oldName
  fi
	echo -----
done < <(find . -type f -print0)
