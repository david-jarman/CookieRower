import pyrow
import json
import asyncio
from autobahn.asyncio.websocket import WebSocketServerProtocol
from autobahn.asyncio.websocket import WebSocketServerFactory

@asyncio.coroutine
def start_sending_rowing_info(server):
    machines = []
    try:
        #print("about to find devices")
        machines = list(pyrow.find())
    except:
        print("Error while finding machines")

    if len(machines) > 0:
        rowing_machine = machines[0]
        erg = pyrow.pyrow(rowing_machine)
        #print("machine found!")
        while True:
            message = json.dumps(erg.get_monitor())
            #print(message)
            message = message.encode('utf8')
            server.sendMessage(message, isBinary=False)
            yield from asyncio.sleep(1)
    else:
        print('No machines connected')

class MyServerProtocol(WebSocketServerProtocol):

    def onOpen(self):
        try:
            yield from start_sending_rowing_info(self)
        except:
            print("fail")

    def onMessage(self, payload, isBinary):
        yield from asyncio.sleep(10)
        self.sendMessage(payload, isBinary)

factory = WebSocketServerFactory()
factory.protocol = MyServerProtocol

loop = asyncio.get_event_loop()
coro = loop.create_server(factory, '0.0.0.0', 9000)
server = loop.run_until_complete(coro)

try:
    loop.run_forever()
except KeyboardInterrupt:
    pass
finally:
    server.close()
    loop.close()
