/// <reference path="Unit.ts"/>
namespace RTS_V2 {
    import ƒ = FudgeCore;
    import ƒAid = FudgeAid;

    export class TankUnit extends Unit {
        public static mesh: ƒ.MeshSprite = new ƒ.MeshSprite();

        public static bodyImg: HTMLImageElement;
        public static enemyBodyImg: HTMLImageElement;
        public static cannonImg: HTMLImageElement;
        public static barrelImg: HTMLImageElement;
        public static enemyBarrelImg: HTMLImageElement;
        public static selectedImg: HTMLImageElement;

        private cannonNode: ƒ.Node;
        private selected: ƒ.Node;

        constructor(_name: string, _pos: ƒ.Vector3, _isPlayer: boolean = true) {
            super(_name);
            this.unitType = UnitType.TANK;
            let unitsetting: UnitSettings = Unit.unitSettings.get(this.unitType);
            this.isPlayer = _isPlayer;
            this.collisionRange = 0.6;
            this.shootingRange = 5;
            this.health = unitsetting.health;
            this.armor = unitsetting.armor;
            this.shootingRate = unitsetting.shootingrate;
            this.speed = unitsetting.speed;
            this.flock = new Flock(this);
            this.createNodes(_pos);
            ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, this.update.bind(this));
            this.healthBar = new Healthbar(this);
        }

        public static loadImages(): void {
            TankUnit.bodyImg = document.querySelector("#tank");
            TankUnit.cannonImg = document.querySelector("#cannon");
            TankUnit.enemyBodyImg = document.querySelector("#enemytank");
            TankUnit.enemyBarrelImg = document.querySelector("#enemybarrel");
            TankUnit.barrelImg = document.querySelector("#barrel");
        }

        public calculateDamage(_bullet: Bullet): void {
            let damage: number;

            if(_bullet.unitType == UnitType.SUPERTANK) {
                damage = ((_bullet.damage * 1.5) / this.armor);
            } else if(_bullet.unitType == UnitType.BOMBER) {
                damage = ((_bullet.damage * 0.5) / this.armor);
            } else {
                damage = ((_bullet.damage) / this.armor);
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

        protected follow(): void {
            if (this.target != null && this.target != undefined) {
                let targetpos: ƒ.Vector3 = this.target.mtxWorld.translation.copy;
                Utils.adjustLookAtToGameworld(targetpos, this.cannonNode);
            }
        }

        private createNodes(_pos: ƒ.Vector3): void {
            let cannonMtr: ƒ.Material = this.getTextureMaterial(TankUnit.cannonImg);
            let selectedMtr: ƒ.Material = this.getTextureMaterial(Unit.selectedImg);

            let bodyMtr: ƒ.Material;
            let barrelMtr: ƒ.Material;

            if (this.isPlayer) {
                bodyMtr = this.getTextureMaterial(TankUnit.bodyImg);
                barrelMtr = this.getTextureMaterial(TankUnit.barrelImg);
            } else {
                bodyMtr = this.getTextureMaterial(TankUnit.enemyBodyImg);
                barrelMtr = this.getTextureMaterial(TankUnit.enemyBarrelImg);
            }

            this.selected = new ƒAid.Node("Unit Selected", ƒ.Matrix4x4.IDENTITY(), selectedMtr, TankUnit.mesh);
            let selectedCmpNode: ƒ.ComponentMesh = this.selected.getComponent(ƒ.ComponentMesh);
            selectedCmpNode.pivot.scale(ƒ.Vector3.ONE(1.3));

            let unitCmpTransform: ƒ.ComponentTransform = new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(_pos));
            this.addComponent(unitCmpTransform);

            this.bodyNode = new ƒAid.Node("Unit Body", ƒ.Matrix4x4.IDENTITY(), bodyMtr, TankUnit.mesh);
            let bodyCmpMesh: ƒ.ComponentMesh = this.bodyNode.getComponent(ƒ.ComponentMesh);
            bodyCmpMesh.pivot.scale(ƒ.Vector3.ONE());
            bodyCmpMesh.pivot.rotateZ(90);

            this.cannonNode = new ƒAid.Node("Unit Cannon", ƒ.Matrix4x4.TRANSLATION(ƒ.Vector3.Z(0.12)), cannonMtr, TankUnit.mesh);
            let cannonCmpMesh: ƒ.ComponentMesh = this.cannonNode.getComponent(ƒ.ComponentMesh);
            cannonCmpMesh.pivot.scale(ƒ.Vector3.ONE(0.7));

            let barrelNode: ƒAid.Node = new ƒAid.Node("Unit Barrel", ƒ.Matrix4x4.TRANSLATION(new ƒ.Vector3(-0.5, 0, 0.11)), barrelMtr, TankUnit.mesh);
            let barrelCmpMesh: ƒ.ComponentMesh = barrelNode.getComponent(ƒ.ComponentMesh);
            barrelCmpMesh.pivot.scale(new ƒ.Vector3(0.7, 0.3, 0));
            barrelCmpMesh.pivot.rotateZ(90);

            this.appendChild(this.bodyNode);
            this.appendChild(this.cannonNode);
            this.cannonNode.appendChild(barrelNode);

        }
    }
}