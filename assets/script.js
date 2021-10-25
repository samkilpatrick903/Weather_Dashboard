console.log(moment().format("M/D/YYYY"));

var currentContainer = $(".currentContainer");
var currentWeather = $("currentWeather");
var forecastContainer = $(".card-deck");
var search = $(".btn");
var searchHistory = [];

search.on("click", function (event) {
  event.preventDefault();

  var cityName = $(".inputArea").val();
  console.log(cityName);

  var searchedBtn = $(
    "<button class='btn btn-primary' type='button'>Search</button>"
  );
  searchedBtn.click(function (event) {
    event.preventDefault();
  });

  searchHistory.push(cityName);
  console.log(cityName);

  const jsonCityArr = JSON.stringify(searchHistory);

  localStorage.setItem("city", jsonCityArr);
  searchedBtn.text(cityName);
  getWeather(cityName);
});

function getWeather(cityName) {
  var request5Day = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=imperial&appid=deb2d4595b0266d3dd7a3a63088c406d`;

  fetch(request5Day)
    .then(function (response) {
      console.log(response);
      if (response.status === 200) {
        return response.json();
      }
    })
    .then(function (data) {
      var cityLat;
      var cityLon;
      console.log(data);
      console.log(data.city.coord);

      cityLat = data.city.coord.lat;
      cityLon = data.city.coord.lon;

      var cityHeader = $("#city");
      var cityDataName = data.city.name;
      cityHeader.text(cityDataName);

      for (i = 5; i < data.list.length; i += 8) {
        var day = moment(data.list[i].dt_txt).format("ddd, M/D/YYYY");
        console.log(day);
        var temp5 = data.list[i].main.temp;
        var wind5 = data.list[i].wind.speed;
        var humidity5 = data.list[i].main.humidity;
        var iconURL =
          "http://openweathermap.org/img/w/" +
          data.list[i].weather[0].icon +
          ".png";

        var forecastCards = $("<div class = 'card forecastCards'>");
        var img = $("<img class = 'card-img-top' alt='5 day forecast icon'/>");
        img.attr("src", iconURL);
        var cardBodyDiv = $("<div class = 'card-body'>");
        var date = $("<h4 class='card-title'></h4>");
        var temp = $("<p class='card-text temp5'></p>");
        var wind = $("<p class='card-text wind5'></p>");
        var humidity = $("<p class='card-text humidity5'></p>");

        date.text(day);
        temp.text("Temp: " + temp5 + String.fromCharCode(176) + "F");
        wind.text("Wind: " + wind5 + " MPH");
        humidity.text("Humidity: " + humidity5 + "%");

        cardBodyDiv.append(date);
        cardBodyDiv.append(temp);
        cardBodyDiv.append(wind);
        cardBodyDiv.append(humidity);
        forecastCards.append(img);
        forecastCards.append(cardBodyDiv);
        forecastContainer.append(forecastCards);
      }

      currentWeather(cityLat, cityLon);
    });

  function currentWeather(cityLat, cityLon) {
    console.log(cityLat);
    var requestWeather = `https://api.openweathermap.org/data/2.5/onecall?lat=${cityLat}&lon=${cityLon}&units=imperial&exclude=minutely,hourly,daily,alerts&appid=deb2d4595b0266d3dd7a3a63088c406d`;
    console.log(requestWeather);

    fetch(requestWeather)
      .then(function (response) {
        console.log(response);
        if (response.status !== 200) {
          console.log(response.status);
          return;
        } else {
          return response.json();
        }
      })
      .then(function (data) {
        console.log(data);

        var currentTemp = data.current.temp;
        var currentWind = data.current.wind_speed;
        var currentHumidity = data.current.humidity;
        var currentUvIndex = data.current.uvi;
        var currentDate = data.current.dt;
        console.log(currentDate);
        var iconURL =
          "http://openweathermap.org/img/w/" +
          data.current.weather[0].icon +
          ".png";
        console.log(currentTemp);

        var todaysDate = moment().format(" " + "(ddd, M/D/YYYY)");
        console.log(todaysDate);
        var temp = $(".temp");
        var wind = $(".wind");
        var humidity = $(".humidity");
        var uvIndex = $(".uvIndex");
        var uv = $(".uv");
        var header = $("#city");
        var img = $("<img class ='currentImg'/>");
        img.attr("src", iconURL);

        temp.text("Temp: " + currentTemp + String.fromCharCode(176) + "F");
        wind.text("Wind: " + currentWind + " MPH");
        humidity.text("Humidity: " + currentHumidity + "%");
        uvIndex.text("UV Index: ");
        uv.text(currentUvIndex);
        header.append(todaysDate);
        header.append(img);

        if (currentUvIndex <= 3) {
          uv.css({
            "background-color": "green",
            color: "white",
            padding: "8px",
            "border-radius": "8px",
          });
        } else if (currentUvIndex > 3 && currentUvIndex < 8) {
          uv.css({
            "background-color": "gold",
            padding: "8px",
            "border-radius": "8px",
          });
        } else {
          uv.css({
            "background-color": "red",
            color: "white",
            padding: "8px",
            "border-radius": "8px",
          });
        }
      });
  }

  clearContent();
  getHistory();
}

function clearContent() {
  $(".card-deck").html("");
}

function getHistory() {
  var searchHistoryDiv = $("#historyBtns");
  searchHistoryDiv.html("");

  if (localStorage.getItem("city")) {
    searchHistory = JSON.parse(localStorage.getItem("city"));
    console.log(searchHistory);

    for (var i = 0; i < searchHistory.length; i++) {
      var newBtns = $(
        "<button class='btn btn-primary' type='button'>Search</button>"
      );
      console.log(newBtns);
      newBtns.text(searchHistory[i]);
      searchHistoryDiv.append(newBtns);

      newBtns.click(function (event) {
        event.preventDefault();
        var searchedCity = $(event.target);
        var prevCity = searchedCity.text();
        console.log(prevCity);
        getWeather(prevCity);
      });
    }
  }
}
