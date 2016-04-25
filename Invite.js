/*global EventEmitter2, util*/
/*exported Invite*/

class Invite extends EventEmitter2 {

    ready() {

        util.grabElements(this, {
            dialog: "invite-dialog",
            blameSpan: "invite-blame",
            yes: "invite-yes", no: "invite-no"
        });

        this.no.addEventListener("click", () => {this.dialog.close(); this.emit("send", {id: "decline", shareId: this.shareId, blame: this.blame});});
        this.yes.addEventListener("click", () => {this.dialog.close(); this.emit("send", {id: "accept", shareId: this.shareId, blame: this.blame});});

    }

    trigger(shareId, blame) {

        this.shareId = shareId;
        this.blame = blame;

        this.blameSpan.textContent = blame;

        this.dialog.showModal();

    }

}
