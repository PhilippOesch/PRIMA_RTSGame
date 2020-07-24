namespace RTS_V2 {
    import ƒ = FudgeCore;

    export class PlayerManager {
        public base: Base;
        public selectedUnits: Unit[];
        public startSelectionInfo: { startSelectionPos: ƒ.Vector3, startSelectionClientPos: ƒ.Vector2 };
        public mousePos: ƒ.Vector2;
        public coins: number;

        constructor() {
            this.createBase();
            viewport.addEventListener(ƒ.EVENT_POINTER.DOWN, this.pointerDown);
            viewport.addEventListener(ƒ.EVENT_POINTER.UP, this.pointerUp);
            viewport.addEventListener(ƒ.EVENT_POINTER.MOVE, this.pointerMove);
            viewport.activatePointerEvent(ƒ.EVENT_POINTER.DOWN, true);
            viewport.activatePointerEvent(ƒ.EVENT_POINTER.UP, true);
            viewport.activatePointerEvent(ƒ.EVENT_POINTER.MOVE, true);
        }

        public pointerUp = (_event: ƒ.EventPointer): void => {
            _event.preventDefault();
            let posMouse: ƒ.Vector2 = new ƒ.Vector2(_event.canvasX, _event.canvasY);
            let ray: ƒ.Ray = viewport.getRayFromClient(posMouse);

            if (_event.which == 1) {
                let endPos: ƒ.Vector3 = ray.intersectPlane(new ƒ.Vector3(0, 0, 0.1), ƒ.Vector3.Z(1));

                let playerunits: Array<Unit> = Utils.getUnits();

                this.selectedUnits = Utils.selectUnits(this.startSelectionInfo.startSelectionPos, endPos, ray, playerunits);

                console.log(this.selectedUnits);
            }

            this.startSelectionInfo = null;
        }

        public pointerDown = (_event: ƒ.EventPointer): void => {
            let posMouse: ƒ.Vector2 = new ƒ.Vector2(_event.canvasX, _event.canvasY);
            let ray: ƒ.Ray = viewport.getRayFromClient(posMouse);
            let position: ƒ.Vector3 = ray.intersectPlane(new ƒ.Vector3(0, 0, 0.1), ƒ.Vector3.Z(1));

            if (_event.which == 1) { //Left Mouse Click
                this.mousePos = posMouse;
                this.startSelectionInfo = { startSelectionPos: position, startSelectionClientPos: posMouse };
            } else if (_event.which == 3 && this.selectedUnits.length != 0) {

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