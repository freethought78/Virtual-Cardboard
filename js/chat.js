//§§§§§§§§§§§§--------------Chat Interface----------§§§§§§§§§§§§
// this registers the 'enter' key to send a message to the peer
function registerEnterKey(conn){
	$(document).keypress(function(e) {
		if(e.which == 13) {
			submit(conn);
		}
	});
}

// takes the text from the chat input field and sends the contents to the peer
async function submit(conn){
	var chatData = chatinput.text;
	chatinput.text = "";
	var chatPacket = {type: "chat", user: username, message: chatData};
	conn.send(chatPacket);
	post(username + ": " + chatData);
}

// when the output div is full and can be scrolled down,
// this keeps the output div scrolled to the bottom of the div.
function scrollbottom(){
	chatrect.verticalBar._value = 1;
}
// this prints a message to the output div, in the specified color
function post(message){
	
	// if no problems were detected, display the message
	chattext.text += "\n"+ message;
	
	// scroll to the bottom of the chat after message is added
	scrollbottom();
}
