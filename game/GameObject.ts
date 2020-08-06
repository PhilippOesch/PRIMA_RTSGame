namespace RTS_V2{
    export abstract class GameObject extends ƒ.Node {
        public isPlayer: boolean;
        public isDead: boolean;
        public collisionRange: number;

        protected health: number;
        protected armor: number;
        protected healthBar: Healthbar;

        public get getHealth(): number {
            return this.health;
        }

        public setPicked(_bool: boolean): void {
            console.log("isPicked");
        }

        public isInPickingRange(_ray: ƒ.Ray): boolean {
            let distanceVector: ƒ.Vector3 = _ray.getDistance(this.mtxWorld.translation.copy);
            if (distanceVector.magnitudeSquared < this.collisionRange ** 2) {
                return true;
            } else {
                return false;
            }
        }

        public calculateDamage(_bullet: Bullet): void {
            this.health -= (_bullet.damage / this.armor);
            //(<Healthbar>this.healthBar).health = Math.floor(this.health * 100);
            if (this.health <= 0 && !this.isDead) {
                gameobjects.removeChild(this);
                this.isDead = true;
                this.healthBar.delete();
                this.healthBar = null;

                if(this.isPlayer){
                    playerManager.decreaseUnitCount();
                } else {
                    playerManager.increaseUnitsDestroyed();
                }
            }
        }

        protected getTextureMaterial(_img: HTMLImageElement): ƒ.Material {
            let txt: ƒ.TextureImage = new ƒ.TextureImage();
            let coatTxt: ƒ.CoatTextured = new ƒ.CoatTextured();
            txt.image = _img;
            coatTxt.texture = txt;
            return new ƒ.Material(name, ƒ.ShaderTexture, coatTxt);
        }

    }
}