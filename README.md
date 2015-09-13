# CookieRower
Play cookie clicker using your PM3/PM4/PM5 rowing computer.

http://orteil.dashnet.org/cookieclicker/

## ABOUT
CookieRower is about spicing up your rowing workout and giving you new motivation to get back on that expensive rowing machine you bought.

## LICENSE
Copyright 2015, David Jarman
FreeBSD

## REQUIREMENTS
- [Concept2 rowing machine](http://www.concept2.com/) with PM3, PM4, or PM5 monitor
- [A/B USB cable](http://www.amazon.com/AmazonBasics-USB-2-0-Cable--Male/dp/B00NH11KIK/)
- [Python](http://python.org/) (3.4.3)
- [Autobahn](http://autobahn.ws/python/) for WebSocket support
- [PyRow](https://github.com/uvd/PyRow) to connect to Concept2 rowing machine via USB
- [Google Chrome](http://www.google.com/chrome/) to play Cookie Clicker

## USAGE
Server

As root:
'python websocket_server.py' on the device that is plugged into the rowing machine

Client
Enable developer mode in Chrome and load the unpacked extension
Go to http://orteil.dashnet.org/cookieclicker/ to play Cookie Clicker
Open the extension from the URL bar
Enter the address and port of the server (127.0.0.1 if the same machine)
Use port 9000 for now, since it's hardcoded in the websocket_server (temporary)