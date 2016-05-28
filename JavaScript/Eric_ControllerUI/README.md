# NOTES

Once running, navigate to the <ipaddress>:3000 (i.e. like http://192.168.1.242:3000/) if on the same network

## Make Meteor easier to call

Either add to path (in `.bashrc`):

```sh
export PATH=$PATH:$HOME/meteor/
# then just run meteor
```

Or use an alias:

```sh
alias meteor="$HOME/meteor/meteor"
```

## Fixed Curl Error while installing Meteor

See temporary fix: https://github.com/4commerce-technologies-AG/meteor/issues/37#issuecomment-184310053

## Fixed MongoDB error:

```bash
=> Started proxy.
Unexpected mongo exit code 1. Restarting.
Unexpected mongo exit code 1. Restarting.
Unexpected mongo exit code 1. Restarting.
Can't start Mongo server.
MongoDB failed global initialization

Looks like MongoDB doesn't understand your locale settings. See
https://github.com/meteor/meteor/issues/4019 for more details.
```

Open Issue: https://github.com/4commerce-technologies-AG/meteor/issues/28

### Solution:

Set locale settings and try again:

```sh
# In case there isn't the locale.gen file
sudo apt-get install locales # generates /etc/locale.gen
```

```sh
sudo su
apt-get install locales
locale-gen en_US.UTF-8
localedef -i en_GB -f UTF-8 en_US.UTF-8
exit
```

### Dealing with PID's:

```sh
ps aux | grep -i 'meteor' | awk '{print $2}'
# then sudo kill ####
```

