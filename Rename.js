/*global EventEmitter2, util*/
/*exported Rename*/

class Rename extends EventEmitter2 {

    ready() {

        util.grabElements(this, {
            dialog: "editor-rename-dialog",
            filename: "editor-rename-filename", filenameError: "editor-rename-filename-error"
        });

        this.filename.addEventListener("blur", () => this.verifyFilename());

        this.dialog.querySelector(".close").addEventListener("click", () => this.dialog.close());

        this.dialog.querySelector(".rename").addEventListener("click", () => this.tryRename());

    }

    clear() {

        util.setTextField(this.filename, "");
        this.filename.parentElement.classList.remove("is-invalid");

    }

    verifyFilename() { return util.verifyNoneEmpty(this.filename, this.filenameError, "Name"); }

    tryRename() {

        if (this.verifyFilename() < 1) return;

        this.editor.rename(this.filename.value);
        this.dialog.close();

        this.clear();

    }

    show(editor) {

        util.setTextField(this.filename, editor.name);

        this.editor = editor;
        this.dialog.showModal();

    }

}
