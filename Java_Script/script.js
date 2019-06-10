// -------------------------------------------------- Global 
//Url for ajax
const BitcoinUrl = `https://api.coingecko.com/api/v3`
const ChartsUrl = 'https://min-api.cryptocompare.com/data/price?fsym='
const ChartsUrlCurrencies = `&tsyms=USD,EUR,ILS`
//First ajax call array, has objects with theree var,  id | symbol | name 
let CurrenciesArray = []
//currency names (line 30)
let CurencySerch = []
//Show what coin is active, array of names
let allActiveCards = []
//Array of five, array of usd by all active 
let chartDataOnce = []
//Get time evry two secods 
let timeArray = []
//get the value of multiple currencys every two scons 
let chartData = [
    [],
    [],
    [],
    [],
    [],
]

// -------------------------------------------------- Starting Point Functions  
//Intervals
let updateTimeint = setInterval(updateTime, 2000);
let printChartint = setInterval(printChart, 2000);
let getDataint = setInterval(getData, 2000);
// Local storage
if (localStorage.allActiveCards) {
    allActiveCards = JSON.parse(localStorage.allActiveCards);
}

//Serch autocomplete
$(".serch").autocomplete({
    source: CurencySerch,
    select: function(event, ui){
        console.log('select', ui.item.value);
        $('input.serch').val(ui.item.value);

            $(`[fullcard=${ui.item.value}]`).show()
},
response: function( event, ui ) { 
    $('.credit-card-container').hide()

    for(var n=0; n<CurencySerch.length; n++)
    {
    $(`[fullcard=${ui.content[n].value }]`).show()
    }
},

});

$('input.serch').on("input propertychange", function () {
    console.log("change", this.value);

    if($('input.serch').val()){
        $('.credit-card-container').hide()
        $(`[fullcard=${this.value}]`).show()
    }
    else{
        $('.credit-card-container').show()
    }
});


$('#home_page').show()
$('.HomeBorder').show()

$('#LiveBorder').hide()
$('#about_page').hide()
$('#liveCharts_page').css({opacity:'0'})
// Functions
// printHomeChart()
currencyChart()
getCurrencies()


// -------------------------------------------------- Page Change 
// -------------------------------------------------- Home 
$('.home').on('click', function () {

    $('#LiveBorder').hide()
    $('.HomeBorder').show()
    $('#about_page').hide()
    $('#home_page').show()
    $('#liveCharts_page').css({opacity:'0'})
    $('.boxestop').addClass('d-none')

})
// -------------------------------------------------- Live Charts

$('.liveCharts_page').on('click', function () {

    $('#LiveBorder').show()
    $('.HomeBorder').hide()
    $('#about_page').hide()
    $('#home_page').hide()
    $('#liveCharts_page').css({opacity:'1'})
    $('.boxestop').removeClass('d-none')

    
})

// -------------------------------------------------- About 
$('.about').on('click', function () {
    $('#about_page').show()
    $('.boxestop').addClass('d-none')
    $('.HomeBorder').hide()
    $('#LiveBorder').hide()
    $('#liveCharts_page').css({opacity:'0'})
    $('#home_page').hide()

    $('#about_page').html(`
    <div class="container" style="margin-top: 100px">
    <div class="row">
        <div class="col d-flex justify-content-center">
                <div class="card border-0" style="max-width: 30rem;">
                        <img class="card-img-top" src="./Css/Images/PNG/ME.jpg" alt="Card image cap">
                        <div class="card-body px-0">
                          <h1 class="card-title">TAI ALT,</h1>
                          <p class="card-text">
                                I am Tai Alt, digital artist,  living in the Northern Galilee, Israel.
                                I am making my first steps into digital art. Highly interested in exploring digital sculpting.
                                Inspired by the gaming world and the world of character and creature design, I currently develop my skills as an
                                artist, creating imaginary figures and presenting a wide variety of final and in-process work produced during the
                                years.
                                Yearning to become an expert and make my way to the creative industry.						</p>
                        </div>
                      </div>
        </div>
    </div>

</div>
	`)
})

