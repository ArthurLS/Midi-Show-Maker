var easymidi = require('easymidi');
const fs = require('fs');
//Get inputs
var inputs = easymidi.getInputs();
var outputs = easymidi.getOutputs();
var data_file = './temp.json';
var project = JSON.parse(fs.readFileSync(data_file));
//Display inputs on HTML
for(i =0;i<inputs.length;i++){
    if(inputs[i] ==  project.configuration.input){
        $("select#inputs").append( "<option value="+inputs[i]+" selected>"+inputs[i]+"</option>");
    }
    else{
        $("select#inputs").append( "<option value="+inputs[i]+">"+inputs[i]+"</option>");
    }
}
//Display outputs on HTML
for(i =0;i<outputs.length;i++){
    if(outputs[i] ==  project.configuration.output){
        $("select#outputs").append( "<option value="+outputs[i]+" selected>"+outputs[i]+"</option>") ;

    }else{
        $( "select#outputs" ).append( "<option value="+outputs[i]+">"+outputs[i]+"</option>");
    }
}
// Save configuration
function save(){
    //Get selected values
    var inP =$("select#inputs").find(":selected").text()
    var inO =$("select#outputs").find(":selected").text()
    //Add configurations on the WebStorage
    localStorage.setItem("input",inP );
    localStorage.setItem("output", inO);
    //Add configuration into temp.json
    project.configuration.input=inP;
    project.configuration.output=inO;
    fs.writeFileSync(data_file, JSON.stringify(project, null, 2));

    const remote = require('electron').remote;
    var window = remote.getCurrentWindow();
    window.close();
}
// Quit configuration
function quit(){
    console.log("quit");
    const remote = require('electron').remote;
    var window = remote.getCurrentWindow();
    window.close();
}

$(window).blur(function(){
    console.log("blur activated");
    // close window
    const remote = require('electron').remote;
    var win = remote.getCurrentWindow();
    win.close();
});