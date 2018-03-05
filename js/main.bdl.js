angular.module('invoicing', [])

  // The default logo for the invoice
  .constant('DEFAULT_LOGO', '../images/metaware_logo.png')

  // The invoice displayed when the user first uses the app
  .constant('DEFAULT_INVOICE', {
    //tax: 13.00,
    invoice_number: moment().format('YYYYMMDDHHmmss'),
    invoice_data: moment().format('DD/MM/YYYY'),
    customer_info: {
      codeClient: 'client00',
      nomClient: 'Mr. John Doe',
      webSite: 'www.metawarelabs.com',
      Adresse: '1 Infinite Loop',
      codePostal: '90210'
    },
    company_info: {
      codeClient: 'Sté ADEM',
      nomClient: 'Vente en Gros Produits Alimentaires',
      webSite: 'GSM: 20 282 219 / 94 141 960',
      Adresse: 'MF: 1549543/E',
      codePostal: 'Hammam Lif'
    },
    items: [
      //{ qty: 10, description: 'Gadget', cost: 9.95 }
    ]
  })

  // Service for accessing local storage
  .service('LocalStorage', [function () {

    var Service = {};

    // Returns true if there is a logo stored
    var hasLogo = function () {
      return !!localStorage['logo'];
    };

    // Returns a stored logo (false if none is stored)
    Service.getLogo = function () {
      if (hasLogo()) {
        return localStorage['logo'];
      } else {
        return false;
      }
    };

    Service.setLogo = function (logo) {
      localStorage['logo'] = logo;
    };

    // Checks to see if an invoice is stored
    var hasInvoice = function () {
      return !(localStorage['invoice'] == '' || localStorage['invoice'] == null);
    };

    // Returns a stored invoice (false if none is stored)
    Service.getInvoice = function () {
      if (hasInvoice()) {
        return JSON.parse(localStorage['invoice']);
      } else {
        return false;
      }
    };

    Service.setInvoice = function (invoice) {
      localStorage['invoice'] = JSON.stringify(invoice);
    };

    // Clears a stored logo
    Service.clearLogo = function () {
      localStorage['logo'] = '';
    };

    // Clears a stored invoice
    Service.clearinvoice = function () {
      localStorage['invoice'] = '';
    };

    // Clears all local storage
    Service.clear = function () {
      localStorage['invoice'] = '';
      Service.clearLogo();
    };

    return Service;

  }])

  .service('Currency', [function () {

    var service = {};

    service.all = function () {
      return [
        /*{
          name: 'Euro (€)',
          symbol: '€ '
        },
        {
          name: 'US Dollar ($)',
          symbol: '$ '
        },*/
        {
          name: 'Dinar Tunisian (DT)',
          symbol: 'DT '
        }
      ]
    }

    return service;

  }])

  // Main application controller
  .controller('InvoiceCtrl', ['$scope', '$http', 'DEFAULT_INVOICE', 'DEFAULT_LOGO', 'LocalStorage', 'Currency', '$window',
    function ($scope, $http, DEFAULT_INVOICE, DEFAULT_LOGO, LocalStorage, Currency, $window) {
      $window.localStorage.clear();
      // Set defaults
      $scope.currencySymbol = 'DT ';
      $scope.logoRemoved = false;
      $scope.printMode = false;
      //$scope.Stock = [];
      $scope.StockTempTest = [];
      $scope.ClientSelected = '';

      (function init() {

        !function () {
          $http.get(path.resolve(__dirname, '..', 'StockDB.json')).success(function (data) {
            $scope.Stock = data;
          });
        }()

        !function () {
          $http.get(path.resolve(__dirname, '..', 'ClientListDB.json')).success(function (data) {
            $scope.ClientList = data;
            $window.ClientList = data;
          });
        }()

        // Attempt to load invoice from local storage
        !function () {
          var invoice = LocalStorage.getInvoice();
          $scope.invoice = invoice ? invoice : DEFAULT_INVOICE;
        }();

        // Set logo to the one from local storage or use default
        !function () {
          var logo = LocalStorage.getLogo();
          $scope.logo = logo ? logo : DEFAULT_LOGO;
        }();

        $scope.availableCurrencies = Currency.all();

      })()
      // Adds an item to the invoice's items
      $scope.addItem = function () {
        $scope.invoice.items.push({ qty: 0, cost: 0, description: "" });
      }

      // Toggle's the logo
      $scope.toggleLogo = function (element) {
        $scope.logoRemoved = !$scope.logoRemoved;
        LocalStorage.clearLogo();
      };

      // Triggers the logo chooser click event
      $scope.editLogo = function () {
        // angular.element('#imgInp').trigger('click');
        document.getElementById('imgInp').click();
      };

      $scope.printInfo = function () {
        var ipcRenderer = require("electron").ipcRenderer;
        ipcRenderer.send('BD_my-Stock', $scope.StockTempTest, $scope.invoice);
        window.print();
      };

      // Remotes an item from the invoice
      $scope.removeItem = function (item) {
        $scope.invoice.items.splice($scope.invoice.items.indexOf(item), 1);
      };

      // Search stock
      $scope.searchStock = function (item) {
        //console.log(item, $scope.invoice.items.indexOf(item))
        //console.log(JSON.stringify($scope.Stock))
        //$scope.invoice.items.push({ qty: 0, cost: 0, description: "" });
        //$scope.invoice.items[$scope.invoice.items.indexOf(item)].cost = $scope.Stock[$scope.Stock.indexOf(item.description)].Prix;
        //$scope.Stock = []
        var existStock = false;
        angular.forEach($scope.Stock, function (stock, key) {
          if (stock.NomProduit == item.description) {
            if ($scope.ClientSelected == '') {
              $scope.invoice.items[$scope.invoice.items.indexOf(item)].cost = stock.PrixCatA
              //$scope.invoice.items[$scope.invoice.items.indexOf(item)].qty = stock.NbrStock
            } else {
              $scope.invoice.items[$scope.invoice.items.indexOf(item)].cost = stock[$scope.ClientSelected.typeFacture]
              //$scope.invoice.items[$scope.invoice.items.indexOf(item)].qty = stock.NbrStock
            }
            existStock = true;
          }
          if ((key == $scope.Stock.length - 1) && (existStock == false)) {
            $scope.invoice.items[$scope.invoice.items.indexOf(item)].cost = '';
            //$scope.invoice.items[$scope.invoice.items.indexOf(item)].qty = '';
          }
        });
      };

      $scope.stockManager = function (item) {
        if ($scope.StockTempTest.length == 0) {
          angular.forEach($scope.Stock, function (stock, key) {
            if (stock.NomProduit == item.description) {
              stock.NbrStockRemove = parseInt(item.qty);
              $scope.StockTempTest.push(stock);
            }
          });
        } else {
          var stockExistTemp = false;
          angular.forEach($scope.StockTempTest, function (stock, key) {
            if (stock.NomProduit == item.description) {
              stock.NbrStockRemove = parseInt(item.qty);
              $scope.StockTempTest[key] = stock;
              stockExistTemp = true;
            }
            if ((key == $scope.StockTempTest.length - 1) && (stockExistTemp == false)) {
              angular.forEach($scope.Stock, function (stock, key) {
                if (stock.NomProduit == item.description) {
                  stock.NbrStockRemove = parseInt(item.qty);
                  $scope.StockTempTest.push(stock);
                }
              });
            }
          });
        }
      }

      $scope.getClientInfo = function (codeClient) {
        var existClient = false;
        angular.forEach($scope.ClientList, function (client, key) {
          if (client.codeClient == codeClient) {
            $scope.ClientSelected = client;
            existClient = true;
            $scope.invoice.customer_info.nomClient = client.nomClient;
            $scope.invoice.customer_info.webSite = client.webSite;
            $scope.invoice.customer_info.Adresse = client.Adresse;
            $scope.invoice.customer_info.codePostal = client.codePostal;
            for (var i = 0; i < $scope.invoice.items.length; i++) {
              $scope.searchStock($scope.invoice.items[i]);
            }
          }
          if ((key == $scope.ClientList.length - 1) && (existClient == false)) {
            $scope.ClientSelected = '';
            $scope.invoice.customer_info.nomClient = '';
            $scope.invoice.customer_info.webSite = '';
            $scope.invoice.customer_info.Adresse = '';
            $scope.invoice.customer_info.codePostal = '';
            for (var i = 0; i < $scope.invoice.items.length; i++) {
              $scope.searchStock($scope.invoice.items[i]);
            }
          }
        })
      }
      var _StockList = JSON.parse(fs.readFileSync(path.resolve(__dirname, '..', 'StockDB.json')));
      $scope.myFunctionFactDesc = function (index, item) {
        var _stockArray = [];

        for (var i = 0; i < _StockList.length; i++) {
          _stockArray.push(_StockList[i].NomProduit)
        }

        var inputListdescription = document.getElementById("browsersListdescription" + index);

        new Awesomplete(inputListdescription, {
          list: _stockArray,

          filter: function (text, input) {
            return Awesomplete.FILTER_CONTAINS(text, input.match(/[^,]*$/)[0]);
          },

          item: function (text, input) {
            return Awesomplete.ITEM(text, input.match(/[^,]*$/)[0]);
          },

          replace: function (text) {
            var before = this.input.value.match(/^.+,\s*|/)[0];
            this.input.value = before + text;
          }
        });
        inputListdescription.addEventListener("awesomplete-select", function (event) {
          $scope.searchStockList(index, event.text.value);
          //console.log(event.text.label, event.text.value);
        });
      }

      $scope.searchStockList = function (index, text) {
        //item.description = text.value
        $scope.invoice.items[index].description = text
        var existStock = false;
        angular.forEach($scope.Stock, function (stock, key) {
          if (stock.NomProduit == text) {
            if ($scope.ClientSelected == '') {
              $scope.invoice.items[index].cost = stock.PrixCatA
              $scope.invoice.items[index].qty = stock.NbrStock
            } else {
              $scope.invoice.items[index].cost = stock[$scope.ClientSelected.typeFacture]
              $scope.invoice.items[index].qty = stock.NbrStock
            }
            existStock = true;
          }
          if ((key == $scope.Stock.length - 1) && (existStock == false)) {
            $scope.invoice.items[index].cost = '';
            $scope.invoice.items[index].qty = '';
          }
        });
      }

      // Calculates the sub total of the invoice
      $scope.invoiceSubTotal = function () {
        var total = 0.00;
        angular.forEach($scope.invoice.items, function (item, key) {
          total += (item.qty * item.cost);
        });
        return total;
      };

      // Calculates the tax of the invoice
      $scope.calculateTax = function () {
        return (($scope.invoice.tax * $scope.invoiceSubTotal()) / 100);
      };

      // Calculates the grand total of the invoice
      $scope.calculateGrandTotal = function () {
        saveInvoice();
        //return $scope.calculateTax() + $scope.invoiceSubTotal();
        return $scope.invoiceSubTotal()
      };

      // Clears the local storage
      $scope.clearLocalStorage = function () {
        var confirmClear = confirm('Êtes-vous sûr de vouloir effacer la facture?');
        if (confirmClear) {
          LocalStorage.clear();
          setInvoice(DEFAULT_INVOICE);
          $window.location.reload();
        }
      };

      // Sets the current invoice to the given one
      var setInvoice = function (invoice) {
        $scope.invoice = invoice;
        saveInvoice();
      };

      // Reads a url
      var readUrl = function (input) {
        if (input.files && input.files[0]) {
          var reader = new FileReader();
          reader.onload = function (e) {
            document.getElementById('company_logo').setAttribute('src', e.target.result);
            LocalStorage.setLogo(e.target.result);
          }
          reader.readAsDataURL(input.files[0]);
        }
      };

      // Saves the invoice in local storage
      var saveInvoice = function () {
        LocalStorage.setInvoice($scope.invoice);
      };

      // Runs on document.ready
      angular.element(document).ready(function () {
        // Set focus
        document.getElementById('invoice-number').focus();

        // Changes the logo whenever the input changes
        document.getElementById('imgInp').onchange = function () {
          readUrl(this);
        };
      });

    }])
