import pyrow
import json
import asyncio
from autobahn.asyncio.websocket import WebSocketServerProtocol
from autobahn.asyncio.websocket import WebSocketServerFactory

class MyServerProtocol(WebSocketServerProtocol):

    def __init__(self):
        self.is_open = False

    def onOpen(self):
        try:
            self.is_open = True
            yield from self.start_sending_rowing_info()
        except:
            print("fail")

    def onClose(self, wasClean, code, reason):
        print("closing time")
        self.is_open = False

    @asyncio.coroutine
    def start_sending_rowing_info(self):
        machines = list(pyrow.find())

        if len(machines) > 0:
            rowing_machine = machines[0]
            erg = pyrow.pyrow(rowing_machine)

            while self.is_open:
                monitor = erg.get_monitor(forceplot=True)

                message = json.dumps(monitor).encode('utf8')
                try:
                    self.sendMessage(message, isBinary=False)
                except:
                    print("couldn't send message")

                yield from asyncio.sleep(2)
        else:
            print('No machines connected')



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
