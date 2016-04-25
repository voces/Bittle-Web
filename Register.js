/*global EventEmitter2, util*/
/*exported Register*/

class Register extends EventEmitter2 {

    ready() {

        util.grabElements(this, {
            dialog: "register-dialog",
            show1: "show-register-dialog1", show2: "show-register-dialog2",
            name: "register-name", nameError: "register-name-error",
            pass: "register-pass", passError: "register-pass-error",
            confirmPass: "register-confirm-pass", passError: "register-confirm-pass-error",
        });

        this.show1.addEventListener("click", () => this.dialog.showModal());
        this.show2.addEventListener("click", () => this.dialog.showModal());

        this.name.addEventListener("blur", () => this.verifyName());
        this.pass.addEventListener("blur", () => this.verifyPass());
        this.confirmPass.addEventListener("blur", () => this.verifyConfirmPass());

        this.dialog.querySelector(".close").addEventListener("click", () => this.dialog.close());

        this.dialog.querySelector(".register").addEventListener("click", () => this.tryRegister());

    }

    hide() {

        this.show1.hidden = true;
        this.show2.hidden = true;

    }

    verifyName() { return util.verifyNoneEmpty(this.name, this.nameError, "Name"); }
    verifyPass() { return util.verifyNoneEmpty(this.pass, this.passError, "Pass"); }

    verifyConfirmPass() {

        if (this.pass.value != this.confirmPass.value) {
            this.confirmPass.parentElement.classList.add("is-invalid");
            return false;
        }

        return true;

    }

    clear() {

        util.setTextField(this.name, "");
        this.name.parentElement.classList.remove("is-invalid");
        util.setTextField(this.pass, "");
        this.pass.parentElement.classList.remove("is-invalid");
        util.setTextField(this.confirmPass, "");
        this.confirmPass.parentElement.classList.remove("is-invalid");

    }

    registerHandler(e) {

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
        this.emit("send", {id: "login", name: this.name.value, pass: this.pass.value});
        this.emit("loggedIn", this.name.value);

        this.clear();

    }

    tryRegister() {

        if (this.verifyName() + this.verifyPass() + this.verifyConfirmPass() < 3) return;

        this.emit("send", {id: "register", name: this.name.value, pass: this.pass.value}, e => this.registerHandler(e));
        // send(JSON.stringify({id: "register", name: this.name.value, pass: this.pass.value}), e => this.registerHandler(e));

    }

    show(data) {

        this.dialog.showModal();

        if (typeof data.name !== "undefined") util.setTextField(this.name, data.name);
        if (typeof data.pass !== "undefined") util.setTextField(this.pass, data.pass);
        if (typeof data.confirmPass !== "undefined") util.setTextField(this.confirmPass, data.confirmPass);

        if (typeof data.name === "undefined") this.name.focus();
        else if (typeof data.pass === "undefined") this.pass.focus();
        else if (typeof data.confirmPass === "undefined") this.confirmPass.focus();

    }

}
