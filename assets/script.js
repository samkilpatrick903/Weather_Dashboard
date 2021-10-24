console.log(moment().format("M/D/YYYY"));


var currentContainer = $(".currentContainer");
var currentWeather = $("currentWeather");
var forecastContainer = $(".card-deck");
var search = $(".btn");
var searchHistory = [];

search.on("click", function(event) {
    event.preventDefault();
    var cityName = $(".inputArea").val();
    console.log(cityName);

    var searchedBtn = $("<button class='btn btn-primary' type='button'>Search</button>");
    searchedBtn.click(function(event){
            event.preventDefault();
    })

    searchHistory.push(cityName);
    console.log(cityName);
    const jsonCityArr = JSON.stringify(searchHistory);
    localStorage.setItem("city", jsonCityArr);
    searchedBtn.text(cityName);
    getWeather(cityName);
});