// -------------------------------------------------- Functions
//Get curency, push to CurrenciesArray and push id to CurencySerch
//Go to PrintCards
function getCurrencies() {
    $.ajax({
        type: 'GET',
        datatype: 'json',
        url: `${BitcoinUrl}/coins/list`,
        success: function (data) {

            for (i = 300; i < 400; i++) {
                CurrenciesArray.push(data[i])
                CurencySerch.push(data[i].symbol)
            }

            printCards()
            console.log('Success');
        },
        error: function (error) {
            console.log('error :', error);
        }
    })
}

// Get ingle coin push to local storage go to function ptint info  
function SingleBitcoin(value) {
    let symbolId = value

    $.ajax({
        type: 'GET',
        datatype: 'json',
        url: `${BitcoinUrl}/coins/${symbolId}`,
        success: function (data) {
        
            localStorage.setItem(symbolId, JSON.stringify(data))
            //Delete afeter 2 minuts 
            window.setTimeout(function(){ localStorage.removeItem(symbolId)}, 120000);

            $('.spinner').hide()
            cardInfo(value)
        },
        error: function (error) {
            console.log('error :', error)
        }
    })
}

//Checking if coin is alrady in local storage
CheckIfInLocal = (value) => {
    let Json = JSON.parse(localStorage.getItem(value))
    if (Json) {
        cardInfo(value)
        return true
    } else {
        $(`.spinner${value}`).show()
        SingleBitcoin(value)
    }
}

// -------------------------------------------------- Card Activation
//Toggle color of card to green with calss 'Active'
ToggleActive = (button) => {
    let card = button.parent().parent().parent()
    let credit_card = button.parent().parent()

    $(button).toggleClass('btn-Blue btn-Green')
    $(button).toggleClass('active')
    $(credit_card).children('.front').toggleClass('Active', 200)
    $(credit_card).children('.back').toggleClass('Active', 200)

    if($(button).hasClass('active')){
        $(button).html('Remove Item')
    }
    else{
        $(button).html('Add To Chart')
    }
}

//Show modal if more then five present in allactivecards
CheckIfActive = (idvalue, button) => {
    if ($(button).hasClass('active') == false) {
        //then check the length of AllActive array 
        if (allActiveCards.length == 5) {
            //if its more then 5 show modal (Line 238)
            //sends it with id of symbol 
            PrintIntoModal(idvalue)
            $('#exampleModal').modal('show')
            //if the array is smaller then five and dosen't have the idvalue in the array add it to active 
        } else if (allActiveCards.length < 5 && allActiveCards.includes(idvalue) == false) {
            AddToActive(idvalue)
            ToggleActive(button)
        }
    } else {
        RemoveFromActive(idvalue)
        ToggleActive(button)
    }
}

AddToActive = (idvalue) => {
    allActiveCards.push(idvalue)
    localStorage.allActiveCards = JSON.stringify(allActiveCards)
    console.log("added", allActiveCards)
}

RemoveFromActive = (idvalue) => {
    let index = allActiveCards.indexOf(idvalue)
    allActiveCards.splice(index, 1)
    localStorage.allActiveCards = JSON.stringify(allActiveCards)
    console.log("removed ", allActiveCards)
}

// -------------------------------------------------- Prints cards
function printCards() {
    let string = ''

    for (let card of CurrenciesArray) {
        string += `<!-- Card -->
		<div fullcard="${card.symbol}" class="credit-card-container">
		<div class="spinner${card.id} spinner spinner-border text-primary spinner-border-sm" role="status"></div>
		<div class="credit-card">
		<div class="front Myshadow">
		<button symbol="${card.symbol}" type="button" class="btn btn-Blue AddToChart">Add To Chart</button>
		<div class="cardText text-light">
		<p card="${card.id}" class="cardHeading">
		${card.name}
		<span class="cardSubHeading">
		${card.symbol}
		</span>
		</p>
		<!-- Card More -->
		<span class="cardmore${card.id} cardMore displayNone"></span>
		</div>
		</div>
		</div>
		</div>`
    }

    $('.CardsArea').html(string)
    // Hide spinners
    $('.spinner').hide()
    for (let activeId of allActiveCards) {
        let button = $(`[symbol=${activeId}]`)
        ToggleActive(button)
    }

    // ---------------- Click
    //When clicking on add to chart 
    $('.AddToChart').click(function () {

        //crypto id 
        let AddToChartId = $(this).attr('symbol')
        //actual button div
        let currentButton = $(this)

        CheckIfInLocal(AddToChartId)
        CheckIfActive(AddToChartId, currentButton)

        homeChartDataGate() 
        currencyChart()

    })

    //When clicking on card heading 
    $('.cardHeading').click(function OpenCard() {

        let credit_card = $(this).parent().parent().parent()
        let front = $(this).parent().parent()
        let back = $(credit_card).children('.back')
        let cardMore = $(this).parent().children('.cardMore')
        let imgLogo = $(this).parent().children().children('.imglogo')
        // Value
        let value = $(this).attr('card')

        CheckIfInLocal(value)

        cardMore.toggleClass('displayNone')
        front.toggleClass('expandCard')
        back.toggleClass('expandCard displayNone')
        imgLogo.toggleClass('displayNone', 150)
    })
}
// -------------------------------------------------- 

