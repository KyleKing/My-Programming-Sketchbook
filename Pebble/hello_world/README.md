# Hello World Basic Watchface

```bash
# Install SDK
brew install pebble/pebble-sdk/pebble-sdk

# Configure
pebble login
pebble package login

# Packages don't seem to work for Rocky.js?
pebble package install ui
pebble package install vector2
```

```bash
# Install on phone: https://developer.pebble.com/guides/tools-and-resources/pebble-tool/
pebble build; pebble install --phone 192.168.0.104 --logs

# Run emulator each time for Pebble 2
pebble build; pebble install --emulator diorite --logs
# Then launch config
pebble emu-app-config --emulator diorite
```

## Other

Try the Clay interface for setting configuration settings from my phone: https://developer.pebble.com/guides/user-interfaces/app-configuration/

Demos: https://github.com/pebble-examples
