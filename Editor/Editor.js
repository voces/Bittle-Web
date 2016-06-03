/*global EventEmitter2, ace*/
/*exported Editor*/

let modeList = ace.require("ace/ext/modelist");

class Editor extends EventEmitter2 {

    constructor(name) {
        super();

        this.name = name;

        this.id = Editor.id++;

        this.a = document.createElement("a");
        this.a.classList.add("mdl-tabs__tab");
        this.a.setAttribute("id", "editors-bar-" + this.id);
        this.a.setAttribute("href", "#editors-" + this.id);
        this.a.textContent = name;

        this.editorDiv = document.createElement("div");
        this.editorDiv.classList.add("mdl-tabs__panel");
        this.editorDiv.classList.add("editor");
        this.editorDiv.setAttribute("id", "editors-" + this.id);

        this.editor = ace.edit(this.editorDiv);

        this.session = this.editor.getSession();
        this.session.setMode(modeList.getModeForPath(name).mode);

        this.a.addEventListener("click", () => this.emit("send", {id: "focus", filename: this.name, line: 0, column: 0}));
        this.a.addEventListener("contextmenu", e => {this.emit("rename", this), e.preventDefault();});

        this.editorDiv.addEventListener("click", () => this.editor.resize());

        this.editor.on("change", e => this.processChange(e));

    }

    select() {

        if (document.readyState === "complete") this.a.click();
        else this.emit("domQueue", this.a.click.bind(this.a));

    }

    processChange(e) {

        if (this.ignoreChanges) return;

        if (e.lines.length === 1)

            switch (e.action) {

                case "insert":
                    return this.emit("send", {
                        id: "line",
                        filename: this.name,
                        lineIndex: e.start.row,
                        start: e.start.column,
                        deleteCount: 0,
                        line: e.lines[0]
                    });

                case "remove":
                    return this.emit("send", {
                        id: "line",
                        filename: this.name,
                        lineIndex: e.start.row,
                        start: e.start.column,
                        deleteCount: e.lines[0].length,
                        line: ""
                    });

                default:
                    /*eslint-disable no-console*/
                    return console.error("Change not calculated!", e);
                    /*eslint-enable no-console*/

            }

        switch (e.action) {

            case "insert":
                return this.emit("send", {
                    id: "lines",
                    filename: this.name,
                    start: e.start.row,
                    deleteCount: 1,
                    lines: this.session.getLines(e.start.row, e.start.row + e.lines.length - 1)
                });

            case "remove":
                return this.emit("send", {
                    id: "lines",
                    filename: this.name,
                    start: e.start.row,
                    deleteCount: e.lines.length,
                    lines: [this.session.getLine(e.start.row, e.start.row)]
                });

            default:
                /*eslint-disable no-console*/
                return console.error("Change not calculated!", e);
                /*eslint-enable no-console*/

        }

    }

    load(lines) {

        this.ignoreChanges = true;
        this.editor.setValue(lines.join("\n"));
        this.ignoreChanges = false;

        this.editor.clearSelection();

    }

    line(json) {

        this.ignoreChanges = true;
        this.session.replace({
            start: {row: json.lineIndex, column: json.start},
            end: {row: json.lineIndex, column: json.start + json.deleteCount}
        }, json.line || "");
        this.ignoreChanges = false;

    }

    lines(json) {

        this.ignoreChanges = true;

        this.session.replace({
            start: {row: json.start, column: 0},
            end: {row: json.start + json.deleteCount - 1, column: json.deleteCount ? Number.MAX_VALUE : 0}
        }, json.lines.join("\n") + (json.deleteCount ? "" : "\n"));
        this.ignoreChanges = false;

    }

    rename(filename) {

        this.name = filename;

        // this.a.setAttribute("id", "editors-bar-" + filename);
        // this.a.setAttribute("href", "#editors-" + filename);
        this.a.textContent = filename;

        // this.editorDiv.setAttribute("id", "editors-" + filename);

    }

}

Editor.id = 0;
