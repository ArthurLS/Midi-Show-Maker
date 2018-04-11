const fs = require('fs');
const remote = require('electron').remote;
const BrowserWindow = remote.BrowserWindow;
const path = require('path');
const ipc = require('electron').ipcRenderer;

var data_file = './temp.json';
var project = {};
if (fs.existsSync(data_file)) {
    project = JSON.parse(fs.readFileSync(data_file));
}

var event_selected = ""; //ex: "test_event"
var event_obj = {};
if (event_selected != "") {
    event_obj = project.list_events[event_selected];
}

var isPlaying = false;
var timeouts = [];
var soundsPlaying = [];
var loadedSounds = [];

var timer_of_event = new Date();

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

    if (project.list_events.hasOwnProperty(event_selected)) {
        event_obj = project.list_events[event_selected];
    }
    else {
        event_obj = {};
        event_selected = "";
    }

    // timeout of 50ms to wait if change is still happening from the calling function
    setTimeout(function() {
        display_cue_table();
        display_event_list();
    }, 50);
    toogle_enabled_buttons();
    refresh_Timeline(); // dans timeline-data
}

ipc.on('message', (event, message) => {
    if(message == 'refresh'){
        console.log("ask refresh");
        refresh_UI();
    }
})

/*
** Reads the selected event
*/
function read_event() {
    isPlaying = true;
    var timer_of_event = new Date();
    soundsPlaying = []; // Something fishy was happening...
    // Read every note and sends from the event
    let save = event_obj;
    for (let i = 0; i < save.cue_list.length; i++) {

        var timer = new Timer(function() {
            var msg_midi = save.cue_list[i];
            if (msg_midi.type != "programme" && msg_midi.type != "musicFile") {
              output.send(msg_midi.type, {
                  note: msg_midi.options.param1,
                  velocity: msg_midi.options.param2,
                  channel: msg_midi.channel
              });
            }
            else if (msg_midi.type == "musicFile") {
              //loadSound(msg_midi.options.paramText, i);
              soundsPlaying.push(playSound(msg_midi.options.paramText, msg_midi.options.param1, msg_midi.options.param2));
            }
            if (remote.getGlobal('ShowActiveCue')) {
                $("#nb"+i).addClass('active');
                if (i != 0) $("#nb"+(i-1)).removeClass('active');
            }
            if (i == save.cue_list.length -1) {
                isPlaying = false;
                $("#nb"+(i-1)).removeClass('active');
                $("#nb"+(i)).removeClass('active');

                //timeline display cues
                //display_red_line(index dans la liste)
            }
        }, event_obj.cue_list[i].delay);

        timeouts.push(timer);
    }
    toogle_enabled_buttons();
}

/*
** Pauses or resumes the current list of cues
*/
function pause_or_resume(elem) {

    console.log("pause_or_resume "+ isPlaying);
    // Resuming
    if(isPlaying == "Pause") {
        isPlaying = true;

        for (let i = 0; i < soundsPlaying.length; i++){
            soundsPlaying[i].paused = false;
        }

        for (let i = 0; i < timeouts.length; i++){
            clearTimeout(timeouts[i].resume());
        }
        $("#pause_resume_btn").html("Pause");
    }

    // Pausing
    else {
        isPlaying = "Pause";
        var nb_to_delete = 0;
        for (let i = 0; i < soundsPlaying.length; i++){
            soundsPlaying[i].paused = true;
        }
        for (let i = 0; i < timeouts.length; i++){
            clearTimeout(timeouts[i].pause());
            var time_remaining = timeouts[i].remain();
            if (time_remaining <= 0) {
                nb_to_delete++;
            }
        }
        $("#pause_resume_btn").html("Resume");
        timeouts.splice(0,nb_to_delete);
    }
    // else, play again
    console.log("pause_or_resume "+ isPlaying);
    toogle_enabled_buttons();
}

/*re-added that part for timeline*/
var previousRenderedTime = 0; //needed for timeline
function getTime() {

    if ((event_obj === '{}' || event_obj === 'undefined' || event_obj == null) || (event_obj.cue_list === '{}' || event_obj.cue_list === 'undefined' || event_obj.cue_list == null)){
        return new Date(0);
    }

    var cue_list = event_obj.cue_list;
    var cue_size = cue_list.length;

    if (cue_list[cue_size-1] === '{}' || cue_list[cue_size-1] === 'undefined' || cue_list[cue_size-1] == null){
        return new Date(0);
    }

    // When is the last cue gonna play
    var last_remaining = 0;
    if (typeof timeouts !== 'undefined' && timeouts.length > 0) {
        last_remaining = timeouts[timeouts.length-1].getupdate();
    }

    // What was the original last cue delay
    var last_delay = cue_list[cue_size-1].delay;
    var result = last_delay - last_remaining;

    if (last_remaining < 0){
        stopPlay();
    }

    if (isPlaying == "Pause") { //added for timeline
            /*console.log("WE ARE AT "+result+"ms (and we are paused)");*/
            return previousRenderedTime;
    } else if (isPlaying == false) { //TODO: to checks
        previousRenderedTime = 0;
        return 0;
    } else { //true
            /*console.log("WE ARE AT "+result+"ms");*/
        previousRenderedTime = result; //added for timeline
        return result;
    }

}

