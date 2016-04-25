/*global EventEmitter2*/
/*exported Snackbar*/

class Snackbar extends EventEmitter2 {

    ready() {

        this.container = document.getElementById("snackbar");

    }

    show(data) {

        this.container.MaterialSnackbar.showSnackbar(data);

    }

}
