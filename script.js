$(document).ready(onPageLoad);

function onPageLoad() {
    var apiKey = "686f35ad8c434c5f9f7120343262302";

    $("#searchBtn").click(onSearchClick);

    function onSearchClick() {
        getWeather(apiKey);
    }
}

function getWeather(apiKey) {

    console.log("Button clicked");

    var city = $("#cityInput").val().trim();

    if (city === "") {
        showMessage("Please enter a city");
        return;
    }

    var url = buildApiUrl(apiKey, city);

    showMessage("Loading...");

    $.ajax({
        url: url,
        type: "GET",
        success: onApiSuccess,
        error: onApiError
    });
}

function buildApiUrl(apiKey, city) {
    return "https://api.weatherapi.com/v1/current.json?key="
        + apiKey + "&q=" + city + "&aqi=no";
}

function onApiSuccess(data) {

    console.log("API SUCCESS");
    console.log(data);

    $("#temperature").text(data.current.temp_c + "°C");
    $("#condition").text(data.current.condition.text);
    $("#humidity").text("Humidity: " + data.current.humidity + "%");
    $("#wind").text("Wind: " + data.current.wind_kph + " kph");
    $("#weatherIcon").attr("src", "https:" + data.current.condition.icon);
}

function onApiError(err) {

    console.log("API ERROR");
    console.log(err);

    showMessage("City not found");
}

function showMessage(message) {
    $("#condition").text(message);
}