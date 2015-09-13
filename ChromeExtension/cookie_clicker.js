chrome.runtime.sendMessage({
	from: 'content',
	subject: 'showPageAction'
});

// Content script first loaded so there is no connection available
chrome.runtime.sendMessage({
	status: 'Closed',
	from: 'content',
	subject: 'updateStatus'});

ws = null;	

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		if (request.from == 'popup' && request.subject == 'startListening') {
			var websocket_url = request.url;
			ws = new WebSocket(websocket_url);
			
			ws.onopen = function() {
				chrome.runtime.sendMessage({
					status: 'Open',
					from: 'content',
					subject: 'updateStatus'});
			};
			
			ws.onclose = function() {
				chrome.runtime.sendMessage({
					status: 'Closed',
					from: 'content',
					subject: 'updateStatus'});
			};
			
			ws.onerror = function() {
				chrome.runtime.sendMessage({
					status: 'Error',
					from: 'content',
					subject: 'updateStatus'});
			};
			
			ws.onmessage = receiveWorkoutInfo;
		}
		else if (request.from == 'popup' && request.subject == 'statusRequest') {
			if (ws) {
				var status = '';
				switch(ws.readyState) {
					case 0:
						status = 'Closed';
						break;
					case 1:
						status = 'Open';
						break;
					case 2:
						status = 'Connecting';
						break;
					case 3:
						status = 'Closed';
						break;
				}
				
				sendResponse({status: status});
			}
			else {
				sendResponse({status: 'Closed'});
			}
		}

	});
	
var prev_distance = 0;
	
function receiveWorkoutInfo(e) {
	var cookie = document.getElementById('bigCookie')
	
	if (cookie) {
		var data = JSON.parse(e.data);
		
		var power = data.power;
		var stroke_state = data.strokestate;
		var force_plot = data.forceplot;
		var time = data.time;
		var distance = data.distance;
		var spm = data.spm;
		
		if (distance < prev_distance || prev_distance == 0) {
			prev_distance = distance;
		}
		
		var distance_delta = distance - prev_distance;
		
		var cookie_click_count = distance_delta;
		console.log("about to click this many times: " + cookie_click_count);
		
		for (var i = 0; i < cookie_click_count; i++) {
			click_the_cookie(cookie, i);
		}
		
		prev_distance = distance;
	}
}

function click_the_cookie(cookie, i) {
	console.log(i);
	var timeout = i * 10;
	setTimeout(function() {
		cookie.click();
	},
	timeout);
}