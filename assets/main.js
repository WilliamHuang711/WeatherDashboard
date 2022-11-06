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
            let cityName = $(".jumbotron").addClass("city-weather is-size-3 has-text-centered has-background-info-light").text(citySearch + "'s Weather Details ");
            let currentDate = moment().format("  MM-DD-YYYY");
            let windData = $("<p>").text("Wind Speed: " + response.wind.speed).addClass('is-size-5 has-text-grey-dark mt-5');
            let humidityData = $("<p>").text("Humidity: " + response.main.humidity + "%").addClass("is-size-5 has-text-grey-dark");
            var iconcode = response.weather[0].icon;
            var iconurl = "https://openweathermap.org/img/w/" + iconcode + ".png";
            let weatherImg = $("<img>").attr("src", iconurl);
            let date = $("<p>").text(moment.unix().format("MMM Do YY")).addClass("is-size-5 has-text-grey-dark");
            $("#five-day").empty();
            // Convert the temp to fahrenheit
            let tempF = (response.main.temp - 273.15) * 1.80 + 32;
            let roundedTemp = Math.floor(tempF);

            //temp elements added to html
            let tempData = $("<p>").text("Temp (K): " + response.main.temp + "°").addClass("is-size-5 has-text-grey-dark");
            let tempDataF = $("<p>").text("Temp (F): " + roundedTemp + "°").addClass("is-size-5 has-text-grey-dark");

            //append the elements together
            cityName.append(weatherImg, currentDate, windData, humidityData, tempData, tempDataF);
            $("container").append(cityName);

            //ajax call for UV Index
            let latitude = response.coord.lat;
            let longitude = response.coord.lon;
            let uvIndexURL = "https://api.openweathermap.org/data/2.5/uvi?" + APIKey + "&lat=" + latitude + "&lon=" + longitude;
            $.ajax({
                type: "GET",
                url: uvIndexURL,
            }).then(function (responseUV) {
                let currentUV = $("<div>").addClass('is-size-5 has-text-grey-dark mb-4').text("UV Index: ");
                let uvValue = $("<span class='badge id='current-uv-level'>").text(responseUV.value);
                currentUV.append(uvValue);
                cityName.append(currentUV);
                renderSearchList();
            })

            //5 days forecast ajax
            let day5QueryURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&units=imperial" + APIKey;

            for (let i = 1; i < 6; i++) {
                $.ajax({
                    url: day5QueryURL,
                    type: "GET"
                }).then(function (response5Day) {
                    let cardbodyElem = $("<div>").addClass("card-body");

                    let fiveDayCard = $("<div>");
                    let fiveDate = $("<h5>").text(moment.unix(response5Day.daily[i].dt).format("MM/DD/YYYY"));
                    fiveDayCard;

                    let fiveDayTemp = $("<p>").text("Temp: " + response5Day.daily[i].temp.max + "°");
                    fiveDayTemp.attr("id", "#fiveDayTemp[i]");

                    let fiveHumidity = $("<p>").attr("id", "humDay").text("Humidity: " + JSON.stringify(response5Day.daily[i].humidity) + "%");
                    fiveHumidity.attr("id", "#fiveHumidity[i]");

                    let iconCode = response5Day.daily[i].weather[0].icon;
                    let iconURL = "https://openweathermap.org/img/w/" + iconCode + ".png";
                    let weatherImgDay = $("<img>").attr("src", iconURL);
                    $("#testImage").attr("src", iconURL);

                    cardbodyElem.append(fiveDate);
                    cardbodyElem.append(weatherImgDay);
                    cardbodyElem.append(fiveDayTemp);
                    cardbodyElem.append(fiveHumidity);
                    fiveDayCard.append(cardbodyElem);
                    $("#five-day").append(fiveDayCard);
                    $("#fiveDayTemp[i]").empty();
                    $(".jumbotron").append(cardbodyElem);
                })
            }
            $("#search").val("");

        })

    }
    $(document).on("click", ".city-btn", function () {
        JSON.parse(localStorage.getItem("cities"));
        let citySearch = $(this).text();
        triggerSearch(citySearch);
    });

    function renderSearchList() {
        let searchList = JSON.parse(localStorage.getItem("cities"));
        $("#search-list").empty();
        if (searchList) {
            for (i = 0; i < searchList.length; i++) {
                let listBtn = $("<button>").addClass("button city-btn is-light is-normal is-rounded").attr('id', 'cityname_' + (i + 1)).text(searchList[i]);
                let listElem = $("<li>").attr('class', 'search-history is-size-4 mt-3');
                listElem.append(listBtn);
                $("#search-list").append(listElem);
            }

        }

    }

})