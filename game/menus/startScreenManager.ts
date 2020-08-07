namespace RTS_V2 {
    window.addEventListener("load", () => {
        new StartScreenManager();
    });

    export class StartScreenManager {
        playbutton: HTMLElement;
        overlay: HTMLElement;

        easyButton: HTMLElement;
        hardButton: HTMLElement;
        middleButton: HTMLElement;

        constructor() {
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

        public showOverlay = (): void => {
            this.overlay.style.display = "block";
        }

        public handleDifficultSelection = (_difficulty: string): void => {
            localStorage.setItem("difficulty", _difficulty);
            window.location.replace("./main.html");
        }
    }
}