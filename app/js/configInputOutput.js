var easymidi = require('easymidi');
const fs = require('fs');
const remote = require('electron').remote;

//Get inputs
var inputs = easymidi.getInputs();
console.log("inputs");
console.log(inputs);
var outputs = easymidi.getOutputs();
var data_file = './temp.json';
var project = JSON.parse(fs.readFileSync(data_file));
//Display inputs on HTML
for(var i = 0; i<inputs.length; i++){
    if(inputs[i] == project.configuration.input){
        $("#inputs").append( '<option value=\"'+inputs[i]+'\" selected>'+inputs[i]+'</option>');
    }
    else{
        $("#inputs").append( "<option value=\""+inputs[i]+"\">"+inputs[i]+"</option>");
    }
}
//Display outputs on HTML
for(var i = 0; i<outputs.length; i++){
    if(outputs[i] ==  project.configuration.output){
        
        $("#outputs").append( "<option value=\""+outputs[i]+"\" selected>"+outputs[i]+"</option>") ;
    }
    else{
        $("#outputs").append( "<option value=\""+outputs[i]+"\">"+outputs[i]+"</option>");
    }
}
// Save configuration
function save(){
    //Get selected values
    var inP =$("#inputs").find(":selected").val();
    var inO =$("#outputs").find(":selected").val();
    //Add configuration into temp.json
    project.configuration.input=inP;
    project.configuration.output=inO;
    
    fs.writeFileSync(data_file, JSON.stringify(project, null, 2));

    close_window();
}

// Quit configuration
function quit(){
    close_window();
}

$(window).blur(function(){
    close_window();
});

/*
** Close the popup window
*/
function close_window() {
    // close window
    var win = remote.getCurrentWindow();
    win.close();
}
