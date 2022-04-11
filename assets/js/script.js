var apiKey = "b97e3e2f12586674c02d56c7194b1ef7";

var city = "";
var citySearchEl = document.querySelector(".search");
var searchBtnEl = document.querySelector(".search-btn");
var date = dayjs().format("MM/DD/YYYY");

var futureContainer = document.querySelector(".futureContainer");
var futureTitle = document.querySelector(".futureTitle");

function getLocationData(city) {
  var cityData =
    "https://api.openweathermap.org/geo/1.0/direct?q=" +
    city +
    "&limit=1&appid=" +
    apiKey;

  fetch(cityData)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      getCurrentWeather(data[0].lat, data[0].lon,city);
      console.log(data[0].name)
    });

}

function getCurrentWeather(lat, lon,city) {
  fetch(
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
      lat +
      "&lon=" +
      lon +
      "&appid=" +
      apiKey +
      "&units=imperial"
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (weatherData) {
      console.log(weatherData);
      var currentWeatherContainer = document.querySelector(".current-weather");
      currentWeatherContainer.classList.add(
        "border",
        "border-dark",
        "rounded",
        "m-2",
        "p-2"
      );

      var icon = weatherData.current.weather[0].icon;
      var iconURL = "https://openweathermap.org/img/wn/" + icon + "@2x.png";
      var iconEl = document.getElementById("icon");
      iconEl.innerHTML = '<img src="' + iconURL + '">';

      var currentCity = document.querySelector(".currentCity");
      //need to fix city name - does not display
      currentCity.textContent = city + " " + " - " + date;

      var temp = document.getElementById("temp");
      temp.textContent = "Temperature: " + weatherData.current.temp + " °F";

      var wind = document.getElementById("wind");
      wind.textContent = "Wind: " + weatherData.current.wind_speed + " MPH";

      var humidity = document.getElementById("humidity");
      humidity.textContent = "Humidity: " + weatherData.current.humidity + "%";

      var uv = document.getElementById("uv");
      uv.innerHTML = "UV Index: <span>" + weatherData.current.uvi + "</span>";
      var uvVal = uv.querySelector("span");

      if (weatherData.current.uvi <= 2) {
        uvVal.classList.add("fav");
      } else if (weatherData.current.uvi <= 6) {
        uvVal.classList.add("mod");
      } else {
        uvVal.classList.add("sev");
      }
      var futureForecastEl = document.querySelector(".future");
      futureForecastEl.innerHTML = ""
      for (var i = 1; i < 6; i++) {
        var fiveDay = document.createElement("div")
        fiveDay.classList.add(
            "cardStyle",
            "card",
            "card-group",
            "p-2",
            "m-2",
          );
        
        //get future dates
        var futureDate = document.createElement("p")
        futureDate.textContent = dayjs().add(i, 'day').format("MM/DD/YYYY")
        fiveDay.appendChild(futureDate)
        

        var futureIconEl = document.createElement("img");
        futureIconEl.setAttribute(
          "src",
          "http://openweathermap.org/img/wn/" +
            weatherData.daily[i].weather[0].icon +
            "@2x.png"
        );
        fiveDay.appendChild(futureIconEl);

        var futureTemp = document.createElement("p");
        futureTemp.textContent =
          "Temperature: " + weatherData.daily[i].temp.day + " °F";
       fiveDay.appendChild(futureTemp);

        var futureWind = document.createElement("p");
        futureWind.textContent =
          "Wind: " + weatherData.daily[i].wind_speed + " MPH";
        fiveDay.appendChild(futureWind);

        var futureHumidity = document.createElement("p");
        futureHumidity.textContent =
          "Humidity: " + weatherData.daily[i].humidity + "%";
        fiveDay.appendChild(futureHumidity);

        futureForecastEl.appendChild(fiveDay);
      }
    });
}

function saveWeather(event) {
  event.preventDefault();

  if (citySearchEl.value !== "") {
    city = citySearchEl.value;
    var savedSearchEl = document.querySelector(".savedSearch");
    savedSearchEl.textContent = "";

    var cityListEl = localStorage.getItem("search");
    if (!cityListEl) {
      cityListEl = [];
    } else {
      cityListEl = JSON.parse(cityListEl);
    }
    cityListEl.push(city);
    var search = JSON.stringify(cityListEl);
    localStorage.setItem("search", search);
    getLocationData(city);
    displayLocalStorage()
  }
}
displayLocalStorage()
function displayLocalStorage(){

    var savedSearchEl = document.querySelector(".savedSearch");
    savedSearchEl.textContent = "";

    var cityListEl = localStorage.getItem("search");
    if (!cityListEl) {
      cityListEl = [];
    } else {
      cityListEl = JSON.parse(cityListEl);
    }
  
    savedSearchEl.innerHTML = ""
    for (var i = 0; i < cityListEl.length; i++) {
      var list = document.createElement("li");
      list.textContent = cityListEl[i];
      //setAttribute - class/id
      savedSearchEl.appendChild(list);
    }
  
}

function clearSearches() {
  var clearBtn = document.querySelector(".clear");
  clearBtn.addEventListener("click", function () {
    localStorage.clear();
    location.reload();
  });
}

searchBtnEl.addEventListener("click", saveWeather);
clearSearches();
var savedSearchEl = document.querySelector(".savedSearch");
savedSearchEl.addEventListener("click", function(event) {
    console.log(event.target.tagName)
    if (event.target.tagName === "LI") {
        var cityName = event.target.textContent
        console.log(cityName)
        getLocationData(cityName)
    }
})
//search for city
//display current conditions of city
//display city name, date, icon representation of conditions, temperature, humidity, wind speed, UV index
//display color to indicate if weather is favorable, moderate, or severe
//display future conditions for city
//display 5 day forecast, date, icon representation of weather conditions, temperature, wind speed, humidigy
//save search in local storage
//display saved searches
//when clicked, user is presesented with current and future weather conditions
