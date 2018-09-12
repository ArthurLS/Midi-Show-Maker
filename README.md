# What is Midi Show Maker
Midi Show Maker is an Electron made desk app, allowing you to create a sequenced Audio/MIDI controled show (oriented for light and sound). Create different shows or scenes called *Events* with an easy-to-use interface.
Midi Show Maker offers the posibility to free you from standing beind your console during the show!

In combo with MIDI Show Viewer, you can fully preview your Audio/MIDI sequences before even setting up your gear on site.

Work in progress...

# To Use

```bash
# Clone this repository
git clone https://github.com/ArthurLS/Midi-Show-Maker
# Go into the repository
cd Midi-Show-Maker
# Install dependencies
npm install
# might have to solve dependencies install issues for 'easymidi'
# this native dependencies problems can be solved with this file (run it with cmd, here on Win)
.\node_modules\.bin\electron-rebuild.cmd
# Run the app
npm start
```
# Linux
You may encounter more issues with Linux because you will need to configure MIDI input/output (ALSA). And other tools like *apt-get install libasound2-dev*.

Each distrib may have it's issues.

Good luck!

# Structure:

## Project:
- Shell of your show, it holds all the information needed on your config + show
- Project data (.json):
```
{
  "name":"The best project ",
  "list_events":{
    "eventTEST":[]
  },
  "configuration": {
    "input": "Midi Through 14:0",
    "output": "RtMidi Input Client 130:0", 
    "keybindings": {}
  }
}
```
