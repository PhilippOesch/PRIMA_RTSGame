namespace RTS_V2 {
    import ƒ = FudgeCore;

    export module Utils {
        export function adjustLookAtToGameworld(_lookAtPos: ƒ.Vector3, _node: ƒ.Node): void {
            let adjustetLookAtToWorld: ƒ.Vector3 = _lookAtPos.copy;
            adjustetLookAtToWorld.subtract(_node.mtxWorld.translation.copy);
            _node.mtxLocal.lookAt(adjustetLookAtToWorld, ƒ.Vector3.Z());
            _node.mtxLocal.rotate(new ƒ.Vector3(0, 90, 90));
        }

        export function createUnitPositions(_startPos: ƒ.Vector3, _ringDistancesArray: number[], _ringPosCountArray: number[]): ƒ.Vector3[] {
            let positionArray: ƒ.Vector3[] = new Array<ƒ.Vector3>();
            positionArray.push(_startPos);

            for (let i = 0; i < _ringDistancesArray.length; i++) {
                let ringPosArray: ƒ.Vector3[] = Utils.createUnitRingPosArray(_startPos, _ringDistancesArray[i], _ringPosCountArray[i]);
                positionArray = positionArray.concat(ringPosArray);
            }

            return positionArray;
        }

        export function createUnitRingPosArray(_pos: ƒ.Vector3, _distance: number, _positionCount: number): ƒ.Vector3[] {
            let targetPosArray: Array<ƒ.Vector3> = new Array<ƒ.Vector3>();
            for (let i = 0; i < _positionCount; i++) {
                let angle: number = i * (360 / _positionCount);
                let dir: ƒ.Vector3 = new ƒ.Vector3(1, 0, 0);
                dir.transform(ƒ.Matrix4x4.ROTATION_Z(angle));
                dir.normalize(_distance);
                let position: ƒ.Vector3 = _pos.copy;
                position.add(dir);

                let isInsideTerrain: boolean = (Math.abs(position.x) < (terrainX / 2 - 0.5) && Math.abs(position.y) < (terrainY / 2 - 0.5));
                if (isInsideTerrain) {
                    targetPosArray.push(position);
                }
            }

            return targetPosArray;
        }

        export function gameTimeToString(): string {
            let time: number = ƒ.Time.game.get();
            let units: ƒ.TimeUnits = ƒ.Time.getUnits(time);
            return units.minutes.toString().padStart(2, "0") + ":" + units.seconds.toString().padStart(2, "0");
        }

        export function commandUnits(_selectedunits: Unit[], _pos: ƒ.Vector3, _ray: ƒ.Ray): void {

            let targetPosArray: ƒ.Vector3[] = Utils.createUnitPositions(_pos, [2, 4, 6], [5, 10, 20]);
            // let targetPosArray: ƒ.Vector3[] = Utils.createUnitRingPosArray(_pos, 1.5, _selectedunits.length);

            let enemySelected: GameObject = null;

            let enemies: Array<GameObject> = getGameObjects(false);

            for (let enemy of enemies) {
                if (enemy.isInPickingRange(_ray)) {
                    enemySelected = enemy;
                }
            }
            if (enemySelected != null) {
                for (let unit of _selectedunits) {
                    unit.setTarget = enemySelected;
                }
            } else {
                let index: number = 0;

                for (let unit of _selectedunits) {
                    unit.setTarget = null;
                    unit.setMove = targetPosArray[index];
                    index++;
                }
            }
        }

        export function selectUnits(_selectionStart: ƒ.Vector3, _selectionEnd: ƒ.Vector3, _ray: ƒ.Ray, _units: Unit[]): Unit[] {
            let distanceVector: ƒ.Vector3 = ƒ.Vector3.DIFFERENCE(_selectionStart, _selectionEnd);
            let selectedUnits: Unit[] = new Array<Unit>();

            if (distanceVector.magnitudeSquared < 1) {
                for (let unit of _units) {
                    if (unit.isInPickingRange(_ray)) {
                        unit.setPicked(true);
                        selectedUnits.push(unit);
                    } else {
                        unit.setPicked(false);
                    }
                }
            } else {
                for (let unit of _units) {
                    let unitPos: ƒ.Vector3 = unit.mtxWorld.translation.copy;
                    let adjustedStartPos: ƒ.Vector3 = _selectionStart.copy;
                    adjustedStartPos.subtract(ƒ.Vector3.Z(0.5));
                    let adjustedEndPos: ƒ.Vector3 = _selectionEnd.copy;
                    adjustedEndPos.add((ƒ.Vector3.Z(0.5)));

                    if (unitPos.isInsideCube(adjustedStartPos, adjustedEndPos)) {
                        unit.setPicked(true);
                        selectedUnits.push(unit);
                    } else {
                        unit.setPicked(false);
                    }
                }
            }
            return selectedUnits;
        }

        export function getGameObjects(_isPlayer: boolean = true): Array<GameObject> {
            let array: GameObject[] = gameobjects.getChildren().map(value => <GameObject>value);
            if (_isPlayer) {
                return array.filter((value) => {
                    if (value.isPlayer)
                        return true;
                    return false;
                });
            } else {
                return array.filter((value) => {
                    if (!value.isPlayer)
                        return true;
                    return false;
                });
            }
        }

        export function getUnits(_isPlayer: boolean = true): Array<Unit> {
            let array: Unit[] = gameobjects.getChildren().map(value => <Unit>value);
            if (_isPlayer) {
                return array.filter((value) => {
                    if (value.isPlayer)
                        return true;
                    return false;
                });
            } else {
                return array.filter((value) => {
                    if (!value.isPlayer)
                        return true;
                    return false;
                });
            }
        }

        export function getAllGameObjects(): Array<GameObject> {
            return gameobjects.getChildren().map(value => <GameObject>value);
        }

        export function drawSelectionRectangle(_startClient: ƒ.Vector2, _endClient: ƒ.Vector2): void {
            let ctx: CanvasRenderingContext2D = viewport.getContext();
            let vector: ƒ.Vector2 = _endClient.copy;
            vector.subtract(_startClient);
            ctx.save();
            ctx.beginPath();
            ctx.rect(_startClient.x, _startClient.y, vector.x, vector.y);
            ctx.strokeStyle = "Black";
            ctx.lineWidth = 3;
            ctx.stroke();
        }
    }
}