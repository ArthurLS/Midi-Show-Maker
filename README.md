# What is MIDIonysos
MIDIonysos is an Electron Desktop application allowing you to create a sequenced MIDI controled show (oriented for light and sound).
MIDIonysos offers the posibility to free you from standing beind your console during the show!

In combo with MIDI Show Viewer, you can fully preview your MIDI sequences before even setting up your gear.

Work in progress...

# To Use

```bash
# Clone this repository
git clone https://github.com/ArthurLS/MIDIonysos
# Go into the repository
cd MIDIonysos
# Install dependencies
npm install
# might have to solve dependencies install issues for 'easymidi'
# this native dependencies problems can be solved with this file (run it with cmd, here on Win)
./node_modules/.bin/electron-rebuild.cmd
# Run the app
npm start
```

# Structure:

## Project:
- Shell of your show, it holds all the information needed on your config + show
- Project data (.json):
```
{
  "name":"The best project ",
  "list_events":{
    "eventTEST":"EventTEST"
  },
  "configuration": {
    "input": "Midi Through 14:0",
    "output": "RtMidi Input Client 130:0", 
    "keybindings": {}
  }
}
```

## Event:
- Holds the info for one "Event"
- An Event is a list of chained MIDI signals called "Cue"
- Event data:

```
"eventTest": {
  "id": 2,
  "name": eventTest,
  "cue_list": [Cue, Cue, ...],
  "options": {}
}

```

## Cue:
- Holds the info to send a MIDI signal, call here Cue
- Cue data:

```
{
  "name": "Red Light OFF",
  "type": "noteoff",
  "channel": 0,
  "delay": 550,   <-- In ms
  "options": {
    "param1": 11, <-- Pitch (0-127)
    "param2": 0   <-- Velocity (0-127)
  }
}
```
