/// <reference path="Unit.ts"/>
namespace RTS_V2 {
    import ƒ = FudgeCore;
    import ƒAid = FudgeAid;

    export class SuperTank extends Unit {
        public static bodyImg: HTMLImageElement;
        public static playerbarrelImg: HTMLImageElement;
        public static enemyBarrelImg: HTMLImageElement;

        private cannonNode: ƒ.Node;
        private selected: ƒ.Node;

        constructor(_name: string, _pos: ƒ.Vector3, _isPlayer: boolean = true) {
            super(_name);
            this.unitType = UnitType.SUPERTANK;
            let unitSettings: UnitSettings = Unit.unitSettings.get(this.unitType);
            this.isPlayer = _isPlayer;
            this.collisionRange = 1;
            this.shootingRange = 6;
            this.health = 1;
            this.armor = unitSettings.armor;
            this.shootingRate = unitSettings.shootingrate;
            this.speed = unitSettings.speed;
            this.flock = new Flock(this, 2);
            this.createNodes(_pos);
            ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, this.update.bind(this));
            this.healthBar = new Healthbar(this);
        }

        public static loadImages(): void {
            SuperTank.bodyImg = document.querySelector("#supertankbody");
            SuperTank.playerbarrelImg = document.querySelector("#playerSuperTankBarrel");
            SuperTank.enemyBarrelImg = document.querySelector("#enemySuperTankBarrel");
        }

        public calculateDamage(_bullet: Bullet): void {
            let damage: number;

            if(_bullet.unitType == UnitType.BOMBER) {
                damage = ((_bullet.damage * 1.5) / this.armor);
            } else if(_bullet.unitType == UnitType.TANK) {
                damage = ((_bullet.damage * 0.5) / this.armor);
            } else {
                damage = _bullet.damage / this.armor;
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
            let mesh: ƒ.MeshSprite = new ƒ.MeshSprite();

            let bodyMtr: ƒ.Material = this.getTextureMaterial(SuperTank.bodyImg);
            let selectedMtr: ƒ.Material = this.getTextureMaterial(Unit.selectedImg);

            let cannonMtr: ƒ.Material;

            if (this.isPlayer) {
                cannonMtr = this.getTextureMaterial(SuperTank.playerbarrelImg);
            } else {
                cannonMtr = this.getTextureMaterial(SuperTank.enemyBarrelImg);
            }

            this.selected = new ƒAid.Node("Unit Selected", ƒ.Matrix4x4.IDENTITY(), selectedMtr, TankUnit.mesh);
            let selectedCmpNode: ƒ.ComponentMesh = this.selected.getComponent(ƒ.ComponentMesh);
            selectedCmpNode.pivot.scale(ƒ.Vector3.ONE(2));

            let unitCmpTransform: ƒ.ComponentTransform = new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(_pos));
            this.addComponent(unitCmpTransform);

            this.bodyNode = new ƒAid.Node("Unit Body", ƒ.Matrix4x4.IDENTITY(), bodyMtr, mesh);
            let bodyCmpMesh: ƒ.ComponentMesh = this.bodyNode.getComponent(ƒ.ComponentMesh);
            bodyCmpMesh.pivot.scale(ƒ.Vector3.ONE(1.5));
            bodyCmpMesh.pivot.rotateZ(270);

            this.cannonNode = new ƒ.Node("Unit Cannon");
            let cmpTransform: ƒ.ComponentTransform = new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(ƒ.Vector3.Z(0.12)));
            this.cannonNode.addComponent(cmpTransform);

            let barrelNode: ƒAid.Node = new ƒAid.Node("Unit Barrel", ƒ.Matrix4x4.TRANSLATION(new ƒ.Vector3(-0.5, 0, 0.11)), cannonMtr, TankUnit.mesh);
            let barrelCmpMesh: ƒ.ComponentMesh = barrelNode.getComponent(ƒ.ComponentMesh);
            barrelCmpMesh.pivot.scale(new ƒ.Vector3(1, 0.5, 0));
            barrelCmpMesh.pivot.rotateZ(90);

            this.appendChild(this.bodyNode);
            this.appendChild(this.cannonNode);
            this.cannonNode.appendChild(barrelNode);
        }
    }
}