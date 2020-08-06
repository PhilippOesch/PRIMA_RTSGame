namespace RTS_V2 {

    import ƒ = FudgeCore;

    enum AIState {
        DEFENSIVE,
        AGGRESSIVE
    }

    export class AIManager extends ƒ.Node {
        public base: Base;
        public nearBaseRadius: number = 7;
        public currentState: AIState = AIState.AGGRESSIVE;
        public selectedUnits: Unit[];
        public coins: number = 0;
        public unitcount: number = 0;

        private coinRate: number = 500;
        private coinTimer: ƒ.Timer;

        private spawnPointArray: ƒ.Vector3[];
        private spawnpointIndex: number = 0;

        constructor() {
            super("AIManager");
            this.createBase();
            this.startCoinTimer();

            this.spawnPointArray = new Array<ƒ.Vector3>();
            let spawnPoint1: ƒ.Vector3 = this.base.mtxLocal.translation.copy;
            spawnPoint1.add(new ƒ.Vector3(-1, -3, 0));
            let spawnPoint2: ƒ.Vector3 = this.base.mtxLocal.translation.copy;
            spawnPoint2.add(new ƒ.Vector3(0, -3, 0));
            let spawnPoint3: ƒ.Vector3 = this.base.mtxLocal.translation.copy;
            spawnPoint3.add(new ƒ.Vector3(1, -3, 0));
            this.spawnPointArray.push(spawnPoint1, spawnPoint2, spawnPoint3);

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
            let spawnPos: ƒ.Vector3 = this.spawnPointArray[this.spawnpointIndex];
            this.spawnpointIndex = (this.spawnpointIndex + 1) % 3;
            let newUnit: TankUnit = new TankUnit("Unit", spawnPos, false);
            gameobjects.appendChild(newUnit);
        }

        public spawnSuperTank(): void {
            this.unitcount++;
            this.coins -= 10;
            let spawnPos: ƒ.Vector3 = this.spawnPointArray[this.spawnpointIndex];
            this.spawnpointIndex = (this.spawnpointIndex + 1) % 3;
            let newUnit: SuperTank = new SuperTank("Unit", spawnPos, false);
            gameobjects.appendChild(newUnit);
        }

        public spawnBomberTank(): void {
            this.unitcount++;
            this.coins -= 10;
            let spawnPos: ƒ.Vector3 = this.spawnPointArray[this.spawnpointIndex];
            this.spawnpointIndex = (this.spawnpointIndex + 1) % 3;
            let newUnit: Bomber = new Bomber("Unit", spawnPos, false);
            gameobjects.appendChild(newUnit);
        }

        public aggressiveAction(): void {
            let units: Unit[] = Utils.getUnits(false);
            let activeAndNonActiveUnits: { activeunits: Unit[], nonactiveunits: Unit[] };

            if (units.length != 0) {
                activeAndNonActiveUnits = this.splitActiveAndNonActiveUnits(units);
                let playerUnitsNearBase: Unit[] = this.getPlayerUnitsNearBase(Utils.getUnits(true));
                // let playerUnits: Unit[]= 

                if (activeAndNonActiveUnits.nonactiveunits.length > 0 && playerUnitsNearBase.length == 0) {
                    for (let unit of activeAndNonActiveUnits.nonactiveunits) {
                        unit.setTarget = playerManager.base;
                    }
                } else if(activeAndNonActiveUnits.nonactiveunits.length > 0 && playerUnitsNearBase.length > 0){
                    for (let unit of activeAndNonActiveUnits.nonactiveunits) {
                        unit.setTarget = playerUnitsNearBase[0];
                    }
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
                if (unit.getTarget == null || unit.getTarget == undefined) {
                    nonActiveUnits.push(unit);
                } else {
                    activeUnits.push(unit);
                }
            }

            return { activeunits: activeUnits, nonactiveunits: nonActiveUnits };
        }

        private getPlayerUnitsNearBase(_units: Unit[]): Unit[] {
            let unitsNearBase: Unit[] = new Array<Unit>();

            for (let unit of _units) {
                let distanceVector: ƒ.Vector3 = ƒ.Vector3.DIFFERENCE(unit.mtxWorld.translation, this.base.mtxLocal.translation);
                let squaredDistance: number = distanceVector.magnitudeSquared;

                if (squaredDistance < this.nearBaseRadius ** 2) {
                    unitsNearBase.push(unit);
                }
            }

            unitsNearBase.sort((a, b) => {
                let distanceA: number = ƒ.Vector3.DIFFERENCE(a.mtxWorld.translation, this.base.mtxWorld.translation).magnitudeSquared;
                let distanceB: number = ƒ.Vector3.DIFFERENCE(b.mtxWorld.translation, this.base.mtxWorld.translation).magnitudeSquared;

                if (distanceA < distanceB) {
                    return -1;
                }
                if (distanceA > distanceB) {
                    return 1;
                }
                return 0;
            })

            return unitsNearBase;
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