const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')
//const pm2 = require('pm2');

const ipc = electron.ipcMain;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

global.ShowActiveCue = false;

function createWindow () {
/*
    pm2.connect(function(err) { //start up pm2 god
        if (err) {
            console.error(err);
            process.exit(2);
        }

        var bin_path = './node_modules';
        pm2.start({
            script    : bin_path,         // path to binary
            exec_mode : 'fork',
            cwd: './working_dir/'
            }, function(err, apps) {
            pm2.disconnect();   // Disconnect from PM2
            if (err) throw err
        });
    });
*/



    console.log("Ready to Show0!");
    // Create the browser window.
    mainWindow = new BrowserWindow({show: false, backgroundColor: "#36393f"})
    //fixPath();
    mainWindow.maximize();

    mainWindow.on('ready-to-show', () => {
        console.log("Ready to Show1!");
        mainWindow.show();
        console.log("Ready to Show2!");
    })
    // and load the index.html of the app.
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'app/index.html'),
        protocol: 'file:',
        slashes: true
    }))

    // Open the DevTools. - Tidying up a bit...
    mainWindow.webContents.openDevTools()


    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
    })


}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', function () {
// On OS X it's common to re-create a window in the app when the
// dock icon is clicked and there are no other windows open.
if (mainWindow === null) {
    createWindow()
}
})

process.on('uncaughtException', function (err) {
    console.log("Error!");
    console.log(err);
})


// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

require('./mainmenu') //Load file to change menu-bar
