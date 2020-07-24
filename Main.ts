
namespace RTS_V2 {
    import ƒ = FudgeCore;
    import ƒAid = FudgeAid;
    //import ƒUi = FudgeUserInterface;

    export let viewport: ƒ.Viewport;
    export let gameobjects: ƒ.Node;
    export let bullets: ƒ.Node;

    export let terrainX: number = 30;
    export let terrainY: number = 20;

    export let playerManager: PlayerManager;

    let terrainTiling: number = 5; //size of each tile

    //let mousePos= ƒ.Vector2;

    ƒ.RenderManager.initialize(true, false);

    window.addEventListener("load", hndLoad);

    function hndLoad(_event: Event): void {
        // ƒUi.CustomElementTemplate.register("custom-healthbar");
        // ƒUi.CustomElement.register("custom-healthbar", FudgeUserInterface.CustomElementTemplate);

        const canvas: HTMLCanvasElement = document.querySelector("canvas");
        let backgroundImg: HTMLImageElement = document.querySelector("#terrain");

        //prevents the context menu to open
        canvas.addEventListener("contextmenu", event => event.preventDefault());

        Bullet.loadImages();
        TankUnit.loadImages();
        Base.loadImage();

        let graph: ƒ.Node = new ƒ.Node("Game");
        let terrain: ƒAid.Node = createTerrainNode(backgroundImg);
        graph.appendChild(terrain);
        bullets = new ƒ.Node("Bullets");
        gameobjects = new ƒ.Node("GameObjects");
        graph.appendChild(bullets);
        graph.appendChild(gameobjects);
        console.log(playerManager);

        let cmpCamera: ƒ.ComponentCamera = new ƒ.ComponentCamera();
        cmpCamera.pivot.translate(ƒ.Vector3.Z(35));
        let cameraLookAt: ƒ.Vector3 = new ƒ.Vector3(0, 0, 0);
        cmpCamera.pivot.lookAt(cameraLookAt);
        cmpCamera.backgroundColor = ƒ.Color.CSS("white");

        viewport = new ƒ.Viewport();
        viewport.initialize("Viewport", graph, cmpCamera, canvas);

        //setup AudioNode
        Audio.start();

        playerManager = new PlayerManager();
        createUnits();

        ƒ.Debug.log(viewport);
        ƒ.Debug.log(graph);

        viewport.draw();

        ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
        ƒ.Loop.start(ƒ.LOOP_MODE.TIME_REAL, 60);
    }

    function update(): void {
        viewport.draw();
        console.log(playerManager.startSelectionInfo);
        if(playerManager.startSelectionInfo!= null){
            Utils.drawSelectionRectangle(playerManager.startSelectionInfo.startSelectionClientPos, playerManager.mousePos);
        }
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


    function createUnits(): void {

        let unit0: Unit = new TankUnit("Unit", new ƒ.Vector3(0, 2, 0.1), false);
        let unit1: Unit = new TankUnit("Unit", new ƒ.Vector3(2, 4, 0.1), false);
        let unit2: Unit = new TankUnit("Unit", new ƒ.Vector3(0, 0, 0.1));
        let unit3: Unit = new TankUnit("Unit", new ƒ.Vector3(2, 0, 0.1));
        let unit4: Unit = new TankUnit("Unit", new ƒ.Vector3(2, 2, 0.1));
        
        gameobjects.appendChild(unit0);
        gameobjects.appendChild(unit1);
        gameobjects.appendChild(unit2);
        gameobjects.appendChild(unit3);
        gameobjects.appendChild(unit4);
    }


}