const electron = require("electron");
const url = require("url");
const path = require("path");
const fs = require("fs");

const { app, BrowserWindow, Menu, ipcMain } = electron;

let mainWindow;
let dashWindow;
let factureHistoryItemWindow;
const dataBase = fs.readFileSync('./db.json');
var dataBaseParse = JSON.parse(dataBase);
const User = dataBaseParse.User;
const StockDB = fs.readFileSync('./StockDB.json');
var Stock = JSON.parse(StockDB);
var  FactureHitoryDB = fs.readFileSync('./FactureHistoryDB.json');
var FactureHitory = JSON.parse(FactureHitoryDB);
var ClientList = JSON.parse(fs.readFileSync('./ClientListDB.json', 'utf8'));

var indexRow;
let deleteUpdate;
let addProduit;

// Listen for app to be ready
app.on('ready', function () {
    // Create new window
    mainWindow = new BrowserWindow({})
    // Load HTML file into window
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'views/index.html'),
        protocol: 'file:',
        slashes: true
    }));
    // Build Menu from template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    // Insert Menu
    Menu.setApplicationMenu(mainMenu);
})

ipcMain.on('login', function (e, username, password) {
    var userExist = false
    for (var i = 0; i < User.length; i++) {
        if (User[i].username == username) {
            if (User[i].password == password) {
                userExist = true;
            }
        }
    }
    if (userExist) {
        //const injectCode = fs.readFileSync("./js/inputlistpopup.js", "utf8");
        // Create new window
        dashWindow = new BrowserWindow({
            width: 992,
            height: 700,
            title: 'Tableau de bord',
            enableLargerThanScreen: true
            //fullscreen: true
        })
        // Load HTML file into window
        dashWindow.loadURL(url.format({
            pathname: path.join(__dirname, 'views/dashboard.html'),
            protocol: 'file:',
            slashes: true
        }));
        dashWindow.maximize()
        dashWindow.setMaximizable(false)
        dashWindow.setResizable(false)
        /*dashWindow.webContents.on("did-finish-load", () => {
            dashWindow.webContents.executeJavaScript(injectCode);
        });*/
        mainWindow.close();
        // Add new Menu
        mainMenuTemplate.push({ label: 'Dashboard', submenu: [{ label: 'Facture', click() { goToFacture(); } }, { label: 'Stock', click() { goToStock(); } }, { label: 'List Client', click() { goToListClient(); } }, { label: 'Bon de livraison', click() { goToBonDeLivraison(); } }, { label: 'Facture History', click() { goToFactureHistory(); } }] });
        // Build new Menu from template
        const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
        // Insert new Menu
        Menu.setApplicationMenu(mainMenu);
    }
})

ipcMain.on('my-Stock', function (e, data, invoice) {
    for (var i = 0; i < Stock.length; i++) {
        for (var j = 0; j < data.length; j++) {
            if (Stock[i].NomProduit == data[j].NomProduit) {
                data[j].NbrStock = data[j].NbrStock - data[j].NbrStockRemove;
                Stock[i] = data[j];
                j = data.length;
            }
        }
        if (i == Stock.length - 1) {
            fs.writeFileSync('./StockDB.json', JSON.stringify(Stock))
            setTimeout(function () {
                FactureHitoryDB = fs.readFileSync('./FactureHistoryDB.json');
                FactureHitory = JSON.parse(FactureHitoryDB);
            }, 200)
        }
    }
    FactureHitory.unshift(invoice);
    fs.writeFileSync('./FactureHistoryDB.json', JSON.stringify(FactureHitory));
    setTimeout(function () {
        FactureHitoryDB = fs.readFileSync('./FactureHistoryDB.json');
        FactureHitory = JSON.parse(FactureHitoryDB);
    }, 200)
})

ipcMain.on('factureOpenEventListItem', function (e, data) {
    factureHistoryItemWindow = new BrowserWindow({})
    factureHistoryItemWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'views/factureHistoryDetail.html'),
        protocol: 'file:',
        slashes: true
    }));
    setTimeout(function () {
        factureHistoryItemWindow.webContents.send('factureHistoryItem', FactureHitory[data]);
    }, 1000)

})

function createProduit(){
    addProduit=new BrowserWindow({
        width:400,
        height:550,
        title: "Ajout Produit"

    })
    addProduit.loadURL(url.format({
        pathname: path.join(__dirname, 'views/ajoutProduit.html'),
        protocol: 'file:',
        slashes: true
    }));
}

