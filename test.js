const electron = require("electron");
const url = require("url");
const path = require("path");

const {app, BrowserWindow, Menu, ipcMain} = electron;

let mainWindow;

app.on('ready', function(){
    // Create new window
    mainWindow = new BrowserWindow({})
    // Load HTML file into window
    mainWindow.loadURL(url.format({
        pathname:  path.join(__dirname, 'mainWindow.html'),
        protocol: 'file:',
        slashes: true
    }));

    // Quit app when closed
    mainWindow.on('closed', function(){
        app.quit();
    });
})
