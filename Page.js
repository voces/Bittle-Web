/*global Bittle, Auth, Editors, Navigation, Invite, Snackbar*/
/*exported page*/

class Page {

    constructor() {

        this.bittle = new Bittle();
        this.auth = new Auth();
        this.editors = new Editors();
        this.navigation = new Navigation();
        this.invite = new Invite();
        this.snackbar = new Snackbar();

        this.domQueue = [];

        this.auth.on("collapse", () => this.navigation.collapseDrawer());
        this.auth.on("send", (json, callback) => this.bittle.send(json, callback));
        this.auth.on("loggedIn", () => {this.editors.trackAll(); this.navigation.loggedIn();});
        this.auth.on("snackbar", data => {this.snackbar.show(data); return this.navigation.collapseDrawer();});

        this.editors.on("domQueue", func => this.domQueue.push(func));
        this.editors.on("send", (json, callback) => this.auth.name ? this.bittle.send(json, callback) : null);
        this.editors.on("share", () => this.navigation.collapseDrawer());

        this.bittle.on("addFile", e => this.editors.checkFile(e.json.filename));
        this.bittle.on("invite", e => typeof e.json.status === "undefined" ? this.invite.trigger(e.json.shareId, e.json.blame) : null);
        this.bittle.on("addClient", e => typeof e.json.files !== "undefined" ? this.editors.load(e.json.files) : null);
        this.bittle.on("line", e => e.json.blame !== this.auth.name ? this.editors.line(e.json) : null);
        this.bittle.on("lines", e => e.json.blame !== this.auth.name ? this.editors.lines(e.json) : null);

        this.navigation.on("ready", () => this.auth.ready());

        this.invite.on("send", (json, callback) => this.bittle.send(json, callback));

        document.addEventListener("DOMContentLoaded", () => {

            for (let i = 0; i < this.domQueue.length; i++)
                this.domQueue[i]();

            this.domQueue = null;

        });

    }

}

let page = new Page();
