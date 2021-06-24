Pebble.addEventListener('ready', function() {

    require('pebblejs');
    var UI = require('pebblejs/ui');
    var Vector2 = require('pebblejs/lib/vector2');
    var Platform = require('pebblejs/platform')
    var timeline = require('pebble-timeline-js');
    
    var fetchDate;

    var leagues = new UI.Menu({
      status: false,
        backgroundColor: 'white',
        textColor: 'black',
        highlightBackgroundColor: 'vivid-cerulean',
        highlightTextColor: 'black',
        sections: [{
            items: [{
                title: 'Football',
                subtitle: getData('Football', 'count'),
                icon: 'american_football.png'
            }, {
                title: 'Baseball',
                subtitle: getData('Baseball', 'count'),
                icon: 'baseball.png'
            }, {
                title: 'Hockey',
                subtitle: getData('Hockey', 'count'),
                icon: 'hockey_puck.png'
            }, {
                title: 'Basketball',
                subtitle: getData('Basketball', 'count'),
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
        text: "NO GAMES TODAY!",
        textOverflow: 'wrap',
        textAlign: 'center'
    });
    noGames.add(noGamesText);

    leagues.on('select', function(e) {
        if (e.item.title == 'About'){
            about();
        } else {
            getData(e.item.title);
            fetchDate = new Date();
        } 
    });

    leagues.show();

    function getData(sport, dataType) { 
        var APIURL = '';
        
        if (sport == "Football") {
            APIURL = 'http://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard';
        } else if (sport == "Hockey") {
            APIURL = 'http://site.api.espn.com/apis/site/v2/sports/hockey/nhl/scoreboard';
        } else if (sport == "Baseball") {
            APIURL = 'http://site.api.espn.com/apis/site/v2/sports/baseball/mlb/scoreboard';
        } else if (sport == "Basketball") {
            APIURL = 'http://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard';
        } else {
          console.log("x("); 
        }

        var req = new XMLHttpRequest();
        req.open('GET', APIURL, false);
        req.send();
        if (req.status == 200) {
            var data = JSON.parse(req.responseText);
            var games = data.events;
            if (dataType == 'count') {
                console.log(games.length);
                var text = '';
                if (games.length > 1 || games.length == 0) {
                    text = " Games";
                } else {
                    text = " Game"
                }
                return games.length + text;
            } else {
                listGames(sport, games);
            }        
        }

    }
    

    function listGames(sport, games) {

        var dateToday = new Date();
        var gameMenuItems = [];
        var filteredGames = [];
    
        for (var i = 0; i < games.length; i++) {
            var game = games[i];
            //If we only show games when their start time is in the future, we'll never show in-progress games
            //The API tells us if the game is over or not, so let's use that
    
            var gameSubtitle = "oops";
    
            //Set the subtitle based on the gamestate
            //See https://www.espn.com/apis/devcenter/docs/scores.html (CTRL + F for 'status')
            if (game.status.type.id == 1) {
                //The game is still scheduled, but in the future, display start time

                //Parse the string date into a date object
                var gameDate = new Date(game.date);
                //Copy gameDate so we preserve the original time in case we need it
                var gameMidnight = new Date(gameDate);
                gameMidnight.setHours(0, 0, 0, 0);
                dateToday.setHours(0, 0, 0, 0);
    
                if (gameMidnight.getTime() == dateToday.getTime()) {
                    //The game starts today, show the just the time
                    gameSubtitle = getPrettyTime(gameDate);
    
                } else {
    
                    //The game doesn't start today, show the date
                    gameSubtitle = getPrettyDate(gameDate);
    
                }
    
            } else if (game.status.type.id == 2) {
                //The game is in progress, display the score
                gameSubtitle = game.competitions[0].competitors[1].score + " to " + game.competitions[0].competitors[0].score;
            } else {
                //The game is not completed, but it isn't in progress or scheduled, display the state (postponed etc)
                gameSubtitle = game.status.type.description
            }
    
            var gameMenuItem = {
                title: game.shortName,
                subtitle: gameSubtitle
            };
            
            gameMenuItems.push(gameMenuItem);
            filteredGames.push(game);

        }
    

        var gameMenu = new UI.Menu({
            status: false,
            backgroundColor: 'white',
            textColor: 'black',
            highlightBackgroundColor: 'vivid-cerulean',
            highlightTextColor: 'black',
            sections: [{
                title: sport,
                items: gameMenuItems,
            }]
        });
    
        if (gameMenuItems.length == 0) {
            noGames.show();
        } else {
            gameMenu.show();
        }
    
        gameMenu.on('select', function(e) {
            gameInformation(filteredGames[e.itemIndex], sport);
        });
    }

    function gameInformation(game, sport) {

        var gameStatus;
        var homeScore;
        var awayScore;
        var timeStamp = game.status.displayClock;

        
        if (game.status.type.id == 2) {
            gameStatus = game.status.type.detail;
            var statusPosition = new Vector2 (0, 128);
        } else if (game.status.type.id == 1 || game.status.type.id >= 3) {
            gameStatus = game.status.type.description;
            statusPosition = new Vector2 (0, 137);
        }

        if (sport == 'Baseball') {
            statusPosition = new Vector2 (0, 137); 
        }

        if (sport == 'Basketball' && game.status.type.id == 2) {
            gameStatus = "Quarter " + game.status.period; 
        } else if (sport == 'Hockey' && game.status.type.id == 2) {
            gameStatus = "Period " + game.status.period;
        }

        //TODO: Shrink font size if scores exceed 2 chars


        var gameInfo = new UI.Window({
            backgroundColor: 'white',
            scrollable: true
        });
        var title = new UI.Text({
            position: new Vector2 (5, 10),
            size: new Vector2 (134, 168),
            font: 'gothic-14-bold',
            color: '#000000',
            text: game.name,
            textOverflow: 'wrap',
            textAlign: 'center'
        });
        var away = new UI.Text({
            position: new Vector2 (-36, 50),
            size: new Vector2 (144, 168),
            font: 'leco-38-bold-numbers',
            color: '#000000',
            text: game.competitions[0].competitors[1].score,
            textOverflow: 'wrap',
            textAlign: 'center'
        });
        var awayAbbreviation = new UI.Text({
            position: new Vector2 (-36, 90),
            size: new Vector2 (144, 168),
            font: 'gothic-18-bold',
            color: '#000000',
            text: game.competitions[0].competitors[1].team.abbreviation,
            textOverflow: 'wrap',
            textAlign: 'center'
        });
        var awayColor = new UI.Rect ({
            position: new Vector2 (22, 115),
            size: new Vector2 (28, 10),
            backgroundColor: '#' + game.competitions[0].competitors[1].team.color
        });
        var home = new UI.Text({
            position: new Vector2 (36, 50),
            size: new Vector2 (144, 168),
            font: 'leco-38-bold-numbers',
            color: '#000000',
            text: game.competitions[0].competitors[0].score,
            textOverflow: 'wrap',
            textAlign: 'center'
        });
        var homeAbbreviation = new UI.Text({
            position: new Vector2 (36, 90),
            size: new Vector2 (144, 168),
            font: 'gothic-18-bold',
            color: '#000000',
            text: game.competitions[0].competitors[0].team.abbreviation,
            textOverflow: 'wrap',
            textAlign: 'center'
        });
        var homeColor = new UI.Rect ({
            position: new Vector2 (94, 115),
            size: new Vector2 (28, 10),
            backgroundColor: '#' + game.competitions[0].competitors[0].team.color
        });
        var at = new UI.Text ({
            position: new Vector2 (0, 67.5),
            size: new Vector2 (144, 168),
            font: 'gothic-24-bold',
            color: '#000000',
            text: "@",
            textOverflow: 'wrap',
            textAlign: 'center'
        })
        var status = new UI.Text({
            position: statusPosition,
            size: new Vector2 (144, 168),
            font: 'gothic-14-bold',
            color: '#000000',
            text: gameStatus,
            textOverflow: 'wrap',
            textAlign: 'center'
        });
        var time = new UI.Text({
            position: new Vector2 (0, 145.5),
            size: new Vector2 (144, 168),
            font: 'gothic-14-bold',
            color: '#000000',
            text: timeStamp,
            textOverflow: 'wrap',
            textAlign: 'center'
        });
        var line = new UI.Line({    
            position: new Vector2(20, 170),
            position2: new Vector2(124, 170),
            strokeColor: 'black',
            strokeWidth: '10',
        });

        if (game.status.type.id == 1 || game.status.type.id >= 3) {
            gameInfo.add(status);
        } else {
            gameInfo.add(time);
        }

        if (game.status.displayClock == "0:00") { 
            gameInfo.remove(time);
        }

        if (Platform.version() == 'basalt' || Platform.version() == "emery") {
            gameInfo.add(awayColor);
            gameInfo.add(homeColor);
        }

        gameInfo.add(at);
        gameInfo.add(title);
        gameInfo.add(away);
        gameInfo.add(status);
        gameInfo.add(awayAbbreviation);
        gameInfo.add(home);
        gameInfo.add(homeAbbreviation);
        gameInfo.add(line);
        gameInfo.show();

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

    function getPrettyDate(d) {
      var months = ["Jan","Feb","Mar","Apr","May","June","July","Aug","Sept","Oct","Nov","Dec"]
      var out = ""
      out += d.getDate() + " "
      out += months[d.getMonth()] + " "
      return out
    }

    function getPrettyTime(t) {
        var out = ""
        var hours = t.getHours()
        if (hours.length < 2) { 
            hours = "0" + hours
          }
        var minutes = t.getMinutes()
        if (minutes.length < 2) { 
            minutes = "0" + minutes
        }
        if (minutes == 0) { 
          minutes = "00"
        }
          console.log("H: " + hours)
          console.log("M2: " + minutes)
        return hours + ":" + minutes
    }

    //Experimental due to RWS sync periods
    function pushPin(sport, game) {
        var gameISO = new Date(game.date).toISOString();
        var period;
        if (game.status.type.id >= 3 || game.status.type.id <= 1 ) {
            period = game.status.type.description;
        } else if (game.status.type.id == 2) {
            period = "Period " + game.status.period
        }

        if (sport == 'Hockey') { // if competitors ----> displayName matches that of Clay config
            var gamePin = {
                "id": game.id,
                "time": gameISO,
                "layout": {
                  "type": "sportsPin",
                  "title": game.name,
                  "subtitle": period,
                  "body": game.competitions[0].venue.fullname,
                  "tinyIcon": "system://images/HOCKEY_GAME",
                  "largeIcon": "system://images/HOCKEY_GAME",
                  "lastUpdated": fetchDate,
                  "rankAway": game.competitions[0].competitors[1].score,
                  "rankHome": game.competitions[0].competitors[0].score,
                  "nameAway": game.competitions[0].competitors[1].team.abbreviation,
                  "nameHome": game.competitions[0].competitors[0].team.abbreviation,
                  "recordAway": game.competitions[0].competitors[1].records.summary,
                  "recordHome": game.competitions[0].competitors[0].records.summary,
                  "scoreAway": game.competitions[0].competitors[1].score,
                  "scoreHome": game.competitions[0].competitors[0].score,
                  "sportsGameState": game.status.type.description,
                }
            };

            console.log('Inserting pin in the future: ' + JSON.stringify(gamePin));

            // Push the pin
            timeline.insertUserPin(gamePin, function(responseText) {
              console.log('Result: ' + responseText);
            });
        }
    }

});
