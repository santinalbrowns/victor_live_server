
import uWS from "uWebSockets.js";
import axios from 'axios';

const app = uWS.App();

interface Event {
    tag: string;
}

app.ws('/*', {
    /* Options */
    compression: uWS.SHARED_COMPRESSOR,
    maxPayloadLength: 16 * 1024 * 1024,
    idleTimeout: 10,

    upgrade: (res, req, context) => {
        console.log('An Http connection wants to become WebSocket, URL: ' + req.getUrl() + '!');

        /* This immediately calls open handler, you must not use res after this call */
        res.upgrade({
            id: req.getUrl().replace(/\//g, '')/* First argument is UserData (see WebSocket.getUserData()) */
        },
            /* Spell these correctly */
            req.getHeader('sec-websocket-key'),
            req.getHeader('sec-websocket-protocol'),
            req.getHeader('sec-websocket-extensions'),
            context);

    },

    /* Handlers */
    open: (ws) => {
        //ws.subscribe
        // ws.subscribe("exit");

        console.log('Hardware connected');
    },

    message: (ws, message, isBinary) => {

        const buf = Buffer.from(message);

        /*  fetch(`http://192.168.8.106:5000/customers/${buf.toString()}`).
             then(data => { ws.send("paid") }).
             catch(err => { ; }); */


        // Make a request for a user with a given ID
        axios.get(`http://192.168.8.106:5000/customer/orders/${buf.toString()}/item`)
            .then(function (response) {
                // handle success
                ws.send("paid")
            })
            .catch(function (error) {
                // handle error
                ws.send("clear")
            });

        

    },

    drain: (ws) => {
        console.log('WebSocket backpressure: ' + ws.getBufferedAmount());
    },

    close: (ws, code, message) => {
        console.log('WebSocket closed', ws.getUserData());
    }
});

app.listen(3000, async (token) => {
    if (token) {
        console.log('Listening to port 3000');
    }
})