Pebble.addEventListener('ready', function() {
    require('pebblejs');
    var UI = require('pebblejs/ui');
    var Vector2 = require('pebblejs/lib/vector2');

    var leagues = new UI.Menu({
      status: false,
        backgroundColor: 'white',
        textColor: 'black',
        highlightBackgroundColor: 'vivid-cerulean',
        highlightTextColor: 'black',
        sections: [{
            items: [{
                title: 'Football',
                icon: 'american_football.png'
            }, {
                title: 'Baseball',
                icon: 'baseball.png'
            }, {
                title: 'Hockey',
                icon: 'hockey_puck.png'
            }, {
                title: 'Basketball',
                icon: 'basketball.png'
            }, {
                title: 'About',
                icon: "about_icon.png"
            }]
        }]
    });


    var noGames = new UI.Window({
        backgroundColor: 'white'
    });

    var noGamesText = new UI.Text({
        position: new Vector2 (0, 50),
        size: new Vector2 (144, 168),
        font: 'gothic-28-bold',
        color: '#000000',
        text: "NO GAMES TO DISPLAY!",
        textOverflow: 'wrap',
        textAlign: 'center'
    });
    noGames.add(noGamesText);




    leagues.on('select', function(e) {
        if (e.item.title == 'About'){
            about();
        } else {
            getData(e.item.title);
        }
        
    });

    leagues.show();





    function getData(sport) {
        var APIURL = '';
        if (sport == "Football") {
            APIURL = 'http://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard';
        } else if (sport == "Hockey") {
            APIURL = 'http://site.api.espn.com/apis/site/v2/sports/hockey/nhl/scoreboard';
        } else if (sport == "Baseball") {
            APIURL = 'http://site.api.espn.com/apis/site/v2/sports/baseball/mlb/scoreboard';
        } else if (sport == "Basketball") {
            APIURL = 'http://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard';
        } else if (sport == "Soccer") {
            APIURL = 'http://site.api.espn.com/apis/site/v2/sports/soccer/league/scoreboard';
        } else {
            console.log('Not a sport :(');
        }
        
        var req = new XMLHttpRequest();
        req.open('GET', APIURL, true);
        req.onload = function(e) {
            if (req.readyState == 4) {
                // 200 - HTTP OK
                if (req.status == 200) {
                    var data = JSON.parse(req.responseText);
                    var games = data.events; 
                    showGamesMenu(sport, games);
                }
            }
        }
        req.send();
    }

    function showGamesMenu(sport, games) {

        var currentEpoch = new Date().getTime();
        var gameMenuItems = [];
        var filteredGames = [];

        console.log("Current Time " + currentEpoch);

        for (var i = 0; i < games.length; i++) {
            var gameEpoch = new Date(games[i].competitions[0].date).getTime();
            if (gameEpoch > currentEpoch) { 
                var gameMenuItem = {
                    title: games[i].shortName,
                    subtitle: games[i].competitions[0].competitors[1].score + " to " + games[i].competitions[0].competitors[0].score
                }
                gameMenuItems.push(gameMenuItem);
                filteredGames.push(games[i]);
                
            }
            console.log("Game Time " + gameEpoch);

        }

        var gameMenu = new UI.Menu({
            status: false,
            backgroundColor: 'white',
            textColor: 'black',
            highlightBackgroundColor: 'vivid-cerulean',
            highlightTextColor: 'black',
            sections: [{
                title: sport,
                items: gameMenuItems
            }]
        });

        if (gameMenuItems.length == 0) {
            noGames.show();
            console.log('no games to show');-
        } else {
            gameMenu.show();
        }
        
        gameMenu.on('select', function (e) {
            gameInformation(filteredGames[e.itemIndex]);
        });
    }

    function gameInformation(game) {

        var infoCard = new UI.Card({
            status: false,
            scrollable: true,
            title: game.name,
            body: "------" + "\n" + game.competitions[0].type.abbreviation + "\n" + game.competitions[0].competitors[1].score + " to " + game.competitions[0].competitors[0].score + "\n" + game.date,
          });

        infoCard.show();

    }

    function about() {
        var aboutCard = new UI.Card({
            status: false,
            scrollable: true,
            title: "Sports",
            body: "Claudio Rojas 2020" + "\n" + "@itsthered1" + "\n" + "------" + "\n" + "Made in Los Angeles",
          });

        aboutCard.show();
    }


});


