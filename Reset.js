/*global EventEmitter2, util*/
/*exported Reset*/

class Reset extends EventEmitter2 {

    ready() {

        util.grabElements(this, {
            dialog: "reset-dialog",
            name: "reset-name", nameError: "reset-name-error"
        });

        this.name.addEventListener("blur", () => this.verifyName());

        this.dialog.querySelector(".close").addEventListener("click", () => this.dialog.close());

        this.dialog.querySelector(".reset").addEventListener("click", () => this.tryReset());

    }

    verifyName() { return util.verifyNoneEmpty(this.name, this.nameError, "Name"); }

    clear() {

        util.setTextField(this.name, "");
        this.name.parentElement.classList.remove("is-invalid");

    }

    resetHandler(e) {

        if (e.json.status === "failed") {

            switch (e.json.reason) {

                default:
                    this.nameError.textContent = e.json.reason;
                    this.name.parentElement.classList.add("is-invalid");
                    this.name.select();
                    break;

            }

            return;

        }

        this.dialog.close();

        this.emit("snackbar", {
            message: "Reset link sent to email.",
            timeout: 5000
        });

        this.clear();

    }

    tryReset() {

        if (!this.verifyName()) return;

        this.emit("send", {id: "resetPass", name: this.name.value}, e => this.resetHandler(e));

    }

    show(data) {

        this.dialog.showModal();

        if (typeof data.name !== "undefined") util.setTextField(this.name, data.name);

        if (typeof data.name === "undefined") this.name.focus();

    }

}
