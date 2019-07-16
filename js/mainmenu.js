//populate page
function createMainMenu(){
	$("body").html(
		'<button style="float:left; background-color:green" onclick="startSinglePlayer()">Single Player</button>'+
		'<center>'+
		'<div id="pageContent">'+
		'<div style="background-color: #57B; color: #222;"><h1>VirtualCardboard</h1></div><br>'+
		
		'Your Nickname:<br>'+
		'<div id="nameInputDiv">'+
		'<input id="nameInput"><br>'+
		'<button onclick="addConnectionDetails()">Submit Name</button>'+
		'</div>'+
		'<br><br>'+
		'</div>'+
		'</center>'
	);
	
	//Enter pressed inside nickname input is the same as pressing the submit button
	$("#nameInput").on('keyup', function (e) {
		if (e.keyCode == 13) {
			addConnectionDetails();
		}
	});
}

//add connection details to page
function addConnectionDetails(){
	if(validateName()==false){
	} else {
		//Replace name input with a static representation of users name	
		replaceNameInput();
		
		$("#pageContent").append(
			'Your ID:'+
			'<div id="idDiv"></div>'+

			'Refresh the page to generate a new ID.'+
			'<hr>'+
			'<br>'+
			"Enter your friend's ID and press connect:<br>"+
			'<input id="targetIDinput">'+
			'<button id="connectButton" onclick="connect()">Connect</button><br>'+
			'<hr>'
		);
		
		// create a PeerJS network id (located in js/networking.js)
		createNetworkID();
	}
	
	//pressing enter on the target ID input will do the same as pressing connect
	$("#targetIDinput").on('keyup', function (e) {
    if (e.keyCode == 13) {
        connect();
    }
});
}

function validateName(){
	if($("#nameInput").val() == ""){
		return false;
	}else{
		return true;
	}
}

function replaceNameInput(){
	//stores the users name after being validated
	username = $("#nameInput").val();
	$("#nameInputDiv").html(username);
}

function startSinglePlayer(){
	serverID="disconnected";
	startEngine();
}