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

# Prerequisites
These prerequisites are due to our MIDI library **https://github.com/justinlatimer/node-midi/**

### OSX

* Some version of Xcode (or Command Line Tools)
* Python (for node-gyp)

### Windows

* Microsoft Visual C++ (the Express edition works fine)
* Python (for node-gyp)

### Linux

* A C++ compiler
* You must have installed and configured ALSA. Without it this module will **NOT** build.
* Install the libasound2-dev package.
* Python (for node-gyp)

# What it looks like for now!

![alt text](https://i.imgur.com/XkR5B8J.png)