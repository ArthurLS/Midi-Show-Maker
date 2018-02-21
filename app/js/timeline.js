// const BrowserWindow = require('electron').remote.BrowserWindow;
// const path = require('path');

var data_file = 'app/json/data.json';
var mario = JSON.parse(fs.readFileSync(data_file));


function addCanvas(){
	console.log("on m'appel");
	let canvas = "<canvas id=\"myCanvas\" width:\"";
			canvas += $(window).height();
			canvas += "\" height:\""
			canvas += $(window).width();
			canvas += "\" class=\"img-responsive\" style=\"border:1px solid lightblue;\">Your browser does not support the HTML5 canvas tag.</canvas>"

	$("#canvas").html(canvas);
}
