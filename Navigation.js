/*global EventEmitter2*/
/*exported Navigation*/

class Navigation extends EventEmitter2 {

    ready() {

        // this.drawer = document.getElementById("nav-drawer");
        this.layout = document.getElementById("layout");

        this.emit("ready");

    }

    collapseDrawer() {

        this.layout.MaterialLayout.toggleDrawer();

    }

    loggedIn() {

        this.layout.MaterialLayout.toggleDrawer();

    }

}
