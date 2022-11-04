let city = $('.city');
let wind = $('.wind');
let humidity = $(".humidity");
let temp = $(".temp");

let searchArr = [];
let APIKey = "&appid=b9330bfd0b1bf5fe0c849c27df315565";

$(document).ready(function () {
    renderSearchList();
    
    $("#searchBtn").click(function (event) {
        event.preventDefault();
        let searchTerm = $("#search").val().trim();
        triggerSearch(searchTerm);
    })

    function triggerSearch(citySearch) {
        //construct the URL
        let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" +
            citySearch + APIKey;

        //add search term to top of list of cities
        $("<button>").text(citySearch).prepend(".search-history");
        //ajax call for local weather
        $.ajax({
            type: "GET",
            url: queryURL
        }).then(function (response) {
            let previousCity = JSON.parse(localStorage.getItem("cities"));
            if (previousCity) {
                previousCity.push(response.name);
                localStorage.setItem("cities", JSON.stringify(previousCity));
            } else {
                searchArr.push(response.name)
                localStorage.setItem("cities", JSON.stringify(searchArr));
            }
            //transfer content to HTML
            let cityName = $(".jumbotron").addClass("city-weather").text(citySearch + " Weather Details  ");
            let currentDate = moment().format("  MM-DD-YYYY");
            let windData = $("<p>").text("Wind Speed: " + response.wind.speed).addClass("lead");
            let humidityData = $("<p>").text("Humidity: " + response.main.humidity + "%").addClass("lead");
            var iconcode = response.weather[0].icon;
            var iconurl = "https://openweathermap.org/img/w/" + iconcode + ".png";
            let weatherImg = $("<img>").attr("src", iconurl);
            let date = $("<p>").text(moment.unix().format("MMM Do YY")).addClass("lead");
            $("#five-day").empty();
            // Convert the temp to fahrenheit
            let tempF = (response.main.temp - 273.15) * 1.80 + 32;
            let roundedTemp = Math.floor(tempF);

            

}