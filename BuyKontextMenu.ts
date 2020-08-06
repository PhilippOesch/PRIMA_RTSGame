namespace RTS_V2 {
    export class BuyKontextMenu {
        public isActive: Boolean = false;

        private playermanager: PlayerManager;
        private kontextMenuElement: HTMLElement;
        private buyTankElement: HTMLElement;
        private buySuperTankElement: HTMLElement;
        private buyBomberElement: HTMLElement;

        constructor(_playermanager: PlayerManager) {
            this.playermanager = _playermanager;
            this.kontextMenuElement = document.querySelector("#buymenu");
            this.buyTankElement = document.querySelector("#buy-tank-btn");
            this.buySuperTankElement = document.querySelector("#buy-supertank-btn");
            this.buyBomberElement = document.querySelector("#buy-bomber-btn");
            this.buySuperTankElement.addEventListener("click", this.buySuperTank);
            this.buyTankElement.addEventListener("click", this.buyTank);
            this.buyBomberElement.addEventListener("click", this.buyBomber);

            // let camera: ƒ.ComponentCamera = viewport.camera;

            // let basePos: ƒ.Vector3 = this.playermanager.base.mtxLocal.translation.copy;
            // let projection: ƒ.Vector3 = camera.project(basePos);
            // let screenPos: ƒ.Vector2 = viewport.pointClipToClient(projection.toVector2());
            // console.log("Base Pos: " + this.playermanager.base.mtxLocal.translation.copy);
            // console.log("relative Base Pos: " + projection);
            // console.log("Screen X: " + screenPos.x + ", Screen Y: " + screenPos.y);

            // this.kontextMenuElement.style.left = screenPos.x + "px";
            // this.kontextMenuElement.style.top = screenPos.y + "px";
        }

        public toggleMenu(): void {
            if (this.isActive) {
                this.kontextMenuElement.style.display = "none";
            } else {
                this.kontextMenuElement.style.display = "block";
            }
            this.isActive = !this.isActive;
        }

        public buyTank = (): void => {
            if (this.playermanager.coins >= 10 && this.playermanager.unitcount < unitsPerPlayer) {
                this.playermanager.coins -= 10;
                this.playermanager.spawnTank();
                console.log("Tank buyed");
                Audio.play(AUDIO.BUYSUCCESS);
            } else {
                Audio.play(AUDIO.BUYERROR);
            }
        }

        public buySuperTank = (): void => {
            if (this.playermanager.coins >= 20 && this.playermanager.unitcount < unitsPerPlayer) {
                this.playermanager.coins -= 20;
                this.playermanager.spawnSuperTank();
                console.log("Super Tank buyed");
                Audio.play(AUDIO.BUYSUCCESS);
            } else {
                Audio.play(AUDIO.BUYERROR);
            }
        }

        public buyBomber = (): void => {
            if (this.playermanager.coins >= 15 && this.playermanager.unitcount < unitsPerPlayer) {
                this.playermanager.coins -= 15;
                this.playermanager.spawnBomber();
                console.log("Bomber buyed");
                Audio.play(AUDIO.BUYSUCCESS);
            } else {
                Audio.play(AUDIO.BUYERROR);
            }
        }
    }
}