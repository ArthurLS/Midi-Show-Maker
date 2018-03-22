const fs = require('fs');
const BrowserWindow = require('electron').remote.BrowserWindow;
const path = require('path');
const remote = require('electron').remote;

var data_file = './temp.json';
var project = {};

if (fs.existsSync(data_file)) {
    project = JSON.parse(fs.readFileSync(data_file));
}

var event_selected = "";
var event_obj = {};

var timeouts = [];

/*
** Called on the onload event of index.html
** Sets up the page layout
*/
function onload_init(){
    refresh_UI();
}

/*
** Function that reloads everything on the UI
** -> add your own display() function if need be!
*/
function refresh_UI() {
    // reloads the global object from the file
    project = JSON.parse(fs.readFileSync(data_file));
    event_obj = project.list_events[event_selected];
    // timeout of 50ms to wait if change is still happening from the calling function
    setTimeout(function() {
        display_cue_list();
        display_event_list();
    }, 50);
}

/*
**  Read every cue from the selected event
**  Each cue is added to the timeouts array and is played via the setTimout
*/
function read_event() {
    // Read every note and sends from the event
    let save = event_obj;
    for (let i = 0; i < save.cue_list.length; i++) {
        timeouts.push(setTimeout(function() {
            var msg_midi = save.cue_list[i];
            output.send(msg_midi.type, {
                note: msg_midi.options.param1,
                velocity: msg_midi.options.param2,
                channel: msg_midi.channel
            });
            if (remote.getGlobal('ShowActiveCue')) {
                $("#nb"+i).addClass('active');
                if (i != 0) $("#nb"+(i-1)).removeClass('active');
            }
        }, event_obj.cue_list[i].delay));
    }
}

/*
**  Show every events from the current project
*/
function display_event_list() {
    let liste = "";
    if (!isEmpty(project.list_events)) {
        $("#event_name_title").html(event_selected);
        for (event_name in project.list_events) {
            if (event_selected == event_name) {
                liste += "<button class=\"btn btn-sq-lg event-selected\" onclick=\"switch_event(\'"+event_name+"\')\">"
                    +event_name +"</button>";
            }
            else{
                liste += "<button class=\"btn btn-sq-lg event-not-selected\" onclick=\"switch_event(\'"+event_name+"\')\">"
                        +event_name +"</button>";
            }
        }
    }
    // adds the cyan "New Event" button
    liste += "<button class=\"btn btn-sq-lg event-new\" onclick=\"open_popup(\'new_event\')\"> New <br>Event </button>"
    $("#event_buttons").html(liste);
}

/*
** Show every event from the selected event in #list
*/
function display_cue_list() {
    if (event_selected != "") {
        toogle_top_left_buttons("on");
        let liste = "<ul class=\"list-group\" class='liste' id=\"liste_cues\">";
        for (let i = 0; i < event_obj.cue_list.length; i++) {
            let cue = event_obj.cue_list[i];
            if (i%2 == 0) 
                liste += "<li class=\"col-md-12 list-group-item btn-primary\"  onclick=\"open_popup("+i+")\" id=\"nb" +i+"\">"+i
                    +" Type: "+cue.type+" - Channel: "+cue.channel+" - Note: "+cue.options.param1;

            else liste += "<li class=\"col-md-12 list-group-item btn-secondary\"  onclick=\"open_popup("+i+")\" id=\"nb" +i+"\">"+i
                    +" Type: "+cue.type+" - Channel: "+cue.channel+" - Note: "+cue.options.param1;
            
            liste += " - Delay: " + cue.delay
            liste += "</li></span>"
        }
        liste += "</ul>"
        $("#list").html(liste);
    }
    else{
        toogle_top_left_buttons("off");
        $("#list").html("No event selected");
    }
}

/*
**  Switch to another event of the project by his name
**  event_selected is set to the new event and all its cues are displayed
*/
function switch_event(event_name) {
    if (event_name != "") {
        console.log("Switch to "+event_name);
        event_selected = event_name;
        event_obj = project.list_events[event_selected];
    }
    else{
        console.log("No event selected");
        event_selected = "";
        event_obj = {};
    }
    refresh_UI();
}

function toggle(a){
    let e = document.getElementById(a);
    if(e.style.display == "block")
        e.style.display = "none";
    else
        e.style.display = "block";
}

/*
**  Clear all the pending timeouts, effectively stoping the current event playing
*/
function stopPlay() {
  for (let i = 0; i < timeouts.length; i++)
    clearTimeout(timeouts[i]);
}

/*
**  Delete an event from the project and saves the project
*/
function delete_event() {
    console.log("deleting");
    for(event_name in project.list_events){
        if (event_name == event_selected) {
            console.log("event name "+event_name+", event_selected "+event_selected);
            delete project.list_events[event_selected];
        }
    }
    // save project
    fs.writeFileSync(data_file, JSON.stringify(project, null, 2));
    switch_event("");
    refresh_UI();
}



// Popup alert when the user clicks "delete event" button
// If yes, event deleted
// If no, Do nothing.
function confirmDeleteEvent() {
    if (confirm('Are you sure you want to delete the event: '+event_selected+'?', event_selected)) {
            delete_event();
        } else {
            // Do nothing!
        }
};

/* Popup alert (info)*/
function popup (message) {
    dialog.showMessageBox({
        message: message,
        buttons: ["OK"],
        title: "Popup",
        type: "info"
    });
};

// Copy-pasted function
// Speed up calls to hasOwnProperty
var hasOwnProperty = Object.prototype.hasOwnProperty;
function isEmpty(obj) {

    // null and undefined are "empty"
    if (obj == null) return true;

    // Assume if it has a length property with a non-zero value
    // that that property is correct.
    if (obj.length > 0)    return false;
    if (obj.length === 0)  return true;

    // If it isn't an object at this point
    // it is empty, but it can't be anything *but* empty
    // Is it empty?  Depends on your application.
    if (typeof obj !== "object") return true;

    // Otherwise, does it have any properties of its own?
    // Note that this doesn't handle
    // toString and valueOf enumeration bugs in IE < 9
    for (var key in obj) {
        if (hasOwnProperty.call(obj, key)) return false;
    }
    return true;
}

function toogle_top_left_buttons(on_off) {
    // OFF, button are disabled
    if (on_off == "off") {
        $(".no_event_disable").attr("disabled", true);
    }
    // ON, button are enabled
    else {
        $(".no_event_disable").attr("disabled", false);
    }
    
}