"use strict";
var RTS_V2;
(function (RTS_V2) {
    window.addEventListener("load", () => {
        new EndScreenManager();
    });
    class EndScreenManager {
        constructor() {
            console.log("Test Test Test");
            let status = (localStorage.getItem("gameStatus") == "won") ? "You Won" : "You Lost";
            this.titleHTMLElement = document.querySelector("#endscreen-title");
            this.endTimeHTMLElement = document.querySelector("#end-time");
            this.endDestoyedEnemies = document.querySelector("#end-enemies-destroyed");
            this.titleHTMLElement.innerHTML = status;
            this.endTimeHTMLElement.innerHTML = localStorage.getItem("gameTime");
            this.endDestoyedEnemies.innerHTML = localStorage.getItem("destroyedUnits");
            if (status == "You Lost") {
                document.querySelector("div.background").classList.add("lost-game");
            }
        }
    }
    RTS_V2.EndScreenManager = EndScreenManager;
})(RTS_V2 || (RTS_V2 = {}));
//# sourceMappingURL=endScreenManager.js.map