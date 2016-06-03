/*global EventEmitter2, util*/
/*exported Popup*/

class Popup extends EventEmitter2 {

    ready() {

        this.isReady = true;

        util.grabElements(this, {
            dialog: "popup-dialog",
            title: "popup-title", text: "popup-text",
            yes: "popup-yes", no: "popup-no"
        });

        this.no.addEventListener("click", () => {this.dialog.close(); this.reject();});
        this.yes.addEventListener("click", () => {this.dialog.close(); this.resolve();});

        if (this.queued) setTimeout(this.processOptions.bind(this), 100);

    }

    processOptions() {

        this.title.innerHTML = this.options.title || "";
        this.text.innerHTML = this.options.text || "";
        this.yes.innerHTML = this.options.yesText || "Yes";
        this.no.innerHTML = this.options.noText || "No";

        if (this.options.mode)
            switch (this.options.mode) {

                case "yes":
                    this.yes.style.display = "inline-block";
                    this.no.style.display = "none";
                    break;

                case "no":
                    this.no.style.display = "inline-block";
                    this.yes.style.display = "none";
                    break;

                case "yesno": case "noyes":
                    this.no.style.display = "inline-block";
                    this.yes.style.display = "inline-block";
                    break;

                default:
                    this.no.style.display = "none";
                    this.yes.style.display = "none";
                    break;

            }

        else {

            this.no.style.display = "inline-block";
            this.yes.style.display = "inline-block";

        }

        if (!this.dialog.open)
            this.dialog.showModal();

    }

    show(options) {

        this.options = options;

        this.promise = new Promise((resolve, reject) => {

            this.resolve = resolve;
            this.reject = reject;

        });

        if (!this.isReady) {
            this.queued = true;
            return this.promise;
        }

        this.processOptions();

        return this.promise;

    }

}
