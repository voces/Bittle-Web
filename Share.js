/*global EventEmitter2, util*/
/*exported Share*/

class Share extends EventEmitter2 {

    ready() {

        util.grabElements(this, {
            dialog: "share-dialog",
            share1: "share1", share2: "share2",
            name: "share-name", nameError: "share-name-error"
        });

        this.share1.addEventListener("click", () => this.dialog.showModal());
        this.share2.addEventListener("click", () => this.dialog.showModal());

        this.dialog.querySelector(".close").addEventListener("click", () => this.dialog.close());

        this.dialog.querySelector(".share").addEventListener("click", () => this.tryShare());

    }

    verifyName() { return util.verifyNoneEmpty(this.name, this.nameError, "Name"); }

    shareHandler(e) {

        if (e.json.status === "failed") {

            switch (e.json.reason) {

                default:
                    this.nameError.textContent = e.json.reason;
                    this.name.parentElement.classList.add("is-invalid");
                    break;

            }

            return;

        }

        this.dialog.close();
        this.emit("share");

    }

    tryShare() {

        if (this.verifyName() < 1) return;

        this.emit("send", {id: "invite", name: this.name.value}, e => this.shareHandler(e));

    }

}
