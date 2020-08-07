namespace RTS_V2 {

    export class Flock {
        unit: Unit;
        neighborRadius: number = 5;
        avoidanceRadius: number = 1.3;
        avoidanceRadiusBase: number = 1.7;

        moveweight: number = 0.4;
        avoidanceWeight: number = 0.6;

        squareNeighborRadius: number;
        squareAvoidanceRadius: number;
        squareAvoidanceRadiusBase: number;

        constructor(_unit: Unit, _avoidanceRadius: number= 1.3, _avoidanceRadiusBase: number= 1.7) {
            this.avoidanceRadius = _avoidanceRadius;
            this.avoidanceRadiusBase = _avoidanceRadiusBase;
            this.unit = _unit;
            this.squareNeighborRadius = this.neighborRadius ** 2;
            this.squareAvoidanceRadius = this.avoidanceRadius ** 2;
            this.squareAvoidanceRadiusBase = this.avoidanceRadiusBase ** 2;
        }

        public calculateMove(_move: ƒ.Vector3): ƒ.Vector3 {
            let move: ƒ.Vector3 = ƒ.Vector3.ZERO();
            let neighbors: GameObject[] = this.getNearbyObjects(this.unit);

            let avoidanceMove: ƒ.Vector3 = this.avoidance(this.unit, neighbors);
            avoidanceMove.scale(this.avoidanceWeight);
            avoidanceMove = this.partialNormalization(avoidanceMove, this.avoidanceWeight);
            let weightedMove: ƒ.Vector3 = _move.copy;
            weightedMove.scale(this.moveweight);
            weightedMove = this.partialNormalization(weightedMove, this.moveweight);

            move.add(avoidanceMove);
            move.add(weightedMove);
            move.z = 0;

            return move;
        }

        public getAvoidableGameObjects(_node: Unit = this.unit, _neighbors: GameObject[]): GameObject[] {
            let gameobjectArray: GameObject[] = new Array<GameObject>();

            for (let element of _neighbors) {
                let distanceVector: ƒ.Vector3 = ƒ.Vector3.DIFFERENCE(element.mtxWorld.translation, _node.mtxWorld.translation);
                if (distanceVector.magnitudeSquared < this.squareAvoidanceRadius) {
                    gameobjectArray.push(element);
                }
            }

            return gameobjectArray;
        }

        public getAdjustedAvoidanceVector(_node: Unit = this.unit, _avoidNeighbors: GameObject[]): ƒ.Vector3 {
            if (_avoidNeighbors.length == 0) {
                return ƒ.Vector3.ZERO();
            }

            let avoidanceMove: ƒ.Vector3 = ƒ.Vector3.ZERO();
            let nAvoide: number = 0;

            for (let element of _avoidNeighbors) {
                let avoidVector: ƒ.Vector3 = ƒ.Vector3.DIFFERENCE(_node.mtxWorld.translation, element.mtxWorld.translation);
                avoidanceMove.add(avoidVector);
                nAvoide++;
            }

            if (nAvoide > 0)
            avoidanceMove.scale(1 / nAvoide);

            avoidanceMove = this.partialNormalization(avoidanceMove, this.avoidanceWeight);

            return avoidanceMove;
        }

        public getNearbyObjects(_node: Unit = this.unit): Array<GameObject> {
            let nearbyObjects: GameObject[] = new Array<GameObject>();
            let objects: GameObject[] = Utils.getAllButAirPlains();
            console.log(objects);

            for (let value of objects) {
                let distanceVector: ƒ.Vector3 = ƒ.Vector3.DIFFERENCE(value.mtxWorld.translation, _node.mtxWorld.translation);
                let distanceSquared: number = distanceVector.magnitudeSquared;
                if (value != _node && distanceSquared < this.squareNeighborRadius) {
                    nearbyObjects.push(value);
                }
            }

            return nearbyObjects;
        }

        private avoidance(_node: Unit = this.unit, _neighbors: GameObject[]): ƒ.Vector3 {
            if (_neighbors.length == 0) {
                return ƒ.Vector3.ZERO();
            }

            let avoidanceMove: ƒ.Vector3 = ƒ.Vector3.ZERO();
            let nAvoide: number = 0;

            for (let element of _neighbors) {
                let distanceVector: ƒ.Vector3 = ƒ.Vector3.DIFFERENCE(element.mtxWorld.translation, _node.mtxWorld.translation);
                if (distanceVector.magnitudeSquared < this.squareAvoidanceRadius) {
                    let avoidVector: ƒ.Vector3 = ƒ.Vector3.DIFFERENCE(_node.mtxWorld.translation, element.mtxWorld.translation);
                    avoidanceMove.add(avoidVector);
                    nAvoide++;
                }
                if (distanceVector.magnitudeSquared < this.squareAvoidanceRadiusBase && (element == playerManager.base || element == aiManager.base)) {
                    let avoidVector: ƒ.Vector3 = ƒ.Vector3.DIFFERENCE(_node.mtxWorld.translation, element.mtxWorld.translation);
                    avoidanceMove.add(avoidVector);
                    nAvoide++;
                }
            }

            if (nAvoide > 0)
                avoidanceMove.scale(1 / nAvoide);

            return avoidanceMove;
        }

        private partialNormalization(_vector: ƒ.Vector3, _weigth: number): ƒ.Vector3 {
            if (_vector.magnitudeSquared > _weigth ** 2) {
                _vector.normalize();
                _vector.scale(_weigth);
            }

            return _vector;
        }
    }
}