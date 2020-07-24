/// <reference path="GameObject.ts"/>
namespace RTS_V2 {
    import ƒ = FudgeCore;

    export class Base extends GameObject {
        public static img: HTMLImageElement;

        constructor(_name: string, _pos: ƒ.Vector3, _isPlayer: boolean = true) {
            super(_name);
            this.isPlayer = _isPlayer;
            this.collisionRange = 2.5;
            this.health = 1;
            this.armor = 20;
            this.healthBar = new Healthbar(this, 15, 40);
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
        }
    }
}