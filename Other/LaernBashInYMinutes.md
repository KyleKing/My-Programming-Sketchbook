# My Additional Notes:

See the actual document at: https://learnxinyminutes.com/docs/bash/

Scan for UDP port using nmap:

```sh
# A port known to be open returns a line of text
$ sudo nmap -sU -p 1740 $(ipconfig getifaddr en0) | grep open
1740/udp *open*|filtered encore

# While a closed port returns no text
$ sudo nmap -sU -p 9999 $(ipconfig getifaddr en0) | grep open
```

But this method can be prone to [false positives](https://scottlinux.com/2012/06/13/nmap-udp-port-scan-example/). Alternatively, I launch a set number of AnyBar icons, so I can make sure they are open by counting the number of lines returned from the process list ([the [ ] idea was from stackoverflow](http://stackoverflow.com/a/3510850)):

```sh
$ ps aux | grep -i '[a]nybar'
kyleking         9728   0.0  0.1  2579936  13844   ??  S    10:54AM   0:00.15 /opt/homebrew-cask/Caskroom/anybar/0.1.3/AnyBar.app/Contents/MacOS/AnyBar
kyleking         9726   0.0  0.1  2579936  14020   ??  S    10:54AM   0:00.16 /opt/homebrew-cask/Caskroom/anybar/0.1.3/AnyBar.app/Contents/MacOS/AnyBar
kyleking         9567   0.0  0.1  2579936  14220   ??  S    10:51AM   0:00.33 /opt/homebrew-cask/Caskroom/anybar/0.1.3/AnyBar.app/Contents/MacOS/AnyBar
```

Then to quit the app from a shell prompt, I'm using:

```sh
sudo kill $(ps aux | grep -i '[a]nybar' | awk '{print $2}')
```
