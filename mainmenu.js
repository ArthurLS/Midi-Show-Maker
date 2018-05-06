const {Menu} = require('electron')
const {dialog} = require('electron')
const electron = require('electron')

const app = electron.app
const BrowserWindow = electron.BrowserWindow
const path = require('path')
const url = require('url')
var fs = require('fs')

var data_file = './temp.json';

var basic_file = {"name": "Unnamed Project",  "list_events": {},  "configuration": {"input": "", "output": "", "keybindings": {}}};

if (!fs.existsSync(data_file)) {
    fs.writeFileSync(data_file, JSON.stringify(basic_file, null, 2));
}
var filesaved;

const template = [
    {
        label: 'File',
        submenu: [
            {
                label:'New', click(){newFile()}
            },
            {
                label: 'Load', click (item, focusedWindow) {
                    loadFile(send_message, focusedWindow);
                }
            },
            {
                label : 'Save', click(){saveFile()}
            } ,
            {
                label : 'Save As', click(){saveAsFile()}
            } ,
            {
                type:'separator'
            },
            {
                label : 'Configurations', click (item, focusedWindow) {
                    createInput(focusedWindow);
                }
            },
            {
                role: 'quit'
            },

        ]
    },
    {
        label: 'Edit',
        submenu: [
            {
                role: 'undo'
            },
            {
                role: 'redo'
            },
            {
                type: 'separator'
            },
            {
                role: 'cut'
            },
            {
                role: 'copy'
            },
            {
                role: 'paste'
            },
            {
                role: 'pasteandmatchstyle'
            },
            {
                role: 'delete'
            },
            {
                role: 'selectall'
            }
        ]
    },
    {
        label: 'View',
        submenu: [
            {
                label: 'Display Active Cue',
                type: 'checkbox',
                checked: false,
                click (item, focusedWindow) {
                    global.ShowActiveCue = item.checked;
                }
            },
            {
                label: 'Reload',
                accelerator: 'CmdOrCtrl+R',
                click (item, focusedWindow) {
                    if (focusedWindow) focusedWindow.reload()
                }
            },
            {
                label: 'Toggle Developer Tools',
                accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
                click (item, focusedWindow) {
                    if (focusedWindow) focusedWindow.webContents.toggleDevTools()
                }
            },
            {
                type: 'separator'
            },
            {
                role: 'resetzoom'
            },
            {
                role: 'zoomin'
            },
            {
                role: 'zoomout'
            },
            {
                type: 'separator'
            },
            {
                role: 'togglefullscreen'
            }
        ]
    },
    {
        role: 'window',
        submenu: [
            {
                role: 'minimize'
            },
            {
                role: 'close'
            }
        ]
    },
    {
        role: 'help',
        submenu: [
            {
                label: 'Learn More',
                click () { require('electron').shell.openExternal('http://jewlofthelotus.github.io/Surviving-Support/images/yoda-rtfm.png') }
            }
        ]
    }
]

if (process.platform === 'darwin') {
    const name = app.getName()
    template.unshift({
        label: name,
        submenu: [
            {
                role: 'about'
            },
            {
                type: 'separator'
            },
            {
                role: 'services',
                submenu: []
            },
            {
                type: 'separator'
            },
            {
                role: 'hide'
            },
            {
                role: 'hideothers'
            },
            {
                role: 'unhide'
            },
            {
                type: 'separator'
            },
            {
                role: 'quit'
            }
        ]
    })
    // Edit menu.
    template[1].submenu.push(
        {
            type: 'separator'
        },
        {
            label: 'Speech',
            submenu: [
                {
                    role: 'startspeaking'
                },
                {
                    role: 'stopspeaking'
                }
            ]
        }
    )
    // Window menu.
    template[3].submenu = [
        {
            label: 'Close',
            accelerator: 'CmdOrCtrl+W',
            role: 'close'
        },
        {
            label: 'Minimize',
            accelerator: 'CmdOrCtrl+M',
            role: 'minimize'
        },
        {
            label: 'Zoom',
            role: 'zoom'
        },
        {
            type: 'separator'
        },
        {
            label: 'Bring All to Front',
            role: 'front'
        }
    ]
}

//Create a new file project
function newFile(){
    dialog.showSaveDialog({title:"Create new file",filters: [{ name: '.json', extensions: ['json'] }]},function (fileName)
    {
        if(fileName == null){return}
        filesaved=fileName;
        fs.writeFile(fileName,fs.readFileSync("app/json/default.json"), function (err) {
            dialog.showMessageBox({ message: "The new project is now created !",
                buttons: ["OK"] });
        });
    })
}

function createInput(focusedWindow){
    let win_TR = new BrowserWindow({frame: false, width: 800, height: 600, resizable: false, modal: true, show: false});
    var modalPath = path.join('file://', __dirname, 'app/sections/configInputOutput.html');

    win_TR.loadURL(modalPath);

    win_TR.on('closed', () => {
        send_message(focusedWindow, "input changed");
        win_TR = null;
    })

    win_TR.on('ready-to-show', () => {
        win_TR.show()
    })
}

// sends a message throught ipc
function send_message(focusedWindow, message) {
    focusedWindow.webContents.send('message', message);
}

//Load a projet file into temp.json
function loadFile(callback, focusedWindow){
    dialog.showOpenDialog({ filters: [{ name: '.json', extensions: ['json'] }]}, function (fileNames) {
        if (fileNames === undefined) return;
        var fileName = fileNames[0];
        fs.readFile(fileName, 'utf-8', function (err, data) {
            fs.writeFile(data_file,fs.readFileSync(fileName), function (err) {
                dialog.showMessageBox({ message: "The project have been loaded!", buttons: ["OK"] });
                callback(focusedWindow, "refresh");
            });

        });
    });
}

//Save As
function saveAsFile(){
    dialog.showSaveDialog({title:"Save as",filters: [{ name: '.json', extensions: ['json'] }]},function (fileName)
    {
        if(fileName == null){return}
        filesaved=fileName;
        fs.writeFile(fileName,fs.readFileSync(data_file), function (err) {
            dialog.showMessageBox({ message: "The project have been saved !",
                buttons: ["OK"] });
        });
    })
}

//Save file
function saveFile(){
    if(filesaved == null){
        saveAsFile();
    }
    else{
        fs.writeFile(filesaved,fs.readFileSync(data_file), function (err) {
            dialog.showMessageBox({ message: "The project have been saved !",
                buttons: ["OK"] });
        });
    }
}


const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)
