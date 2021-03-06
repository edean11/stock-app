(function(){
  'use strict';
//Selector variables 
  var buyButton = $('.buy-button');
  var refreshButton = $('.refresh');
  var $tbody = $('#tbody');

//Document On Load - Return Existing Stocks
  $.get('https://stock-app.firebaseio.com/stocks.json', function(res){
    if(res !== null) {
      Object.keys(res).forEach(function(uuid){
        addRowToTable(uuid, res[uuid]);
        updateTotal();
      });
    } else{}
  });

  function addRowToTable(uuid, data){
    var $tr = $('<tr class="tableRow"></tr>');
    var $name = $('<td class="name">'+data.companyName+'</td>');
    var $price = $('<td class="price">'+data.purchasePrice+'</td>');
    var $quantity = $('<td class="quantity">'+data.quantity+'</td>');
    var $lastPrice = $('<td class="currentPrice">'+data.lastPrice+'</td>');
    var $change = $('<td class="change">'+data.change+'</td>');
      if( data.change[0] !== '-') {
        $change.css("color", "limegreen");
      } else {
        $change.css("color", "red");
        console.log(data.change);
      }
    var $remove = $('<td><button class="removeButton">Remove</button></td>');

    $tr.append($name);$tr.append($price);$tr.append($quantity);$tr.append($lastPrice);$tr.append($change);$tr.append($remove);
    $tr.attr('data-uuid', uuid);
    $tbody.append($tr);
  }

//Click events   
  buyButton.on("click", function(evt){
      evt.preventDefault();
  	  var ticker = $('#tickerSymbol').val();
      var quantity = $('#quantity').val();
      if(ticker) {
    	  var url = 'http://dev.markitondemand.com/Api/v2/Quote/jsonp?symbol='+ticker+'&callback=?';
        $.getJSON(url, function(res){
  	     createTable(res);
        });
      } else {alert('Enter All Required Fields')}
	 });

  refreshButton.on("click", function(evt){
    evt.preventDefault();
    refreshTable();
    databaseLastPriceUpdate();
  })

  $tbody.on("click", "button", function(){
    var $tr = $(this).closest('tr');
    var uuid = $tr.data('uuid');
    var url = 'https://stock-app.firebaseio.com/stocks/'+uuid+'.json';
    $.ajax({url: url, type:'DELETE'});
    $tr.remove();
    updateTotal();
  })


//Create table function 
  function createTable(data) {
  	var info = [];
  	var tableRow = $('<tr class="tableRow"></tr>');
  	var quantityValue = $('#quantity').val();
  	var tableBody = $('#tbody');
  	var changeNum = Math.round(data.Change*100)/100;
  	var changePerc = Math.round(data.ChangePercent*100)/100;

    var object = {change: changeNum+', %'+changePerc,  lastPrice: data.LastPrice,  quantity: quantityValue, purchasePrice: data.LastPrice, companyName: data.Name, symbol: data.Symbol}
    var url = 'https://stock-app.firebaseio.com/stocks.json'
    
    $.post(url, JSON.stringify(object), function(res){
      tableRow.attr('data-uuid', res.name);
      tableBody.append(tableRow);
      updateTotal();
    });

  	var name = $('<td class="name">'+data.Name+'</td>');
  	var price = $('<td class="price">'+data.LastPrice+'</td>');
  	var quantity = $('<td class="quantity">'+quantityValue+'</td>');
    var currentPrice = $('<td class="currentPrice">'+data.LastPrice+'</td>');
  	var change = $('<td class="change">'+changeNum+', '+'% '+changePerc+'</td>');
  		if( data.Change > 0) {
        change.css("color", "limegreen");
      } else {
        change.css("color", "red");
      }
  	var remove = $('<td><button class="removeButton">Remove</button></td>');


  	tableRow.append(name);
  	tableRow.append(price);
  	tableRow.append(quantity);
    tableRow.append(currentPrice);
  	tableRow.append(change);
  	tableRow.append(remove);

  }


//Update My Stocks total
  function updateTotal(){
    var priceArray = [];
    var tableChildren = $('#tbody').children();

    _.forEach(tableChildren, function(n){
      var element = $(n);
      var total = parseFloat(element.children()[1].innerHTML) * parseFloat(element.children()[2].innerHTML);
      priceArray.push(total);
    });

    var totalPrice = _.reduce(priceArray, function(totalPrice, n){
      return totalPrice + n;
     })

    var total = $('#total');
    total.empty();
    total.append("$" + Math.round(totalPrice*100)/100);
  }



// Update current stock price
  function refreshTable(){

    var trow = $('.tableRow');

    _.forEach(trow, function(n){
      var row = $(n);
      var foundName = row.find('.name')[0].innerHTML;
      var tickerFindURL = 'http://dev.markitondemand.com/Api/v2/Lookup/jsonp?input='+foundName+'&callback=?';

      $.getJSON(tickerFindURL, function(res){
        var ticker = res[0].Symbol;

        var url = 'http://dev.markitondemand.com/Api/v2/Quote/jsonp?symbol='+ticker+'&callback=?'

        $.getJSON(url, function(res){
          row.find('.currentPrice')[0].innerHTML = parseFloat(res.LastPrice);
          row.find('.change')[0].innerHTML = (Math.round(res.Change*100)/100)+', %'+Math.round(res.ChangePercent*100)/100;
        });
      })

    })
 }

// Database Update Last Price Function

  function databaseLastPriceUpdate() {
    var $tr = $('.tableRow');

    _.forEach($tr, function(row){
      var uuid = $(row).data('uuid');
      var url = 'https://stock-app.firebaseio.com/stocks/'+uuid+'.json';

      //$.ajax(url: url, type: 'PUT')
    })
  }

}());
