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

// mario world -> delay between notes is not correct
var notes = [{"note":"Mi4","time":0},{"note":"Mi4","time":250},{"note":"Mi4","time":500},{"note":"Do4","time":750},{"note":"Mi4","time":1000},{"note":"Sol4","time":1250},{"note":"Sol3","time":1500},{"note":"Do4","time":1750},{"note":"Sol3","time":2000},{"note":"Mi3","time":2250},{"note":"La3","time":2500},{"note":"Si3","time":2750},{"note":"La3#","time":3000},{"note":"La3","time":3250},{"note":"Mi4","time":3500},{"note":"Sol4","time":3750},{"note":"La4","time":4000},{"note":"Fa4","time":4250},{"note":"Sol4","time":4500},{"note":"Mi4","time":4750},{"note":"Do4","time":5000},{"note":"Re4","time":5250},{"note":"Si3","time":5500},{"note":"Do4","time":5750},{"note":"Sol3","time":6000},{"note":"Mi3","time":6250},{"note":"La3","time":6500},{"note":"Si3","time":6750},{"note":"La3#","time":7000},{"note":"La3","time":7250},{"note":"Mi4","time":7500},{"note":"Sol4","time":7750},{"note":"La4","time":8000},{"note":"Fa4","time":8250},{"note":"Sol4","time":8500},{"note":"Mi4","time":8750},{"note":"Do4","time":9000},{"note":"Re4","time":9250},{"note":"Si3","time":9500},{"note":"Do4","time":9750},{"note":"Sol4","time":10000},{"note":"Fa4#","time":10250},{"note":"Fa4","time":10500},{"note":"Re4#","time":10750},{"note":"Mi4","time":11000},{"note":"Sol3#","time":11250},{"note":"La3","time":11500},{"note":"Do4","time":11750},{"note":"La3","time":12000},{"note":"Do4","time":12250},{"note":"Re4","time":12500},{"note":"Sol4","time":12750},{"note":"Fa4#","time":13000},{"note":"Fa4","time":13250},{"note":"Re4#","time":13500},{"note":"Mi4","time":13750},{"note":"Do5","time":14000},{"note":"Do5","time":14250},{"note":"Do5","time":14500},{"note":"Sol4","time":14750},{"note":"Fa4#","time":15000},{"note":"Fa4","time":15250},{"note":"Re4#","time":15500},{"note":"Mi4","time":15750},{"note":"Sol3#","time":16000},{"note":"La3","time":16250},{"note":"Do4","time":16500},{"note":"La3","time":16750},{"note":"Do4","time":17000},{"note":"Re4","time":17250},{"note":"Re4#","time":17500},{"note":"Re4","time":17750},{"note":"Do4","time":18000}];

// correspondance notes
var tab = { "Do3": {"en": 'C3', "midi": 36, "hz": 130.813},
			"Do3#": {"en": 'C3#', "midi": 37, "hz": 138.591},
			"Re3": {"en": 'D3', "midi": 38, "hz": 146.832},
			"Mi3": {"en": 'E3', "midi": 40, "hz": 164.814},
			"Fa3": {"en": 'F3', "midi": 41, "hz": 174.614},
			"Sol3": {"en":'G3', "midi": 43, "hz": 195.998},			
			"Sol3#": {"en":'G3#', "midi": 44, "hz": 207.652},
			"La3": {"en": 'A3', "midi": 45, "hz": 220},
			"La3#": {"en": 'A3#', "midi": 46, "hz": 233.082},
			"Si3": {"en": 'B3', "midi": 47, "hz": 246.942},
			"Do4": {"en": 'C4', "midi": 48, "hz": 261.626},
			"Do4#": {"en": 'C4#', "midi": 49, "hz": 277.183},
			"Re4": {"en": 'D4', "midi": 50, "hz": 293.665},			
			"Re4#": {"en": 'D4#', "midi": 51, "hz": 311.127},
			"Mi4": {"en": 'E4', "midi": 52, "hz": 329.628},
			"Fa4": {"en": 'F4', "midi": 53, "hz": 349.228},
			"Fa4#": {"en": 'F4#', "midi": 54, "hz": 369.994},
			"Sol4": {"en":'G4', "midi": 55, "hz": 391.995},
			"La4": {"en": 'A4', "midi": 57, "hz": 440},
			"Si4": {"en": 'B4', "midi": 59, "hz": 493.883},
			"Do5": {"en": 'C5', "midi": 60, "hz": 523.251}}

for (let i = 0; i < notes.length; i++) {
    setTimeout(function() {
        console.log(i);
    	output.send('noteon', {
			note: tab[notes[i].note].midi,
			velocity: 127,
			channel: 3
		});
    }, notes[i].time);
};