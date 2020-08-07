/// <reference path="Unit.ts"/>
namespace RTS_V2 {
    import ƒ = FudgeCore;
    import ƒAid = FudgeAid;

    export class Bomber extends Unit{
        public static bodyImg: HTMLImageElement;
        public static playerbarrelImg: HTMLImageElement;
        public static enemyBarrelImg: HTMLImageElement;

        private cannonNode: ƒ.Node;
        private selected: ƒ.Node;

        constructor(_name: string, _pos: ƒ.Vector3, _isPlayer: boolean = true) {
            super(_name);
            this.unitType = UnitType.BOMBER;
            let unitSettings: UnitSettings = Unit.unitSettings.get(this.unitType);
            this.isPlayer = _isPlayer;
            this.collisionRange = 0.8;
            this.shootingRange = 4;
            this.health = 1;
            this.armor = unitSettings.armor;
            this.shootingRate = unitSettings.shootingrate;
            this.speed = unitSettings.speed;
            this.flock = new PlainFlock(this);
            this.createNodes(_pos);
            ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, this.update.bind(this));
            this.healthBar = new Healthbar(this);
        }

        public static loadImages(): void {
            Bomber.bodyImg = document.querySelector("#airplane");
            Bomber.playerbarrelImg = document.querySelector("#playerairplaneBarrel");
            Bomber.enemyBarrelImg = document.querySelector("#enemyairplaneBarrel");
        }

        public calculateDamage(_bullet: Bullet): void {
            let damage: number;

            if(_bullet.unitType == UnitType.TANK) {
                damage = ((_bullet.damage * 1.5) / this.armor);
            } else if(_bullet.unitType == UnitType.SUPERTANK) {
                damage = ((_bullet.damage * 0.5) / this.armor);
            } else {
                damage = (_bullet.damage / this.armor);
            }
            
            this.health -= damage;
            //(<Healthbar>this.healthBar).health = Math.floor(this.health * 100);
            if (this.health <= 0 && !this.isDead) {
                gameobjects.removeChild(this);
                this.isDead = true;
                this.healthBar.delete();
                this.healthBar = null;

                this.target = null;
                this.clearTimer();

                if (this.isPlayer) {
                    playerManager.decreaseUnitCount();
                } else {
                    playerManager.increaseUnitsDestroyed();
                }
            }
        }
        
        public setPicked(_bool: boolean): void {
            if (_bool) {
                this.appendChild(this.selected);
            } else {
                this.removeChild(this.selected);
            }
        }
        
        public update(): void {
            let getNeighbors: GameObject[] = this.flock.getNearbyObjects(this);
            let avoidObjects: GameObject[] = this.flock.getAvoidableGameObjects(this.flock.unit, getNeighbors);

            if (this.target != null) {
                this.attack();
            } else {
                this.clearTimer();
            }
            if (this.moveTo != null && this.moveTo != undefined) {
                this.move(this.moveTo);

                //don't ask why! it somehow prevents an error and works
                if (this.moveTo != null) {
                    let pointAt: ƒ.Vector3 = this.moveTo.copy;
                    pointAt.add(ƒ.Vector3.Z(0.6));
                    Utils.adjustLookAtToGameworld(pointAt, this.bodyNode);
                }
            } else if (avoidObjects.length > 0) {
                let moveVector: ƒ.Vector3 = this.flock.getAdjustedAvoidanceVector(this, avoidObjects);
                this.move(moveVector);
            }
        }

        protected follow(): void {
            if (this.target != null && this.target != undefined) {
                let targetpos: ƒ.Vector3 = this.target.mtxWorld.translation.copy;
                targetpos.add(ƒ.Vector3.Z(0.3));
                Utils.adjustLookAtToGameworld(targetpos, this.cannonNode);
            }
        }

        private createNodes(_pos: ƒ.Vector3): void {
            let mesh: ƒ.MeshSprite = new ƒ.MeshSprite();

            let bodyMtr: ƒ.Material = this.getTextureMaterial(Bomber.bodyImg);
            let selectedMtr: ƒ.Material = this.getTextureMaterial(Unit.selectedImg);

            let cannonMtr: ƒ.Material;

            if (this.isPlayer) {
                cannonMtr = this.getTextureMaterial(Bomber.playerbarrelImg);
            } else {
                cannonMtr = this.getTextureMaterial(Bomber.enemyBarrelImg);
            }

            this.selected = new ƒAid.Node("Unit Selected", ƒ.Matrix4x4.IDENTITY(), selectedMtr, TankUnit.mesh);
            let selectedCmpNode: ƒ.ComponentMesh = this.selected.getComponent(ƒ.ComponentMesh);
            selectedCmpNode.pivot.scale(ƒ.Vector3.ONE(1.2));

            let position: ƒ.Vector3 = _pos.copy;
            let unitCmpTransform: ƒ.ComponentTransform = new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(position));
            this.addComponent(unitCmpTransform);

            this.bodyNode = new ƒAid.Node("Unit Body", ƒ.Matrix4x4.TRANSLATION(ƒ.Vector3.Z(0.3)), bodyMtr, mesh);
            let bodyCmpMesh: ƒ.ComponentMesh = this.bodyNode.getComponent(ƒ.ComponentMesh);
            bodyCmpMesh.pivot.scale(ƒ.Vector3.ONE(2));
            bodyCmpMesh.pivot.rotateZ(180);

            this.cannonNode = new ƒ.Node("Unit Cannon");
            let cmpTransform: ƒ.ComponentTransform = new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(ƒ.Vector3.Z(0.3)));
            this.cannonNode.addComponent(cmpTransform);

            let barrelNode: ƒAid.Node = new ƒAid.Node("Unit Barrel", ƒ.Matrix4x4.TRANSLATION(new ƒ.Vector3(-0.2, 0, 0.11)), cannonMtr, TankUnit.mesh);
            let barrelCmpMesh: ƒ.ComponentMesh = barrelNode.getComponent(ƒ.ComponentMesh);
            barrelCmpMesh.pivot.scale(new ƒ.Vector3(0.6, 0.3, 0));
            barrelCmpMesh.pivot.rotateZ(90);

            this.appendChild(this.bodyNode);
            this.appendChild(this.cannonNode);
            this.cannonNode.appendChild(barrelNode);
        }
    }
}