function isItPlaying() {
    return isPlaying;
}
/*end of the part added for the red line in timeline*/

/*
**  Clear all the pending timeouts, effectively stoping the current event playing
*/
function stopPlay() {
    isPlaying = false;
    for (let i = 0; i < soundsPlaying.length; i++)
        soundsPlaying[i].stop();
    for (let i = 0; i < timeouts.length; i++){
        clearTimeout(timeouts[i].stop());

    }
    timeouts = new Array();
    refresh_UI();
    $("#pause_resume_btn").html("Pause");
}

function new_event_trigger() {
    if ($("#event_name_input").is(":visible")) {
        var new_event_name = $("#event_name_input").val();
        if (new_event_name == "") {
            $('#event_name_input').attr("placeholder", "Enter A Valid Event Name");
        }
        else{
            add_event(create_event(new_event_name));
            refresh_UI();
            $("#event_name_input").attr("hidden", true);
            $("#event_name_input").val("");
            $("#event_name_input").attr("placeholder", "Event Name");
        }
    }
    else{
        $("#event_name_input").attr("hidden", false);
        $("#event_name_input").focus();
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
                liste += "<div class=\"btn btn-sq-lg event-selected\" onclick=\"switch_event(\'"+event_name+"\')\">"+event_name
                +" <br><button type=\"button\" class=\"btn btn-info no_event_disable\" onclick=\"open_popup_little('edit_event', '"+event_name+"')\">Edit</button>"+
                " </div>";
            }
            else{
                liste += "<div class=\"btn btn-sq-lg event-not-selected\" onclick=\"switch_event(\'"+event_name+"\')\">"+event_name +
                " <br><button type=\"button\" class=\"btn btn-info no_event_disable\" onclick=\"open_popup_little('edit_event', '"+event_name+"')\">Edit</button>"+
                "</div>";
            }
        }
    }

    $("#event_buttons").html(liste);
}

/*
** Show every event from the selected event in #list
*/
function display_cue_list() {
    if (event_selected != "") {
        let liste = "<ul class=\"list-group\" class='liste' id=\"liste_cues\">";
        for (let i = 0; i < event_obj.cue_list.length; i++) {
            let cue = event_obj.cue_list[i];
            if (i%2 == 0){
                liste += "<li class=\"col-md-12 list-group-item btn-primary\"  onclick=\"open_popup(\'edit_cue\', "+i+")\" id=\"nb" +i+"\">"+i
                    +" Type: "+cue.type+" - Channel: "+cue.channel+" - Note: "+cue.options.param1;
            }
            else{
                liste += "<li class=\"col-md-12 list-group-item btn-secondary\"  onclick=\"open_popup(\'edit_cue\', "+i+")\" id=\"nb" +i+"\">"+i
                +" Type: "+cue.type+" - Channel: "+cue.channel+" - Note: "+cue.options.param1;
            }
            liste += " - Delay: " + cue.delay
            liste += "</li></span>"
        }
        liste += "</ul>"
        $("#list").html(liste);
    }
    else{
        $("#list").html("No event selected");
    }
}

