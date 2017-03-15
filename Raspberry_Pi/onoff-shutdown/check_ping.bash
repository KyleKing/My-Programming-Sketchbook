#!/bin/sh

# Example ping with $? from http://stackoverflow.com/q/7383144/3219667

# ping -c 2 localhost
ping -c 2 google.com
if [ $? != 0 ] ; then
    echo "Couldn't ping localhost, weird"
    fi

echo ""

ping -c 2 veryweirdhostname.noend
if [ $? != 0 ] ; then
    echo "Surprise, Couldn't ping a very weird hostname.."
    fi

echo "
The pid of this process is $$"


