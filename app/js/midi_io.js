var easymidi = require('easymidi');

var inputs = easymidi.getInputs();
var outputs = easymidi.getOutputs();

var input = {};
var output = {};

function init_midi_io() {
	project = JSON.parse(fs.readFileSync(data_file));
	var midi_in = project.configuration.input;
	var midi_out = project.configuration.output;

	// handling outputs
	if (midi_out != "") {
		for (var i = 0; i < outputs.length; i++) {
			if(outputs[i] == midi_out){
				new_midi_output(midi_out);
				break;
			}
		}
		if (isEmpty(output)) {
			if (outputs.length != 0) {
				new_midi_output(outputs[0])
			}
			else {
				output = {};
				project.configuration.output="";
			    fs.writeFileSync(data_file, JSON.stringify(project, null, 2));
			}
		}
	}
	else{
		if (outputs.length != 0) {
			new_midi_output(outputs[0])
		}
		else {
			output = {};
			project.configuration.output="";
		    fs.writeFileSync(data_file, JSON.stringify(project, null, 2));
		}
	}

	// handling inputs
	if (midi_in != "") {
		for (var i = 0; i < inputs.length; i++) {
			if(inputs[i] == midi_in){
				new_midi_input(midi_in);
				break;
			}
		}
		if (isEmpty(input)) {
			if (inputs.length != 0) {
				new_midi_input(inputs[0])
			}
			else {
				input = {};
				project.configuration.input="";
		    	fs.writeFileSync(data_file, JSON.stringify(project, null, 2));
			}
		}
	}
	else{
		console.log(inputs);
		console.log(inputs.length);
		if (inputs.length != 0) {
			new_midi_input(inputs[0])
		}
		else {
			input = {};
			project.configuration.input="";
		    fs.writeFileSync(data_file, JSON.stringify(project, null, 2));
		}
	}
	console.log("midi io finished");
}



function new_midi_input(input_name) {
	if (!isEmpty(input)) {
		input.close();
	}
	input = new easymidi.Input(input_name);
	input.on('noteon', function (msg) {
		console.log(msg);
		output.send('noteon', {
			note: msg.note + 42,
			velocity: 127,
			channel: 3
		});
	});
	project.configuration.input=input_name;
    fs.writeFileSync(data_file, JSON.stringify(project, null, 2));
}

function new_midi_output(output_name) {
	if (!isEmpty(output)) {
		output.close();
	}
	output = new easymidi.Output(output_name);

	project.configuration.output=output_name;
    fs.writeFileSync(data_file, JSON.stringify(project, null, 2));
}
