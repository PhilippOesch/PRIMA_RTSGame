"use strict";
var RTS_V2;
(function (RTS_V2) {
    var ƒ = FudgeCore;
    let AIState;
    (function (AIState) {
        AIState[AIState["DEFENSIVE"] = 0] = "DEFENSIVE";
        AIState[AIState["AGGRESSIVE"] = 1] = "AGGRESSIVE";
    })(AIState || (AIState = {}));
    class AIManager extends ƒ.Node {
        constructor() {
            super("AIManager");
            this.nearBaseRadius = 7;
            this.currentState = AIState.AGGRESSIVE;
            this.coins = 0;
            this.unitcount = 0;
            this.coinRate = 500;
            this.spawnpointIndex = 0;
            this.coinTimerHandler = () => {
                this.coins++;
            };
            this.update = () => {
                this.act(this.currentState);
            };
            this.createBase();
            this.startCoinTimer();
            this.spawnPointArray = new Array();
            let spawnPoint1 = this.base.mtxLocal.translation.copy;
            spawnPoint1.add(new ƒ.Vector3(-1, -3, 0));
            let spawnPoint2 = this.base.mtxLocal.translation.copy;
            spawnPoint2.add(new ƒ.Vector3(0, -3, 0));
            let spawnPoint3 = this.base.mtxLocal.translation.copy;
            spawnPoint3.add(new ƒ.Vector3(1, -3, 0));
            this.spawnPointArray.push(spawnPoint1, spawnPoint2, spawnPoint3);
            ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.update.bind(this));
        }
        startCoinTimer() {
            this.coinTimer = new ƒ.Timer(ƒ.Time.game, this.coinRate, 0, this.coinTimerHandler);
            console.log(this.coinTimer);
        }
        spawnTank() {
            this.unitcount++;
            this.coins -= 10;
            let spawnPos = this.spawnPointArray[this.spawnpointIndex];
            this.spawnpointIndex = (this.spawnpointIndex + 1) % 3;
            let newUnit = new RTS_V2.TankUnit("Unit", spawnPos, false);
            RTS_V2.gameobjects.appendChild(newUnit);
        }
        spawnSuperTank() {
            this.unitcount++;
            this.coins -= 10;
            let spawnPos = this.spawnPointArray[this.spawnpointIndex];
            this.spawnpointIndex = (this.spawnpointIndex + 1) % 3;
            let newUnit = new RTS_V2.SuperTank("Unit", spawnPos, false);
            RTS_V2.gameobjects.appendChild(newUnit);
        }
        spawnBomberTank() {
            this.unitcount++;
            this.coins -= 10;
            let spawnPos = this.spawnPointArray[this.spawnpointIndex];
            this.spawnpointIndex = (this.spawnpointIndex + 1) % 3;
            let newUnit = new RTS_V2.Bomber("Unit", spawnPos, false);
            RTS_V2.gameobjects.appendChild(newUnit);
        }
        aggressiveAction() {
            let units = RTS_V2.Utils.getUnits(false);
            let activeAndNonActiveUnits;
            if (units.length != 0) {
                activeAndNonActiveUnits = this.splitActiveAndNonActiveUnits(units);
                let playerUnitsNearBase = this.getPlayerUnitsNearBase(RTS_V2.Utils.getUnits(true));
                // let playerUnits: Unit[]= 
                if (activeAndNonActiveUnits.nonactiveunits.length > 0 && playerUnitsNearBase.length == 0) {
                    for (let unit of activeAndNonActiveUnits.nonactiveunits) {
                        unit.setTarget = RTS_V2.playerManager.base;
                    }
                }
                else if (activeAndNonActiveUnits.nonactiveunits.length > 0 && playerUnitsNearBase.length > 0) {
                    for (let unit of activeAndNonActiveUnits.nonactiveunits) {
                        unit.setTarget = playerUnitsNearBase[0];
                    }
                }
            }
            if (this.coins >= 10 && this.unitcount < RTS_V2.unitsPerPlayer) {
                this.spawnTank();
                console.log("buy");
            }
        }
        splitActiveAndNonActiveUnits(_units) {
            let activeUnits = new Array();
            let nonActiveUnits = new Array();
            for (let unit of _units) {
                if (unit.getTarget == null || unit.getTarget == undefined) {
                    nonActiveUnits.push(unit);
                }
                else {
                    activeUnits.push(unit);
                }
            }
            return { activeunits: activeUnits, nonactiveunits: nonActiveUnits };
        }
        getPlayerUnitsNearBase(_units) {
            let unitsNearBase = new Array();
            for (let unit of _units) {
                let distanceVector = ƒ.Vector3.DIFFERENCE(unit.mtxWorld.translation, this.base.mtxLocal.translation);
                let squaredDistance = distanceVector.magnitudeSquared;
                if (squaredDistance < this.nearBaseRadius ** 2) {
                    unitsNearBase.push(unit);
                }
            }
            unitsNearBase.sort((a, b) => {
                let distanceA = ƒ.Vector3.DIFFERENCE(a.mtxWorld.translation, this.base.mtxWorld.translation).magnitudeSquared;
                let distanceB = ƒ.Vector3.DIFFERENCE(b.mtxWorld.translation, this.base.mtxWorld.translation).magnitudeSquared;
                if (distanceA < distanceB) {
                    return -1;
                }
                if (distanceA > distanceB) {
                    return 1;
                }
                return 0;
            });
            return unitsNearBase;
        }
        createBase() {
            let pos = new ƒ.Vector3(+(RTS_V2.terrainX / 2) - 5, 0, 0.1);
            this.base = new RTS_V2.Base("enemyBase", pos, false);
            RTS_V2.gameobjects.appendChild(this.base);
        }
        act(_action) {
            switch (_action) {
                case AIState.AGGRESSIVE:
                    this.aggressiveAction();
                    break;
                case AIState.DEFENSIVE:
                    console.log("defensive");
                    break;
            }
        }
    }
    RTS_V2.AIManager = AIManager;
})(RTS_V2 || (RTS_V2 = {}));
var RTS_V2;
(function (RTS_V2) {
    var ƒ = FudgeCore;
    let AUDIO;
    (function (AUDIO) {
        AUDIO["SHOOT"] = "assets/sounds/shooting-sound.ogg";
        AUDIO["IMPACT"] = "assets/sounds/impact-sound.ogg";
        AUDIO["BUYSUCCESS"] = "assets/sounds/hjm-coin_clicker_1.wav";
        AUDIO["BUYERROR"] = "assets/sounds/error_006.ogg";
    })(AUDIO = RTS_V2.AUDIO || (RTS_V2.AUDIO = {}));
    class Audio extends ƒ.Node {
        static start() {
            Audio.appendAudio();
            RTS_V2.viewport.getGraph().appendChild(Audio.node);
            ƒ.AudioManager.default.listenTo(Audio.node);
        }
        static play(_audio) {
            Audio.getAudio(_audio).play(true);
        }
        static getAudio(_audio) {
            return Audio.components.get(_audio);
        }
        static async appendAudio() {
            Audio.components.set(AUDIO.SHOOT, new ƒ.ComponentAudio(await ƒ.Audio.load(AUDIO.SHOOT), false, false));
            Audio.components.set(AUDIO.IMPACT, new ƒ.ComponentAudio(await ƒ.Audio.load(AUDIO.IMPACT), false, false));
            Audio.components.set(AUDIO.BUYSUCCESS, new ƒ.ComponentAudio(await ƒ.Audio.load(AUDIO.BUYSUCCESS), false, false));
            Audio.components.set(AUDIO.BUYERROR, new ƒ.ComponentAudio(await ƒ.Audio.load(AUDIO.BUYERROR), false, false));
            Audio.components.get(AUDIO.SHOOT).volume = 0.5;
            Audio.components.get(AUDIO.IMPACT).volume = 0.5;
            Audio.components.get(AUDIO.BUYSUCCESS).volume = 0.5;
            Audio.components.get(AUDIO.BUYERROR).volume = 0.5;
            Audio.components.forEach(value => Audio.node.addComponent(value));
        }
    }
    Audio.components = new Map();
    Audio.node = new Audio("Audio");
    RTS_V2.Audio = Audio;
})(RTS_V2 || (RTS_V2 = {}));
var RTS_V2;
(function (RTS_V2) {
    class GameObject extends ƒ.Node {
        get getHealth() {
            return this.health;
        }
        setPicked(_bool) {
            console.log("isPicked");
        }
        isInPickingRange(_ray) {
            let distanceVector = _ray.getDistance(this.mtxWorld.translation.copy);
            if (distanceVector.magnitudeSquared < this.collisionRange ** 2) {
                return true;
            }
            else {
                return false;
            }
        }
        calculateDamage(_bullet) {
            this.health -= (_bullet.damage / this.armor);
            //(<Healthbar>this.healthBar).health = Math.floor(this.health * 100);
            if (this.health <= 0 && !this.isDead) {
                RTS_V2.gameobjects.removeChild(this);
                this.isDead = true;
                this.healthBar.delete();
                this.healthBar = null;
                if (this.isPlayer) {
                    RTS_V2.playerManager.decreaseUnitCount();
                }
                else {
                    RTS_V2.playerManager.increaseUnitsDestroyed();
                }
            }
        }
        getTextureMaterial(_img) {
            let txt = new ƒ.TextureImage();
            let coatTxt = new ƒ.CoatTextured();
            txt.image = _img;
            coatTxt.texture = txt;
            return new ƒ.Material(name, ƒ.ShaderTexture, coatTxt);
        }
    }
    RTS_V2.GameObject = GameObject;
})(RTS_V2 || (RTS_V2 = {}));
/// <reference path="GameObject.ts"/>
var RTS_V2;
/// <reference path="GameObject.ts"/>
(function (RTS_V2) {
    var ƒ = FudgeCore;
    class Base extends RTS_V2.GameObject {
        constructor(_name, _pos, _isPlayer = true) {
            super(_name);
            this.isPlayer = _isPlayer;
            this.collisionRange = 2;
            this.health = 1;
            this.armor = 40;
            this.healthBar = new RTS_V2.Healthbar(this, 15, 60);
            this.createNode(_pos);
        }
        static loadImage() {
            Base.img = document.querySelector("#base");
        }
        createNode(_pos) {
            let mesh = new ƒ.MeshSprite();
            let mtr = this.getTextureMaterial(Base.img);
            let cmpMesh = new ƒ.ComponentMesh(mesh);
            cmpMesh.pivot.scale(new ƒ.Vector3(2, 2, 0));
            let cmpMaterial = new ƒ.ComponentMaterial(mtr);
            let cmpTransform = new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(_pos));
            this.addComponent(cmpMesh);
            this.addComponent(cmpMaterial);
            this.addComponent(cmpTransform);
            console.log("base pos:" + this.mtxWorld.translation.copy);
        }
        calculateDamage(_bullet) {
            this.health -= (_bullet.damage / this.armor);
            //(<Healthbar>this.healthBar).health = Math.floor(this.health * 100);
            if (this.health <= 0 && !this.isDead) {
                RTS_V2.gameobjects.removeChild(this);
                this.isDead = true;
                this.healthBar.delete();
                this.healthBar = null;
                if (!this.isPlayer) {
                    let eventEndGame = new CustomEvent("gameWon", { bubbles: true });
                    RTS_V2.playerManager.dispatchEvent(eventEndGame);
                }
                else {
                    let eventEndGame = new CustomEvent("gameLost", { bubbles: true });
                    RTS_V2.playerManager.dispatchEvent(eventEndGame);
                }
            }
        }
    }
    RTS_V2.Base = Base;
})(RTS_V2 || (RTS_V2 = {}));
/// <reference path="GameObject.ts"/>
var RTS_V2;
/// <reference path="GameObject.ts"/>
(function (RTS_V2) {
    var ƒ = FudgeCore;
    let UnitType;
    (function (UnitType) {
        UnitType[UnitType["TANK"] = 0] = "TANK";
        UnitType[UnitType["SUPERTANK"] = 1] = "SUPERTANK";
        UnitType[UnitType["BOMBER"] = 2] = "BOMBER";
    })(UnitType = RTS_V2.UnitType || (RTS_V2.UnitType = {}));
    class Unit extends RTS_V2.GameObject {
        constructor() {
            super(...arguments);
            this.speed = 3 / 1000;
            this.shoot = (_node, _target) => {
                let startingPos = _node.mtxWorld.copy;
                let bullet = new RTS_V2.Bullet(startingPos.translation.copy, _target, this.isPlayer, this.unitType);
                RTS_V2.bullets.appendChild(bullet);
            };
        }
        static loadImages() {
            Unit.selectedImg = document.querySelector("#selected");
        }
        set setMove(_pos) {
            this.moveTo = _pos;
        }
        set setTarget(_target) {
            this.target = _target;
        }
        get getTarget() {
            return this.target;
        }
        get getHealth() {
            return this.health;
        }
        calculateDamage(_bullet) {
            this.health -= (_bullet.damage / this.armor);
            //(<Healthbar>this.healthBar).health = Math.floor(this.health * 100);
            if (this.health <= 0 && !this.isDead) {
                RTS_V2.gameobjects.removeChild(this);
                this.isDead = true;
                this.healthBar.delete();
                this.healthBar = null;
                this.target = null;
                this.clearTimer();
                if (this.isPlayer) {
                    RTS_V2.playerManager.decreaseUnitCount();
                }
                else {
                    RTS_V2.playerManager.increaseUnitsDestroyed();
                }
            }
        }
        update() {
            let getNeighbors = this.flock.getNearbyObjects(this);
            let avoidObjects = this.flock.getAvoidableGameObjects(this.flock.unit, getNeighbors);
            if (this.target != null) {
                this.attack();
            }
            else {
                this.clearTimer();
            }
            if (this.moveTo != null && this.moveTo != undefined) {
                this.move(this.moveTo);
                //don't ask why! it somehow prevents an error and works
                if (this.moveTo != null) {
                    let pointAt = this.moveTo.copy;
                    RTS_V2.Utils.adjustLookAtToGameworld(pointAt, this.bodyNode);
                }
            }
            else if (avoidObjects.length > 0) {
                let moveVector = this.flock.getAdjustedAvoidanceVector(this, avoidObjects);
                this.move(moveVector);
            }
        }
        attack() {
            let targetPos = this.target.mtxWorld.translation.copy;
            this.moveTo = targetPos;
            let thisPos = this.mtxWorld.translation.copy;
            let distanceVector = ƒ.Vector3.DIFFERENCE(targetPos, thisPos);
            if (distanceVector.magnitudeSquared < this.shootingRange ** 2) {
                this.moveTo = null;
                this.follow();
                if (this.shootingTimer == null || !this.shootingTimer.active) {
                    this.shootingTimer = new ƒ.Timer(ƒ.Time.game, this.shootingRate, 0, () => this.shoot(this, this.target));
                }
            }
            else {
                this.clearTimer();
            }
            if (this.target == undefined || this.target.isDead) {
                this.target = null;
                this.clearTimer();
            }
        }
        setPicked(_bool) {
            console.log("isPicked");
        }
        move(_move) {
            let distanceToTravel = this.speed * ƒ.Loop.timeFrameGame;
            let moveVector;
            moveVector = ƒ.Vector3.DIFFERENCE(_move, this.mtxLocal.translation);
            while (true && this.moveTo != null) {
                moveVector = ƒ.Vector3.DIFFERENCE(this.moveTo, this.mtxLocal.translation);
                if (moveVector.magnitudeSquared > distanceToTravel ** 2)
                    break;
                this.moveTo = null;
            }
            moveVector = this.flock.calculateMove(moveVector);
            let pointAt = moveVector.copy;
            pointAt.subtract(this.mtxWorld.translation);
            this.cmpTransform.local.translate(ƒ.Vector3.NORMALIZATION(moveVector, distanceToTravel));
        }
        clearTimer() {
            if (this.shootingTimer != undefined) {
                this.shootingTimer.clear();
            }
        }
        follow() {
            if (this.target != null && this.target != undefined) {
                let targetpos = this.target.mtxWorld.translation.copy;
                //targetpos.subtract(this.mtxWorld.translation.copy);
                console.log(targetpos);
            }
        }
    }
    Unit.unitSettings = new Map();
    RTS_V2.Unit = Unit;
})(RTS_V2 || (RTS_V2 = {}));
/// <reference path="Unit.ts"/>
var RTS_V2;
/// <reference path="Unit.ts"/>
(function (RTS_V2) {
    var ƒ = FudgeCore;
    var ƒAid = FudgeAid;
    class Bomber extends RTS_V2.Unit {
        constructor(_name, _pos, _isPlayer = true) {
            super(_name);
            this.unitType = RTS_V2.UnitType.BOMBER;
            let unitSettings = RTS_V2.Unit.unitSettings.get(this.unitType);
            this.isPlayer = _isPlayer;
            this.collisionRange = 0.8;
            this.shootingRange = 4;
            this.health = unitSettings.health;
            this.armor = unitSettings.armor;
            this.shootingRate = unitSettings.shootingrate;
            this.speed = unitSettings.speed;
            this.flock = new RTS_V2.PlainFlock(this);
            this.createNodes(_pos);
            ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.update.bind(this));
            this.healthBar = new RTS_V2.Healthbar(this);
        }
        static loadImages() {
            Bomber.bodyImg = document.querySelector("#airplane");
            Bomber.playerbarrelImg = document.querySelector("#playerairplaneBarrel");
            Bomber.enemyBarrelImg = document.querySelector("#enemyairplaneBarrel");
        }
        calculateDamage(_bullet) {
            let damage;
            if (_bullet.unitType == RTS_V2.UnitType.TANK) {
                damage = ((_bullet.damage * 1.5) / this.armor);
            }
            else if (_bullet.unitType == RTS_V2.UnitType.SUPERTANK) {
                damage = ((_bullet.damage * 0.5) / this.armor);
            }
            else {
                damage = ((_bullet.damage) / this.armor);
            }
            this.health -= damage;
            //(<Healthbar>this.healthBar).health = Math.floor(this.health * 100);
            if (this.health <= 0 && !this.isDead) {
                RTS_V2.gameobjects.removeChild(this);
                this.isDead = true;
                this.healthBar.delete();
                this.healthBar = null;
                this.target = null;
                this.clearTimer();
                if (this.isPlayer) {
                    RTS_V2.playerManager.decreaseUnitCount();
                }
                else {
                    RTS_V2.playerManager.increaseUnitsDestroyed();
                }
            }
        }
        setPicked(_bool) {
            if (_bool) {
                this.appendChild(this.selected);
            }
            else {
                this.removeChild(this.selected);
            }
        }
        update() {
            let getNeighbors = this.flock.getNearbyObjects(this);
            let avoidObjects = this.flock.getAvoidableGameObjects(this.flock.unit, getNeighbors);
            if (this.target != null) {
                this.attack();
            }
            else {
                this.clearTimer();
            }
            if (this.moveTo != null && this.moveTo != undefined) {
                this.move(this.moveTo);
                //don't ask why! it somehow prevents an error and works
                if (this.moveTo != null) {
                    let pointAt = this.moveTo.copy;
                    pointAt.add(ƒ.Vector3.Z(0.6));
                    RTS_V2.Utils.adjustLookAtToGameworld(pointAt, this.bodyNode);
                }
            }
            else if (avoidObjects.length > 0) {
                let moveVector = this.flock.getAdjustedAvoidanceVector(this, avoidObjects);
                this.move(moveVector);
            }
        }
        follow() {
            if (this.target != null && this.target != undefined) {
                let targetpos = this.target.mtxWorld.translation.copy;
                targetpos.add(ƒ.Vector3.Z(0.3));
                RTS_V2.Utils.adjustLookAtToGameworld(targetpos, this.cannonNode);
            }
        }
        createNodes(_pos) {
            let mesh = new ƒ.MeshSprite();
            let bodyMtr = this.getTextureMaterial(Bomber.bodyImg);
            let selectedMtr = this.getTextureMaterial(RTS_V2.Unit.selectedImg);
            let cannonMtr;
            if (this.isPlayer) {
                cannonMtr = this.getTextureMaterial(Bomber.playerbarrelImg);
            }
            else {
                cannonMtr = this.getTextureMaterial(Bomber.enemyBarrelImg);
            }
            this.selected = new ƒAid.Node("Unit Selected", ƒ.Matrix4x4.IDENTITY(), selectedMtr, RTS_V2.TankUnit.mesh);
            let selectedCmpNode = this.selected.getComponent(ƒ.ComponentMesh);
            selectedCmpNode.pivot.scale(ƒ.Vector3.ONE(1.2));
            let position = _pos.copy;
            let unitCmpTransform = new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(position));
            this.addComponent(unitCmpTransform);
            this.bodyNode = new ƒAid.Node("Unit Body", ƒ.Matrix4x4.TRANSLATION(ƒ.Vector3.Z(0.3)), bodyMtr, mesh);
            let bodyCmpMesh = this.bodyNode.getComponent(ƒ.ComponentMesh);
            bodyCmpMesh.pivot.scale(ƒ.Vector3.ONE(2));
            bodyCmpMesh.pivot.rotateZ(180);
            this.cannonNode = new ƒ.Node("Unit Cannon");
            let cmpTransform = new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(ƒ.Vector3.Z(0.3)));
            this.cannonNode.addComponent(cmpTransform);
            let barrelNode = new ƒAid.Node("Unit Barrel", ƒ.Matrix4x4.TRANSLATION(new ƒ.Vector3(-0.2, 0, 0.11)), cannonMtr, RTS_V2.TankUnit.mesh);
            let barrelCmpMesh = barrelNode.getComponent(ƒ.ComponentMesh);
            barrelCmpMesh.pivot.scale(new ƒ.Vector3(0.6, 0.3, 0));
            barrelCmpMesh.pivot.rotateZ(90);
            this.appendChild(this.bodyNode);
            this.appendChild(this.cannonNode);
            this.cannonNode.appendChild(barrelNode);
        }
    }
    RTS_V2.Bomber = Bomber;
})(RTS_V2 || (RTS_V2 = {}));
var RTS_V2;
(function (RTS_V2) {
    var ƒ = FudgeCore;
    var ƒAid = FudgeAid;
    class Bullet extends ƒ.Node {
        constructor(_pos, _target, _isPlayer, _unitType = RTS_V2.UnitType.TANK) {
            super("Bullet");
            this.collisionActive = true;
            this.unitType = _unitType;
            let unitSetting = RTS_V2.Unit.unitSettings.get(this.unitType);
            this.target = _target;
            this.isPlayer = _isPlayer;
            this.damage = unitSetting.damage;
            this.speed = unitSetting.bulletspeed;
            this.createNodes(_pos);
            ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.update.bind(this));
            RTS_V2.Audio.play(RTS_V2.AUDIO.SHOOT);
        }
        static loadImages() {
            Bullet.bulletImg = document.querySelector("#tankbullet");
            Bullet.bulletImgEnemy = document.querySelector("#tankbulletenemy");
        }
        update() {
            let enemyPos = this.target.cmpTransform.local.copy;
            let pos = this.cmpTransform.local.copy;
            let movement = pos.getTranslationTo(enemyPos);
            movement.normalize(this.speed);
            if (this.target == undefined) {
                RTS_V2.bullets.removeChild(this);
            }
            this.cmpTransform.local.translate(movement);
            let pointAt = enemyPos.translation.copy;
            pointAt.subtract(this.mtxWorld.translation);
            this.textureNode.mtxLocal.lookAt(pointAt, ƒ.Vector3.Z());
            this.textureNode.mtxLocal.rotate(new ƒ.Vector3(0, 90, 90));
            this.collidingWithEnemy();
        }
        createNodes(_pos) {
            let mtr;
            if (this.isPlayer) {
                mtr = this.getTextureMaterial("BulletMtr", Bullet.bulletImg);
            }
            else {
                mtr = this.getTextureMaterial("BulletMtr", Bullet.bulletImgEnemy);
            }
            let mesh = new ƒ.MeshSprite();
            let cmpTransform = new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(_pos));
            this.textureNode = new ƒAid.Node("Bullet Texture Node", ƒ.Matrix4x4.IDENTITY(), mtr, mesh);
            let cmpMesh = this.textureNode.getComponent(ƒ.ComponentMesh);
            cmpMesh.pivot.scale(new ƒ.Vector3(0.4, 0.3, 0));
            cmpMesh.pivot.rotateZ(90);
            this.addComponent(cmpTransform);
            this.appendChild(this.textureNode);
        }
        collidingWithEnemy() {
            if (this.collisionActive) {
                let thisPos = this.mtxWorld.translation;
                let targetPos = this.target.mtxWorld.translation.copy;
                let distanceVector = ƒ.Vector3.DIFFERENCE(thisPos, targetPos);
                if (distanceVector.magnitudeSquared < this.target.collisionRange) {
                    this.target.calculateDamage(this);
                    this.collisionActive = false;
                    RTS_V2.bullets.removeChild(this);
                    RTS_V2.Audio.play(RTS_V2.AUDIO.IMPACT);
                }
            }
        }
        getTextureMaterial(_name, _img) {
            let txt = new ƒ.TextureImage();
            let coatTxt = new ƒ.CoatTextured();
            txt.image = _img;
            coatTxt.texture = txt;
            return new ƒ.Material(_name, ƒ.ShaderTexture, coatTxt);
        }
    }
    RTS_V2.Bullet = Bullet;
})(RTS_V2 || (RTS_V2 = {}));
var RTS_V2;
(function (RTS_V2) {
    class BuyKontextMenu {
        constructor(_playermanager) {
            this.isActive = false;
            this.buyTank = () => {
                if (this.playermanager.coins >= 10 && this.playermanager.unitcount < RTS_V2.unitsPerPlayer) {
                    this.playermanager.coins -= 10;
                    this.playermanager.spawnTank();
                    console.log("Tank buyed");
                    RTS_V2.Audio.play(RTS_V2.AUDIO.BUYSUCCESS);
                }
                else {
                    RTS_V2.Audio.play(RTS_V2.AUDIO.BUYERROR);
                }
            };
            this.buySuperTank = () => {
                if (this.playermanager.coins >= 20 && this.playermanager.unitcount < RTS_V2.unitsPerPlayer) {
                    this.playermanager.coins -= 20;
                    this.playermanager.spawnSuperTank();
                    console.log("Super Tank buyed");
                    RTS_V2.Audio.play(RTS_V2.AUDIO.BUYSUCCESS);
                }
                else {
                    RTS_V2.Audio.play(RTS_V2.AUDIO.BUYERROR);
                }
            };
            this.buyBomber = () => {
                if (this.playermanager.coins >= 15 && this.playermanager.unitcount < RTS_V2.unitsPerPlayer) {
                    this.playermanager.coins -= 15;
                    this.playermanager.spawnBomber();
                    console.log("Bomber buyed");
                    RTS_V2.Audio.play(RTS_V2.AUDIO.BUYSUCCESS);
                }
                else {
                    RTS_V2.Audio.play(RTS_V2.AUDIO.BUYERROR);
                }
            };
            this.playermanager = _playermanager;
            this.kontextMenuElement = document.querySelector("#buymenu");
            this.buyTankElement = document.querySelector("#buy-tank-btn");
            this.buySuperTankElement = document.querySelector("#buy-supertank-btn");
            this.buyBomberElement = document.querySelector("#buy-bomber-btn");
            this.buySuperTankElement.addEventListener("click", this.buySuperTank);
            this.buyTankElement.addEventListener("click", this.buyTank);
            this.buyBomberElement.addEventListener("click", this.buyBomber);
            // let camera: ƒ.ComponentCamera = viewport.camera;
            // let basePos: ƒ.Vector3 = this.playermanager.base.mtxLocal.translation.copy;
            // let projection: ƒ.Vector3 = camera.project(basePos);
            // let screenPos: ƒ.Vector2 = viewport.pointClipToClient(projection.toVector2());
            // console.log("Base Pos: " + this.playermanager.base.mtxLocal.translation.copy);
            // console.log("relative Base Pos: " + projection);
            // console.log("Screen X: " + screenPos.x + ", Screen Y: " + screenPos.y);
            // this.kontextMenuElement.style.left = screenPos.x + "px";
            // this.kontextMenuElement.style.top = screenPos.y + "px";
        }
        toggleMenu() {
            if (this.isActive) {
                this.kontextMenuElement.style.display = "none";
            }
            else {
                this.kontextMenuElement.style.display = "block";
            }
            this.isActive = !this.isActive;
        }
    }
    RTS_V2.BuyKontextMenu = BuyKontextMenu;
})(RTS_V2 || (RTS_V2 = {}));
var RTS_V2;
(function (RTS_V2) {
    class Flock {
        constructor(_unit, _avoidanceRadius = 1.3, _avoidanceRadiusBase = 1.7) {
            this.neighborRadius = 5;
            this.avoidanceRadius = 1.3;
            this.avoidanceRadiusBase = 1.7;
            this.moveweight = 0.4;
            this.avoidanceWeight = 0.6;
            this.avoidanceRadius = _avoidanceRadius;
            this.avoidanceRadiusBase = _avoidanceRadiusBase;
            this.unit = _unit;
            this.squareNeighborRadius = this.neighborRadius ** 2;
            this.squareAvoidanceRadius = this.avoidanceRadius ** 2;
            this.squareAvoidanceRadiusBase = this.avoidanceRadiusBase ** 2;
        }
        calculateMove(_move) {
            let move = ƒ.Vector3.ZERO();
            let neighbors = this.getNearbyObjects(this.unit);
            let avoidanceMove = this.avoidance(this.unit, neighbors);
            avoidanceMove.scale(this.avoidanceWeight);
            avoidanceMove = this.partialNormalization(avoidanceMove, this.avoidanceWeight);
            let weightedMove = _move.copy;
            weightedMove.scale(this.moveweight);
            weightedMove = this.partialNormalization(weightedMove, this.moveweight);
            move.add(avoidanceMove);
            move.add(weightedMove);
            move.z = 0;
            return move;
        }
        getAvoidableGameObjects(_node = this.unit, _neighbors) {
            let gameobjectArray = new Array();
            for (let element of _neighbors) {
                let distanceVector = ƒ.Vector3.DIFFERENCE(element.mtxWorld.translation, _node.mtxWorld.translation);
                if (distanceVector.magnitudeSquared < this.squareAvoidanceRadius) {
                    gameobjectArray.push(element);
                }
            }
            return gameobjectArray;
        }
        getAdjustedAvoidanceVector(_node = this.unit, _avoidNeighbors) {
            if (_avoidNeighbors.length == 0) {
                return ƒ.Vector3.ZERO();
            }
            let avoidanceMove = ƒ.Vector3.ZERO();
            let nAvoide = 0;
            for (let element of _avoidNeighbors) {
                let avoidVector = ƒ.Vector3.DIFFERENCE(_node.mtxWorld.translation, element.mtxWorld.translation);
                avoidanceMove.add(avoidVector);
                nAvoide++;
            }
            if (nAvoide > 0)
                avoidanceMove.scale(1 / nAvoide);
            avoidanceMove = this.partialNormalization(avoidanceMove, this.avoidanceWeight);
            return avoidanceMove;
        }
        getNearbyObjects(_node = this.unit) {
            let nearbyObjects = new Array();
            let objects = RTS_V2.Utils.getAllButAirPlains();
            for (let value of objects) {
                let distanceVector = ƒ.Vector3.DIFFERENCE(value.mtxWorld.translation, _node.mtxWorld.translation);
                let distanceSquared = distanceVector.magnitudeSquared;
                if (value != _node && distanceSquared < this.squareNeighborRadius) {
                    nearbyObjects.push(value);
                }
            }
            return nearbyObjects;
        }
        avoidance(_node = this.unit, _neighbors) {
            if (_neighbors.length == 0) {
                return ƒ.Vector3.ZERO();
            }
            let avoidanceMove = ƒ.Vector3.ZERO();
            let nAvoide = 0;
            for (let element of _neighbors) {
                let distanceVector = ƒ.Vector3.DIFFERENCE(element.mtxWorld.translation, _node.mtxWorld.translation);
                if (distanceVector.magnitudeSquared < this.squareAvoidanceRadius) {
                    let avoidVector = ƒ.Vector3.DIFFERENCE(_node.mtxWorld.translation, element.mtxWorld.translation);
                    avoidanceMove.add(avoidVector);
                    nAvoide++;
                }
                if (distanceVector.magnitudeSquared < this.squareAvoidanceRadiusBase && (element == RTS_V2.playerManager.base || element == RTS_V2.aiManager.base)) {
                    let avoidVector = ƒ.Vector3.DIFFERENCE(_node.mtxWorld.translation, element.mtxWorld.translation);
                    avoidanceMove.add(avoidVector);
                    nAvoide++;
                }
            }
            if (nAvoide > 0)
                avoidanceMove.scale(1 / nAvoide);
            return avoidanceMove;
        }
        partialNormalization(_vector, _weigth) {
            if (_vector.magnitudeSquared > _weigth ** 2) {
                _vector.normalize();
                _vector.scale(_weigth);
            }
            return _vector;
        }
    }
    RTS_V2.Flock = Flock;
})(RTS_V2 || (RTS_V2 = {}));
var RTS_V2;
(function (RTS_V2) {
    var ƒ = FudgeCore;
    //import ƒUi = FudgeUserInterface;
    class Healthbar /* implements ƒ.MutableForUserInterface*/ {
        //uiController: ƒUi.Controller;
        // health: number = 0;
        constructor(_gameobject, _height = 15, _width = 30) {
            this.elementWidth = 30; //in px
            this.elementWidth = _width;
            this.unit = _gameobject;
            this.element = document.createElement("progress");
            //this.element = document.createElement("custom-healtbar");
            this.element.value = this.unit.getHealth;
            this.element.setAttribute("value", this.unit.getHealth + "");
            this.element.setAttribute("key", "health");
            this.element.setAttribute("min", "0");
            this.element.style.width = _width + "px";
            this.element.style.height = _height + "px";
            //this.element.max = 100;
            this.element.setAttribute("max", "1");
            document.body.appendChild(this.element);
            if (this.unit.isPlayer) {
                this.element.classList.add("player");
            }
            else {
                this.element.classList.add("enemy");
            }
            //this.uiController = new ƒUi.Controller(this, this.element);
            ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.update.bind(this));
        }
        update() {
            let camera = RTS_V2.viewport.camera;
            let projection = camera.project(this.unit.mtxLocal.translation.copy);
            projection.add(ƒ.Vector3.Y(0.1));
            let screenPos = RTS_V2.viewport.pointClipToClient(projection.toVector2());
            this.element.style.left = (screenPos.x - this.elementWidth / 2) + "px";
            this.element.style.top = screenPos.y + "px";
            this.element.value = this.unit.getHealth;
            // this.element.setAttribute("value", this.unit.getHealth + "");
        }
        delete() {
            ƒ.Loop.removeEventListener("loopFrame" /* LOOP_FRAME */, this.update);
            document.body.removeChild(this.element);
        }
    }
    RTS_V2.Healthbar = Healthbar;
})(RTS_V2 || (RTS_V2 = {}));
var RTS_V2;
(function (RTS_V2) {
    var ƒ = FudgeCore;
    var ƒAid = FudgeAid;
    let terrainTiling = 5; //size of each tile
    let cameraDistance;
    ƒ.RenderManager.initialize(true, false);
    window.addEventListener("load", hndLoad);
    function hndLoad(_event) {
        loadSettings();
        const canvas = document.querySelector("canvas");
        let backgroundImg = document.querySelector("#terrain");
        //prevents the context menu to open
        canvas.addEventListener("contextmenu", event => event.preventDefault());
        loadGameImages();
        let graph = new ƒ.Node("Game");
        let terrain = createTerrainNode(backgroundImg);
        graph.appendChild(terrain);
        RTS_V2.bullets = new ƒ.Node("Bullets");
        RTS_V2.gameobjects = new ƒ.Node("GameObjects");
        graph.appendChild(RTS_V2.bullets);
        graph.appendChild(RTS_V2.gameobjects);
        console.log(RTS_V2.playerManager);
        let cmpCamera = new ƒ.ComponentCamera();
        cmpCamera.pivot.translate(ƒ.Vector3.Z(cameraDistance));
        let cameraLookAt = new ƒ.Vector3(0, 0, 0);
        cmpCamera.pivot.lookAt(cameraLookAt);
        cmpCamera.backgroundColor = ƒ.Color.CSS("#cccccc");
        RTS_V2.viewport = new ƒ.Viewport();
        RTS_V2.viewport.initialize("Viewport", graph, cmpCamera, canvas);
        //setup AudioNode
        RTS_V2.Audio.start();
        RTS_V2.playerManager = new RTS_V2.PlayerManager();
        RTS_V2.aiManager = new RTS_V2.AIManager();
        ƒ.Debug.log(RTS_V2.viewport);
        ƒ.Debug.log(graph);
        RTS_V2.viewport.draw();
        startGameTimer();
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        ƒ.Loop.start(ƒ.LOOP_MODE.TIME_REAL, 60);
    }
    function update() {
        RTS_V2.viewport.draw();
        if (RTS_V2.playerManager.startSelectionInfo != null) {
            RTS_V2.Utils.drawSelectionRectangle(RTS_V2.playerManager.startSelectionInfo.startSelectionClientPos, RTS_V2.playerManager.mousePos);
        }
    }
    function startGameTimer() {
        let timerHTMLElement;
        timerHTMLElement = document.querySelector("#timer");
        RTS_V2.gameTimer = new ƒ.Timer(ƒ.Time.game, 1000, 0, function () {
            timerHTMLElement.textContent = RTS_V2.Utils.gameTimeToString();
        });
    }
    function createTerrainNode(_img) {
        let txt = new ƒ.TextureImage();
        let coat = new ƒ.CoatTextured();
        txt.image = _img;
        coat.texture = txt;
        let mesh = new ƒ.MeshSprite();
        let mtr = new ƒ.Material("mtrTerrain", ƒ.ShaderTexture, coat);
        let terrain = new ƒAid.Node("Terrain", ƒ.Matrix4x4.IDENTITY(), mtr, mesh);
        let terrainsCmpMesh = terrain.getComponent(ƒ.ComponentMesh);
        terrainsCmpMesh.pivot.scale(new ƒ.Vector3(RTS_V2.terrainX, RTS_V2.terrainY, 0));
        let cmpMtr = terrain.getComponent(ƒ.ComponentMaterial);
        cmpMtr.pivot.scale(new ƒ.Vector2(RTS_V2.terrainX / terrainTiling, RTS_V2.terrainY / terrainTiling));
        return terrain;
    }
    function loadSettings() {
        let file = new XMLHttpRequest();
        file.open("GET", "./assets/settings.json", false);
        file.send();
        let settings = JSON.parse(file.response);
        RTS_V2.terrainX = settings.terrain.terrainX;
        RTS_V2.terrainY = settings.terrain.terrainY;
        RTS_V2.unitsPerPlayer = settings.general.unitsPerPlayer;
        cameraDistance = settings.general.cameraDistance;
        RTS_V2.Unit.unitSettings.set(RTS_V2.UnitType.TANK, settings.unitValues.tank);
        RTS_V2.Unit.unitSettings.set(RTS_V2.UnitType.SUPERTANK, settings.unitValues.supertank);
        RTS_V2.Unit.unitSettings.set(RTS_V2.UnitType.BOMBER, settings.unitValues.bomber);
    }
    function loadGameImages() {
        RTS_V2.Bullet.loadImages();
        RTS_V2.Unit.loadImages();
        RTS_V2.TankUnit.loadImages();
        RTS_V2.Base.loadImage();
        RTS_V2.SuperTank.loadImages();
        RTS_V2.Bomber.loadImages();
    }
})(RTS_V2 || (RTS_V2 = {}));
var RTS_V2;
(function (RTS_V2) {
    class PlainFlock extends RTS_V2.Flock {
        getNearbyObjects(_node = this.unit) {
            let nearbyObjects = new Array();
            let objects = RTS_V2.Utils.getAirPlanes();
            for (let value of objects) {
                let distanceVector = ƒ.Vector3.DIFFERENCE(value.mtxWorld.translation, _node.mtxWorld.translation);
                let distanceSquared = distanceVector.magnitudeSquared;
                if (value != _node && distanceSquared < this.squareNeighborRadius) {
                    nearbyObjects.push(value);
                }
            }
            return nearbyObjects;
        }
    }
    RTS_V2.PlainFlock = PlainFlock;
})(RTS_V2 || (RTS_V2 = {}));
var RTS_V2;
(function (RTS_V2) {
    var ƒ = FudgeCore;
    class PlayerManager extends ƒ.Node {
        constructor() {
            super("player Manager");
            this.coins = 0;
            this.unitcount = 0;
            this.unitsDestroyed = 0;
            this.coinRate = 300;
            this.spawnpointIndex = 0;
            this.keyboardControls = (_event) => {
                switch (_event.code) {
                    case ƒ.KEYBOARD_CODE.A:
                        this.selectedUnits = RTS_V2.Utils.selectAllPlayerUnits();
                        break;
                }
            };
            this.gameWonHandler = (_event) => {
                console.log("End Game");
                localStorage.setItem("gameTime", RTS_V2.Utils.gameTimeToString());
                localStorage.setItem("destroyedUnits", RTS_V2.playerManager.unitsDestroyed.toString());
                localStorage.setItem("gameStatus", "won");
                window.location.replace("/endScreen.html");
            };
            this.gameLostHandler = (_event) => {
                console.log("End Game");
                localStorage.setItem("gameTime", RTS_V2.Utils.gameTimeToString());
                localStorage.setItem("destroyedUnits", RTS_V2.playerManager.unitsDestroyed.toString());
                localStorage.setItem("gameStatus", "lost");
                window.location.replace("/endScreen.html");
            };
            this.pointerUp = (_event) => {
                _event.preventDefault();
                let posMouse = new ƒ.Vector2(_event.canvasX, _event.canvasY);
                let ray = RTS_V2.viewport.getRayFromClient(posMouse);
                if (_event.which == 1) {
                    let endPos = ray.intersectPlane(new ƒ.Vector3(0, 0, 0.1), ƒ.Vector3.Z(1));
                    let playerunits = RTS_V2.Utils.getUnits();
                    let distanceVector = ƒ.Vector3.DIFFERENCE(this.startSelectionInfo.startSelectionPos, endPos);
                    console.log(distanceVector);
                    if (distanceVector.magnitudeSquared < 1 && this.base.isInPickingRange(ray)) {
                        this.buyMenu.toggleMenu();
                    }
                    else {
                        this.selectedUnits = RTS_V2.Utils.selectUnits(this.startSelectionInfo.startSelectionPos, endPos, ray, playerunits);
                        console.log(this.selectedUnits);
                        if (this.buyMenu.isActive)
                            this.buyMenu.toggleMenu();
                    }
                }
                this.startSelectionInfo = null;
            };
            this.coinTimerHandler = () => {
                this.coins++;
                this.timerHTMLElement.innerHTML = this.coins + "";
            };
            this.pointerDown = (_event) => {
                let posMouse = new ƒ.Vector2(_event.canvasX, _event.canvasY);
                let ray = RTS_V2.viewport.getRayFromClient(posMouse);
                let position = ray.intersectPlane(new ƒ.Vector3(0, 0, 0.1), ƒ.Vector3.Z(1));
                let isInsideTerrain = (Math.abs(position.x) < (RTS_V2.terrainX / 2 - 0.5) && Math.abs(position.y) < (RTS_V2.terrainY / 2 - 0.5));
                if (_event.which == 1) { //Left Mouse Click
                    this.mousePos = posMouse;
                    this.startSelectionInfo = { startSelectionPos: position, startSelectionClientPos: posMouse };
                }
                else if (_event.which == 3 && this.selectedUnits.length != 0 && isInsideTerrain) {
                    RTS_V2.Utils.commandUnits(this.selectedUnits, position, ray);
                }
                else {
                    this.startSelectionInfo = null;
                }
            };
            this.pointerMove = (_event) => {
                let posMouse = new ƒ.Vector2(_event.canvasX, _event.canvasY);
                this.mousePos = posMouse;
            };
            this.createBase();
            this.startCoinTimer();
            this.spawnPointArray = new Array();
            let spawnPoint1 = this.base.mtxLocal.translation.copy;
            spawnPoint1.add(new ƒ.Vector3(-1, -3, 0));
            let spawnPoint2 = this.base.mtxLocal.translation.copy;
            spawnPoint2.add(new ƒ.Vector3(0, -3, 0));
            let spawnPoint3 = this.base.mtxLocal.translation.copy;
            spawnPoint3.add(new ƒ.Vector3(1, -3, 0));
            this.spawnPointArray.push(spawnPoint1, spawnPoint2, spawnPoint3);
            document.addEventListener("keydown", this.keyboardControls);
            RTS_V2.viewport.addEventListener("\u0192pointerdown" /* DOWN */, this.pointerDown);
            RTS_V2.viewport.addEventListener("\u0192pointerup" /* UP */, this.pointerUp);
            RTS_V2.viewport.addEventListener("\u0192pointermove" /* MOVE */, this.pointerMove);
            RTS_V2.viewport.activatePointerEvent("\u0192pointerdown" /* DOWN */, true);
            RTS_V2.viewport.activatePointerEvent("\u0192pointerup" /* UP */, true);
            RTS_V2.viewport.activatePointerEvent("\u0192pointermove" /* MOVE */, true);
            this.buyMenu = new RTS_V2.BuyKontextMenu(this);
            this.unitsDestroyedHTMLElement = document.querySelector("#units-destoyed");
            this.unitCountHTMLElement = document.querySelector("#unit-count");
            let maxUnits = document.querySelector("#max-units");
            maxUnits.innerHTML = RTS_V2.unitsPerPlayer + "";
            console.log(this.buyMenu);
            this.addEventListener("gameWon", this.gameWonHandler);
            this.addEventListener("gameLost", this.gameLostHandler);
        }
        startCoinTimer() {
            this.timerHTMLElement = document.querySelector("#coins");
            this.coinTimer = new ƒ.Timer(ƒ.Time.game, this.coinRate, 0, this.coinTimerHandler);
            console.log(this.coinTimer);
        }
        spawnTank() {
            this.increaseUnitCount();
            let spawnPos = this.spawnPointArray[this.spawnpointIndex];
            this.spawnpointIndex = (this.spawnpointIndex + 1) % 3;
            let newUnit = new RTS_V2.TankUnit("Unit", spawnPos);
            RTS_V2.gameobjects.appendChild(newUnit);
        }
        spawnSuperTank() {
            this.increaseUnitCount();
            let spawnPos = this.spawnPointArray[this.spawnpointIndex];
            this.spawnpointIndex = (this.spawnpointIndex + 1) % 3;
            let newUnit = new RTS_V2.SuperTank("Unit", spawnPos);
            RTS_V2.gameobjects.appendChild(newUnit);
        }
        spawnBomber() {
            this.increaseUnitCount();
            let spawnPos = this.spawnPointArray[this.spawnpointIndex];
            this.spawnpointIndex = (this.spawnpointIndex + 1) % 3;
            let newUnit = new RTS_V2.Bomber("Unit", spawnPos);
            RTS_V2.gameobjects.appendChild(newUnit);
        }
        increaseUnitsDestroyed() {
            this.unitsDestroyed++;
            this.unitsDestroyedHTMLElement.innerHTML = this.unitsDestroyed + "";
        }
        increaseUnitCount() {
            this.unitcount++;
            this.unitCountHTMLElement.innerHTML = this.unitcount + "";
        }
        decreaseUnitCount() {
            this.unitcount--;
            this.unitCountHTMLElement.innerHTML = this.unitcount + "";
        }
        createBase() {
            let pos = new ƒ.Vector3(-(RTS_V2.terrainX / 2) + 5, 0, 0.1);
            this.base = new RTS_V2.Base("playerBase", pos);
            RTS_V2.gameobjects.appendChild(this.base);
        }
    }
    RTS_V2.PlayerManager = PlayerManager;
})(RTS_V2 || (RTS_V2 = {}));
/// <reference path="Unit.ts"/>
var RTS_V2;
/// <reference path="Unit.ts"/>
(function (RTS_V2) {
    var ƒ = FudgeCore;
    var ƒAid = FudgeAid;
    class SuperTank extends RTS_V2.Unit {
        constructor(_name, _pos, _isPlayer = true) {
            super(_name);
            this.unitType = RTS_V2.UnitType.SUPERTANK;
            let unitSettings = RTS_V2.Unit.unitSettings.get(this.unitType);
            this.isPlayer = _isPlayer;
            this.collisionRange = 1;
            this.shootingRange = 6;
            this.health = unitSettings.health;
            this.armor = unitSettings.armor;
            this.shootingRate = unitSettings.shootingrate;
            this.speed = unitSettings.speed;
            this.flock = new RTS_V2.Flock(this, 2);
            this.createNodes(_pos);
            ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.update.bind(this));
            this.healthBar = new RTS_V2.Healthbar(this);
        }
        static loadImages() {
            SuperTank.bodyImg = document.querySelector("#supertankbody");
            SuperTank.playerbarrelImg = document.querySelector("#playerSuperTankBarrel");
            SuperTank.enemyBarrelImg = document.querySelector("#enemySuperTankBarrel");
        }
        calculateDamage(_bullet) {
            let damage;
            if (_bullet.unitType == RTS_V2.UnitType.BOMBER) {
                damage = ((_bullet.damage * 1.5) / this.armor);
            }
            else if (_bullet.unitType == RTS_V2.UnitType.TANK) {
                damage = ((_bullet.damage * 0.5) / this.armor);
            }
            else {
                damage = ((_bullet.damage) / this.armor);
            }
            this.health -= damage;
            //(<Healthbar>this.healthBar).health = Math.floor(this.health * 100);
            if (this.health <= 0 && !this.isDead) {
                RTS_V2.gameobjects.removeChild(this);
                this.isDead = true;
                this.healthBar.delete();
                this.healthBar = null;
                this.target = null;
                this.clearTimer();
                if (this.isPlayer) {
                    RTS_V2.playerManager.decreaseUnitCount();
                }
                else {
                    RTS_V2.playerManager.increaseUnitsDestroyed();
                }
            }
        }
        setPicked(_bool) {
            if (_bool) {
                this.appendChild(this.selected);
            }
            else {
                this.removeChild(this.selected);
            }
        }
        follow() {
            if (this.target != null && this.target != undefined) {
                let targetpos = this.target.mtxWorld.translation.copy;
                RTS_V2.Utils.adjustLookAtToGameworld(targetpos, this.cannonNode);
            }
        }
        createNodes(_pos) {
            let mesh = new ƒ.MeshSprite();
            let bodyMtr = this.getTextureMaterial(SuperTank.bodyImg);
            let selectedMtr = this.getTextureMaterial(RTS_V2.Unit.selectedImg);
            let cannonMtr;
            if (this.isPlayer) {
                cannonMtr = this.getTextureMaterial(SuperTank.playerbarrelImg);
            }
            else {
                cannonMtr = this.getTextureMaterial(SuperTank.enemyBarrelImg);
            }
            this.selected = new ƒAid.Node("Unit Selected", ƒ.Matrix4x4.IDENTITY(), selectedMtr, RTS_V2.TankUnit.mesh);
            let selectedCmpNode = this.selected.getComponent(ƒ.ComponentMesh);
            selectedCmpNode.pivot.scale(ƒ.Vector3.ONE(2));
            let unitCmpTransform = new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(_pos));
            this.addComponent(unitCmpTransform);
            this.bodyNode = new ƒAid.Node("Unit Body", ƒ.Matrix4x4.IDENTITY(), bodyMtr, mesh);
            let bodyCmpMesh = this.bodyNode.getComponent(ƒ.ComponentMesh);
            bodyCmpMesh.pivot.scale(ƒ.Vector3.ONE(1.5));
            bodyCmpMesh.pivot.rotateZ(270);
            this.cannonNode = new ƒ.Node("Unit Cannon");
            let cmpTransform = new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(ƒ.Vector3.Z(0.12)));
            this.cannonNode.addComponent(cmpTransform);
            let barrelNode = new ƒAid.Node("Unit Barrel", ƒ.Matrix4x4.TRANSLATION(new ƒ.Vector3(-0.5, 0, 0.11)), cannonMtr, RTS_V2.TankUnit.mesh);
            let barrelCmpMesh = barrelNode.getComponent(ƒ.ComponentMesh);
            barrelCmpMesh.pivot.scale(new ƒ.Vector3(1, 0.5, 0));
            barrelCmpMesh.pivot.rotateZ(90);
            this.appendChild(this.bodyNode);
            this.appendChild(this.cannonNode);
            this.cannonNode.appendChild(barrelNode);
        }
    }
    RTS_V2.SuperTank = SuperTank;
})(RTS_V2 || (RTS_V2 = {}));
/// <reference path="Unit.ts"/>
var RTS_V2;
/// <reference path="Unit.ts"/>
(function (RTS_V2) {
    var ƒ = FudgeCore;
    var ƒAid = FudgeAid;
    class TankUnit extends RTS_V2.Unit {
        constructor(_name, _pos, _isPlayer = true) {
            super(_name);
            this.unitType = RTS_V2.UnitType.TANK;
            let unitsetting = RTS_V2.Unit.unitSettings.get(this.unitType);
            this.isPlayer = _isPlayer;
            this.collisionRange = 0.6;
            this.shootingRange = 5;
            this.health = unitsetting.health;
            this.armor = unitsetting.armor;
            this.shootingRate = unitsetting.shootingrate;
            this.speed = unitsetting.speed;
            this.flock = new RTS_V2.Flock(this);
            this.createNodes(_pos);
            ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.update.bind(this));
            this.healthBar = new RTS_V2.Healthbar(this);
        }
        static loadImages() {
            TankUnit.bodyImg = document.querySelector("#tank");
            TankUnit.cannonImg = document.querySelector("#cannon");
            TankUnit.enemyBodyImg = document.querySelector("#enemytank");
            TankUnit.enemyBarrelImg = document.querySelector("#enemybarrel");
            TankUnit.barrelImg = document.querySelector("#barrel");
        }
        calculateDamage(_bullet) {
            let damage;
            if (_bullet.unitType == RTS_V2.UnitType.SUPERTANK) {
                damage = ((_bullet.damage * 1.5) / this.armor);
            }
            else if (_bullet.unitType == RTS_V2.UnitType.BOMBER) {
                damage = ((_bullet.damage * 0.5) / this.armor);
            }
            else {
                damage = ((_bullet.damage) / this.armor);
            }
            this.health -= damage;
            //(<Healthbar>this.healthBar).health = Math.floor(this.health * 100);
            if (this.health <= 0 && !this.isDead) {
                RTS_V2.gameobjects.removeChild(this);
                this.isDead = true;
                this.healthBar.delete();
                this.healthBar = null;
                this.target = null;
                this.clearTimer();
                if (this.isPlayer) {
                    RTS_V2.playerManager.decreaseUnitCount();
                }
                else {
                    RTS_V2.playerManager.increaseUnitsDestroyed();
                }
            }
        }
        setPicked(_bool) {
            if (_bool) {
                this.appendChild(this.selected);
            }
            else {
                this.removeChild(this.selected);
            }
        }
        follow() {
            if (this.target != null && this.target != undefined) {
                let targetpos = this.target.mtxWorld.translation.copy;
                RTS_V2.Utils.adjustLookAtToGameworld(targetpos, this.cannonNode);
            }
        }
        createNodes(_pos) {
            let cannonMtr = this.getTextureMaterial(TankUnit.cannonImg);
            let selectedMtr = this.getTextureMaterial(RTS_V2.Unit.selectedImg);
            let bodyMtr;
            let barrelMtr;
            if (this.isPlayer) {
                bodyMtr = this.getTextureMaterial(TankUnit.bodyImg);
                barrelMtr = this.getTextureMaterial(TankUnit.barrelImg);
            }
            else {
                bodyMtr = this.getTextureMaterial(TankUnit.enemyBodyImg);
                barrelMtr = this.getTextureMaterial(TankUnit.enemyBarrelImg);
            }
            this.selected = new ƒAid.Node("Unit Selected", ƒ.Matrix4x4.IDENTITY(), selectedMtr, TankUnit.mesh);
            let selectedCmpNode = this.selected.getComponent(ƒ.ComponentMesh);
            selectedCmpNode.pivot.scale(ƒ.Vector3.ONE(1.3));
            let unitCmpTransform = new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(_pos));
            this.addComponent(unitCmpTransform);
            this.bodyNode = new ƒAid.Node("Unit Body", ƒ.Matrix4x4.IDENTITY(), bodyMtr, TankUnit.mesh);
            let bodyCmpMesh = this.bodyNode.getComponent(ƒ.ComponentMesh);
            bodyCmpMesh.pivot.scale(ƒ.Vector3.ONE());
            bodyCmpMesh.pivot.rotateZ(90);
            this.cannonNode = new ƒAid.Node("Unit Cannon", ƒ.Matrix4x4.TRANSLATION(ƒ.Vector3.Z(0.12)), cannonMtr, TankUnit.mesh);
            let cannonCmpMesh = this.cannonNode.getComponent(ƒ.ComponentMesh);
            cannonCmpMesh.pivot.scale(ƒ.Vector3.ONE(0.7));
            let barrelNode = new ƒAid.Node("Unit Barrel", ƒ.Matrix4x4.TRANSLATION(new ƒ.Vector3(-0.5, 0, 0.11)), barrelMtr, TankUnit.mesh);
            let barrelCmpMesh = barrelNode.getComponent(ƒ.ComponentMesh);
            barrelCmpMesh.pivot.scale(new ƒ.Vector3(0.7, 0.3, 0));
            barrelCmpMesh.pivot.rotateZ(90);
            this.appendChild(this.bodyNode);
            this.appendChild(this.cannonNode);
            this.cannonNode.appendChild(barrelNode);
        }
    }
    TankUnit.mesh = new ƒ.MeshSprite();
    RTS_V2.TankUnit = TankUnit;
})(RTS_V2 || (RTS_V2 = {}));
var RTS_V2;
(function (RTS_V2) {
    var ƒ = FudgeCore;
    let Utils;
    (function (Utils) {
        function adjustLookAtToGameworld(_lookAtPos, _node) {
            let adjustetLookAtToWorld = _lookAtPos.copy;
            adjustetLookAtToWorld.subtract(_node.mtxWorld.translation.copy);
            _node.mtxLocal.lookAt(adjustetLookAtToWorld, ƒ.Vector3.Z());
            _node.mtxLocal.rotate(new ƒ.Vector3(0, 90, 90));
        }
        Utils.adjustLookAtToGameworld = adjustLookAtToGameworld;
        function createUnitPositions(_startPos, _ringDistancesArray, _ringPosCountArray) {
            let positionArray = new Array();
            positionArray.push(_startPos);
            for (let i = 0; i < _ringDistancesArray.length; i++) {
                let ringPosArray = Utils.createUnitRingPosArray(_startPos, _ringDistancesArray[i], _ringPosCountArray[i]);
                positionArray = positionArray.concat(ringPosArray);
            }
            return positionArray;
        }
        Utils.createUnitPositions = createUnitPositions;
        function createUnitRingPosArray(_pos, _distance, _positionCount) {
            let targetPosArray = new Array();
            for (let i = 0; i < _positionCount; i++) {
                let angle = i * (360 / _positionCount);
                let dir = new ƒ.Vector3(1, 0, 0);
                dir.transform(ƒ.Matrix4x4.ROTATION_Z(angle));
                dir.normalize(_distance);
                let position = _pos.copy;
                position.add(dir);
                let isInsideTerrain = (Math.abs(position.x) < (RTS_V2.terrainX / 2 - 0.5) && Math.abs(position.y) < (RTS_V2.terrainY / 2 - 0.5));
                if (isInsideTerrain) {
                    targetPosArray.push(position);
                }
            }
            return targetPosArray;
        }
        Utils.createUnitRingPosArray = createUnitRingPosArray;
        function gameTimeToString() {
            let time = ƒ.Time.game.get();
            let units = ƒ.Time.getUnits(time);
            return units.minutes.toString().padStart(2, "0") + ":" + units.seconds.toString().padStart(2, "0");
        }
        Utils.gameTimeToString = gameTimeToString;
        function commandUnits(_selectedunits, _pos, _ray) {
            let targetPosArray = Utils.createUnitPositions(_pos, [2, 4, 6], [5, 10, 20]);
            // let targetPosArray: ƒ.Vector3[] = Utils.createUnitRingPosArray(_pos, 1.5, _selectedunits.length);
            let enemySelected = null;
            let enemies = getGameObjects(false);
            for (let enemy of enemies) {
                if (enemy.isInPickingRange(_ray)) {
                    enemySelected = enemy;
                }
            }
            if (enemySelected != null) {
                for (let unit of _selectedunits) {
                    unit.setTarget = enemySelected;
                }
            }
            else {
                let index = 0;
                for (let unit of _selectedunits) {
                    unit.setTarget = null;
                    unit.setMove = targetPosArray[index];
                    index++;
                }
            }
        }
        Utils.commandUnits = commandUnits;
        function selectUnits(_selectionStart, _selectionEnd, _ray, _units) {
            let distanceVector = ƒ.Vector3.DIFFERENCE(_selectionStart, _selectionEnd);
            let selectedUnits = new Array();
            if (distanceVector.magnitudeSquared < 1) {
                for (let unit of _units) {
                    if (unit.isInPickingRange(_ray)) {
                        unit.setPicked(true);
                        selectedUnits.push(unit);
                    }
                    else {
                        unit.setPicked(false);
                    }
                }
            }
            else {
                for (let unit of _units) {
                    let unitPos = unit.mtxWorld.translation.copy;
                    let adjustedStartPos = _selectionStart.copy;
                    adjustedStartPos.subtract(ƒ.Vector3.Z(0.5));
                    let adjustedEndPos = _selectionEnd.copy;
                    adjustedEndPos.add((ƒ.Vector3.Z(0.5)));
                    if (unitPos.isInsideCube(adjustedStartPos, adjustedEndPos)) {
                        unit.setPicked(true);
                        selectedUnits.push(unit);
                    }
                    else {
                        unit.setPicked(false);
                    }
                }
            }
            return selectedUnits;
        }
        Utils.selectUnits = selectUnits;
        function selectAllPlayerUnits() {
            let units = Utils.getUnits();
            for (let unit of units) {
                unit.setPicked(true);
            }
            return units;
        }
        Utils.selectAllPlayerUnits = selectAllPlayerUnits;
        function getGameObjects(_isPlayer = true) {
            let array = RTS_V2.gameobjects.getChildren().map(value => value);
            if (_isPlayer) {
                return array.filter((value) => {
                    if (value.isPlayer)
                        return true;
                    return false;
                });
            }
            else {
                return array.filter((value) => {
                    if (!value.isPlayer)
                        return true;
                    return false;
                });
            }
        }
        Utils.getGameObjects = getGameObjects;
        function getUnits(_isPlayer = true) {
            let array = RTS_V2.gameobjects.getChildrenByName("Unit").map(value => value);
            if (_isPlayer) {
                return array.filter((value) => {
                    if (value.isPlayer)
                        return true;
                    return false;
                });
            }
            else {
                return array.filter((value) => {
                    if (!value.isPlayer)
                        return true;
                    return false;
                });
            }
        }
        Utils.getUnits = getUnits;
        function getAllGameObjects() {
            return RTS_V2.gameobjects.getChildren().map(value => value);
        }
        Utils.getAllGameObjects = getAllGameObjects;
        function getAirPlanes() {
            let array = RTS_V2.gameobjects.getChildren().map(value => value);
            let plainArray = Array();
            for (let unit of array) {
                if (unit.unitType == RTS_V2.UnitType.BOMBER) {
                    plainArray.push(unit);
                }
            }
            return plainArray;
        }
        Utils.getAirPlanes = getAirPlanes;
        function getAllButAirPlains() {
            let array = RTS_V2.gameobjects.getChildren().map(value => value);
            let gameObjectArray = Array();
            for (let unit of array) {
                if (unit.unitType != 2) {
                    gameObjectArray.push(unit);
                }
            }
            return gameObjectArray;
        }
        Utils.getAllButAirPlains = getAllButAirPlains;
        function drawSelectionRectangle(_startClient, _endClient) {
            let ctx = RTS_V2.viewport.getContext();
            let vector = _endClient.copy;
            vector.subtract(_startClient);
            ctx.save();
            ctx.beginPath();
            ctx.rect(_startClient.x, _startClient.y, vector.x, vector.y);
            ctx.strokeStyle = "Black";
            ctx.lineWidth = 3;
            ctx.stroke();
        }
        Utils.drawSelectionRectangle = drawSelectionRectangle;
    })(Utils = RTS_V2.Utils || (RTS_V2.Utils = {}));
})(RTS_V2 || (RTS_V2 = {}));
//# sourceMappingURL=RealTimeStrategie.js.map