function display_cue_list() {
	console.log("Display cue list");
	var mario = JSON.parse(fs.readFileSync(data_file));
	let liste = "<ul class=\"list-group\" class='liste' id=\"list\">";
	for (let i = 0; i < mario.cue_list.length; i++) {
		let cue = mario.cue_list[i];
		liste += "<span class=\"col-md-12\" onclick=\"open_cue_options("+i+")\">"
		liste += "<li class=\"list-group-item\" id=\"nb" +i+"\">"+(i+1)+" Note: "+cue.options.note
		liste += " - Délai: " + cue.delay
		liste += "</li></span>"
	}
	liste += "</ul>"
	$("#list").html(liste);
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
