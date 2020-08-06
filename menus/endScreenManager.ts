namespace RTS_V2 {
    window.addEventListener("load", () => {
        new EndScreenManager();
    });

    export class EndScreenManager {
        private titleHTMLElement: HTMLElement;
        private endTimeHTMLElement: HTMLElement;
        private endDestoyedEnemies: HTMLElement;

        constructor() {
            console.log("Test Test Test");
            this.titleHTMLElement = document.querySelector("#endscreen-title");
            this.endTimeHTMLElement = document.querySelector("#end-time");
            this.endDestoyedEnemies = document.querySelector("#end-enemies-destroyed");
            this.titleHTMLElement.innerHTML = (localStorage.getItem("gameStatus") == "won") ? "You Won" : "You Lost";
            this.endTimeHTMLElement.innerHTML = localStorage.getItem("gameTime");
            this.endDestoyedEnemies.innerHTML = localStorage.getItem("destroyedUnits");
        }
    }
}