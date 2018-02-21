
const remote = require('electron').remote;


function initii() {
	console.log("here");
	console.log(document.getElementById("field").value);
	localStorage.setItem("value_to_send", document.getElementById("field").value);
}


function init_options_win(){
	document.getElementById("result").innerHTML = localStorage.getItem("value_to_send");
}


function close_win_TR() {
	// close window
   var window = remote.getCurrentWindow();
   window.close();

}

