namespace RTS_V2 {

    export class PlainFlock extends Flock{

        
        public getNearbyObjects(_node: Unit = this.unit): Array<GameObject> {
            let nearbyObjects: GameObject[] = new Array<GameObject>();
            let objects: GameObject[] = Utils.getAirPlanes();

            for (let value of objects) {
                let distanceVector: ƒ.Vector3 = ƒ.Vector3.DIFFERENCE(value.mtxWorld.translation, _node.mtxWorld.translation);
                let distanceSquared: number = distanceVector.magnitudeSquared;
                if (value != _node && distanceSquared < this.squareNeighborRadius) {
                    nearbyObjects.push(value);
                }
            }

            return nearbyObjects;
        }
    }
}