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
	canvas.height = row_height - 45;
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

		// height of a rectangle
		var height = 5 * zoom_scale;
		// where the relative posx = 0 is
		var origin_x = $("#range").val();

		// full canvas width -1% for the final cue
		var x_ratio = zoom_scale * ((canvas.width - canvas.width * 0.01) / info.max_delay);
		// full canvas height -10% for the special cues
		var y_ratio = ((canvas.height - canvas.height * 0.1)  / (info.max_note - info.min_note+2));

		for (var i = 0; i < cue_l.length; i++) {
			var cue = cue_l[i];
			// definitive posX positioning
			var posx = (cue.delay*x_ratio) - origin_x;
			// Do the maths on only the drawable ones (quicker)
			if (posx >= 0 && (posx+height * 1.5) <= canvas.width) {
				
				// basic Y positioning
				var posy =  (y_ratio * (cue_l[i]["options"].param1 - info.min_note));
				// since the (0,0) pos is top left, we flip up side down
				posy = posy + (2 * (((canvas.height / 2)-10) - posy));

				// for special cues, we put them up top (no pitch)
				if (cue.type != "noteoff" && cue.type != "noteon" && cue.type != 'cc' && cue.type != 'programme') posy = canvas.height * 0.05;

				// Changes the color
				var color = "";
				(cue.type == "noteon") ? (color = "green") : ((cue.type == "noteoff") ? (color = "red") : (color = "white"));
				drawRect(posx, posy, height * 1.5, height, color);

				// list the drawn cues
				rekt_list.push({"id": i, "posx": posx, "posy": posy});

				// small scale -> relative ratio bigger font
				// big scale -> relative ratio smaller font
				var font_size = (zoom_scale > 2 ? height * 0.8 : height * 2);
				// letter: if note then pitch, else type
				var char = cue.type;
				if (cue.type == "noteoff" || cue.type == "noteon" || cue.type == 'cc' || cue.type == 'programme') char = cue["options"].param1;
				
				// Always draws the letter in the canvas
				if (posy - height*2 < 0) drawChar(posx, posy + 2*height, char, font_size, "white");
				else drawChar(posx, posy - height, char, font_size, "white");
			}
		}
		var time_ratio = (info.max_delay / canvas.width) / zoom_scale;

		$("#time_label_left").html(origin_x);
		$("#time_label_right").html(Math.round((origin_x*time_ratio + canvas.width*time_ratio)));
	}
}



/*
** Called when the range changes position
*/
function up_range() {
	if (zoom_scale == 1) $("#range").val(0);

	draw();
}
/*
** Canvas mouse events
*/
canvas.onmousedown = function (e) {
    console.log(e);
	var offx = e.layerX;
	var offy = e.layerY;
	var height = 5 * zoom_scale;
	var width = height * 1.5;

	for (var i = 0; i < rekt_list.length; i++) {
		var cue = rekt_list[i];

		//match the mouse pos with a cue
		if (offx > cue.posx && offx < cue.posx + width && offy > cue.posy && offy < cue.posy+height) {
			open_popup("edit_cue", cue.id);
		}
	}
};

// throttle reduces the number of event triggered by the "mousemove" event
// N.B.: it doesn't reduce, but doesn't call the function linked to it more than once every 50ms
$("#time_canvas").mousemove(throttle(50, function(e) {
	var height = 5 * zoom_scale;
	var width = height * 1.5;
	var is_hovering = false;
	var offx = e.offsetX;
	var offy = e.offsetY;

	for (var i = 0; i < rekt_list.length; i++) {
		var cue = rekt_list[i]; 
		//matches the mouse pos with the cue
		if (offx > cue.posx && offx < cue.posx + width && offy > cue.posy && offy < cue.posy+height) {
			is_hovering = true;
			rect_hover(cue.id, cue.posx, cue.posy, width, height);
			document.body.style.cursor = "pointer";
			break;
		}
	}

	// reset if it doesn't hover a cue anymore
	if (!is_hovering){
		document.body.style.cursor = 'default';
		rect_hover(-1, 0, 0, 0, 0)
	}

}));

// Draws a light pink rectangle on the hovered cue
var last_hover = -1;
function rect_hover(id, posx, posy, width, height) {
	if (id == -1 && last_hover != -1) {
		draw();
		last_hover = -1;
	}
	else if (id != -1 && last_hover != id) {
		draw();

		var color = "pink";
		// draw the new one
		drawRect(posx, posy, width, height, color);
		last_hover = id;
	}
}

// triggers the zoom in on the timeline
function zoom_in() {
	zoom_scale = zoom_scale * 2;
	zoom_scale = Math.min(zoom_scale, 8);
	$("#range").attr("max", (canvas.width * zoom_scale)-canvas.width);

	if (zoom_scale != 8) $("#range").val($("#range").val() * 2)
	draw();
}

// triggers the zoom out on the timeline
function zoom_out() {
	zoom_scale = zoom_scale / 2;
	zoom_scale = Math.max(zoom_scale, 1);
	$("#range").attr("max", (canvas.width * zoom_scale)-canvas.width);

	if (zoom_scale == 1) $("#range").val(1);
	else $("#range").val($("#range").val() / 2);
	draw();
	
}


/*
** returns in an object the max delay, max note, min note, length of the event;
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
	//console.log("posx: "+Math.round(posx)+", y "+Math.round(posy)+", "+width+", "+height+", "+color);
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


/*
** Throttle calls to "callback" routine and ensure that it
** is not invoked any more often than "delay" milliseconds.
*/
function throttle(delay, callback) {
    var previousCall = new Date().getTime();
    return function() {
        var time = new Date().getTime();

        if ((time - previousCall) >= delay) {
            previousCall = time;
            callback.apply(null, arguments);
        }
    };
}
