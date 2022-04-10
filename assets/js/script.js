var apiKey = "b97e3e2f12586674c02d56c7194b1ef7";

var city = ""
var citySearchEl = document.querySelector(".search")
var searchBtnEl = document.querySelector(".search-btn")
var date = (dayjs().format("MM/DD/YYYY"))

function getLocationData() {
    var cityData = "https://api.openweathermap.org/geo/1.0/direct?q="+ city + "&limit=1&appid=" + apiKey

    fetch(cityData)
    .then(function(response) {
        return response.json()
    }) .then(function(data) {
        getCurrentWeather(data[0].lat, data[0].lon)
    })
}

function getCurrentWeather(lat, lon) {
    fetch("https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey + "&units=imperial")
    .then(function (response) {
        return response.json()
    })
    .then(function (weatherData) {
        console.log(weatherData)
        var currentCity = document.querySelector(".currentCity")
        var icon = weatherData.weather[0].icon
        var iconURL = "https://openweathermap.org/img/wn/" + icon + "@2x.png"

        currentCity.innerHTML = (weatherData.name + " " + date + '<img src="' + iconURL + '">')
        
    })
}

function saveWeather (event) {
    event.preventDefault()
    if (citySearchEl.value !== "") {
        city = citySearchEl.value
        getLocationData(city)

        var savedSearchEl = document.querySelector(".savedSearch")
        savedSearchEl.textContent = ""

        var cityListEl = localStorage.getItem("search")
        if (!search) {
            cityListEl = []
        } else {
            cityListEl = JSON.parse(cityListEl)
        }
        cityListEl.push(city);

        var search = JSON.stringify(cityListEl)
        localStorage.setItem("search", search)

        for (var i = 0; i < search.length; i++) {
            var list = document.createElement("li")
            list.textContent = cityListEl[i]
            //setAttribute - class/id
            savedSearchEl.appendChild(list)
        }
    }
}

searchBtnEl.addEventListener("click", saveWeather)





//search for city
//display current conditions of city
    //display city name, date, icon representation of conditions, temperature, humidity, wind speed, UV index
    //display color to indicate if weather is favorable, moderate, or severe
//display future conditions for city
    //display 5 day forecast, date, icon representation of weather conditions, temperature, wind speed, humidigy
//save search in local storage
//display saved searches
    //when clicked, user is presesented with current and future weather conditions