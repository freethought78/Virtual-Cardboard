function createGUI(){
	//Create GUI
	
	advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
	
	chatrect = new BABYLON.GUI.ScrollViewer();
	chatrect.background = "black";
	chatrect.color = "yellow";
	chatrect.width = "90%";
	chatrect.height = "15%";
	chatrect.top  = "-3%";
	chatrect.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
	chatrect.alpha = "0.5";
	
	chattext = new BABYLON.GUI.TextBlock();
	chattext.textWrapping = BABYLON.GUI.TextWrapping.WordWrap;
	chattext.resizeToFit = true;
	chattext.text = "Chat Start:";
	chattext.color = "white";
	chattext.fontSize = 14;
	chattext.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
	chattext.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
	chattext.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
	chattext.textVerticalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_TOP;
	
	chatinput = new BABYLON.GUI.InputText();
	chatinput.width = "90%";
	chatinput.fontSize = 14;
	chatinput.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
	chatinput.color = "lightgreen";
	chatinput.resizeToFit = true;
	chatinput.alpha = "0.5";
	chatinput.height = "3%";
	chatinput.background = "black";
	
	chatrect.addControl(chattext);
	advancedTexture.addControl(chatrect);   
	advancedTexture.addControl(chatinput); 
	
	button1 = BABYLON.GUI.Button.CreateSimpleButton("but1", "Fullscreen");
	button1.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
	button1.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
	button1.width = "75px";
	button1.height = "20px";
	button1.color = "white";
	button1.fontSize = 12;
	button1.cornerRadius = 5;
	button1.background = "darkblue";
	button1.onPointerUpObservable.add(function() {
		engine.enterFullscreen();
	});
	advancedTexture.addControl(button1);    
}


