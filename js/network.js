// the peer will only send update packets every frame when it is the master peer
// currently, the peer becomes the master when he is dragging a piece
peerIsDragging = false;

// lets us know if this client is also the server.
// it defaultws to false and sets itself to true when successfully taking incoming connections
actingServer = false;

// on the server, we store an array of connections to all of the connected peers.
// non server peers will not use this array.
connections = [];

// a list of the names of connected clients
peerList = [];

function createNetworkID(){
	// the id of the connected peer. The initial connection is only one way.
	// we use 'remote' to check for 2 way connection and only connect back once
	remote="disconnected";
	// serverID will hold the ID of the peer that will be treated as the serverID
	// the server is the peer recieving incoming connections
	serverID="disconnected";
	
	//§§§§§§§§§§-----------Create A Peer ID------------§§§§§§§§§§§§§§§§§
	//Register as a Peer on the PeerJS cloud
	peer = new Peer();

	//When peer is registered, add the peer ID to the appropriate Div
	peer.on('open', function(id) {
		var idDiv = document.getElementById("idDiv");
		idDiv.innerHTML += id;
	});
	registerConnectionHandlers();
}

//§§§§§§§§§§§§------------Manage connection and handle network data-----------§§§§§§§§§§§§§§§§
// Outgoing connection is created when 'connect' button is pressed
function connect(){
	var targetIDinput = document.getElementById("targetIDinput");
	var targetID = targetIDinput.value;
	remote = targetID;
	if(serverID == "disconnected"){serverID = remote};
	conn = peer.connect(remote, {metadata: {name: username}});
}

// When incoming connection attempt is recieved create message handlers
function registerConnectionHandlers(){
	peer.on('connection', function(conn) {
		//If we only have a one way connection, connect back to the peer
		if (remote=="disconnected"){
			remote = conn.peer;
			serverID = peer.id;
			actingServer = true;
			var remoteName = conn.metadata.name;
			conn = peer.connect(remote);
			
		}
		
		// On successful connection:
		conn.on('open', function() {
			//Register the Enter key to send messages.
			registerEnterKey(conn);
			
			//Manage different types of network traffic
			conn.on('data', async function(data){
				//when a chat message is recieved, post it to the output
				if(data.type == "chat"){
					var sender = data.user;
					var message = data.message;
					post(sender + ": " + message);
				}
				//when a state message is recieved, update all pieces on the board
				if(data.type == 'state'){
					var states = JSON.parse(data.states);
					
					// if no piece is being dragged, enable gravity on all pieces.
					// else disable gravity on dragged piece.
					var dp = data.draggedPiece;
					if (dp == "none"){
						for(x in states){
							pieces[x].physicsImpostor.wakeUp()
						}
					}else{
						pieces[dp].physicsImpostor.sleep();
					}
					
					// when state update packet is recieved, update position and rotation of all pieces.
					for (x in states){
						var id = states[x].id;
						var p = JSON.parse(states[x].position);
						var r = JSON.parse(states[x].rotation);
						pieces[id].position = p;
						pieces[id].rotationQuaternion = new BABYLON.Quaternion(r.x, r.y, r.z, r.w);
					}
				}
				
				if(data.type == 'peerListUpdate'){
					peerList = JSON.parse(data.list);
				}
			});
			
		
			//Start the 3d engine and load the scene using method from external file js/startengine.js
			startEngine();
			
			
			//notify user that a connection was established
			post("-----Connection Established------");
			
			// Sychronize scenes between peers
			synchronizeScenes(conn);
			
			if (actingServer == true){
				connections.push({name: remoteName, connection:conn});
				updateRemotePeerLists();
			}
			
		});
		
	});
}

// after every frame is rendered, send the updated state of all pieces to connected peer
function synchronizeScenes(conn){
	scene.onAfterDrawPhaseObservable.add(
		function(){
			if (peerIsDragging){
				updateRemoteBoard(conn);
			}
			if (endRemoteDrag == true){
				updateRemoteBoard(conn);
				endRemoteDrag = false;
			}
		}
	);
}

//sends the local state of the board to the connected peer once
function updateRemoteBoard(conn){
	var states = [];
	for (x in pieces){
		states.push({id:x, position:JSON.stringify(pieces[x].position), rotation:JSON.stringify(pieces[x].rotationQuaternion),});
	}
	
	var statePacket = {type: "state", states:JSON.stringify(states), draggedPiece: draggedPiece};
	conn.send(statePacket);
}

function updateRemotePeerLists(){
	peerList = [];
	peerList.push(username);
	for (peer in connections){
		peerList.push(connections[peer].name);
	}
	for (peer in connections){
		connections[peer].connection.send({type: "peerListUpdate", list: JSON.stringify(peerList)});
	}
}