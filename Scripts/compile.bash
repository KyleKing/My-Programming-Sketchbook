#!/bin/bash

# Modified from: http://stackoverflow.com/a/1957258/3219667
# Recursive compile of all .applescript files
while IFS= read -r -d $'\0' file; do
  dirname="${file%/*}/"
  basename="${file:${#dirname}}"
  # echo mv "$file" "$dirname${basename%.*}_$basename"
  # # Modify only .applescript files
  # echo ${basename: -12} # get last 12 characters
  if [[ ${basename: -12} == ".applescript" ]]; then
	  oldName="$dirname$basename"
	  newName="$dirname${basename%.applescript*}.scpt"
	  # echo $oldName
	  # echo $newName
	  # # Compile .applescript file found above
	  echo Compiling ${basename%.applescript*}
	  osacompile -o $newName $oldName
  fi
done < <(find . -type f -print0)
