// Function used when sending a note: reflects the current note on a list
function illuminate(index) {
	$("#nb"+index).addClass("active");
	if (index > 0) $("#nb"+(index - 1)).removeClass("active");
}

let liste = " <ul class=\"list-group\" class='liste' id=\"list\">";
for (let i = 0; i < event.cue_list.length; i++) {
	let cue = event.cue_list[i];
	liste += "<span class=\"col-md-12\">"
	liste += "<li onclick=\"return toggle('hidden"+i+"')\" class=\"list-group-item\" id=\"nb" + i + "\">Note: "+cue.options.note
	liste += "<span class=\"offset-md-10\"> <img onclick=\"play("+i+")\" src=\"../node_modules/octicons/build/svg/arrow-right.svg\"></img></span>"
	liste += "<p class=\"hidden\" id=\"hidden"+i+"\"> Vélocité: "+cue.options.velocity+" - Channel: "+cue.channel
	liste += " - Délai: " + cue.delay
	liste += "</p></li></span>"
}
liste += "</ul>"

$("#list").html(liste);

/*jQuery('#nb1').click(function() {
	alert("test");
});*/

function toggle(a)
{
    let e = document.getElementById(a);
    if(e.style.display == "block")
        e.style.display = "none";
    else
        e.style.display = "block";
}

function play(i) {
	var event = JSON.parse(fs.readFileSync(data_file));
	var msg_midi = event.cue_list[i];
		console.log("Note n°"+i+" = "+msg_midi.options.note);
	output.send(msg_midi.type, {
	note: msg_midi.options.note,
	velocity: msg_midi.options.note,
	channel: msg_midi.channel
});
}
