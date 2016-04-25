/*global EventEmitter2, NewEditor, Share, Rename, Editor, componentHandler, util*/
/*exported Editors*/

class Editors extends EventEmitter2 {

    constructor() {
        super();

        this.editors = [];

        this.newEditorDialog = new NewEditor();
        this.share = new Share();
        this.rename = new Rename();

        this.newEditorDialog.on("new", e => this.newEditor(e).select());

        this.share.on("send", (json, callback) => this.emit("send", json, callback));
        this.share.on("share", () => this.emit("share"));

        // this.rename.on("rename", editor => this.toRename.rename(filename));

    }

    ready() {

        util.grabElements(this, {
            editorsDiv: "editors",
            editorsBar: "editors-bar", editorsBarNew: "editors-bar-new",
            editorsNew: "editors-new"
        });

        this.editorsBarNew.addEventListener("click", () => this.newEditorDialog.dialog.showModal());

        this.newEditor("untitled").select();

    }

    newEditor(name) {

        let editor = new Editor(name);

        this.editorsBar.insertBefore(editor.a, this.editorsBarNew);
        this.editorsDiv.insertBefore(editor.editorDiv, this.editorsNew);

        if (document.readyState === "complete") this.upgradeElement();
        else this.emit("domQueue", this.upgradeElement.bind(this));

        editor.on("domQueue", func => this.emit("domQueue", func));
        editor.on("send", (json, callback) => this.emit("send", json, callback));
        editor.on("rename", editor => this.rename.show(editor));

        this.editors.push(editor);

        this.emit("send", {id: "track", filename: editor.name, lines: [""]});

        return editor;

    }

    trackAll() {

        for (let i = 0; i < this.editors.length; i++)
            this.emit("send", {id: "track", filename: this.editors[i].name, lines: this.editors[i].editor.getValue().split("\n")});

    }

    checkFile(file) {

        let flag = false;

        for (let i = 0; i < this.editors.length; i++)
            if (this.editors[i].name === file) {
                flag = true;
                break;
            }

        if (!flag) {
            let editor = this.newEditor(file);
            this.emit("send", {id: "get", filename: file}, e => editor.load(e.json.lines));
        }

    }

    getEditor() {

        let editor = this.a.querySelector(".is-active").textContent;

        for (let i = 0; i < this.editors.length; i++)
            if (this.editors[i].name === editor) return this.editors[i];

    }

    load(files) {

        for (let i = 0; i < this.editors.length; i++) {

            this.editorsBar.removeChild(this.editors[i].a);
            this.editorsDiv.removeChild(this.editors[i].editorDiv);

        }

        this.editors = [];

        for (let i = 0; i < files.length; i++)
            this.checkFile(files[i]);

        this.editors[0].select();

    }

    line(json) {

        for (let i = 0; i < this.editors.length; i++)
            if (this.editors[i].name === json.filename) return this.editors[i].line(json);

    }

    lines(json) {

        for (let i = 0; i < this.editors.length; i++)
            if (this.editors[i].name === json.filename) return this.editors[i].lines(json);

    }

    upgradeElement() {

        componentHandler.downgradeElements(this.editorsDiv);
        componentHandler.upgradeElement(this.editorsDiv);

    }

}
