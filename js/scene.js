// The Game Scene
function createScene(){

	// Create the scene space
	scene = new BABYLON.Scene(engine);
	scene.enablePhysics();
	scene.getPhysicsEngine().setGravity(new BABYLON.Vector3(0,-70, 0));
	
	// Add a camera to the scene 
	camera = new BABYLON.UniversalCamera("UniversalCamera", new BABYLON.Vector3(0, 50, 80), scene);
	camera.setTarget(new BABYLON.Vector3.Zero());
	// reduce camera movement speed
	camera.speed = 2;
	camera.inputs.attached.gamepad.gamepadAngularSensibility = 250;
	// add wasd controls to camera
	camera.keysUp.push(87);    //W
	camera.keysDown.push(83)   //D
	camera.keysLeft.push(65);  //A
	camera.keysRight.push(68); //S
	
	var chatFocused;
	scene.onBeforeRenderObservable.add(
		function(){
			// if the chat is not focused, allow these keys to move the camera
			if(chatFocused == false){	
				//Spacebar
				if (keys[32] == true){
					camera.position.y += 0.02*engine.getDeltaTime();
				}
				//Left Control
				if (keys[17] == true){
					camera.position.y -= 0.02*engine.getDeltaTime();
				}
			}
		}
	);

/*	
	scene.onKeyboardObservable.add((e)=>{
		if ((e.event.key=="Enter") && (e.event.type=="keyup")){
			chattext.text += "\n"+ chatinput.text;
			chatinput.text = "";
			chatrect.verticalBar._value = 1;
		}
	})
*/
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
	
	//Create components of checkers scene from external file js/checkers.js
	createCheckersScene();
	//Create GUI from external file js/GUI.js
	createGUI();

	//End of Scene
	return scene;
};