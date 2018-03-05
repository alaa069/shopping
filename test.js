/*const electron = require("electron");
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
})*/

/* -------
var obj = {
    aa: "bb",
    cc: "dd",
    ee: "ee"
}

function arrfd (tab){
    var tt = Object.keys(tab)
    var res = []
    for(var i = 0; i < tt.length; i++){
        res.push('Hello-' + tt[i])
    }
    return  res
}

console.log(arrfd(obj))
*/

// Singleton

Math.pow(8, 2); //64

Math.sqrt(64); //8

/* ---
function strRT (str){
    var strArr = str.split()
    var res = ""
    for (var i = 0; i < strArr.length; i++){
        res = res + strArr[i] + "\n"
    }
    return res
}

console.log(strRT("Hello Word !"))
*/

function PiCal() {
    var c = 888
    var Pi=0;
    var n=1;
    for (i = 0; i <= c; i++) {
        Pi = Pi + (4 / n) - (4 / (n + 2))
        n = n + 4
    }
    return Pi;
}

console.log(PiCal())