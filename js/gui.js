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
	chattext.fontSize = "14%";
	chattext.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
	chattext.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
	chattext.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
	chattext.textVerticalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_TOP;
	
	chatinput = new BABYLON.GUI.InputText();
	chatinput.width = "90%";
	chatinput.fontSize = "2.5%";
	chatinput.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
	chatinput.color = "lightgreen";
	chatinput.resizeToFit = true;
	chatinput.alpha = "0.5";
	chatinput.height = "3%";
	chatinput.background = "black";
	// chatFocused lets us know whether the user is trying to chat
	// its used for keeping the keypresses from moving the camera when chat is focused
	// it is defined in controls.js;
	chatinput.onFocusObservable.add(function(){chatFocused = true;});
	chatinput.onBlurObservable.add(function(){chatFocused = false;});
	
	
	chatrect.addControl(chattext);
	advancedTexture.addControl(chatrect);   
	advancedTexture.addControl(chatinput); 
	
	fullscreenButton = BABYLON.GUI.Button.CreateSimpleButton("fullscreenButton", "Fullscreen");
	fullscreenButton.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
	fullscreenButton.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
	fullscreenButton.width = "75px";
	fullscreenButton.height = "20px";
	fullscreenButton.color = "white";
	fullscreenButton.fontSize = 12;
	fullscreenButton.cornerRadius = 5;
	fullscreenButton.background = "darkblue";
	fullscreenButton.onPointerUpObservable.add(function() {
		engine.switchFullscreen();
	});
	advancedTexture.addControl(fullscreenButton);
	
	selectButton = BABYLON.GUI.Button.CreateSimpleButton("selectButton", "Select");
	selectButton.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
	selectButton.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
	selectButton.width = "75px";
	selectButton.height = "20px";
	selectButton.top = "10%";
	selectButton.color = "white";
	selectButton.fontSize = 12;
	selectButton.cornerRadius = 5;
	selectButton.background = "darkblue";
	advancedTexture.addControl(selectButton);
	
	serverIDrect = BABYLON.GUI.Button.CreateSimpleButton("serverIDbutton", "Server ID:\n"+serverID);
	serverIDrect.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
	serverIDrect.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
	serverIDrect.color = "white";
	serverIDrect.fontSize = "2%";
	serverIDrect.resizeToFit = true;
	serverIDrect.background = "black";
	serverIDrect.alpha = "0.5";
	serverIDrect.height = "7%";
	serverIDrect.width = "12%";
	serverIDrect.onPointerUpObservable.add(function(){
		copyToClipboard(serverID);
		alert("Server ID copied to clipboard.");
	});
	advancedTexture.addControl(serverIDrect);
	
	peerListRect = new BABYLON.GUI.TextBlock();
	peerListRect.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
	peerListRect.verticalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_TOP;
	peerListRect.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
	peerListRect.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
	peerListRect.text = "Peers:\nYou\nMe\nPlaceholder";
	peerListRect.color = "lightblue";
	peerListRect.fontSize = "2%";
	peerListRect.top = "10%";
	peerListRect.width = "12%";
	//peerListRect.resizeToFit = true;
	peerListRect.paddingRight = "1%";
	advancedTexture.addControl(peerListRect);
	scene.onAfterDrawPhaseObservable.add(function(){updateGUIpeerList()});
}

function updateGUIpeerList(){
	peerListRect.text = "Peers:";
	for (name in peerList){
		peerListRect.text += "\n"+peerList[name];
	}
}

function copyToClipboard(text) {
    var dummy = document.createElement("textarea");
    // to avoid breaking orgain page when copying more words
    // cant copy when adding below this code
    // dummy.style.display = 'none'
    document.body.appendChild(dummy);
    //Be careful if you use texarea. setAttribute('value', value), which works with "input" does not work with "textarea". – Eduard
    dummy.value = text;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
}