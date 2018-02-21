const fs = require('fs');
const BrowserWindow = require('electron').remote.BrowserWindow;
const path = require('path');

var data_file = 'app/json/data.json';
var mario = JSON.parse(fs.readFileSync(data_file));


function onload_init(){
    var inner_height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    document.getElementById('top_row').style.height = inner_height/2+"px";
}

$(window).on('resize', function(e) {
    var inner_height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    document.getElementById('top_row').style.height = inner_height/2+"px";
});

function read_mario() {
    // Read every note and sends from the event
    console.log("Mario:");
    console.log(mario);
    for (let i = 0; i < mario.cue_list.length; i++) {
        setTimeout(function() {
            var msg_midi = mario.cue_list[i];
            //console.log("Note n°"+i+" = "+msg_midi.options.note);
            //illuminate(i);
            output.send(msg_midi.type, {
                note: msg_midi.options.note,
                velocity: msg_midi.options.note,
                channel: msg_midi.channel
            });
        }, mario.cue_list[i].delay);
    }
}

//console.log(mario.cue_list);

/*for (var i = 10; i < mario.cue_list.length; i++) {
    mario.cue_list[i].delay = i*1000;
}*/
// if you need to change the data file
//fs.writeFileSync("app/json/data.json", JSON.stringify(mario, null, 2));
