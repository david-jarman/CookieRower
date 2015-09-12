document.addEventListener('DOMContentLoaded', function() {
	var submit_button = document.getElementById('submit_button');
	submit_button.onclick = start_listening;
	
	// Update state of the popup from persisted storage
	chrome.storage.sync.get('url', function (items) {
		var url_field = document.getElementById('url_input');
		url_field.value = items.url;
	});
	
	chrome.storage.sync.get('port', function (items) {
		var port_field = document.getElementById('port_input');
		port_field.value = items.port;
	});
	
	chrome.storage.sync.get('status', function (items) {
		var status = document.getElementById('status');
		status.innerHTML = 'Status: ' + items.status;
	});
} );

function start_listening() {
	var port_field = document.getElementById('port_input');
	var port = Number(port_field.value);
	var url_field = document.getElementById('url_input');
	var url = url_field.value;
	
	// Persist the url and port
	chrome.storage.sync.set({'url': url});
	chrome.storage.sync.set({'port': port});
	
	var websocket_url = 'ws://' + url + ':' + port;
	
	// Send url to the content script
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		chrome.tabs.sendMessage(tabs[0].id, {url: websocket_url});
	});
}

chrome.runtime.onMessage.addListener(function(message, sender) {
    if ((message.from === 'eventPage') && (message.subject === 'updateStatus')) {
        var status = document.getElementById('status');
		status.innerHTML = 'Status: ' + message.status;
    }
});