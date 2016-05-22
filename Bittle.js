/*global EventEmitter2*/
/*exported Bittle*/

class Bittle extends EventEmitter2 {

    constructor() {
        super();

        this.queue = [];

        this.connect();

        this.echoId = 0;

    }

    connect() {

        this.ws = new WebSocket("wss://notextures.io:8086");

        this.ws.addEventListener("message", e => this.onMessage(e));
        this.ws.addEventListener("close", () => this.disconnected());

    }

    disconnected() {

        // console.log("Disconnected from Bittle, reconnecting...");
        this.connect();

    }

    send(obj, callback) {

        let echo = this.echoId++;

        obj.echo = echo;

        let json = JSON.stringify(obj);

        this.queue.push([echo, json, callback]);

        console.log("SEND", obj);
        this.ws.send(json);

    }

    onMessage(e) {

        e.json = JSON.parse(e.data);

        console.log("RECV", e.json);

        if (this.queue.length > 0 && typeof e.json.echo !== "undefined")
            for (let i = 0; i < this.queue.length; i++)
                if (this.queue[i][0] === e.json.echo) {
                    if (this.queue[i][2]) this.queue[i][2](e);
                    this.queue.splice(i, 1);
                }

        this.emit(e.json.id, e);

    }

}
