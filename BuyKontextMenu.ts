namespace RTS_V2 {
    export class BuyKontextMenu {
        public isActive: Boolean = false;

        private playermanager: PlayerManager;
        private kontextMenuElement: HTMLElement;
        private buyTankElement: HTMLElement;

        constructor(_playermanager: PlayerManager) {
            this.playermanager = _playermanager;
            this.kontextMenuElement = document.querySelector("#buymenu");
            this.buyTankElement = document.querySelector("#buy-tank-btn");
            this.buyTankElement.addEventListener("click", this.buyTank);

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
            if (this.playermanager.coins >= 10 && this.playermanager.unitcount < 15) {
                this.playermanager.coins -= 10;
                this.playermanager.spawnTank();
                console.log("Tank gekauft");
                Audio.play(AUDIO.BUYSUCCESS);
            } else {
                Audio.play(AUDIO.BUYERROR);
            }
        }
    }
}