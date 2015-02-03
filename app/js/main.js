(function(){
  'use strict';
//Selector variables 
  var buyButton = $('.buy-button');
  var refreshButton = $('.refresh');
  var $tbody = $('#tbody');

//Click events   
  buyButton.on("click", function(evt){
  	  var ticker = $('#tickerSymbol').val();
  	  var url = 'http://dev.markitondemand.com/Api/v2/Quote/jsonp?symbol='+ticker+'&callback=?'
      evt.preventDefault();
	  $.getJSON(url, function(res){
	    createTable(res);
	  });

  })

  refreshButton.on("click", function(evt){
    evt.preventDefault();
    refreshTable();
  })

  $tbody.on("click", "button", function(){
    $(this).closest('tr').remove();
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
  	var remove = $('<td><button style="background-color: lightCoral; color: black; box-shadow: 0px 1px 1px; ">Remove</button></td>');


  	tableRow.append(name);
  	tableRow.append(price);
  	tableRow.append(quantity);
    tableRow.append(currentPrice);
  	tableRow.append(change);
  	tableRow.append(remove);

  	tableBody.append(tableRow);

    updateTotal();

  }


//Update My Stocks total
  function updateTotal(){
    var priceArray = [];
    var tableChildren = $('#tbody').children();

    _.forEach(tableChildren, function(n){
      var element = $(n);
      var total = parseFloat(element.children()[1].innerHTML) * parseFloat(element.children()[2].innerHTML);
      priceArray.push(total);
      console.log(total);
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
      console.log(row);

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

}());
