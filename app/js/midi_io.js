var easymidi = require('easymidi');

var inputs = easymidi.getInputs();
var outputs = easymidi.getOutputs();

var input;
if (inputs.length != 0) {
	console.log("Using input: "+inputs[0]);
	input = new easymidi.Input(inputs[0]);
	input.on('noteon', function (msg) {
		console.log("Message: "+msg);
	});
}
else console.log("You do not have a detected MIDI input available.");



var output;
if (outputs.length != 0) {
	console.log("Using output: "+outputs[0]);
	output = new easymidi.Output(outputs[0]);
}
else console.log("You do not have a detected MIDI input available.");



