const electron = require('electron');
const { ipcRenderer } = electron;
const fs = require("fs");

const dataBase = fs.readFileSync('./db.json');
const dataBaseParse = JSON.parse(dataBase);
const User = dataBaseParse.User;
const StockDB = fs.readFileSync('./StockDB.json');
const Stock = JSON.parse(StockDB);
const factureHistoryList = JSON.parse(fs.readFileSync('./FactureHistoryDB.json'));

function myFactureOpen() {
    ipcRenderer.send('factureOpenEvent');
    //document.location.href = "facture.html"
}

function myStockOpen() {
    ipcRenderer.send('stockOpenEvent');
    //document.location.href = "stock.html"
}

function myDashboardOpen() {
    ipcRenderer.send('dashboardOpenEvent');
}

function myListClientOpen() {
    ipcRenderer.send('listclientOpenEvent');
}

function myBonDeLivraisonOpen() {
    ipcRenderer.send('bondelivraisonOpenEvent');
}

function myFactureHistoryOpen() {
    ipcRenderer.send('facturehistoryOpenEvent');
}

var myFactureList = document.getElementById("myFactureList").getElementsByTagName("tbody")[0];

for (var i = 0; i < factureHistoryList.length; i ++){
    var rowList = myFactureList.insertRow(myFactureList.rows.length);

    var cell1 = rowList.insertCell(0);
    var cell2 = rowList.insertCell(1);

    cell1.innerHTML = factureHistoryList[i].invoice_number;
    cell2.innerHTML = factureHistoryList[i].customer_info.codeClient;

    rowList.onclick= function(){
        ipcRenderer.send('factureOpenEventListItem', this.rowIndex - 1);
    };
}