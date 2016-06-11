/*global EventEmitter2*/
/*exported Navigation*/

class Navigation extends EventEmitter2 {

    ready() {

        // this.drawer = document.getElementById("nav-drawer");
        this.layout = document.getElementById("layout");
        this.drawer = this.layout.querySelector(".mdl-layout__drawer");

        this.emit("ready");

    }

    collapseDrawer() {

        if (this.drawVisible())
            this.layout.MaterialLayout.toggleDrawer();
        
    }

    loggedIn() {

        this.collapseDrawer();

    }

    drawVisible() {

        return this.drawer.classList.contains("is-visible");

    }

}
