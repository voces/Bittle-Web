/*global EventEmitter2, util*/
/*exported Login*/

class Login extends EventEmitter2 {

    ready() {

        util.grabElements(this, {
            dialog: "login-dialog",
            show1: "show-login-dialog1", show2: "show-login-dialog2",
            name: "login-name", nameError: "login-name-error",
            pass: "login-pass", passError: "login-pass-error"
        });

        this.show1.addEventListener("click", () => this.dialog.showModal());
        this.show2.addEventListener("click", () => this.dialog.showModal());

        this.name.addEventListener("blur", () => this.verifyName());
        this.pass.addEventListener("blur", () => this.verifyPass());

        this.dialog.querySelector(".close").addEventListener("click", () => this.dialog.close());
        this.dialog.querySelector(".login").addEventListener("click", () => this.tryLogin());

        this.registerLink = document.createElement("a");
        this.registerLink.setAttribute("href", "#login-register");
        this.registerLink.textContent = "Register instead.";
        this.registerLink.addEventListener("click", () => this.registerInstead());

        this.resetLink = document.createElement("a");
        this.resetLink.setAttribute("href", "#login-reset");
        this.resetLink.textContent = "Reset pass instead.";
        this.resetLink.addEventListener("click", () => this.resetInstead());

    }

    hide() {

        this.show1.hidden = true;
        this.show2.hidden = true;

    }

    verifyName() { return util.verifyNoneEmpty(this.name, this.nameError, "Name"); }
    verifyPass() { return util.verifyNoneEmpty(this.pass, this.passError, "Pass"); }

    clear() {

        util.setTextField(this.name, "");
        this.name.parentElement.classList.remove("is-invalid");
        util.setTextField(this.pass, "");
        this.pass.parentElement.classList.remove("is-invalid");

    }

    loginHandler(e) {

        console.log(e.json, `<span>${e.json.reason}</span> `, this.resetLink);

        if (e.json.status === "failed") {

            switch (e.json.reason) {

                case "Account does not exist.":
                    this.nameError.innerHTML = `<span>${e.json.reason}</span> `;
                    this.nameError.appendChild(this.registerLink);
                    this.name.parentElement.classList.add("is-invalid");
                    this.name.select();
                    break;

                case "Incorrect pass.":
                    this.passError.innerHTML = `<span>${e.json.reason}</span> `;
                    this.passError.appendChild(this.resetLink);
                    this.pass.parentElement.classList.add("is-invalid");
                    this.pass.select();
                    break;

                default:
                    this.nameError.textContent = e.json.reason;
                    this.name.parentElement.classList.add("is-invalid");
                    this.name.select();
                    break;

            }

            return;

        }

        this.dialog.close();
        this.emit("loggedIn", this.name.value);

        this.clear();

    }

    registerInstead() {

        this.dialog.close();
        this.emit("register", {name: this.name.value, pass: this.pass.value});

        this.clear();

    }

    resetInstead() {

        this.dialog.close();
        this.emit("reset", {name: this.name.value});

        this.clear();

    }

    tryLogin() {

        if (this.verifyName() + this.verifyPass() < 2) return;

        this.emit("send", {id: "login", name: this.name.value, pass: this.pass.value}, e => this.loginHandler(e));

    }

}
