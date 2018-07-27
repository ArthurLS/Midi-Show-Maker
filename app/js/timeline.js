/*timeline.js*/

var canvas = document.getElementById("time_canvas");
var ctx = canvas.getContext('2d');

// Handles the containers placement according to the user window (phone, tablet, PC)
window.addEventListener('resize', function () {
	resize();
})
function resize() {
	var col_width = document.getElementById("canvas_container").offsetWidth;
	var row_height = document.getElementById("canvas_container").offsetHeight;
	var range = document.getElementById("range");
	canvas.width = col_width;
	canvas.height = row_height - 35;
	range.max = col_width;
	draw();
}

function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	if (event_obj != null) {
		var info = get_info_params();
		console.log(info);
		var cue_l = event_obj["cue_list"];

		var x_ratio = Math.round((canvas.width / (cue_l.length+1)));
		var y_ratio = Math.round((canvas.height) / (info.max_note - info.min_note+2));

		for (var i = 0; i < cue_l.length; i++) {
			var posx = (x_ratio*i + 10);
			
			var posy =  (y_ratio * (cue_l[i]["options"].param1 - info.min_note));
			posy = posy + (2 * (((canvas.height-10) / 2) - posy));

			drawPoint(posx, posy, 5, "red");
			drawChar(posx - 6, posy - 10, cue_l[i]["options"].param1, "white")
		}
	}
}

canvas.onmousedown = function (e) {
    console.log(e);
    console.log("Posx: "+e.layerX);
    console.log("Posy: "+e.layerY);
};


/*
** return in an object the max delay, max note, min note, length;
*/
function get_info_params() {
	var info = {"max_delay": 0, "max_note": 0, "min_note": 127, "length": event_obj["cue_list"].length};
	for (var i = 0; i < event_obj["cue_list"].length; i++) {
		if(event_obj["cue_list"][i].delay > info.max_delay) info.max_delay = event_obj["cue_list"][i].delay;

		if(event_obj["cue_list"][i]["options"].hasOwnProperty("param1")){
			var param1 = event_obj["cue_list"][i]["options"].param1;
			if(param1 < info.min_note) info.min_note = param1;
			if(param1 > info.max_note) info.max_note = param1;
		}
	}
	return info;
}




/*
* Draws a white circle then the point on top of it 
*/
function drawPoint(posx, posy, radius, color) {
    ctx.fillStyle = "rgba(255,255,255,1)";
    ctx.beginPath();
    ctx.arc(posx, posy, radius, 0 ,2*Math.PI);
    ctx.fill();

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(posx, posy, radius, 0 ,2*Math.PI);
    ctx.fill();

};

/*
* Draws a character, used inside the points
*/
function drawChar(posx, posy, letter, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.fillText(letter, posx, posy);

    ctx.fill();
};