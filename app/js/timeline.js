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

var rekt_list = [];

function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	if (event_obj != null) {
		rekt_list = [];
		var info = get_info_params();
		var cue_l = event_obj["cue_list"];

		var height = 5 * zoom_scale;
		var origin_x = ($("#range").val())*zoom_scale;

		var x_ratio = zoom_scale * (canvas.width / ((cue_l.length+1)+zoom_scale));
		// - 10% for the special cues
		var y_ratio = ((canvas.height - canvas.height * 0.1)  / (info.max_note - info.min_note+2));

		for (var i = 0; i < cue_l.length; i++) {
			var cue = cue_l[i];
			// definitive X positioning
			var posx = (x_ratio*i + 10)-origin_x;

			// Do the math on only the drawable ones (quicker)
			if (posx >= 0 && (posx+height * 1.5) <= canvas.width) {
				// basic Y positioning
				var posy =  (y_ratio * (cue_l[i]["options"].param1 - info.min_note));
				// since the (0,0) pos is top left, we flip up side down
				posy = posy + (2 * (((canvas.height / 2)-10) - posy));

				if (cue.type != "noteoff" && cue.type != "noteon" && cue.type != 'cc' && cue.type != 'programme') posy = canvas.height * 0.05;

				// Changes the color
				var color = "";
				(cue.type == "noteon") ? (color = "green") : ((cue.type == "noteoff") ? (color = "red") : (color = "white"));
				drawRect(posx, posy, height * 1.5, height, color);

				rekt_list.push({"id": i, "posx": posx, "posy": posy});

				// small scale -> bigger font
				// big scale -> smaller font
				var font_size = (zoom_scale > 2 ? height * 0.8 : height * 2);
				// letter: if note then note, else type
				var char = cue.type;
				if (cue.type == "noteoff" || cue.type == "noteon" || cue.type == 'cc' || cue.type == 'programme') char = cue["options"].param1;
				
				if (posy - height*2 < 0) drawChar(posx, posy + 2*height, char, font_size, "white");
				else drawChar(posx, posy - height, char, font_size, "white");
			}
			
		}
		console.log(rekt_list);
	}
}



/*
** Called when the range changes position
*/
function up_range() {
	draw();
}

canvas.addEventListener('mousemove', function(evt) {
	var mousePos = getMousePos(canvas, evt);
	//console.log(mousePos);
}, false);

function getMousePos(canvas, evt) {
	var rect = canvas.getBoundingClientRect();
	return {
		x: evt.clientX - rect.left,
		y: evt.clientY - rect.top
	};
}
canvas.onmousedown = function (e) {
    console.log(e);
    console.log("Posx: "+e.layerX);
    console.log("Posy: "+e.layerY);
};

function zoom_in() {
	zoom_scale = zoom_scale * 2;
	zoom_scale = Math.min(zoom_scale, 8);
	draw();
}

function zoom_out() {
	zoom_scale = zoom_scale / 2;
	zoom_scale = Math.max(zoom_scale, 1);
	if (zoom_scale == 1) $("#range").val(1);
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
* Draws a rectangle on the canvas
*/
function drawRect(posx, posy, width, height, color) {
    ctx.fillStyle = color;
    ctx.rect(posx, posy, width, height);
    ctx.fill();

};

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