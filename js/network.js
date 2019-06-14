function createNetworkID(){
	// the id of the connected peer. The initial connection is only one way.
	// we use 'remote' to check for 2 way connection and only connect back once
	remote="disconnected";
	
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
	conn = peer.connect(remote);
}

// When incoming connection attempt is recieved create message handlers
function registerConnectionHandlers(){
	peer.on('connection', function(conn) {
		//If we only have a one way connection, connect back to the peer
		if (remote=="disconnected"){
			remote = conn.peer;
			conn = peer.connect(remote);
		}
		
		// On successful connection:
		conn.on('open', function() {
			//Register the Enter key to send messages.
			registerEnterKey(conn);
			
			//when a message is recieved, post it to the output
			conn.on('data', async function(data){
				if(data.type == "chat"){
					var sender = data.user;
					var message = data.message;
					post(sender + ": " + message);
				}
			});
			
			//Start the 3d engine and load the scene using method from external file js/startengine.js
			startEngine();
			
			//notify user that a connection was established
			post("-----Connection Established------");
		});
	});
}