/*
** Show every event from the selected event in #table
*/
function display_cue_table() {
    //let column_names = ["Id", "Type", "Channel", "Delay", "Note", "Velocity"];
    let column_names = ["Name or Id", "Type", "Channel", "Delay", "Note"];
    let heads = "";
    for (var i = 0; i < column_names.length; i++) {
        heads += "<th scope=\"col\">"+column_names[i]+"</th>";
    }
    let table = "<table class=\"table\"><thead><tr style=\"cursor: default;\">"+heads+"</tr></thead>";
    table += "<tbody>";
    if (event_selected != "") {
        for (let i = 0; i < event_obj.cue_list.length; i++) {
            let cue = event_obj.cue_list[i];
            // We need to preload soundfiles why not do it here?
            if (cue.type == "musicFile") {
              if (!createjs.Sound.loadComplete(cue.options.paramText)) loadSound(cue.options.paramText, cue.options.paramText);
            }

            table += "<tr class=\"primary\" onclick=\"open_popup(\'edit_cue\', "+i+")\" id=\"nb" +i+"\">";
            if (cue.name != "") {
                table += "<td>"+cue.name+"</td>";
            }
            else{
                table += "<td>"+i+"</td>";
            }
            table += "<td>"+cue.type+"</td>"
                    +"<td>"+cue.channel+"</td>"
                    +"<td>"+cue.delay+"</td>";
                    // handles options
                    if (cue.options.param1 != undefined) {
                        table += "<td>"+cue.options.param1+"</td>"
                    }
                    else table += "<td></td>"
                    // Velocity
                    /*if (cue.options.param2 != undefined) {
                        table += "<td>"+cue.options.param2+"</td>"
                    }
                    else table += "<td></td>"*/
        }
        table += "</tbody>"
        $("#table").html(table);
    }
    else{
        toogle_enabled_buttons();
        table += "</tbody>"
        $("#table").html(table);
    }
}

/*
**  Switch to another event of the project by his name
**  event_selected is set to the new event and all its cues are displayed
*/
function switch_event(event_name) {
    if (event_name != "") {
        event_selected = event_name;
        event_obj = project.list_events[event_selected];
    }
    else{
        event_selected = "";
        event_obj = {};
    }
    refresh_UI();
}

// Popup alert when the user clicks "delete event" button
// If yes, event deleted
// If no, Do nothing.
function confirmDeleteEvent() {
    if (confirm('Are you sure you want to delete the event: '+event_selected+'?', event_selected)) {
            delete_event(event_selected);
            switch_event("");
            refresh_UI();
        } else {
            // Do nothing!
        }
};

/*
** setTimeout wrapper to handle pause, stop and resume
*/
function Timer(callback, delay) {
    var timerId, start, remaining = delay;
    this.remain = function () {
        return remaining;
    }
    this.getupdate = function () {
        return remaining - (new Date() - start);
    }

    this.pause = function() {
        window.clearTimeout(timerId);
        remaining -= new Date() - start;
    };

    this.resume = function() {
        start = new Date();
        window.clearTimeout(timerId);
        timerId = window.setTimeout(callback, remaining);
    };

    this.resume();
    this.stop = function() {
        window.clearTimeout(timerId);
    };

}


/* Popup alert (info)*/
function popup (message) {
    dialog.showMessageBox({
        message: message,
        buttons: ["OK"],
        title: "Popup",
        type: "info"
    });
};

/*
** Copy-pasted function. Returns if an object is Empty or not
*/
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

function toogle_enabled_buttons() {
    //TODO: remettre //console.log("toogle_enabled_buttons "+ isPlaying);
    // All buttons are disabled if no events are selected
    if (event_selected == "") {
        $("#add_cue_btn").attr("disabled", true);
        $("#play_event_btn").attr("disabled", true);
        $("#pause_resume_btn").attr("disabled", true);
        $("#stop_btn").attr("disabled", true);
        $("#btn_delete_event").attr("disabled", true);

    }
    // If event is selected
    else {
        console.log("Is Playing: "+isPlaying);
        $("#btn_delete_event").attr("disabled", false);
        // if the event is playing
        if (isPlaying) {
            $("#add_cue_btn").attr("disabled", false);
            $("#play_event_btn").attr("disabled", false);

            $("#pause_resume_btn").attr("disabled", false);
            $("#stop_btn").attr("disabled", false);
        }
        // if the event is not playing
        else if(isPlaying == false){
            $("#add_cue_btn").attr("disabled", false);
            $("#play_event_btn").attr("disabled", false);

            $("#pause_resume_btn").attr("disabled", true);
            $("#stop_btn").attr("disabled", true);
        }
        // if the event is paused
        else if(isPlaying == "Pause"){
            $("#add_cue_btn").attr("disabled", false);
            $("#play_event_btn").attr("disabled", false);

            //$("#pause_resume_btn").attr("disabled", false);
            //$("#stop_btn").attr("disabled", false);
        }
    }
}

function toggle(a){
    let e = document.getElementById(a);
    if(e.style.display == "block")
        e.style.display = "none";
    else
        e.style.display = "block";
}


/*function getTime() {
    var cue_list = event_obj.cue_list;
    var cue_size = cue_list.length;

    // When is the last cue gonna play
    var last_remaining = timeouts[timeouts.length-1].getupdate();

    // What was the original last cue delay
    var last_delay = cue_list[cue_size-1].delay;
    var result = last_delay - last_remaining;
    console.log("WE ARE AT "+result+"ms");
    return result;
}
*/
