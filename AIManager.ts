namespace RTS_V2 {

    import ƒ = FudgeCore;
    enum AIState {
        DEFENSIVE,
        AGGRESSIVE
    }

    export class AIManager extends ƒ.Node {
        public base: Base;
        public currentState: AIState = AIState.AGGRESSIVE;
        public selectedUnits: Unit[];
        public coins: number = 0;
        public unitcount: number = 0;

        private coinRate: number = 350;
        private coinTimer: ƒ.Timer;

        constructor() {
            super("AIManager");
            this.createBase();
            this.startCoinTimer();
            ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, this.update.bind(this));
        }

        public startCoinTimer(): void {
            this.coinTimer = new ƒ.Timer(ƒ.Time.game, this.coinRate, 0, this.coinTimerHandler);
            console.log(this.coinTimer);
        }


        public coinTimerHandler = (): void => {
            this.coins++;
        }

        public update = (): void => {
            this.act(this.currentState);
        }

        public spawnTank(): void {
            this.unitcount++;
            this.coins -= 10;
            let spawnPos: ƒ.Vector3 = this.base.mtxLocal.translation.copy;
            spawnPos.add(ƒ.Vector3.Y(-3));
            let newUnit: TankUnit = new TankUnit("TankUnit", spawnPos, false);
            gameobjects.appendChild(newUnit);
        }

        public aggressiveAction(): void {
            let units: Unit[] = Utils.getUnits(false);
            let activeAndNonActiveUnits: { activeunits: Unit[], nonactiveunits: Unit[] };
            if (units.length != 0) {
                activeAndNonActiveUnits = this.splitActiveAndNonActiveUnits(units);

                for (let unit of activeAndNonActiveUnits.nonactiveunits) {
                    unit.setTarget = playerManager.base;
                }
            }

            if (this.coins >= 10 && this.unitcount < unitsPerPlayer) {
                this.spawnTank();
                console.log("buy");
            }
        }

        private splitActiveAndNonActiveUnits(_units: Unit[]): { activeunits: Unit[], nonactiveunits: Unit[] } {
            let activeUnits: Unit[] = new Array<Unit>();
            let nonActiveUnits: Unit[] = new Array<Unit>();

            for (let unit of _units) {
                if (unit.getTarget == null) {
                    activeUnits.push(unit);
                } else {
                    nonActiveUnits.push(unit);
                }
            }

            return { activeunits: _units, nonactiveunits: _units };
        }

        private createBase(): void {
            let pos: ƒ.Vector3 = new ƒ.Vector3(+(terrainX / 2) - 5, 0, 0.1);
            this.base = new Base("enemyBase", pos, false);
            gameobjects.appendChild(this.base);
        }

        private act(_action: AIState): void {
            switch (_action) {
                case AIState.AGGRESSIVE:
                    this.aggressiveAction();
                    break;
                case AIState.DEFENSIVE:
                    console.log("defensive");
                    break;
            }
        }
    }
}