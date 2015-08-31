import pyrow
import socket
import json

BROADCAST_ADDRESS = "255.255.255.255"
BROADCAST_PORT = 6969

def startBroadcast():
    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    sock.setsockopt(socket.SOL_SOCKET, socket.SO_BROADCAST, 1)

    device = getRowingDevice()
    if device != None:
        message = json.dumps(device.get_monitor())
        sock.sendto(message, (BROADCAST_ADDRESS, BROADCAST_PORT))

def getRowingDevice():
    devices = list(pyrow.find())
    
    if len(devices) > 0:
        erg = pyrow.pyrow(devices[0])
        if erg != None:
            return erg

    return None

startBroadcast()

print('done!')

