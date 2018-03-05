const fs = require('fs');
const BrowserWindow = require('electron').remote.BrowserWindow;
const path = require('path');

var data_file = 'app/json/project.json';
var project = JSON.parse(fs.readFileSync(data_file));

var event_selected = "test_event";
var event_obj = project.list_events[event_selected];

function onload_init(){
    var inner_height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0); 
    var inner_width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    document.getElementById('top_container').style.maxWidth = (inner_width-50)+"px";
    document.getElementById('bot_container').style.maxWidth = (inner_width-50)+"px";
    document.getElementById('top_row').style.height = inner_height/2+"px";
    setTimeout(function() {
        display_cue_list();
        display_event_list();
    }, 250);
}

$(window).on('resize', function(e) {    
    var inner_height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0); 
    var inner_width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    document.getElementById('top_container').style.maxWidth = (inner_width-50)+"px";
    document.getElementById('bot_container').style.maxWidth = (inner_width-50)+"px";
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

function play(i) {
    var msg_midi = event_obj.cue_list[i];
    output.send(msg_midi.type, {
        note: msg_midi.options.note,
        velocity: msg_midi.options.note,
        channel: msg_midi.channel
    });
}

function display_event_list() {
    let liste = "";
    for (event_o in project.list_events) {
        liste += "<button class=\"btn btn-sq-lg btn-primary\" onclick=\"switch_event(\'"+project.list_events[event_o].name+"\')\">"+
                "Event <br>Button<br>"+project.list_events[event_o].name +"</button>&nbsp;";
    }
    $("#event_buttons").html(liste);
}

function display_cue_list() {
    project = JSON.parse(fs.readFileSync(data_file));
    event_obj = project.list_events[event_selected];

    let liste = "<ul class=\"list-group\" class='liste' id=\"list\">";
    for (let i = 0; i < event_obj.cue_list.length; i++) {
        let cue = event_obj.cue_list[i];
        liste += "<span class=\"col-md-12\" onclick=\"open_cue_options("+i+")\">"
        liste += "<li class=\"list-group-item\" id=\"nb" +i+"\">"+i+" Type: "+cue.type+" - Channel: "+cue.channel+" - Note: "+cue.options.param1
        liste += " - Delay: " + cue.delay
        liste += "</li></span>"
    }
    liste += "</ul>"
    $("#list").html(liste);
}

function switch_event(event_name) {
    console.log("Switch to "+event_name);
    event_selected = event_name;
    event_obj = project.list_events[event_selected];
    display_cue_list();
}

function toggle(a){
    let e = document.getElementById(a);
    if(e.style.display == "block")
        e.style.display = "none";
    else
        e.style.display = "block";
}