//Information in card (line 258)
function cardInfo(value) {
    let Json = JSON.parse(localStorage.getItem(value))

    let USD = Json.market_data.current_price.usd
    let EUR = Json.market_data.current_price.eur
    let ILS = Json.market_data.current_price.ils
    let BTC = Json.market_data.current_price.btc
    let LastUpdated = Json.last_updated
    let Ranking = Json.coingecko_rank

    let trimmedUSD = String(USD).substr(0, 5)
    let trimmedEUR = String(EUR).substr(0, 5)
    let trimmedILS = String(ILS).substr(0, 5)
    let trimmedBTC = String(BTC).substr(0, 5)
    let trimmedYear = LastUpdated.substring(2, 4)
    let trimmedMonth = LastUpdated.substring(5, 7)
    // let trimmedYear = new Date(LastUpdated).getFullYear()
    // let trimmedMonth = new Date(LastUpdated).getMonth()

    let string = ""
    string += `<div class="imglogo">
	<img class="cardLogo" src="${Json.image.small}" alt="${Json.name} image" width="50px" height="50px">
	</div>
	<div class="cardCurencyes d-flex mt-4">
	<p class="cardCurency">USD</p>
	<p class="cardCurency">EUR</p>
	<p class="cardCurency">LIS</p>
	<p class="cardCurency">BTC</p>
	</div>
	<div class="cardValue d-flex">
	<p class="value" style="margin-right: 16.5px;">${trimmedUSD}</p>
	<p class="value" style="margin-right: 16.5px;">${trimmedEUR}</p>
	<p class="value" style="margin-right: 11.5px;">${trimmedILS}</p>
	<p class="value" style="margin-right: 00.0px;">${trimmedBTC}</p>
	</div>
	<div class="cardCurencyes d-flex">
	<p class="cardCurency info">Updated</p>
	<p class="cardCurency info">Score</p>
	</div>
	<div class="cardValue d-flex">
	<p class="value infoValue" style="margin-right: 19.5px;">${trimmedMonth}/${trimmedYear}</p>
	<p class="value infoValue">${Ranking}</p>
	</div>
	<p class="cardFlip">PROVIDED BY<span class="cardWhight"> CoinGecko</span></p>
	</div>`

    $(`.cardmore${value}`).html(string)
}

//Print Modal (line 173)
//value = coin.id
PrintIntoModal = (value) => {
    //empty modal content
    $('.modalContent').html("")

    for (let card of allActiveCards) {
        //get the html content, or get element by attr 
        let full = $(`[fullcard=${card}]`).html()
        //Append to modal 
        $('.modalContent').append(full)
    }
    //Buttons in the modal 
    $('.modalContent .AddToChart').click(function () {
        let AddToChartId = $(this).attr('symbol')

        //Removes the name from allactivecards and addes clicked one 
        RemoveFromActive(AddToChartId)
        AddToActive(value)
        //Back to blue 
        ToggleActive($(`[symbol=${AddToChartId}]`))
        ToggleActive($(`[symbol=${value}]`))

        $('#exampleModal').modal('hide')

        homeChartDataGate()
        currencyChart()
    })
}

function chartCheackAcrtive() {
    if (allActiveCards.length == 0) {
        chartData = [
            [],
            [],
            [],
            [],
            []
        ]
        clearInterval(updateTimeint)
        clearInterval(printChartint)
        clearInterval(getDataint)
        printChart()

    } else {
        clearInterval(updateTimeint)
        clearInterval(printChartint)
        clearInterval(getDataint)
        updateTimeint = setInterval(updateTime, 2000);
        printChartint = setInterval(printChart, 2000);
        getDataint = setInterval(getData, 2000);
    }
}

