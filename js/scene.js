// The Game Scene
function createScene(){

	// Create the scene space
	scene = new BABYLON.Scene(engine);
	scene.enablePhysics();
	scene.getPhysicsEngine().setGravity(new BABYLON.Vector3(0,-70, 0));
	
	// Add a camera to the scene 
	camera = new BABYLON.UniversalCamera("UniversalCamera", new BABYLON.Vector3(0, 50, 80), scene);
	camera.setTarget(new BABYLON.Vector3.Zero());
	
	defineControls();

	// attach camera to the canvas
	camera.attachControl(canvas, true);

	// Add lights to the scene
	light1 = new BABYLON.DirectionalLight("light1", new BABYLON.Vector3(0, -1, 0), scene);
	light1.position = new BABYLON.Vector3(0,20,0);
	light2 = new BABYLON.PointLight("light2", new BABYLON.Vector3(50, 40, 0), scene);
	light3 = new BABYLON.PointLight("light3", new BABYLON.Vector3(-50, 40, 0), scene);
	
	light1.intensity = 1;
	light2.intensity = 0.5;
	light3.intensity = 0.5;
	
	//Add transparent floor to scene
	floor = BABYLON.MeshBuilder.CreatePlane("floor", {width:200, height:1, depth:200}, scene);
	floor.position.y = -50;
	floor.physicsImpostor = new BABYLON.PhysicsImpostor(floor, BABYLON.PhysicsImpostor.PlaneImpostor, { mass: 0, restitution: 0.9 }, scene);
	floorcolor = new BABYLON.StandardMaterial("floorcolor", scene);
	floorcolor.alpha = 0;
	floor.material = floorcolor;
	
	//Add Skybox
	var skyMaterial = new BABYLON.SkyMaterial("skyMaterial", scene);
	skyMaterial.backFaceCulling = false;
	skyMaterial.inclination = 0; 
	skyMaterial.azimuth = 0.42;
	skyMaterial.cameraOffset.y = 50;
	skyMaterial.luminance = 1,189;
	
	var skybox = BABYLON.Mesh.CreateBox("skyBox", 1000.0, scene);
	skybox.material = skyMaterial;
	
	
	//Create components of checkers scene from external file js/checkers.js
	createCheckersScene();
	//Create GUI from external file js/GUI.js
	createGUI();

	//End of Scene
	return scene;
};