/*global EventEmitter2, util*/
/*exported NewEditor*/

class NewEditor extends EventEmitter2 {

    ready() {

        util.grabElements(this, {
            dialog: "editor-new-dialog",
            filename: "editor-new-filename", filenameError: "editor-new-filename-error"
        });

        this.filename.addEventListener("blur", () => this.verifyFilename());

        this.dialog.querySelector(".close").addEventListener("click", () => this.dialog.close());

        this.dialog.querySelector(".create").addEventListener("click", () => this.tryCreate());

    }

    clear() {

        util.setTextField(this.filename, "");
        this.filename.parentElement.classList.remove("is-invalid");

    }

    verifyFilename() { return util.verifyNoneEmpty(this.filename, this.filenameError, "Name"); }

    tryCreate() {

        if (this.verifyFilename() < 1) return;

        this.emit("new", this.filename.value);
        this.dialog.close();

        this.clear();

    }

}
