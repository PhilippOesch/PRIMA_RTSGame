/// <reference path="GameObject.ts"/>
namespace RTS_V2 {
    import ƒ = FudgeCore;

    export class Base extends GameObject {
        public static img: HTMLImageElement;

        constructor(_name: string, _pos: ƒ.Vector3, _isPlayer: boolean = true) {
            super(_name);
            this.isPlayer = _isPlayer;
            this.collisionRange = 2;
            this.health = 1;
            this.armor = 20;
            this.healthBar = new Healthbar(this, 15, 60);
            this.createNode(_pos);
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
            this.health -= (_bullet.damage / this.armor);
            //(<Healthbar>this.healthBar).health = Math.floor(this.health * 100);
            if (this.health <= 0 && !this.isDead) {
                gameobjects.removeChild(this);
                this.isDead = true;
                this.healthBar.delete();
                this.healthBar = null;

                let eventEndGame: CustomEvent = new CustomEvent("gameWon", {bubbles: true});
                playerManager.dispatchEvent(eventEndGame);
            }
        }
    }
}