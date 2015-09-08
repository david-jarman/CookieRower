import pyrow
import json
import time
import sched
from SimpleWebSocketServer import WebSocket, SimpleWebSocketServer, SimpleSSLWebSocketServer

def getRowingDevice():
    devices = list(pyrow.find())
    if len(devices) > 0:
        erg = pyrow.pyrow(devices[0])
        if erg != None:
            print 'rowing machine found'
            return erg

    print 'No devices found'
    return None

rowingDevice = getRowingDevice()
s = sched.scheduler(time.time, time.sleep)

def sendRowingStatus(sock):
    print 'sending message'
    message = json.dumps(rowingDevice.get_monitor())
    sock.sendMessage(message)

class RowWebSocket(WebSocket):
     
    def handleMessage(self):
        print 'handling message'

    def handleConnected(self):
        while 1:
            s.enter(1, 1, sendRowingStatus, (self,))
            s.run()

    def handleClose(self):
        print 'device closed'

server = SimpleWebSocketServer('', 8080, RowWebSocket)
server.serveforever()
