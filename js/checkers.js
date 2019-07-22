function createCheckersScene(){
	// Add board to scene
	board = BABYLON.MeshBuilder.CreateBox("board", {height:1, width:50, depth:50}, scene);
	board.position.y = 1;
	board.physicsImpostor = new BABYLON.PhysicsImpostor(board, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.9 }, scene);

	
	// Load Texture for board
	boardImage = new BABYLON.StandardMaterial("boardImage", scene);
	boardImage.diffuseTexture = new BABYLON.Texture("https://i.imgur.com/EzkZgbc.jpg", scene);
	boardImage.activeLight = light1;
	board.material = boardImage;
				
	// Create colors for pieces
	redpiececolor = new BABYLON.StandardMaterial("redpiececolor", scene);
	blackpiececolor = new BABYLON.StandardMaterial("blackpiececolor", scene);
	redpiececolor.diffuseColor = new BABYLON.Color3(1,0,0);
	blackpiececolor.diffuseColor = new BABYLON.Color3(0.1,0.1,0.1);
	
	
	pieces = [];
	// Create red pieces
	for (var x=0; x<4; x++){
		pieces[x] =  BABYLON.MeshBuilder.CreateCylinder("piece"+x, {height:1, diameter:5}, scene);
		pieces[x].position.y = 2;
		pieces[x].position.x = (x*11) - 19.3;
		pieces[x].position.z = 19;
		pieces[x].material = redpiececolor;
	}
	for (var y=0; y<4; y++){
		var x = y+4;
		pieces[x] =  BABYLON.MeshBuilder.CreateCylinder("piece"+x, {height:1, diameter:5}, scene);
		pieces[x].position.y = 2;
		pieces[x].position.x = (y*11) - 19.3;
		pieces[x].position.z = 8;
		pieces[x].material = redpiececolor;
	}
	for (var y=0; y<4; y++){
		var x = y+8;
		pieces[x] =  BABYLON.MeshBuilder.CreateCylinder("piece"+x, {height:1, diameter:5}, scene);
		pieces[x].position.y = 2;
		pieces[x].position.x = (y*11) - 14;
		pieces[x].position.z = 14;
		pieces[x].material = redpiececolor;
	}
	
	//Create black pieces
	for (var y=0; y<4; y++){
		var x=y+12;
		pieces[x] =  BABYLON.MeshBuilder.CreateCylinder("piece"+x, {height:1, diameter:5}, scene);
		pieces[x].position.y = 2;
		pieces[x].position.x = (y*11) - 14;
		pieces[x].position.z = -19;
		pieces[x].material = blackpiececolor;
	}
	for (var y=0; y<4; y++){
		var x = y+16;
		pieces[x] =  BABYLON.MeshBuilder.CreateCylinder("piece"+x, {height:1, diameter:5}, scene);
		pieces[x].position.y = 2;
		pieces[x].position.x = (y*11) - 19.3;
		pieces[x].position.z = -14;
		pieces[x].material = blackpiececolor;
	}
	for (var y=0; y<4; y++){
		var x = y+20;
		pieces[x] =  BABYLON.MeshBuilder.CreateCylinder("piece"+x, {height:1, diameter:5}, scene);
		pieces[x].position.y = 2;
		pieces[x].position.x = (y*11) - 14;
		pieces[x].position.z = -8;
		pieces[x].material = blackpiececolor;
	}
	
	// Make all pieces draggable
	for (var x in pieces){
		pieces[x].physicsImpostor = new BABYLON.PhysicsImpostor(pieces[x], BABYLON.PhysicsImpostor.CylinderImpostor, { mass: 10, restitution: 0.2 }, scene);
		pieces[x].actionManager = new BABYLON.ActionManager(scene);
		makeDraggable(pieces[x], x);
	}
	
	//register right click behaviors for each piece
	for (var x in pieces){
		pieces[x].actionManager = new BABYLON.ActionManager(scene);
		pieces[x].actionManager.registerAction(
			new BABYLON.ExecuteCodeAction(
				BABYLON.ActionManager.OnRightPickTrigger,
				function(x){
					var meshID = x.meshUnderPointer.id;
					var pieceID = meshID.replace('piece','');
					pieceRightClicked(pieceID);
				},
			)
		);
	}
	
	// Allow Pieces to cast shadows onto board
	shadowGenerator = new BABYLON.ShadowGenerator(1024, light1);
	
	//add pieces to shadowmap
	for (x in pieces){
		pieces[x].receiveShadows = true;
		shadowGenerator.getShadowMap().renderList.push(pieces[x]);	
	}

	board.receiveShadows = true;
}

function pieceRightClicked(pieceID){
	highlightLayer.addMesh(pieces[pieceID], BABYLON.Color3.Green());
}