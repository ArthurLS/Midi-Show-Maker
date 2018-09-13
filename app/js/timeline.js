/*timeline.js*/
var canvas = document.getElementById("time_canvas");
var ctx = canvas.getContext('2d');
var zoom_scale = 1;

// Handles the containers placement according to the user window (phone, tablet, PC)
window.addEventListener('resize', function(){
	resize();
});

var last_canvas_width = 0;
var last_canvas_height = 0;
var last_event = "";

function resize() {
	var check_wave = $("#wave_checkbox").prop('checked');
	var check_squares = $("#squares_checkbox").prop('checked');

	var hasMusicFile = false;
	var app_width = $("#app_container").width();
	$("#main_container").width(app_width - $("#nav").width() - 30);

	var col_width = document.getElementById("canvas_container").offsetWidth;
	var row_height = document.getElementById("timeline_container").offsetHeight;
	destroy_p();
	var is_event_change = (last_event != event_selected);
	last_event = event_selected;

    $("#top_side_nav").height($("#top_container").height()+7);
    $("#bot_side_nav").height(row_height+10);

	var musicFile = "";
	for (var i = 0; i < event_obj.cue_list.length; i++) {
		if(event_obj.cue_list[i].type == "musicFile") {
			hasMusicFile = true;
			musicFile = event_obj.cue_list[i]["options"].paramText;
			break;
		}
	}
	console.log("Has music file: "+hasMusicFile);
	if (hasMusicFile){
		if(check_wave && check_squares) {
			resize_peaks((row_height/2)-10, col_width, musicFile);
			canvas.height = row_height/2;
		}
		else if (check_wave && !check_squares) {
			resize_peaks(row_height, col_width, musicFile);
			canvas.height = 0;
		}
		else canvas.height = (row_height)-20;
	}
	else {
		canvas.height = (row_height)-20;
		$("#wave_checkbox").prop('checked', false);
	}
	canvas.width = col_width;
	document.getElementById("range").max = col_width;
	draw();
}

function destroy_p() {
	if (p != null) {
		p.destroy();
		p.destroy();
		p = null;
	}
}

function resize_peaks(p_height, p_width, musicFile) {
	console.log("peaks");
	
	destroy_p();

	$("#peaks-container").html('<audio><source src="'+musicFile+'" type="audio/wav"</audio>');
	p = Peaks.init({
	    container: document.querySelector('#peaks-container'),
	    mediaElement: document.querySelector('audio'),
	    audioContext: myAudioContext,
	    // default height of the waveform canvases in pixels
	    height: p_height,

	    // Array of zoom levels in samples per pixel (big >> small)
	    //zoomLevels: zoom,
	    zoomLevels: [Math.round(p_width/8), Math.round(p_width/4), Math.round(p_width/2)],

	    // Bind keyboard controls
	    keyboard: true,

	    // Colour of the play head
	    playheadColor: 'rgba(255, 0, 0, 1)',

		// Show current time next to the play head
		// (zoom view only)
		showPlayheadTime: true,

		// Colour for the zoomed in waveform
		zoomWaveformColor: 'rgba(0, 225, 128, 0.8)',
	    
	});
	p.on('peaks.ready', function() {
	    $('.overview-container').remove();
	    
	});
	p.zoom.setZoom(3);
/*	console.log(p);
	console.log(p.waveform);
	for(var key in p.waveform){
		console.log(key);
		
		//console.log(p.waveform[key]);
	}
	console.log("WHAT THE FUCK");
	console.log("WHAT THE FUCK");*/
	//console.log(Object.prototype.getRemoteWaveformData(p.waveform));
	//console.log(p.waveform.waveformZoomView.pixelLength);
}

var rekt_list = [];
var x_ratio = 0;
var y_ratio = 0;

