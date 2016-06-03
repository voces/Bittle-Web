/*global EventEmitter2, util*/
/*exported Request*/

class Request extends EventEmitter2 {

    ready() {

        util.grabElements(this, {
            dialog: "request-dialog",
            nameSpan: "request-name",
            yes: "request-yes", no: "request-no"
        });

        this.no.addEventListener("click", () => {this.dialog.close(); this.emit("send", {id: "reject", shareId: this.shareId, name: this.name});});
        this.yes.addEventListener("click", () => {this.dialog.close(); this.emit("send", {id: "approve", shareId: this.shareId, name: this.name});});

    }

    trigger(shareId, name) {

        this.shareId = shareId;
        this.name = name;

        this.nameSpan.textContent = name;

        this.dialog.showModal();

    }

}