function createClient(){
    addProduit=new BrowserWindow({
        width:400,
        height:550,
        title: "Ajout Client"

    })
    addProduit.loadURL(url.format({
        pathname: path.join(__dirname, 'views/ajoutClient.html'),
        protocol: 'file:',
        slashes: true
    }));
}

function goToEditStock(index){
    deleteUpdate=new BrowserWindow({
        width:890,
        height:550,
        title: "Edit Stock"

    })
    deleteUpdate.loadURL(url.format({
        pathname: path.join(__dirname, 'views/deleteUpdate.html'),
        protocol: 'file:',
        slashes: true
    }));

    
}


function goToFacture() {
    dashWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'views/facture.html'),
        protocol: 'file:',
        slashes: true
    }));
}

function goToStock() {
    dashWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'views/stock.html'),
        protocol: 'file:',
        slashes: true
    }));
}

function goToDashboard() {
    dashWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'views/dashboard.html'),
        protocol: 'file:',
        slashes: true
    }));
}

function goToListClient() {
    dashWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'views/listClient.html'),
        protocol: 'file:',
        slashes: true
    }));
}

function goToBonDeLivraison() {
    dashWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'views/bondelivraison.html'),
        protocol: 'file:',
        slashes: true
    }));
}

function goToFactureHistory() {
    dashWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'views/factureHistory.html'),
        protocol: 'file:',
        slashes: true
    }));
}

ipcMain.on('item:add',function(e, item){
   
    Stock.push({
        Reference : item[0],
        NomProduit : item[1],
        PrixAchat : item[2],
        NbrStock : item[3],
        PrixCatA : item[4],
        PrixCatB : item[5],
        PrixCatC : item[6],
    })
    fs.writeFileSync('./StockDB.json', JSON.stringify(Stock), 'utf8');
    dashWindow.webContents.send('item:add', item);
    addProduit.close();
});

ipcMain.on('item:addClient',function(e, item){
   
    ClientList.push({
        codeClient : item[0],
        nomClient : item[1],
        webSite : item[2],
        Adresse : item[3],
        codePostal : item[4],
        typeFacture : item[5]
    })
    fs.writeFileSync('./ClientListDB.json', JSON.stringify(ClientList), 'utf8');
    dashWindow.webContents.send('item:addClient', item);
    addProduit.close();
    console.log(item)
});

ipcMain.on('delete:update', function(e, index){
    console.log('row :'+index);
    goToEditStock(index);
    indexRow=index-1;
    

});

ipcMain.on('ajoutProduit', function(){
    createProduit();
});

ipcMain.on('ajoutClient', function(){
    createClient();
});

ipcMain.on('load:ready', function(e, yes){
    deleteUpdate.webContents.send('index', indexRow);
});

ipcMain.on('edit:complete', function(){
 deleteUpdate.close();
    dashWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'views/stock.html'),
        protocol: 'file:',
        slashes: true
    }));
});

ipcMain.on('factureOpenEvent', function (e, item) {
    goToFacture()
})

ipcMain.on('stockOpenEvent', function (e, item) {
    goToStock()
})

ipcMain.on('dashboardOpenEvent', function (e, item) {
    goToDashboard()
})

ipcMain.on('listclientOpenEvent', function (e, item) {
    goToListClient()
})

ipcMain.on('bondelivraisonOpenEvent', function (e, item) {
    goToBonDeLivraison()
})

ipcMain.on('facturehistoryOpenEvent', function (e, item) {
    goToFactureHistory()
})


//mainWindow.webContents.send('item:add', item);

const mainMenuTemplate = [
    {
        label: "File",
        submenu: [
            {
                label: 'Quit',
                accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
                click() {
                    app.quit();
                }
            }
        ]
    }
]

// If MAC, add empty object to Menu
if (process.platform == 'darwin') {
    mainMenuTemplate.unshift({});
}

// add developer tools item if not in prod
if (process.env.NODE_ENC !== 'production') {
    mainMenuTemplate.push({
        label: 'Developer Tools',
        submenu: [
            {
                label: 'Toggle DevTools',
                accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
                click(item, focusedWindow) {
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role: 'reload'
            }
        ]
    })
}