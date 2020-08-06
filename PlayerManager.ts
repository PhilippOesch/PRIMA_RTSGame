namespace RTS_V2 {
    import ƒ = FudgeCore;

    export class PlayerManager extends ƒ.Node {
        public base: Base;
        public selectedUnits: Unit[];
        public startSelectionInfo: { startSelectionPos: ƒ.Vector3, startSelectionClientPos: ƒ.Vector2 };
        public mousePos: ƒ.Vector2;
        public coins: number = 0;
        public unitcount: number = 0;
        public unitsDestroyed: number = 0;

        private coinTimer: ƒ.Timer;
        private coinRate: number = 300;
        private timerHTMLElement: HTMLElement;
        private unitCountHTMLElement: HTMLElement;
        private unitsDestroyedHTMLElement: HTMLElement;
        private buyMenu: BuyKontextMenu;

        constructor() {
            super("player Manager");
            this.createBase();
            this.startCoinTimer();
            viewport.addEventListener(ƒ.EVENT_POINTER.DOWN, this.pointerDown);
            viewport.addEventListener(ƒ.EVENT_POINTER.UP, this.pointerUp);
            viewport.addEventListener(ƒ.EVENT_POINTER.MOVE, this.pointerMove);
            viewport.activatePointerEvent(ƒ.EVENT_POINTER.DOWN, true);
            viewport.activatePointerEvent(ƒ.EVENT_POINTER.UP, true);
            viewport.activatePointerEvent(ƒ.EVENT_POINTER.MOVE, true);
            this.buyMenu = new BuyKontextMenu(this);
            this.unitsDestroyedHTMLElement = document.querySelector("#units-destoyed");
            this.unitCountHTMLElement = document.querySelector("#unit-count");
            let maxUnits = document.querySelector("#max-units");
            maxUnits.innerHTML = unitsPerPlayer + "";
            console.log(this.buyMenu);

            this.addEventListener("gameWon", this.gameWonHandler);
        }

        public gameWonHandler = (_event: Event): void => {
            console.log("End Game");
            localStorage.setItem("gameTime", Utils.gameTimeToString());
            localStorage.setItem("destroyedUnits", playerManager.unitsDestroyed.toString());
            localStorage.setItem("gameStatus", "won");
            window.location.replace("/endScreen.html");
        }

        public pointerUp = (_event: ƒ.EventPointer): void => {
            _event.preventDefault();
            let posMouse: ƒ.Vector2 = new ƒ.Vector2(_event.canvasX, _event.canvasY);
            let ray: ƒ.Ray = viewport.getRayFromClient(posMouse);

            if (_event.which == 1) {
                let endPos: ƒ.Vector3 = ray.intersectPlane(new ƒ.Vector3(0, 0, 0.1), ƒ.Vector3.Z(1));

                let playerunits: Array<Unit> = Utils.getUnits();

                let distanceVector: ƒ.Vector3 = ƒ.Vector3.DIFFERENCE(this.startSelectionInfo.startSelectionPos, endPos);
                console.log(distanceVector);
                if (distanceVector.magnitudeSquared < 1 && this.base.isInPickingRange(ray)) {
                    this.buyMenu.toggleMenu();
                } else {
                    this.selectedUnits = Utils.selectUnits(this.startSelectionInfo.startSelectionPos, endPos, ray, playerunits);

                    console.log(this.selectedUnits);
                    if (this.buyMenu.isActive)
                        this.buyMenu.toggleMenu();
                }
            }

            this.startSelectionInfo = null;
        }

        public startCoinTimer(): void {
            this.timerHTMLElement = document.querySelector("#coins");
            this.coinTimer = new ƒ.Timer(ƒ.Time.game, this.coinRate, 0, this.coinTimerHandler);
            console.log(this.coinTimer);
        }

        public coinTimerHandler = (): void => {
            this.coins++;
            this.timerHTMLElement.innerHTML = this.coins + "";
        }

        public spawnTank(): void {
            this.increaseUnitCount();
            let spawnPos: ƒ.Vector3 = this.base.mtxLocal.translation.copy;
            spawnPos.add(ƒ.Vector3.Y(-3));
            let newUnit: TankUnit = new TankUnit("TankUnit", spawnPos);
            gameobjects.appendChild(newUnit);
        }

        public increaseUnitsDestroyed(): void {
            this.unitsDestroyed++;
            this.unitsDestroyedHTMLElement.innerHTML = this.unitsDestroyed + "";
        }

        public increaseUnitCount(): void {
            this.unitcount++;
            this.unitCountHTMLElement.innerHTML = this.unitcount + "";
        }

        public decreaseUnitCount(): void {
            this.unitcount--;
            this.unitCountHTMLElement.innerHTML = this.unitcount + "";
        }

        public pointerDown = (_event: ƒ.EventPointer): void => {
            let posMouse: ƒ.Vector2 = new ƒ.Vector2(_event.canvasX, _event.canvasY);
            let ray: ƒ.Ray = viewport.getRayFromClient(posMouse);
            let position: ƒ.Vector3 = ray.intersectPlane(new ƒ.Vector3(0, 0, 0.1), ƒ.Vector3.Z(1));

            let isInsideTerrain: boolean = (Math.abs(position.x) < (terrainX / 2 - 0.5) && Math.abs(position.y) < (terrainY / 2 - 0.5));

            if (_event.which == 1) { //Left Mouse Click
                this.mousePos = posMouse;
                this.startSelectionInfo = { startSelectionPos: position, startSelectionClientPos: posMouse };
            } else if (_event.which == 3 && this.selectedUnits.length != 0 && isInsideTerrain) {

                Utils.commandUnits(this.selectedUnits, position, ray);

            } else {
                this.startSelectionInfo = null;
            }
        }

        public pointerMove = (_event: ƒ.EventPointer): void => {
            let posMouse: ƒ.Vector2 = new ƒ.Vector2(_event.canvasX, _event.canvasY);
            this.mousePos = posMouse;
        }

        private createBase(): void {
            let pos: ƒ.Vector3 = new ƒ.Vector3(-(terrainX / 2) + 5, 0, 0.1);
            this.base = new Base("playerBase", pos);
            gameobjects.appendChild(this.base);
        }
    }
}