$(document).ready(function () {
    var searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    renderSearchHistory();

    // Click functions

    // Search Button Click Function
    $('button').on('click', function () {
        var city = $('input').val().trim();
        if (city !== '') {
            addToSearchHistory(city);
            fetchWeatherData(city);
            $('input').val('');
        }
    });

    // Search Button Enter Key
    $('input').on('keypress', function (event) {
        if (event.keyCode === 13) {
            $('button').click();
        }
    });

    // Search History Item Click
    $(document).on('click', '.list-group-item', function () {
        var city = $(this).text();
        fetchWeatherData(city);
    });

    // Clear Search History Click Function
    $('.clear-button').on('click', function() {
        clearSearchHistory();
    });

    function clearSearchHistory() {
        searchHistory = [];
        localStorage.removeItem('searchHistory');
        renderSearchHistory();
    }

    // Previously searched cities/Local Storage

    function addToSearchHistory(city) {
        //Check if the city has already been searched
        if (!searchHistory.includes(city)) {
            searchHistory.push(city);

            // Update local storage
            localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
            renderSearchHistory();
        }
    }

    // Render the search history
    function renderSearchHistory() {
        var searchHistoryContainer = $('.list-group');
        searchHistoryContainer.empty();
        searchHistory.forEach(function (city) {
            searchHistoryContainer.append('<li class="list-group-item">' + city + '</li>');
        });
    }

    // Fetch weather data for cities
    function fetchWeatherData(city) {
        var apiKey = '13d18342efaddb08465cfed49539d47c';
        var apiUrl = 'https://api.openweathermap.org/data/2.5/forecast?q=' + city + '&appid=' + apiKey;

        $.ajax({
            url: apiUrl,
            method: 'GET',
            dataType: 'json',
            success: function (response) {
                processWeatherData(response);
            },
            error: function () {
                alert('Error while fetching data. Please try again.');
            }
        });
    }

    // Processing the data to be displayed
    function processWeatherData(data) {
        var cityName = data.city.name;
        var currentWeather = data.list[0];
        var forecast = data.list.slice(1, 6);

        // Current weather
        $('.weather-city').text('City: ' + cityName);
        $('.weather-date').text('Date: ' + currentWeather.dt_txt);
        $('.weather-temperature').text('Temperature: ' + tempConversion(currentWeather.main.temp) + ' °F');
        $('.weather-humidity').text('Humidity: ' + currentWeather.main.humidity + '%');
        $('.weather-wind-speed').text('Wind Speed: ' + currentWeather.wind.speed + ' mph');

        // 5-day forecast
        $('.forecast-card').empty();
        forecast.forEach(function (day, index) {
            var forecastDate = new Date();
            forecastDate.setDate(forecastDate.getDate() + index + 1);
            var forecastDateString = forecastDate.toLocaleDateString();
            var card = `
        <div class="col-md-2 col-sm-4">            
            <div class="card">
                <p class="forecast-date">Date: ${forecastDate}</p>
                <p class="forecast-temperature">Temperature: ${tempConversion(day.main.temp)} °F</p>
                <p class="forecast-wind-speed">Wind Speed: ${day.wind.speed} mph</p>
                <p class="forecast-humidity">Humidity: ${day.main.humidity}%</p>
            </div>
        </div>
        `;
            $('.forecast-card').append(card);
        });
    }

    // Converting temperature to Fahrenheit since the API pulled the temperatures in Kelvin
    function tempConversion(kelvin) {
        var fahrenheit = (kelvin - 273.15) * 9 / 5 + 32;
        return Math.round(fahrenheit);
    }
});