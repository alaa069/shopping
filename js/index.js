const electron = require('electron');
const { ipcRenderer } = electron;
const fs = require("fs");

const dataBase = fs.readFileSync('./db.json');
const dataBaseParse = JSON.parse(dataBase);
const User = dataBaseParse.User;
const StockDB = fs.readFileSync('./StockDB.json');
const Stock = JSON.parse(StockDB);

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

/*function searchStock() {
    const searchItem = document.querySelector('#searchItem').value;
    var searchExist = false;
    var searchIndex = [];
    if(searchItem=='') document.getElementById("demo").innerHTML = '';
    else
    for (var i = 0; i < Stock.length; i++) {
        if (Stock[i].Produit.includes(searchItem)) {
            var searchExist = true;
            searchIndex.push(Stock[i])
        }
        if (i == Stock.length -1) {
            if(searchExist){
                document.getElementById("demo").innerHTML = JSON.stringify(searchIndex);
                searchIndex = [];
                searchExist = false;
            } else {
                document.getElementById("demo").innerHTML = '';
            }
        }
    }
}*/

