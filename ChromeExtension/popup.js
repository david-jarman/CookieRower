document.addEventListener('DOMContentLoaded', function() {
	var submit_button = document.getElementById("submit_button");
	submit_button.onclick = start_listening;
	
	chrome.storage.sync.get('url', function (items) {
		var url_field = document.getElementById("url_input");
		url_field.value = items.url;
	});
	
	chrome.storage.sync.get('port', function (items) {
		var port_field = document.getElementsByName("port_input")[0];
		port_field.value = items.port;
	});
} );

function start_listening() {
	var port_field = document.getElementsByName("port_input")[0];
	var port = Number(port_field.value);
	var url_field = document.getElementById("url_input");
	var url = url_field.value;
	
	chrome.storage.sync.set({'url': url});
	chrome.storage.sync.set({'port': port});
	
	var websocket_url = 'ws://' + url + ':' + port;
	
	var url_package = {
		url: websocket_url
	};
	
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		chrome.tabs.sendMessage(tabs[0].id, url_package, function(response) {
			console.log(response.farewell);
		});
	});
	
	// chrome.runtime.getBackgroundPage(function(page)
	// {
		// if (page != null) {
			// var ws = new WebSocket('ws://' + url + ':' + port);
			// ws.onmessage = page.receiveMessage;
		// }
	// });
}