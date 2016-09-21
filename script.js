/**
 Project Name: SNAPPY TITLE
 File Name: script.js
 Author: Collette Tamez, Daniel Lee, Dave Weizenegger, Kyle Marx
 Date: 09/21/2016
 Objective: Hackathon project involving the combination of different data sources into an application or game
 Prompt: https://github.com/Learning-Fuze/c10_api_hackathon/
 */
/**
 * makeFirstAjaxCall - makes a request to The Movie DB to return search results via AJAX
 * @param movie
 */
function makeTmdbAjaxCall(movie) {
    /**
     * dataToSendServerForFirstCall - local variable that holds the data to send to The Movie DB database API in the first AJAX call
     * @type {{api_key: string, query: *}}
     */
    var dataToSendServerForFirstCall = {
        api_key: "7e73e5037ed00682f5aae1e5b6d940a4",
        query: movie
    };
    /**
     * dataToSendServerForSecondCall - local variable that holds the data to send to The Movie DB database in the second AJAX call
     * @type {{api_key: string}}
     */
    var dataToSendServerForSecondCall  = {
        api_key: "7e73e5037ed00682f5aae1e5b6d940a4"
    };
    /**
     * AJAX call to The Movie Database API that performs a search query based on the keyword variable
     */
    $.ajax({
        data: dataToSendServerForFirstCall,
        dataType: "JSON",
        method: "GET",
        url: "https://api.themoviedb.org/3/search/movie?",
        /**
         * anonymous error function - lets the user know their search was invalid
         * @param response
         */
        error: function (response) {
            $("<h1>").text("We couldn't find anything!").appendTo("#divForQuote");
        }
        /**
         * anonymous success function - executes on success of first ajax call?
         * @param response
         */
    }).then(function (response) {
        /**
         * result - local variable that stores the object at index zero of the key "results" array in response object
         */
        var result = response.results[0];
        /**
         * movieID - local variable that stores the value of the key id in the results variable
         */
        var movieID = result.id;
        /**
         * url - stores the url to be sent to the data base that includes the necessary path parameter
         * @type {string}
         */
        var urlForMovieData = 'https://api.themoviedb.org/3/movie/' + movieID + '?';
        /**
         * ajax call to The Movie DB API to retrieve detailed movie information
         */
        $.ajax({
            data: dataToSendServerForSecondCall,
            dataType: "JSON",
            method: "GET",
            url: urlForMovieData,
            /**
             * anonymous error function - lets the user know there was an error
             * @param response
             */
            error: function (response) {
                $("<h1>").text("We couldn't find anything!").appendTo("#divForQuote");
            },
            /**
             * anonymous success function - on successful request appends selected information to DOM
             * @param response
             */
            success: function (response) {
                /**
                 * result - local variable that stores the response object
                 */
                var movieData = response;
                /**
                 * moviePoster - local variable that concats URL needed to resolve a TMDB image and the backdrop_path image file path in response object
                 * @type {string}
                 */
                var moviePoster = "http://image.tmdb.org/t/p/original" + movieData.backdrop_path;
                $("#divForQuote").empty();
                $("body").css('background-image', 'url(' + moviePoster + ')');
                $("<h1>").text(movieData.original_title).appendTo("#divForQuote");
                $("<h2>").text(movieData.tagline).appendTo("#divForQuote");
                $("<h3>").text(movieData.release_date).appendTo("#divForQuote");
                $("<p>").text(movieData.overview).appendTo("#divForQuote");
            }
        })
    })
}

/**
 * Listen for the document to load and calls addClickHandlers function
 */
$(document).ready(function () {
    addClickHandlers();
});
/**
 * searchTerm - empty string
 * @type {string}
 */
var searchTerm = "";
/**
 * url - empty string to be defined later
 * @type {string}
 */
var url = "";
/**
 * Function to start the ajax call to itunes
 */
function searchItunes() {
    searchTerm = $('#searchIt').val();
    url = "https://itunes.apple.com/search?media=music&order=popular&term=" + searchTerm + " soundtrack&callback=?";
    $.getJSON(url, function (data) {
        $('#musicSrc').attr('src', data.results[0].previewUrl);
        $('#musicImg').attr('src', data.results[0].artworkUrl100);
        $('#artistName').text(data.results[0].artistName);
        $('#music').attr('src', data.results[0].previewUrl);
    });
}
/**
 * music - variable to create music player
 * @type {Element}
 */
var music = document.getElementById("music");
music.pause();
music.volume = 1.0;
/**
 * addClickHandlers - and click handler functions to button in DOM with id of movieInfo
 */
function addClickHandlers() {
    $("#random").click(quoteToMovie);
    $('#ajaxCall').click(function () {
        searchItunes();
        makeAjaxCall();
    });
}
/**
 * quoteToMovie - makes an ajax call to famous quotes API and calls the makeTmdbAjaxCall function on success
 */
function quoteToMovie() {
    $.ajax({
        type: "POST",
        headers: {
            "X-Mashape-Key": "OivH71yd3tmshl9YKzFH7BTzBVRQp1RaKLajsnafgL2aPsfP9V"
        },
        dataType: 'json',
        url: 'https://andruxnet-random-famous-quotes.p.mashape.com/?cat=movies'
    }).then(function(res) {
        ///console.log(res);
        /**
         * quote - local variable that holds value of the key "quote" in the response object
         */
        var quote = res.quote;
        /**
         * local variable that holds value of the key "author" in the response object
         * @type {*}
         */
        var movie = res.author;
        /// console.log(quote + ' - ' + movie);
        makeTmdbAjaxCall(movie);
    })
}

