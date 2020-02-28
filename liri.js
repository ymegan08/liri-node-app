// Set environment variables
require("dotenv").config();

// Variables
var keys = require("./keys.js");
var moment = require("moment");
var axios = require("axios");
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);
var fs = require("fs");

// Variables for reading user input
var command = process.argv[2];
var value = "";
var valueInput = process.argv;

// In the case that the value is more than one word
for (let i = 3; i < valueInput.length; i++){
    value += valueInput[i] + "+";
}

if (value.endsWith("+")){
    value = value.substring(0, value.length - 1);
}

// Switch statement for determining user commands
switch (command){
    case "concert-this":
        concertThis(value);
        break;
    case "spotify-this-song":
        spotifyThisSong(value);
        break;
    case "movie-this":
        movieThis(value);
        break;
    case "do-what-it-says":
        doWhatItSays();
        break;
}

// Function to search artist events on BandsinTown API
function concertThis(value){
    axios.get("https://rest.bandsintown.com/artists/" + value + "/events?app_id=codingbootcamp")
    .then(function(response){
        for (var i = 0; i < response.data.length; i++){
            var eventDate = response.data[i].datetime.split("T");
            var concertResults =
            "--------------------------------------------" +
            "\nVenue Name: " + response.data[i].venue.name +
            "\nVenue Location: " + response.data[i].venue.city + ", " + response.data[i].venue.country +
            "\nDate of the Event: " + moment(eventDate[0]).format("MM-DD-YYYY");
            console.log(concertResults);
        }
    })
    .catch(function(error){
        if(error){
            console.log(error);
        }
    });
}

// Function to search song on Spotify API
function spotifyThisSong(value){
    if(!value){
        value = "the+sign";
    }
    spotify.search({ type: "track", query: value })
    .then(function(response){
        for (var i = 0; i < response.tracks.items.length; i++){
            var spotifyResults =
            "-------------------------------------------------------------------------------------------------------" +
            "\nArtist(s): " + response.tracks.items[i].artists[0].name +
            "\nSong Name: " + response.tracks.items[i].name +
            "\nAlbum Name: " + response.tracks.items[i].album.name +
            "\nPreview Link: " + response.tracks.items[i].preview_url;
            console.log(spotifyResults);
        }
    })
    .catch(function(error){
        if(error){
            console.log(error);
        }
    });
}

// Function to search movie information on OMDB API
function movieThis(value){
    if(!value){
        value = "mr+nobody";
    }
    axios.get("https://www.omdbapi.com/?t=" + value + "&y=&plot=short&apikey=trilogy")
    .then(function(response){

        var movieResults = 
        "------------------------------------------------------------------------------------------------------------" +
        "\nMovie Title: " + response.data.Title +
        "\nRelease Year: " + response.data.Year +
        "\nIMDB Rating: " + response.data.imdbRating +
        "\nRotten Tomatoes Rating: " + response.data.tomatoRating +
        "\nProduced In: " + response.data.Country +
        "\nLanguage: " + response.data.Language +
        "\nPlot: " + response.data.Plot +
        "\nActors: " + response.data.Actors;
        console.log(movieResults);
    })
    .catch(function(error){
        if(error){
            console.log(error);
        }
    })
}

// Function that uses fs package to call one of LIRI's commands
function doWhatItSays(){
    fs.readFile("random.txt", "utf8", function(error, data){
        if(error){
            return console.log(error);
        }
        var textArr = data.split(",");
        spotifyThisSong(textArr[1]);
    })
}