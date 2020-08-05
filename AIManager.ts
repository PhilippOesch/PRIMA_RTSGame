namespace RTS_V2 {
    // enum AIState{
    //     DEFENSIVE,
    //     OFFENSIVE
    // }

    export class AIManager extends ƒ.Node {
        public base: Base;

        constructor(){
            super("AIManager");
            this.addEventListener("endGame", this.endGameHandler);
            this.createBase();
        }

        public endGameHandler = (_event: Event): void => {
            console.log("End Game");  
        }

        private createBase(): void {
            let pos: ƒ.Vector3 = new ƒ.Vector3(+(terrainX / 2) - 5, 0, 0.1);
            this.base = new Base("enemyBase", pos, false);
            gameobjects.appendChild(this.base);
        }

    }
}