const fs = require('fs');
const remote = require('electron').remote;

var data_file = 'app/json/data.json';
var mario = JSON.parse(fs.readFileSync(data_file));

let cue_id = null;

function init_window(){
	console.log(mario);
	cue_id = localStorage.getItem("cue_selected")
	$("#delay").val(mario.cue_list[Number(cue_id)].delay);
	console.log("Cue à l'index: "+cue_id);
	document.getElementById("result").innerHTML = cue_id;
}

function close_window() {
	// close window
	var win = remote.getCurrentWindow();
    win.close();
}

function save_delay() {
	console.log("Delay saved: "+Number($("#delay").val())+ " of cue n°"+cue_id);
	update_cue_delay(mario.cue_list, cue_id, Number($("#delay").val()));
	fs.writeFileSync("app/json/data.json", JSON.stringify(mario, null, 2));
}


$(window).blur(function(){
  console.log("blur activated");
  	// close window
	var win = remote.getCurrentWindow();
    win.close();
});
