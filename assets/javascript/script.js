M.AutoInit();

document.addEventListener('DOMContentLoaded', function () {
    var elems = document.querySelectorAll('.dropdown-trigger');
    var instances = M.Dropdown.init(elems, options);
    instances.open();
});



function onload() {



    displayArea = document.getElementById("display-area");
    omdbDisplayArea = document.getElementById("omdb-display");

    let moviesArray = [];


    $("#button-search").on("click", function () {
        omdbDisplayArea.innerHTML = "";
        console.log(document.getElementById('user-input').value);

        if (document.getElementById("movieCheck").checked) {

            console.log("movie checked");

            let searchTerm = document.getElementById('user-input').value;

            //let searchTerm = userInput.value;
            console.log(searchTerm);
            let omdbQueryUrl = "https://www.omdbapi.com/?t=" + searchTerm + "&apikey=trilogy";
            console.log(omdbQueryUrl);

            axios.get(omdbQueryUrl)
                .then(function (response) {

                    omdbDisplayArea.innerHTML = "";
                    console.log(response);
                    const movieDisplay = document.createElement("div");
                    const titleDisplay = document.createElement("p");
                    const releasedDisplay = document.createElement("p");
                    const ratingIMDBDisplay = document.createElement("p");
                    const ratingRottenTomatoDisplay = document.createElement("p");
                    const ratingMetaCritDisplay = document.createElement("p");
                    const nytReviewBtn = document.createElement("a");
                    const posterDisplay = document.createElement("img");

                    console.log(response.data.Title);
                    titleDisplay.innerHTML = "Title: " + response.data.Title;
                    movieDisplay.append(titleDisplay);

                    console.log(response.data.Released);
                    releasedDisplay.innerHTML = "Released: " + response.data.Released;
                    movieDisplay.append(releasedDisplay);

                    console.log(response.data.Ratings[0].Value);
                    ratingIMDBDisplay.innerHTML = "IMDB Rating: " + response.data.Ratings[0].Value;
                    movieDisplay.append(ratingIMDBDisplay);

                    console.log(response.data.Ratings[1].Value);
                    ratingRottenTomatoDisplay.innerHTML = "Rotten Tomato Rating: " + response.data.Ratings[1].Value;
                    movieDisplay.append(ratingRottenTomatoDisplay);

                    console.log(response.data.Ratings[2].Value);
                    ratingMetaCritDisplay.setAttribute("class", "meta-critic")
                    ratingMetaCritDisplay.innerHTML = "MetaCritic Rating: " + response.data.Ratings[2].Value;
                    movieDisplay.append(ratingMetaCritDisplay);

                    const movieTitle = response.data.Title;


                    let nytReviewURL = "https://api.nytimes.com/svc/movies/v2/reviews/search.json?query=" + movieTitle + "&api-key=J4LLcLYdwjbGQvjGuEQK9mGgePlM1SWk";

                    axios.get(nytReviewURL)
                        .then(function (response) {
                            console.log(response);
                            moviesArray = response.data.results;
                            console.log(moviesArray);

                            for (i = 0; i < moviesArray.length; i++) {
                                let nytDisplayTitle = response.data.results[i].display_title;
                                console.log(nytDisplayTitle);
                                if (nytDisplayTitle === movieTitle) {
                                    console.log("matched title")
                                    const movieLink = document.createElement("a");

                                    movieLink.innerHTML = moviesArray[i].display_title;
                                    movieLink.setAttribute("href", moviesArray[i].link.url);
                                    movieLink.setAttribute("class", "button");
                                    movieLink.setAttribute("target", "blank");
                                    // movieDisplay.append(movieLink);
                                    omdbDisplayArea.prepend(movieLink);
                                };
                            }
                        })




                    posterDisplay.setAttribute("src", response.data.Poster);
                    posterDisplay.setAttribute("id", "posterImg")
                    movieDisplay.append(posterDisplay);

                    omdbDisplayArea.append(movieDisplay);


                })
        }


        if (document.getElementById("gameCheck").checked) {

            console.log("game checked");

            console.log("button clicked");
            let appId = [];
            let input = document.getElementById('user-input').value;
            console.log(input);

            axios.get('https://cors-anywhere.herokuapp.com/https://api.steampowered.com/ISteamApps/GetAppList/v2/')
                .then(function (response) {

                    console.log(JSON.stringify(response, null, 2));

                    appId.push(response);

                    let targetID = response.data.applist.apps.find(appName => appName.name === input);

                    console.log("targetID", targetID);
                    console.log("targetID", targetID.appid);
                    let ID = targetID.appid;
                    storeURL = 'https://cors-anywhere.herokuapp.com/https://store.steampowered.com/api/appdetails?appids=' + targetID.appid;

                    console.log(storeURL);

                    axios.get(storeURL)
                        .then(function (response2) {

                            console.log("2nd get function run");
                            console.log(response2);


                            //game summary

                            let summary = $('<br> <h4 class="left-align"> Game Summary: </h4> <br> <p class="left-align"><br> ' + response2.data[ID].data.about_the_game + '</p><br>');
                            $('#omdb-display').append(summary);

                            //game trailer

                            console.log(response2.data[ID].data.movies[0].webm.max);
                            let trailer = $('<br><video width="1280" height="720" controls> <source src=' + response2.data[ID].data.movies[0].webm.max + 'type=video/ogg> </video> <br><br>');
                            $('#omdb-display').prepend(trailer);

                            //game name

                            console.log(response2.data[ID].data.name);
                            let gameName = $('<br> <h1>' + response2.data[ID].data.name + '</h1>');
                            $('#omdb-display').prepend(gameName);

                            //developer

                            console.log(response2.data[ID].data.developers);
                            let developers = $('<br> <p> Game Developer(s): ' + response2.data[ID].data.developers + '</p> <br><br>');
                            $('#omdb-display').append(developers);


                            //publisher

                            console.log(response2.data[ID].data.publishers);
                            let publishers = $('<br> <p> Game Publisher(s): ' + response2.data[ID].data.publishers + '</p> <br><br>');
                            $(developers).append(publishers);


                            //metacritic

                            console.log(response2.data[ID].data.metacritic.score);
                            let metacriticScore = $('<br> <p> Metacritic Score: ' + response2.data[ID].data.metacritic.score + '</p> <br>');
                            $('#omdb-display').append(metacriticScore);

                            let metacriticURL = $('<br> <p>Metacritic Website: <a href="' + response2.data[ID].data.metacritic.url + '"> Metacritic.com </a></p> <br><br>');
                            $(metacriticScore).append(metacriticURL);



                        });
                });
        }
    });
}
onload()
