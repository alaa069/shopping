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

// Ridha
var obj = JSON.parse(fs.readFileSync('./ClientListDB.json', 'utf8'));

const table = document.getElementById("myTable").getElementsByTagName('tbody')[0];
        
 for(var i=0;i<obj.length;i++){   
    var row = table.insertRow(table.rows.length);
    //row.onclick= function() { deleteUpdate(this.rowIndex); };
    row.className = "row100 head";
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);
    var cell5 = row.insertCell(4);
    var cell6 = row.insertCell(5);


    cell1.className = "column100 column1";
    cell2.className = "column100 column2";
    cell3.className = "column100 column3";
    cell4.className = "column100 column4";
    cell5.className = "column100 column5";
    cell6.className = "column100 column6";

   

    cell1.innerHTML = obj[i].codeClient;
    cell2.innerHTML = obj[i].nomClient;
    cell3.innerHTML = obj[i].webSite;
    cell4.innerHTML = obj[i].Adresse;
    cell5.innerHTML = obj[i].codePostal;
    cell6.innerHTML = obj[i].typeFacture;
}
//////

function deleteUpdate(index){
   ipcRenderer.send('delete:update', index);
   //alert('ROw : '+index);
}

function myAjoutClient(){
    //alert("Hello World!");
    ipcRenderer.send('ajoutClient');
}