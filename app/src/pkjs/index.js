Pebble.addEventListener('ready', function() {
    require('pebblejs');
    var UI = require('pebblejs/ui');
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
            }]
        }]
    });


    leagues.on('select', function(e) {
        getData(e.item.title);
    });

    leagues.show();

    //this function receives 'sport' which is a string variable. It should be the title of a menu item like Hockey
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
            console.log('need to add support for more sports!');
        }
        
        var req = new XMLHttpRequest();
        req.open('GET', APIURL, true);
        req.onload = function(e) {
            if (req.readyState == 4) {
                // 200 - HTTP OK
                if (req.status == 200) {
                    var data = JSON.parse(req.responseText);
                    var games = data.events; 
                    for (var i = 0; i < games.length; i++) {
                        console.log(games[i].name);
                    }
                    showGamesMenu(sport, games);
                }
            }
        }
        req.send();
    }

    function showGamesMenu(sport, games) {
        var gameMenuItems = [];
        for (var i = 0; i < games.length; i++) {
            var gameMenuItem = {
                title: games[i].name,
                subtitle: games[i].competitions[0].competitors[1].score + " | " + games[i].competitions[0].competitors[0].score
            }
            gameMenuItems.push(gameMenuItem);
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

        gameMenu.show();

        gameMenu.on('select', function (e) {
            gameInformation();
        });
    }

    function gameInformation() {

        console.log("OK, this listener is working!");
        
        var infoCard = new UI.Card({
            title: 'Testing...',
            body: 'This is working!',
          });

        infoCard.show();

    }
});
