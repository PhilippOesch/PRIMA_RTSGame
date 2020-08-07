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

        private coinRate: number;
        private coinTimer: ƒ.Timer;

        private spawnPointArray: ƒ.Vector3[];
        private spawnpointIndex: number = 0;
        private nextUnit: UnitType;

        constructor() {
            super("AIManager");
            this.setDifficulty();
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

            this.addEventListener("defensive", this.changeToDefensive);
        }

        public setDifficulty(): void {
            let difficulty: string = localStorage.getItem("difficulty");
            switch (difficulty) {
                case "easy":
                    this.coinRate = 500;
                    break;
                case "middle":
                    this.coinRate = 400;
                    break;
                case "hard":
                    this.coinRate = 300;
                    break;
            }
        }

        public changeToDefensive = (): void => {
            this.nearBaseRadius = 10;
            this.currentState = AIState.DEFENSIVE;

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

        public spawnUnit(_unitType: UnitType): void {
            this.unitcount++;
            this.coins -= _unitType;
            let spawnPos: ƒ.Vector3 = this.spawnPointArray[this.spawnpointIndex];
            this.spawnpointIndex = (this.spawnpointIndex + 1) % 3;
            let newUnit: Unit;

            switch (_unitType) {
                case UnitType.TANK:
                    newUnit = new TankUnit("Unit", spawnPos, false);
                    break;
                case UnitType.BOMBER:
                    newUnit = new Bomber("Unit", spawnPos, false);
                    break;
                case UnitType.SUPERTANK:
                    newUnit = new SuperTank("Unit", spawnPos, false);
                    break;
            }

            gameobjects.appendChild(newUnit);
        }

        public aggressiveAction(): void {
            let units: Unit[] = Utils.getUnits(false);
            let playerUnits: Unit[] = Utils.getUnits();
            let activeAndNonActiveUnits: { activeunits: Unit[], nonactiveunits: Unit[] };

            if (this.nextUnit == null || this.nextUnit == undefined) {
                this.nextUnit = this.analysePlayerUnits(playerUnits);
            }

            if (units.length != 0) {
                activeAndNonActiveUnits = this.splitActiveAndNonActiveUnits(units);
                let playerUnitsNearBase: Unit[] = this.getPlayerUnitsNearBase(Utils.getUnits(true));

                if (activeAndNonActiveUnits.nonactiveunits.length > 0 && playerUnitsNearBase.length == 0) {
                    for (let unit of activeAndNonActiveUnits.nonactiveunits) {
                        unit.setTarget = playerManager.base;
                    }
                } else if (activeAndNonActiveUnits.nonactiveunits.length > 0 && playerUnitsNearBase.length > 0) {
                    for (let unit of activeAndNonActiveUnits.nonactiveunits) {
                        unit.setTarget = playerUnitsNearBase[0];
                    }
                }

            }

            if (this.coins >= this.nextUnit && this.unitcount < unitsPerPlayer && (this.nextUnit != null || this.nextUnit != undefined)) {
                let randomValue: number = Math.random();
                let unittypeArray: UnitType[] = [UnitType.TANK, UnitType.SUPERTANK, UnitType.BOMBER];
                let randomIndex: number = ƒ.Random.default.getRangeFloored(0, 2);

                if (randomValue > 0.4) {
                    this.spawnUnit(this.nextUnit);
                } else {
                    this.spawnUnit(unittypeArray[randomIndex]);
                }
                this.nextUnit = null;

                console.log("buy");
            }
        }

        private defensiveAction(): void {
            let units: Unit[] = Utils.getUnits(false);
            let playerUnits: Unit[] = Utils.getUnits();

            if (this.nextUnit == null || this.nextUnit == undefined) {
                this.nextUnit = this.analysePlayerUnits(playerUnits);
            }

            if (units.length != 0) {
                let playerUnitsNearBase: Unit[] = this.getPlayerUnitsNearBase(Utils.getUnits(true));

                if (playerUnitsNearBase.length == 0) {
                    for (let unit of units) {
                        unit.setTarget = playerManager.base;
                    }
                } else if (playerUnitsNearBase.length > 0) {
                    for (let unit of units) {
                        unit.setTarget = playerUnitsNearBase[0];
                    }
                }

            }

            if (this.coins >= this.nextUnit && this.unitcount < unitsPerPlayer && (this.nextUnit != null || this.nextUnit != undefined)) {
                let randomValue: number = Math.random();
                let unittypeArray: UnitType[] = [UnitType.TANK, UnitType.SUPERTANK, UnitType.BOMBER];
                let randomIndex: number = ƒ.Random.default.getRangeFloored(0, 2);

                if (randomValue > 0.3) {
                    this.spawnUnit(this.nextUnit);
                } else {
                    this.spawnUnit(unittypeArray[randomIndex]);
                }
                this.nextUnit = null;

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
            });

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
                    this.defensiveAction();
                    break;
            }
        }

        private analysePlayerUnits(_units: Unit[]): UnitType {
            let tanksCount: number = 0;
            let superTankCount: number = 0;
            let bomberCount: number = 0;

            for (let unit of _units) {
                switch (unit.unitType) {
                    case UnitType.TANK:
                        tanksCount++;
                        break;
                    case UnitType.SUPERTANK:
                        superTankCount++;
                        break;
                    case UnitType.BOMBER:
                        bomberCount++;
                        break;
                }
            }

            if (superTankCount > bomberCount && superTankCount > tanksCount) {
                return UnitType.BOMBER;
            } else if (bomberCount > superTankCount && bomberCount > tanksCount) {
                return UnitType.TANK;
            } else {
                return UnitType.SUPERTANK;
            }
        }
    }
}