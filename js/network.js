// the peer will only send update packets every frame when it is the master peer
// currently, the peer becomes the master when he is dragging a piece
peerIsDragging = false;

// lets us know if this client is also the server.
// it defaultws to false and sets itself to true when successfully taking incoming connections
actingServer = "none";

// on the server, we store an array of connections to all of the connected peers.
// non server peers will not use this array.
connections = [];

// a list of the names of connected clients
peerList = [];

// keeps track of whether the engine has been started so we dont start it again every time a new connection is made to the server
var engineStarted = false;

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
		peerID = peer.id;
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
	actingServer = false;
}

// When incoming connection attempt is recieved create message handlers
function registerConnectionHandlers(){

	peer.on('connection', function(conn) {
		// If this is the first incoming connection, an no outgoing connections have been made yet, this is now the acting server
		if(actingServer == "none"){actingServer = true};
		
		// Store nickname of incoming connection on either server or client
		var remoteName = conn.metadata.name;
		
		//If we only have a one way connection, connect back to the peer
		if (actingServer == true){
			remote = conn.peer;
			serverID = peer.id;
			
			conn = peer.connect(remote, {metadata: {name: username}});
		}
		
		conn.on('close', function(){
			removeDeadConnections();
		});
		
		// On successful connection:
		conn.on('open', function() {

			
			//Manage different types of network traffic
			conn.on('data', async function(data){
				//when a chat message is recieved, post it to the output
				if(data.type == "chat"){
					var sender = data.user;
					var message = data.message;
					post(sender + ": " + message);
					rebroadcast(data);
				}
				
				//when a state message is recieved, update all pieces on the board
				if(data.type == 'state'){
					rebroadcast(data);
					
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
				
				// this packet is set from the server containing a list of connected peers
				if(data.type == 'peerListUpdate'){
					peerList = JSON.parse(data.list);
				}
				
				// A client sends this packet to the server to get a board state update packet in return
				if(data.type == "requestBoardUpdate"){
					updateRemoteBoard(conn);
				}
				
				// A connect packet is sent from the server to the clien list when a new client has connected to the server
				if(data.type=="connect"){
					post("-----"+data.name+" connected to the server-----");
				}
				
				// A droppedConnection packet is sent from the server to the client list when a client has lost connections
				if(data.type=='droppedConnection'){
					post("-----"+data.name+" left the server-----");
				}
			});
			
		
			//Start the 3d engine and load the scene using method from external file js/startengine.js
			if (engineStarted == false){
				startEngine();
				engineStarted = true;
				requestBoardUpdate(conn);
				registerEnterKey(conn);
			}
			
			
			//notify user that a connection was established
			if (actingServer==true){
				post("-----Incoming Connection from "+remoteName+"-----");
				var connectionPacket = {type: "connect", name:remoteName, peerID:conn.peer};
				broadcast(connectionPacket);
			} else {
				post ("-----Connected to "+remoteName+"'s server-----");
			}
			
			// Sychronize scenes between peers
			synchronizeScenes(conn);
			
			if (actingServer == true){
				connections.push({name: remoteName, connection:conn, id:conn.peer});
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
	
	var statePacket = {type: "state", states:JSON.stringify(states), draggedPiece: draggedPiece, peerID: peer.id};
	
	// clients send board updates to the server, the server sends board updates to all clients.
	// updates originating from non server clients still need to be rebroadcast by the server in the packet handler
	broadcast(statePacket, conn);
}

// If this is the acting server loop through the list of connections in reverse, eliminating dead connections from the list
// then broadcast the updated list to the clients
function removeDeadConnections(){
	if(actingServer == true){
		for (var currentPeer = connections.length -1; currentPeer>=0; currentPeer--){
			if(connections[currentPeer].connection.open == false){
				var name = connections[currentPeer].name;
				var id = connections[currentPeer].id;
				var disconnectPacket = {type: "droppedConnection", name: name, PeerID: id};
				post("-----"+name+" left the server-----");
				broadcast(disconnectPacket);
				connections.splice(currentPeer, 1);
			}
		}
		updateRemotePeerLists();
	}
}

function updateRemotePeerLists(){
	peerList = [];
	peerList.push(username);
	for (var currentPeer in connections){
		peerList.push(connections[currentPeer].name);
	}
	for (var currentPeer in connections){
		connections[currentPeer].connection.send({type: "peerListUpdate", list: JSON.stringify(peerList)});
	}
}

function requestBoardUpdate(serverConnection){
	serverConnection.send({type: "requestBoardUpdate"});
}

//rebroadcast state changes to all clients except the sender
function rebroadcast(packet){
	if(actingServer == true){
		for(var currentPeer in connections){
			if(packet.peerID != connections[currentPeer].id){
				connections[currentPeer].connection.send(packet);
			}
		}
	}
}

function broadcast(packet, conn){
	if (actingServer == false){
		conn.send(packet);
	}else{
		rebroadcast(packet);
	}
}