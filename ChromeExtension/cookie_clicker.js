chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		var websocket_url = request.url;
		var ws = new WebSocket(websocket_url);
		
		ws.onmessage = receiveWorkoutInfo;
	});
	
var prev_time = 0;
	
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
		var time_delta = time - prev_time;
		
		var cookie_click_count = state * power * time_delta;
		console.log("about to click this many times: " + cookie_click_count);
		
		for (var i = 0; i < cookie_click_count; i++) {
			cookie.click();
		}
		
		prev_time = time;
	}
}

// Sample data from rowing machine
// calhr: 864.4224
// calories: 1
// distance: 35.9
// heartrate: 0
// pace: 128.74826901045958
// power: 164
// spm: 25
// status: 1
// time: 11.21