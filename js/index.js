const electron = require('electron');
const { ipcRenderer } = electron;

function myFacture(){
    ipcRenderer.send('factureEvent');
}

function myStock(){
    ipcRenderer.send('stockEven');
}