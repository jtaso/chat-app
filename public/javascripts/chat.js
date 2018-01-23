var ws_controller_path = '/';
var ws_uri = window.location.protocol.match(/https/) ?
    'wss' :
    'ws' + '://' + window.document.location.host + ws_controller_path;

// Initialize websocket connection
var websocket = null;

// Fired Once
function handleNameSubmit(e) {
    e.preventDefault();
    var form = e.target;
    var name = form.name.value;

    revealChat();
    initWebsocket(name);

    document.getElementById('name-input').value = null;
}

function broadcastMessage(message) {
    if (!message || !message.length) return;
    websocket.send(message);
    document.getElementById('input').value = null;
}

function handleMessageSubmit(e) {
    e.preventDefault();
    var form = e.target;
    broadcastMessage(form.message.value);
}


function revealChat() {
    var chatApp = document.getElementById('chat-app');
    var nameForm = document.getElementById('name-form');

    chatApp.style.display = 'block';
    nameForm.style.display = 'none';

}

function initApp() {
    var nameForm = document.getElementById('name-form');
    var messageForm = document.getElementById('message-form');

    nameForm.onsubmit = handleNameSubmit;
    messageForm.onsubmit = handleMessageSubmit;

}

function initWebsocket(handle) {
    if (websocket && websocket.readyState == 1)
        return true;

    websocket = new WebSocket(ws_uri + handle);

    websocket.onopen = function(e) {
        var msg = document.createElement("li");
        msg.className = 'system_message'
        msg.innerHTML = "Connected.";
        msg.style.color = "#bababa";
        document.getElementById("chat-output").appendChild(msg);
    };

    websocket.onclose = function(e) {
        var msg = document.createElement("li");
        msg.className = 'system_message'
        msg.innerHTML = "Disconnected.";
        msg.style.color = "#bababa";
        document.getElementById("chat-output").appendChild(msg);
    };

    websocket.onmessage = function(e) {
        var msg = document.createElement("li");
        msg.innerHTML = e.data;
        var chatOutput = document.getElementById("chat-output");
        chatOutput.appendChild(msg);
        chatOutput.scrollTop = chatOutput.scrollHeight;

    };
}

initApp();