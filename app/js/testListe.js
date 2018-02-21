const BrowserWindow = require('electron').remote.BrowserWindow;
const path = require('path');


function open_cue_options(id) {
	console.log("ola que tal");
	const modalPath = path.join('file://', __dirname, './sections/cue_options.html');
	let win = new BrowserWindow({ frame: false });
	win.on('close', function () { win = null });
	win.loadURL(modalPath);
	win.show();
};


// Function used when sending a note: reflects the current note on a list
function illuminate(index) {
	$("#nb"+index).addClass("active");
	if (index > 0) $("#nb"+(index - 1)).removeClass("active");
}

function play_mario() {
	console.log("Mario playing");
	let liste = "<ul class=\"list-group\" class='liste' id=\"list\">";
	for (let i = 0; i < mario.cue_list.length; i++) {
		let cue = mario.cue_list[i];
		liste += "<span class=\"col-md-12\">"
		liste += "<li class=\"list-group-item\" id=\"nb" +i+"\">"+(i+1)+" Note: "+cue.options.note + "  <input type=\"number\" onchange=\"onchange_input_delay("+i+", this.value)\" value=\""+cue.delay+"\" style=\"width: 70px;\">"
		liste += " - Délai: " + cue.delay
		liste += "</p></li></span>"
	}
	liste += "</ul>"
	$("#list").html(liste);
	read_mario(mario);
}

function onchange_input_delay(index, value) {
	update_cue_delay(mario.cue_list, index, Number(value));
	fs.writeFileSync("app/json/data.json", JSON.stringify(mario, null, 2));
}


function toggle(a)
{
    let e = document.getElementById(a);
    if(e.style.display == "block")
        e.style.display = "none";
    else
        e.style.display = "block";
}

function play(i) {
	var msg_midi = mario.cue_list[i];
	//console.log("Note n°"+i+" = "+msg_midi.options.note);
	output.send(msg_midi.type, {
	note: msg_midi.options.note,
	velocity: msg_midi.options.note,
	channel: msg_midi.channel
});
}
