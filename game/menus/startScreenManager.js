"use strict";
var RTS_V2;
(function (RTS_V2) {
    window.addEventListener("load", () => {
        new StartScreenManager();
    });
    class StartScreenManager {
        constructor() {
            this.showOverlay = () => {
                this.overlay.style.display = "block";
            };
            this.handleDifficultSelection = (_difficulty) => {
                localStorage.setItem("difficulty", _difficulty);
                window.location.replace("./main.html");
            };
            console.log("test");
            this.playbutton = document.querySelector("#select-difficulty");
            this.overlay = document.querySelector("#difficulty-overlay");
            this.easyButton = document.querySelector("#difficulty-easy");
            this.middleButton = document.querySelector("#difficulty-middle");
            this.hardButton = document.querySelector("#difficulty-hard");
            this.playbutton.addEventListener("click", this.showOverlay);
            this.easyButton.addEventListener("click", () => this.handleDifficultSelection("easy"));
            this.middleButton.addEventListener("click", () => this.handleDifficultSelection("middle"));
            this.hardButton.addEventListener("click", () => this.handleDifficultSelection("hard"));
        }
    }
    RTS_V2.StartScreenManager = StartScreenManager;
})(RTS_V2 || (RTS_V2 = {}));
//# sourceMappingURL=startScreenManager.js.map