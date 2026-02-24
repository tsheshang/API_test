document.getElementById("getWeather").onclick = fetchWeatherData;

function fetchWeatherData() {

    var cityName = document.getElementById("city").value;
    var apiKey = "YOUR_API_KEY_HERE";

    var requestUrl = "http://api.weatherapi.com/v1/current.json/q"
        + cityName + "&appid=" + apiKey + "&units=metric";

    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (weatherData) {
            displayWeatherData(weatherData);
        })
        .catch(function () {
            showErrorMessage();
        });
}

function displayWeatherData(weatherData) {

    var temperature = weatherData.main.temp;
    var weatherCondition = weatherData.weather[0].description;

    document.getElementById("result").innerHTML =
        "Temperature: " + temperature + "°C <br>" +
        "Condition: " + weatherCondition;
}

function showErrorMessage() {

    document.getElementById("result").innerHTML =
        "City not found ";
}
