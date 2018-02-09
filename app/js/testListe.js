// Function used when sending a note: reflects the current note on a list
function illuminate(index) {
	$("#nb"+index).addClass("active");
	if (index > 0) $("#nb"+(index - 1)).removeClass("active");
}


let liste = " <ul class=\"list-group\" id=\"list\">";
for (let i = 0; i < event.cue_list.length; i++) {
	let cue = event.cue_list[i];
	liste += "<li class=\"list-group-item\" id=\"nb" + i + "\">Note: "+cue.options.note+" - Vélocité: "+cue.options.velocity+
		" - Channel: "+cue.channel+"</li>"
}
liste += "</ul>"

$("#list").html(liste);
