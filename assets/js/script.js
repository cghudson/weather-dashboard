var apiKey = "b97e3e2f12586674c02d56c7194b1ef7";
var city = "";
var citySearchEl = document.querySelector(".search");
var searchBtnEl = document.querySelector(".search-btn");
var date = dayjs().format("MM/DD/YYYY");

//display last search or default city on page load
var cityListEl = JSON.parse(localStorage.getItem("search"));
if (cityListEl) {
  var cityLast = cityListEl[cityListEl.length - 1];
} else {
  var cityLast = "Madison";
}
getLocationData(cityLast);

//fetch lat, lon, and city name from api
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
      getCurrentWeather(data[0].lat, data[0].lon, city);
    });
}

//fetch current weather from api and display current weather
function getCurrentWeather(lat, lon, city) {
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
      futureForecastEl.innerHTML = "";

      //generate cards for 5-day forecast
      for (var i = 1; i < 6; i++) {
        var fiveDay = document.createElement("div");
        fiveDay.classList.add(
          "cardStyle",
          "card-body",
          "text-center",
          "p-2",
          "m-2",
          "col-lg-2"
        );

        var futureDate = document.createElement("p");
        futureDate.textContent = dayjs().add(i, "day").format("MM/DD/YYYY");
        fiveDay.appendChild(futureDate);

        var futureIconEl = document.createElement("img");
        futureIconEl.setAttribute(
          "src",
          "https://openweathermap.org/img/wn/" +
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

//save to local storage
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
    displayLocalStorage();
  }
}

//display city weather data from local storage
function displayLocalStorage() {
  var savedSearchEl = document.querySelector(".savedSearch");
  savedSearchEl.textContent = "";

  var cityListEl = localStorage.getItem("search");
  if (!cityListEl) {
    cityListEl = [];
  } else {
    cityListEl = JSON.parse(cityListEl);
  }

  savedSearchEl.innerHTML = "";
  for (var i = 0; i < cityListEl.length; i++) {
    var list = document.createElement("li");
    list.textContent = cityListEl[i];
    list.classList.add("historyBtn");
    savedSearchEl.appendChild(list);
  }
}

//clear searches
function clearSearches() {
  var clearBtn = document.querySelector(".clear");
  clearBtn.addEventListener("click", function () {
    localStorage.clear();
    location.reload();
  });
}

//click past searches and view weather data
var savedSearchEl = document.querySelector(".savedSearch");
savedSearchEl.addEventListener("click", function (event) {
  if (event.target.tagName === "LI") {
    var cityName = event.target.textContent;
    getLocationData(cityName);
  }
});

searchBtnEl.addEventListener("click", saveWeather);
clearSearches();
displayLocalStorage();
