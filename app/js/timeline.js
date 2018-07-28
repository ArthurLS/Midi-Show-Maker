/*timeline.js*/

var canvas = document.getElementById("time_canvas");
var ctx = canvas.getContext('2d');
var zoom_scale = 1;

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
		var cue_l = event_obj["cue_list"];

		var radius = 5 * zoom_scale;
		var origin_x = ($("#range").val())*zoom_scale;

		var x_ratio = zoom_scale * Math.round((canvas.width / ((cue_l.length+1)+zoom_scale)));
		var y_ratio = Math.round((canvas.height) / (info.max_note - info.min_note+2));

		for (var i = 0; i < cue_l.length; i++) {
			var posx = (x_ratio*i + 10)-origin_x;
			
			var posy =  (y_ratio * (cue_l[i]["options"].param1 - info.min_note));
			posy = posy + (2 * (((canvas.height-10) / 2) - posy));

			drawPoint(posx, posy, radius, "red");
			//var variable = (condition) ? (true block) : (else block)
			var font_size = (zoom_scale > 2 ? radius * 0.8 : radius * 2);
			if (posy - radius < 0) drawChar(posx - radius, posy + radius, cue_l[i]["options"].param1, font_size, "white");
			else drawChar(posx - radius, posy - radius, cue_l[i]["options"].param1, font_size, "white");

			if (i == cue_l.length -1) console.log("Posx: "+posx+ " Posy: "+posy);
		}
	}
}

function getMousePos(canvas, evt) {
	var rect = canvas.getBoundingClientRect();
	return {
		x: evt.clientX - rect.left,
		y: evt.clientY - rect.top
	};
}


function up_range() {
	draw();
}

canvas.addEventListener('mousemove', function(evt) {
	var mousePos = getMousePos(canvas, evt);
	var message = 'Mouse position: ' + mousePos.x + ',' + mousePos.y;
	console.log(message);
}, false);

canvas.onmousedown = function (e) {
    console.log(e);
    console.log("Posx: "+e.layerX);
    console.log("Posy: "+e.layerY);
};

function zoom_in() {
	zoom_scale = zoom_scale * 2;
	draw();
}

function zoom_out() {
	zoom_scale = zoom_scale / 2;
	zoom_scale = Math.max(zoom_scale, 1);
	draw();
	
}


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
* Draws a point on the canvas
*/
function drawPoint(posx, posy, radius, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(posx, posy, radius, 0 ,2*Math.PI);
    ctx.fill();

};

/*
* Draws a character, used inside the points
*/
function drawChar(posx, posy, letter, height, color) {
    ctx.fillStyle = color;
    ctx.font = height + "px serif";
    ctx.beginPath();
    ctx.fillText(letter, posx, posy);

    ctx.fill();
};