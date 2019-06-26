// chatfocused is used for preventing camera control keys from functioning
// when the user is chatting.
var chatFocused = false;	

function defineControls(){
	// reduce camera movement speed
	camera.speed = 2;
	camera.inputs.attached.gamepad.gamepadAngularSensibility = 250;
	// add wasd controls to camera
	camera.keysUp.push(87);    //W
	camera.keysDown.push(83)   //D
	camera.keysLeft.push(65);  //A
	camera.keysRight.push(68); //S
	
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
}