const fs = require('fs');
const BrowserWindow = require('electron').remote.BrowserWindow;
const path = require('path');

var data_file = 'app/json/project.json';
var project = JSON.parse(fs.readFileSync(data_file));

var event_selected = "mario";
var event_obj = project.list_events[event_selected];



function onload_init(){
    var inner_height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    document.getElementById('top_row').style.height = inner_height/2+"px";
    setTimeout(function() {
        display_cue_list();
    }, 250);
}

$(window).on('resize', function(e) {
    var inner_height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    document.getElementById('top_row').style.height = inner_height/2+"px";
});

function read_event() {
    // Read every note and sends from the event
    for (let i = 0; i < event_obj.cue_list.length; i++) {
        setTimeout(function() {
            var msg_midi = event_obj.cue_list[i];
            output.send(msg_midi.type, {
                note: msg_midi.options.param1,
                velocity: msg_midi.options.param2,
                channel: msg_midi.channel
            });
        }, event_obj.cue_list[i].delay);
    }
}

// add an event
//add_event(create_event(5, "test event", {}));

