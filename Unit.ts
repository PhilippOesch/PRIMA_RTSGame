/// <reference path="GameObject.ts"/>
namespace RTS_V2 {
    import ƒ = FudgeCore;

    export abstract class Unit extends GameObject {
        protected target: GameObject;
        protected shootingRange: number;
        protected shootingRate: number;
        protected shootingTimer: ƒ.Timer;
        protected moveTo: ƒ.Vector3;
        protected speed: number = 3 / 1000;
        protected flock: Flock;

        protected healthBar: Healthbar;

        public set setMove(_pos: ƒ.Vector3) {
            this.moveTo = _pos;
        }

        public set setTarget(_target: GameObject) {
            this.target = _target;
        }

        public get getTarget(): GameObject {
            return this.target;
        }

        public get getHealth(): number {
            return this.health;
        }

        public attack(): void {
            let targetPos: ƒ.Vector3 = this.target.mtxWorld.translation.copy;
            this.moveTo = targetPos;
            let thisPos: ƒ.Vector3 = this.mtxWorld.translation.copy;
            let distanceVector: ƒ.Vector3 = ƒ.Vector3.DIFFERENCE(targetPos, thisPos);
            if (distanceVector.magnitudeSquared < this.shootingRange ** 2) {
                this.moveTo = null;
                this.follow();
                if (this.shootingTimer == null || !this.shootingTimer.active) {
                    this.shootingTimer = new ƒ.Timer(ƒ.Time.game, this.shootingRate, 0, () => this.shoot(this, this.target));
                }
            } else {
                this.clearTimer();
            }

            if (this.target == undefined || this.target.isDead) {
                this.target = null;
                this.clearTimer();
            }
        }

        public setPicked(_bool: boolean): void {
            console.log("isPicked");
        }

        protected move(_move: ƒ.Vector3): void {
            let distanceToTravel: number = this.speed * ƒ.Loop.timeFrameGame;
            let moveVector: ƒ.Vector3;

            moveVector = ƒ.Vector3.DIFFERENCE(_move, this.mtxLocal.translation);

            while (true && this.moveTo != null) {
                moveVector = ƒ.Vector3.DIFFERENCE(this.moveTo, this.mtxLocal.translation);
                if (moveVector.magnitudeSquared > distanceToTravel ** 2)
                    break;

                this.moveTo = null;
            }

            moveVector = this.flock.calculateMove(moveVector);
            let pointAt: ƒ.Vector3 = moveVector.copy;
            pointAt.subtract(this.mtxWorld.translation);
            this.cmpTransform.local.translate(ƒ.Vector3.NORMALIZATION(moveVector, distanceToTravel));

        }

        protected shoot = (_node: ƒ.Node, _target: GameObject): void => {
            let startingPos: ƒ.Matrix4x4 = _node.mtxWorld.copy;
            let bullet: Bullet = new Bullet(startingPos.translation.copy, _target);

            bullets.appendChild(bullet);
        }

        protected clearTimer(): void {
            if (this.shootingTimer != undefined) {
                this.shootingTimer.clear();
            }
        }

        protected follow(): void {
            if (this.target != null && this.target != undefined) {
                let targetpos: ƒ.Vector3 = this.target.mtxWorld.translation.copy;
                //targetpos.subtract(this.mtxWorld.translation.copy);
                console.log(targetpos);

            }
        }

    }
}