function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	if (event_obj != null) {
		rekt_list = [];
		var info = get_info_params();
		var cue_l = event_obj["cue_list"];
		// where the relative posx = 0 is
		var origin_x = $("#range").val();

		// full canvas width -1% for the final cue
		x_ratio = zoom_scale * ((canvas.width - canvas.width * 0.01) / info.max_delay);
		// full canvas height -10% for the special cues
		y_ratio = (canvas.height - canvas.height * 0.1)  / (info.max_note - info.min_note+1);

		// height & width of a rectangle
		var rect_height = (y_ratio / 2) * 1.3;
		var rect_width = 8 * zoom_scale;

		for (var i = 0; i < cue_l.length; i++) {
			var cue = cue_l[i];
			// definitive posX positioning
			var posx = (cue.delay*x_ratio) - origin_x;
			// Do the maths on only the drawable ones (quicker)
			if (posx >= 0 && (posx+rect_width) <= canvas.width) {
				
				// basic Y positioning
				var posy =  (y_ratio * (cue_l[i]["options"].param1 - info.min_note));
				// since the (0,0) pos is top left, we flip up side down
				posy = posy + (2 * (((canvas.height / 2)-10) - posy));

				// for special cues, we put them up top (no pitch)
				if (cue.type != "noteoff" && cue.type != "noteon" && cue.type != 'cc' && cue.type != 'programme') posy = canvas.height * 0.05;

				// Changes the color
				var color = "";
				(cue.type == "noteon") ? (color = "green") : ((cue.type == "noteoff") ? (color = "red") : (color = "white"));
				drawRect(posx, posy, rect_width, rect_height, color);

				// list the drawn cues
				rekt_list.push({"id": i, "posx": posx, "posy": posy});

				// small scale -> relative ratio bigger font
				// big scale -> relative ratio smaller font
				var font_size = rect_height * 1.8;
				// letter: if note then pitch, else type
				var info_select = $('#info_select').find(":selected").val();
				var char = "";
				if (info_select == "pitch") {
					if (cue.type == "noteoff" || cue.type == "noteon" || cue.type == 'cc' || cue.type == 'programme') char = cue["options"].param1;
				}
				else if (info_select == "type") char = cue.type;
				else if (info_select == "name") char = cue.name;
				else char = i;
				
				
				
				// Always draws the letter in the canvas
				if (posy - rect_height*2 < 0) drawChar(posx, posy + 2.5*rect_height, char, font_size, "white");
				else drawChar(posx, posy - 0.5*rect_height, char, font_size, "white");
			}
		}
		var time_ratio = (info.max_delay / (canvas.width - canvas.width * 0.01)) / zoom_scale;

		var t0 = origin_x * time_ratio;
		var t4 = origin_x * time_ratio + (canvas.width - canvas.width * 0.01)* time_ratio;
		var t1 = t0 + (t4 - t0)/4;
		var t2 = t0 + (t4 - t0)/2;
		var t3 = t0 + 3*((t4 - t0)/4);
		$("#time_label_0").html(Math.round(t0));
		$("#time_label_1").html(Math.round(t1));
		$("#time_label_2").html(Math.round(t2));
		$("#time_label_3").html(Math.round(t3));
		$("#time_label_4").html(Math.round(t4));
		
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
$("#time_canvas").mousemove(throttle(85, function(e) {
	var rect_height = (y_ratio / 2) * 1.3;
	var rect_width = 8 * zoom_scale;
	var is_hovering = false;
	var offx = e.offsetX;
	var offy = e.offsetY;

	draw();

	for (var i = 0; i < rekt_list.length; i++) {
		var cue = rekt_list[i]; 
		//matches the mouse pos with the cue
		if (offx > cue.posx && offx < cue.posx + rect_width && offy > cue.posy && offy < cue.posy+rect_height) {
			is_hovering = true;
			draw_rect_hover(cue.id, cue.posx, cue.posy, rect_width, rect_height);
			document.body.style.cursor = "pointer";
			break;
		}
	}

	// reset if it doesn't hover a cue anymore
	if (!is_hovering){
		document.body.style.cursor = 'default';
		draw_rect_hover(-1, 0, 0, 0, 0)
	}

	if (p != null){
		var info = get_info_params();
		var time_ratio = (info.max_delay / (canvas.width - canvas.width * 0.01)) / zoom_scale;
		p.player.seek((offx*time_ratio)/1000);
		//console.log("Seek = "+ (offx*time_ratio)/1000);
	}

	draw_line(offx, 0, offx, canvas.height, "red");
}));

// Draws a light pink rectangle on the hovered cue
var last_hover = -1;
function draw_rect_hover(id, posx, posy, width, height) {
	if (id == -1 && last_hover != -1) last_hover = -1;
	else if (id != -1) {

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

	if (zoom_scale != 8) $("#range").val($("#range").val() * 2);
	draw();

	p.zoom.zoomIn();
	console.log(p.zoom.getZoom());
}

// triggers the zoom out on the timeline
function zoom_out() {
	zoom_scale = zoom_scale / 2;
	zoom_scale = Math.max(zoom_scale, 1);
	$("#range").attr("max", (canvas.width * zoom_scale)-canvas.width);

	if (zoom_scale == 1) $("#range").val(1);
	else $("#range").val($("#range").val() / 2);
	draw();
	p.zoom.zoomOut()
	console.log(p.zoom.getZoom());
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
* Draws a char on the canvas
*/
function drawChar(posx, posy, letter, height, color) {
    ctx.fillStyle = color;
    ctx.font = height + "px serif";
    ctx.beginPath();
    ctx.fillText(letter, posx, posy);

    ctx.fill();
};
/*
* Draws a line on the canvas
*/
function draw_line(from_x, form_y, to_x, to_y, color) {
	ctx.strokeStyle = color;
	ctx.beginPath();
	ctx.moveTo(from_x, form_y);
	ctx.lineTo(to_x,to_y);
	ctx.stroke();
}

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
