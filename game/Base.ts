/// <reference path="GameObject.ts"/>
namespace RTS_V2 {
    import ƒ = FudgeCore;

    export class Base extends GameObject {
        public static img: HTMLImageElement;
        public static armor: number = 0;

        private nearDeath: boolean = false;

        constructor(_name: string, _pos: ƒ.Vector3, _isPlayer: boolean = true) {
            super(_name);
            this.isPlayer = _isPlayer;
            this.collisionRange = 2;
            this.health = 1;
            this.healthBar = new Healthbar(this, 15, 60);
            this.createNode(_pos);
        }

        public static set setarmor(_armor: number){
            Base.armor = _armor;
        }

        public static loadImage(): void {
            Base.img = document.querySelector("#base");
        }

        public createNode(_pos: ƒ.Vector3): void {
            let mesh: ƒ.MeshSprite = new ƒ.MeshSprite();
            let mtr: ƒ.Material = this.getTextureMaterial(Base.img);

            let cmpMesh: ƒ.ComponentMesh = new ƒ.ComponentMesh(mesh);
            cmpMesh.pivot.scale(new ƒ.Vector3(2, 2, 0));
            let cmpMaterial: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(mtr);
            let cmpTransform: ƒ.ComponentTransform = new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(_pos));

            this.addComponent(cmpMesh);
            this.addComponent(cmpMaterial);
            this.addComponent(cmpTransform);

            console.log("base pos:" + this.mtxWorld.translation.copy);
        }

        public calculateDamage(_bullet: Bullet): void {
            this.health -= (_bullet.damage / Base.armor);
            //(<Healthbar>this.healthBar).health = Math.floor(this.health * 100);
            if (this.health <= 0 && !this.isDead) {
                gameobjects.removeChild(this);
                this.isDead = true;
                this.healthBar.delete();
                this.healthBar = null;

                if (!this.isPlayer) {
                    let eventEndGame: CustomEvent = new CustomEvent("gameWon", { bubbles: true });
                    playerManager.dispatchEvent(eventEndGame);
                } else {
                    let eventEndGame: CustomEvent = new CustomEvent("gameLost", { bubbles: true });
                    playerManager.dispatchEvent(eventEndGame);
                }
            }

            if (!this.nearDeath && this.health < 0.5 && !this.isPlayer) {
                this.nearDeath = true;
                let eventDefensisive: CustomEvent = new CustomEvent("defensive", { bubbles: true });
                aiManager.dispatchEvent(eventDefensisive);
            }
        }
    }
}