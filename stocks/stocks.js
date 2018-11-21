var finalData3;
var chart;
var data;
var options;

function Get(yourUrl){
    var Httpreq = new XMLHttpRequest(); // a new request
    Httpreq.open("GET",yourUrl,false);
    Httpreq.send(null);
    return Httpreq.responseText;
}

async function request(stock) {
   var url = 'https://api.iextrading.com/1.0/stock/' + stock + '/quote';
   var url2 = 'https://api.iextrading.com/1.0/stock/' + stock + '/chart/1d';
   var finalData = JSON.parse(Get(url));
   var finalData2 = JSON.parse(Get(url2));
   var finalDataLngth = finalData2.length - 1;
   var sector = " / " + finalData['sector'];
   var goodValue = true;
   var realClosing;
   while (goodValue == true) {
     realClosing = finalData2[finalDataLngth]['average'].toFixed(2);
     if (realClosing == -1) {
        finalDataLngth -= 1;
     }
     else {
        goodValue = false;
     }
   }
   
   document.getElementById("closing").innerHTML = realClosing;
   document.getElementById("symbol").innerHTML = finalData['symbol'];
   document.getElementById("stckName").innerHTML = finalData['companyName'];
   if (sector != "") {
     document.getElementById("sector").innerHTML = sector;
   }

   if (finalData['change'] > 0) {
      document.getElementById("txtColor").style.color = "green";
      document.getElementById("arrow").className = "ion ion-md-arrow-dropup-circle display-4 text-primary";
   }

   else {
      document.getElementById("txtColor").style.color = "red";
      document.getElementById("arrow").className = "ion ion-md-arrow-dropdown-circle display-4 text-primary";
   }

   document.getElementById("pointChng").innerHTML = finalData['change'];
   document.getElementById("percChng").innerHTML = finalData['changePercent'];

   if (finalData['ytdChange'] > 0) {
     document.getElementById("ytdColor").style.color = "green";
     document.getElementById("ytd").innerHTML = '+' + finalData['ytdChange'].toFixed(2);
   }

   else {
     document.getElementById("ytdColor").style.color = "red";
     document.getElementById("ytd").innerHTML = finalData['ytdChange'].toFixed(2);
   }

   document.getElementById("preClose").innerHTML = finalData['close'].toFixed(2);
   finalData3 = JSON.parse(Get(url2));
   google.charts.load('current', {'packages':['line']});
   google.charts.setOnLoadCallback(drawChart);
   twt();
}

function drawChart() {
   data = new google.visualization.DataTable();
   data.addColumn('string', '');
   data.addColumn('number', '');
   var arr = [];
   var timearr = [];
   for (var i = 0; i < finalData3.length; i += 10) {
      var prevValue = finalData3[i]['average'];
      if (prevValue != -1) {
        break;
      }
   }
   for (var i = 0; i < finalData3.length; i += 10) {
      if (finalData3[i]['average'] != -1) {
        arr.push([finalData3[i]['minute'], finalData3[i]['average']]);
        prevValue = finalData3[i]['average'];
      }
      else {
        arr.push([finalData3[i]['minute'], prevValue]);
      }
      
   }
   data.addRows(arr);

   options = {
     legend: {
       position: 'none'
     },
     axes: {
        x: {
           0: {side: 'top'}
        }
     },
     width: '100%',
     height: '100%'
   };

   chart = new google.charts.Line(document.getElementById('curve_chart'));

   chart.draw(data, google.charts.Line.convertOptions(options));
}

function twt() {
  var twitURL = "https://twitter.com/WSJmarkets";
  document.getElementById("twitter").href = twitURL;
}

var sessionStock = 'AAPL';

request(sessionStock);

function clickChange(newStock) {
  request(newStock);
  sessionStock = newStock;
}

function search() {
  var srch = document.getElementById("srchbx").value
  request(srch);
  sessionStock = srch;
}

$(window).resize(function(){
    chart.draw(data, google.charts.Line.convertOptions(options));
});

function addStock() {
    $.ajax({
        type: "POST",
        url: "php/newStock.php",
        data: {newStk: sessionStock}
    }).done(function( msg ) {
        var stk = sessionStock;
        alert( "Data Saved: " + sessionStock );
        location.reload();
        request(stk);
    });
}
