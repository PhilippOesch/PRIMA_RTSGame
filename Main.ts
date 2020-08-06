namespace RTS_V2 {
    import ƒ = FudgeCore;
    import ƒAid = FudgeAid;
    //import ƒUi = FudgeUserInterface;

    export let viewport: ƒ.Viewport;
    export let gameobjects: ƒ.Node;
    export let bullets: ƒ.Node;

    export let terrainX: number;
    export let terrainY: number;

    export let playerManager: PlayerManager;
    export let aiManager: AIManager;
    export let gameTimer: ƒ.Timer;
    export let unitsPerPlayer: number;

    let terrainTiling: number = 5; //size of each tile
    let cameraDistance: number;

    //let mousePos= ƒ.Vector2;

    interface SettingsJSON {
        general: {
            unitsPerPlayer: number,
            cameraDistance: number
        };
        terrain: {
            terrainX: number,
            terrainY: number
        };
        unitValues: {
            tank: UnitSettings,
            supertank: UnitSettings,
            bomber: UnitSettings
        };
    }

    export interface UnitSettings{
        damage: number;
        health: number;
        armor: number;
        speed: number;
        shootingrate: number;
        bulletspeed: number;
    }

    ƒ.RenderManager.initialize(true, false);

    window.addEventListener("load", hndLoad);

    function hndLoad(_event: Event): void {
        loadSettings();

        const canvas: HTMLCanvasElement = document.querySelector("canvas");
        let backgroundImg: HTMLImageElement = document.querySelector("#terrain");

        //prevents the context menu to open
        canvas.addEventListener("contextmenu", event => event.preventDefault());

        loadGameImages();

        let graph: ƒ.Node = new ƒ.Node("Game");
        let terrain: ƒAid.Node = createTerrainNode(backgroundImg);
        graph.appendChild(terrain);
        bullets = new ƒ.Node("Bullets");
        gameobjects = new ƒ.Node("GameObjects");
        graph.appendChild(bullets);
        graph.appendChild(gameobjects);
        console.log(playerManager);

        let cmpCamera: ƒ.ComponentCamera = new ƒ.ComponentCamera();
        cmpCamera.pivot.translate(ƒ.Vector3.Z(cameraDistance));
        let cameraLookAt: ƒ.Vector3 = new ƒ.Vector3(0, 0, 0);
        cmpCamera.pivot.lookAt(cameraLookAt);
        cmpCamera.backgroundColor = ƒ.Color.CSS("#395709");

        viewport = new ƒ.Viewport();
        viewport.initialize("Viewport", graph, cmpCamera, canvas);

        //setup AudioNode
        Audio.start();

        playerManager = new PlayerManager();
        aiManager = new AIManager();

        ƒ.Debug.log(viewport);
        ƒ.Debug.log(graph);

        viewport.draw();

        startGameTimer();

        ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
        ƒ.Loop.start(ƒ.LOOP_MODE.TIME_REAL, 60);
    }

    function update(): void {
        viewport.draw();
        if (playerManager.startSelectionInfo != null) {
            Utils.drawSelectionRectangle(playerManager.startSelectionInfo.startSelectionClientPos, playerManager.mousePos);
        }
    }

    function startGameTimer(): void {
        let timerHTMLElement: HTMLElement;
        timerHTMLElement = document.querySelector("#timer");
        gameTimer = new ƒ.Timer(ƒ.Time.game, 1000, 0, function (): void {
            timerHTMLElement.textContent = Utils.gameTimeToString();
        });
    }

    function createTerrainNode(_img: HTMLImageElement): ƒAid.Node {
        let txt: ƒ.TextureImage = new ƒ.TextureImage();
        let coat: ƒ.CoatTextured = new ƒ.CoatTextured();
        txt.image = _img;
        coat.texture = txt;

        let mesh: ƒ.MeshSprite = new ƒ.MeshSprite();
        let mtr: ƒ.Material = new ƒ.Material("mtrTerrain", ƒ.ShaderTexture, coat);

        let terrain: ƒAid.Node = new ƒAid.Node("Terrain", ƒ.Matrix4x4.IDENTITY(), mtr, mesh);
        let terrainsCmpMesh: ƒ.ComponentMesh = terrain.getComponent(ƒ.ComponentMesh);
        terrainsCmpMesh.pivot.scale(new ƒ.Vector3(terrainX, terrainY, 0));
        let cmpMtr: ƒ.ComponentMaterial = terrain.getComponent(ƒ.ComponentMaterial);
        cmpMtr.pivot.scale(new ƒ.Vector2(terrainX / terrainTiling, terrainY / terrainTiling));

        return terrain;
    }

    function loadSettings(): void {
        let file: XMLHttpRequest = new XMLHttpRequest();
        file.open("GET", "./assets/settings.json", false);
        file.send();
        let settings: SettingsJSON = JSON.parse(file.response);

        terrainX = settings.terrain.terrainX;
        terrainY = settings.terrain.terrainY;
        unitsPerPlayer = settings.general.unitsPerPlayer;
        cameraDistance = settings.general.cameraDistance;

        Unit.unitSettings.set(UnitType.TANK, settings.unitValues.tank);
        Unit.unitSettings.set(UnitType.SUPERTANK, settings.unitValues.supertank);
        Unit.unitSettings.set(UnitType.BOMBER, settings.unitValues.bomber);
    }

    function loadGameImages(): void{
        Bullet.loadImages();
        Unit.loadImages();
        TankUnit.loadImages();
        Base.loadImage();
        SuperTank.loadImages();
        Bomber.loadImages();
    }

}