const {Menu} = require('electron')
const {dialog} = require('electron')
const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const path = require('path')
const url = require('url')
var fs = require('fs');


var data_file = 'app/json/project.json';


const template = [
    {
        label: 'File',
        submenu: [
           /* {
                label:'New Project'
            },*/
            {
                label: 'Load Project', click(){loadFile()}
            },
            {
                label : 'Save Project', click(){saveFile()}
            } ,
            {
                type:'separator'
            },
            {
                label : 'Configurations',
                click () {createInput()}
            },
            {
                label: 'Exit'
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
                click () { require('electron').shell.openExternal('http://electron.atom.io') }
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

function createInput(){
    win = new BrowserWindow({frame:false,width: 800, height: 600, resizable: false }) //Create "pop-up"
    win.loadURL(url.format({//Load HTML
        pathname: path.join(__dirname, 'app/configInputOutput.html'),
        protocol: 'file:',
        slashes: true,
    }))

    // Ouvre le DevTools.
    //win.webContents.openDevTools()


}

//Load a projet file into project.json
function loadFile(){
    dialog.showOpenDialog({ filters: [{ name: 'json project', extensions: ['json'] }]}, function (fileNames) {
        if (fileNames === undefined) return;
        var fileName = fileNames[0];
        fs.readFile(fileName, 'utf-8', function (err, data) {

            fs.writeFile(data_file,fs.readFileSync(fileName), function (err) {
                dialog.showMessageBox({ message: "The project have been loaded!",
                    buttons: ["OK"] });
            });

        });

    });
}

//Save the project on a file
function saveFile(){
    dialog.showSaveDialog({title:"Save as"},function (fileName){
        fs.writeFile(fileName,fs.readFileSync(data_file), function (err) {
            dialog.showMessageBox({ message: "The project have been saved !",
                buttons: ["OK"] });
        });
    })
}

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)