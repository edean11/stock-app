(function(){
  'use strict';

  var buyButton = $('.buy-button');

  buyButton.on("click", function(){
  	  var ticker = $('#tickerSymbol').val();
  	  var url = 'http://dev.markitondemand.com/Api/v2/Quote/jsonp?symbol='+ticker+'&callback=?'

	  $.getJSON(url, function(res){
	    createTable(res);
	  });

  })

  function createTable(data) {
  	var info = [];
  	var tableRow = $('<tr></tr>');
  	var quantityValue = $('#quantity').val();
  	var tableBody = $('#tbody');
  	var changeNum = Math.round(data.Change*100)/100;
  	var changePerc = Math.round(data.ChangePercent*100)/100;

  	var name = $('<td>'+data.Name+'</td>');
  	var price = $('<td class="price">'+data.LastPrice+'</td>');
  	var quantity = $('<td class="quantity">'+quantityValue+'</td>');
  	var change = $('<td>'+changeNum+', '+'% '+changePerc+'</td>');
  		if( data.Change > 0) {
        change.css("color", "green");
      } else {
        change.css("color", "red");
      }
  	var remove = $('<td><button>Remove</button></td>');
  	remove.on("click", function(){
  		tableRow.empty();
  	});


  	tableRow.append(name);
  	tableRow.append(price);
  	tableRow.append(quantity);
  	tableRow.append(change);
  	tableRow.append(remove);

  	tableBody.append(tableRow);

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
    total.append(Math.round(totalPrice*100)/100);

  }


}());
