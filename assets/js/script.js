var apiKey = "b97e3e2f12586674c02d56c7194b1ef7";

var city = "Madison"

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
    })
}

getLocationData(city)


//search for city
//display current conditions of city
    //display city name, date, icon representation of conditions, temperature, humidity, wind speed, UV index
    //display color to indicate if weather is favorable, moderate, or severe
//display future conditions for city
    //display 5 day forecast, date, icon representation of weather conditions, temperature, wind speed, humidigy
//save search in local storage
//display saved searches
    //when clicked, user is presesented with current and future weather conditions