function currencyChart() {
    chartCheackAcrtive()
    timeArray = []
    chartData = [
        [],
        [],
        [],
        [],
        [],
    ]
}

function updateTime() {
    let time = `${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`

    if (timeArray.length <= 9) {
        timeArray.push(time)
        console.log(timeArray);
    } else {
        timeArray.push(time)
        console.log(timeArray);
    }

    return timeArray
}

function getData() {
    $.each(allActiveCards, function (index, value) {

        let symbol = value.toUpperCase()

        $.ajax({
            type: 'GET',
            datatype: 'json',
            url: `${ChartsUrl}${symbol}&tsyms=USD`,
            success: function (data) {
                console.log(data.USD)
                if (data.USD) {
                    chartData[index].push(data.USD)
                } else {
                    alert(`Cannot show data of ${value}, data unfidined`)
                    clearInterval(updateTimeint)
                    clearInterval(printChartint)
                    clearInterval(getDataint)
                    $(`[symbol=${value}]`).trigger('click');
                }
                console.log(chartData);
            },
            error: function (error) {
                console.log('error :', error)
            }
        })
    })
}

function cahcklengthforchart() {
    let attr = 0
    if (allActiveCards.length == 1) {
        attr = 0.05
    } else(
        attr = ''
    )
    return attr
}

function printChart() {
    appendInfoToDom()
    // ----------------------- Red Live Chart
    var ctx = document.getElementById("redChart").getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            //Add time to array then put it here
            labels: timeArray,
            datasets: [
                {
                    label: allActiveCards[0],
                    data: chartData[0],
                    backgroundColor: 'rgba(0, 0, 0, 0)',
                    borderColor: '#ff6384',
                    borderWidth: 1,
                },
                {
                    label: allActiveCards[1],
                    data: chartData[1],
                    backgroundColor: 'rgba(0, 0, 0, 0)',
                    borderColor: '#ff9f40',
                    borderWidth: 1,
                },
                {
                    label: allActiveCards[2],
                    data: chartData[2],
                    backgroundColor: 'rgba(0, 0, 0, 0)',
                    borderColor: '#ffcd56',
                    borderWidth: 1,
                },
                {
                    label: allActiveCards[3],
                    data: chartData[3],
                    backgroundColor: 'rgba(0, 0, 0, 0)',
                    borderColor: '#4bc0c0',
                    borderWidth: 1,
                },
                {
                    label: allActiveCards[4],
                    data: chartData[4],
                    backgroundColor: 'rgba(0, 0, 0, 0)',
                    borderColor: '#36a2eb',
                    borderWidth: 1,
                },
            ]
        },
        options: {
            plugins: {
                // Change options for ALL labels of THIS CHART
                datalabels: {
                    display: false
                }
            },
            animation: {
                duration: 0
            },
            scales: {
                yAxes: [{
                    ticks: {
                        callback: function (value, index, values) {
                            return value + ' $'
                        },
                        beginAtZero: false,
                        stepSize: 0.05
                    }
                }]
            }
        }
    });

}

function appendInfoToDom(){
    if(allActiveCards.length != 0){
        $('.nameof01').html(`<b style="text-transform: uppercase;">${allActiveCards[0]}</b>`)
        $('.nameof02').html(`<b style="text-transform: uppercase;">${allActiveCards[1]}</b>`)
        $('.nameof03').html(`<b style="text-transform: uppercase;">${allActiveCards[2]}</b>`)
        $('.nameof04').html(`<b style="text-transform: uppercase;">${allActiveCards[3]}</b>`)
        $('.nameof05').html(`<b style="text-transform: uppercase;">${allActiveCards[4]}</b>`)

        $('.current01').html(`<b>${chartData[0][chartData[0].length-1]} $</b>`)
        $('.current02').html(`<b>${chartData[1][chartData[1].length-1]} $</b>`)
        $('.current03').html(`<b>${chartData[2][chartData[2].length-1]} $</b>`)
        $('.current04').html(`<b>${chartData[3][chartData[3].length-1]} $</b>`)
        $('.current05').html(`<b>${chartData[4][chartData[4].length-1]} $</b>`)
    }
}
