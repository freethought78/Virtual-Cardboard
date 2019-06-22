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
		engine.switchFullscreen();
	});
	advancedTexture.addControl(button1);    
	
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
	peerListRect.text = "Peers:\nYou\nMe\nPlaceholder";
	peerListRect.color = "lightblue";
	peerListRect.fontSize = "2%";
	peerListRect.top = "10%";
	peerListRect.resizeToFit = true;
	peerListRect.paddingRight = "1%";
	advancedTexture.addControl(peerListRect);
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