$(document).ready(function() {
    var searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    renderSearchHistory();

// Click functions

    // Search Button Click Function
    $('button').on('click', function() {
        var city = $('input').val().trim();
        if (city !== '') {
            addToSearchHistory(city);
            fetchWeatherData(city);
            $('input').val('');
        }
    });

    // Search Button Enter Key
    $('input').on('keypress', function(event) {
        if (event.keyCode === 13) {
            $('button').click();
        }
    });

    // Search History Item Click
    $(document).on('click', '.list-group-item', function() {
        var city = $(this).text();
        fetchWeatherData(city);
    });

// Previously searched cities/Local Storage

    function addToSearchHistory(city) {
        //Check if the city has already been searched
        if (searchHistory.indexOf(city) === -1) {
            searchHistory.push(city);

            // Update local storage
            localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
            renderSearchHistory();
        }
    }

// Render the search history
function renderSearchHistory() {
    $('.search-history').empty();

    // Render each item
    searchHistory.forEach(function(city) {
        var listItem = $('<li>').addClass('list-group-item').text(city);
        $('.search-history').prepend(listItem);
    });
}

// Fetch weather data for cities

})