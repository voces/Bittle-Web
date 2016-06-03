/*global Bittle, Auth, Editors, Navigation, Invite, Snackbar, Request, Popup*/
/*exported page*/

class Page {

    constructor() {

        this.bittle = new Bittle();
        this.auth = new Auth();
        this.editors = new Editors();
        this.navigation = new Navigation();
        this.invite = new Invite();
        this.request = new Request();
        this.snackbar = new Snackbar();
        this.popup = new Popup();

        this.domQueue = [];

        this.auth.on("collapse", () => this.navigation.collapseDrawer());
        this.auth.on("send", (json, callback) => this.bittle.send(json, callback));
        this.auth.on("loggedIn", () => {this.editors.trackAll(); this.navigation.loggedIn();});
        this.auth.on("snackbar", data => {this.snackbar.show(data); return this.navigation.collapseDrawer();});

        this.editors.on("domQueue", func => this.domQueue.push(func));
        this.editors.on("send", (json, callback) => this.bittle.send(json, callback));
        // this.editors.on("send", (json, callback) => this.auth.name ? this.bittle.send(json, callback) : null);
        this.editors.on("share", () => this.navigation.collapseDrawer());

        this.bittle.on("addFile", e => this.editors.checkFile(e.json.filename));
        this.bittle.on("invite", e => typeof e.json.status === "undefined" ? this.invite.trigger(e.json.shareId, e.json.blame) : null);
        this.bittle.on("request", e => typeof e.json.status === "undefined" ? this.request.trigger(e.json.shareId, e.json.name) : null);
        this.bittle.on("addClient", e => this.addClient(e));
        this.bittle.on("line", e => e.json.blame !== this.auth.name ? this.editors.line(e.json) : null);
        this.bittle.on("lines", e => e.json.blame !== this.auth.name ? this.editors.lines(e.json) : null);
        this.bittle.on("connected", e => this.connected(e));
        this.bittle.on("reject", () => this.cancelRequest());

        this.navigation.on("ready", () => this.auth.ready());

        this.invite.on("send", (json, callback) => this.bittle.send(json, callback));
        this.request.on("send", (json, callback) => this.bittle.send(json, callback));

        document.addEventListener("DOMContentLoaded", () => {

            for (let i = 0; i < this.domQueue.length; i++)
                this.domQueue[i]();

            this.domQueue = null;

        });

    }

    connected(e) {

        //Always update name... (used for detecting who "I" am)
        this.auth.name = e.json.name;
        this.autoShare = e.json.shareId;

        //Grab the share number
        let currentShare = parseInt(window.location.href.split("#").pop());

        //URL indicates we're not loading a share, so change URL to match share we were automatically added to
        if (isNaN(currentShare))
            return window.history.pushState("#" + e.json.shareId, "Bittle - " + e.json.shareId, "#" + e.json.shareId);

        //Else request access to the share
        this.bittle.send({id: "request", shareId: currentShare}, e => {

            if (e.json.status === "failed")
                this.popup.show({
                    mode: "yes",
                    yesText: "OK",
                    title: "Request",
                    text: e.json.reason

                }).then(() => window.history.pushState("#" + this.autoShare, "Bittle - " + this.autoShare, "#" + this.autoShare));

        });

        this.popup.show({
            mode: "no",
            noText: "Cancel",
            title: "Request",
            text: `Requesting access to share ${e.json.shareId}.`

        }).then(() => {}, () => window.history.pushState("#" + this.autoShare, "Bittle - " + this.autoShare, "#" + this.autoShare));

    }

    addClient(e) {

        if (typeof e.json.files !== "undefined") {
            this.popup.yes.click();
            this.editors.load(e.json.files);
        }

    }

    cancelRequest() {

        this.popup.no.click();

    }

}

let page = new Page();
