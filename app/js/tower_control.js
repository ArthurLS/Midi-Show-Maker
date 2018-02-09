const fs = require('fs');

// Partition de mario (notre architecture)
// Fichier créé avec event_builder.js
var data_file = 'app/json/data.json';
var event = JSON.parse(fs.readFileSync(data_file));

// Read every note and sends from the event
for (let i = 0; i < event.cue_list.length; i++) {
    setTimeout(function() {
    	var msg_midi = event.cue_list[i];
        console.log("Note n°"+i+" = "+msg_midi.options.note);
    	output.send(msg_midi.type, {
			note: msg_midi.options.note,
			velocity: msg_midi.options.note,
			channel: msg_midi.channel
		});
    }, event.cue_list[i].delay);
};
console.log(event.cue_list);

// if you need to change the data file
//fs.writeFileSync("app/json/data.json", JSON.stringify(event, null, 2));