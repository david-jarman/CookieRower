chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		var websocket_url = request.url;
		var ws = new WebSocket(websocket_url);
		
		ws.onopen = function() {
			chrome.runtime.sendMessage({status:"Open"});
		};
		
		ws.onclose = function() {
			chrome.runtime.sendMessage({status:"Closed"});
		};
		
		ws.onerror = function() {
			chrome.runtime.sendMessage({status:"Error"});
		};
		
		ws.onmessage = receiveWorkoutInfo;
	});
	
var prev_time = 0;
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
		
		var state = stroke_state - 1;
		
		if (prev_time == 0 || time < prev_time) {
			prev_time = time;
		}
		
		if (prev_distance == 0 || distance < prev_distance) {
			prev_distance = distance;
		}
		
		var time_delta = time - prev_time;
		var distance_delta = distance - prev_distance;
		
		var cookie_click_count = distance_delta * time_delta;
		console.log("about to click this many times: " + cookie_click_count);
		
		for (var i = 0; i < cookie_click_count; i++) {
			click_the_cookie(cookie, i);
		}
		
		prev_time = time;
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