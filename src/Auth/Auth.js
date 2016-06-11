/*global EventEmitter2, util, Login, Register, Reset*/
/*exported Auth*/

class Auth extends EventEmitter2 {

    constructor() {
        super();

        this.login = new Login();
        this.register = new Register();
        this.reset = new Reset();

        this.login.on("send", (json, callback) => this.emit("send", json, callback));
        this.login.on("loggedIn", name => this.loggedIn(name));
        this.login.on("register", data => this.register.show(data));
        this.login.on("reset", data => this.reset.show(data));

        this.register.on("send", (json, callback) => this.emit("send", json, callback));
        this.register.on("loggedIn", name => this.loggedIn(name));

        this.reset.on("send", (json, callback) => this.emit("send", json, callback));
        this.reset.on("snackbar", data => this.emit("snackbar", data));

    }

    hide() {

        this.login.hide();
        this.register.hide();

        this.logout1.style.display = "";
        this.logout2.style.display = "";

        this.share1.style.display = "";
        this.share2.style.display = "";

        this.emit("hidden");

    }

    loggedIn(name) {

        this.hide();

        this.name = name;

        this.emit("loggedIn");

    }

    ready() {

        util.grabElements(this, {
            logout1: "logout1", logout2: "logout2",
            share1: "share1", share2: "share2"
        });

    }

}
