// -------------------------------------------------- Global 
//Url for ajax
// const BitcoinUrl = `https://api.coingecko.com/api/v3`
// const ChartsUrl = 'https://min-api.cryptocompare.com/data/price?fsym='
// const ChartsUrlCurrencies = `&tsyms=USD,EUR,ILS`
//First ajax call array, has objects with theree var,  id | symbol | name 
// let CurrenciesArray = []
//currency names (line 30)
// let CurencySerch = []
//Show what coin is active, array of names
// let allActiveCards = []
//Array of five, array of usd by all active 
// let chartDataOnce = []
//Get time evry two secods 
// let timeArray = []
//get the value of multiple currencys every two scons 
// let chartData = [
//     [],
//     [],
//     [],
//     [],
//     [],
// ]

printHomeChart()
homeChartDataGate() //line 259, 357

function getDataOnce(){
    $.each(allActiveCards, function (index, value) {

        let symbol = value.toUpperCase()

        $.ajax({
            type: 'GET',
            datatype: 'json',
            async:false,
            url: `${ChartsUrl}${symbol}&tsyms=USD`,
            success: function (data) {
                if (data.USD) {
                    chartDataOnce.push(data.USD)
                    console.log('on the chart: ' + chartDataOnce);
                } else {
                    $('#sorry').html(value)
                    $('#chartModal').modal('show')
                    $(`[symbol=${value}]`).trigger('click');
                }
            },
            error: function (error) {
                console.log('error :', error)
            }
        })
        printHomeChart()
    })
}

function homeChartDataGate(){
    if( allActiveCards.length !== 0 ){
        chartDataOnce = []
        getDataOnce()
    }
    else{
        chartDataOnce = []
        printHomeChart()
    }
}

function printHomeChart(){
    var ctx = document.getElementById("myChart").getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            //For the single one put time here
            labels: allActiveCards,
            datasets: [{
                datalabels: {
                    color: 'black',
                    anchor: 'end',
                    align: 'top',
                },
                label: ' Value In USD ',
                data: [
                    chartDataOnce[0], 
                    chartDataOnce[1], 
                    chartDataOnce[2], 
                    chartDataOnce[3], 
                    chartDataOnce[4]
                ],
                backgroundColor: [
                    'rgba(248, 100, 132, 1)',
                    'rgba(248, 162, 69, 1)',
                    'rgba(249, 208, 89, 1)',
                    'rgba(91, 190, 190, 1)',
                    'rgba(81, 155, 234, 1)',
                ],
                borderColor: [
                    'rgba(0,0,0,0)',
                    'rgba(0,0,0,0)',
                    'rgba(0,0,0,0)',
                    'rgba(0,0,0,0)',
                    'rgba(0,0,0,0)',
                ],
                borderWidth: 1
            }]
        },
        options: {
            legend: {
                display: false
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        callback: function(value, index, values) {return value + ' $';},
                }}]
            }
        }
    });
}
