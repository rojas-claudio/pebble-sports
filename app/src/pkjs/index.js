require('pebblejs');
var UI = require('pebblejs/ui');

var leagues = new UI.Menu({
  backgroundColor: 'white',
  textColor: 'black',
  highlightBackgroundColor: 'cadet-blue',
  highlightTextColor: 'white',
  sections: [{
    title: 'Leagues',
    items: [{
      title: 'NFL',
      icon: 'american_football.png'
    }, {
      title: 'MLB',
      icon: 'baseball.png'
    }, {
      title: 'NHL',
      icon: 'hockey_puck.png'
    }, {
      title: 'NBA',
      icon: 'basketball.png'
    }]
  }]
});


leagues.on('select', function(e) {
  getSportsData(e.item.title);
});

leagues.show();

//this function receives 'sport' which is a string variable. It should be the title of a menu item like Hockey
function getSportsData(sport) {
  var APIURL = '';
  if (sport == "NFL") {
    APIURL = 'http://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard';
  } else if (sport == "NHL") {
    APIURL = 'http://site.api.espn.com/apis/site/v2/sports/hockey/nhl/scoreboard';
  } else if (sport == "MLB") {
    APIURL = 'http://site.api.espn.com/apis/site/v2/sports/baseball/mlb/scoreboard';
  } else if (sport == "NBA") {
    APIURL = 'http://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard';
  } else if (sport == "Soccer") {
    APIURL = 'http://site.api.espn.com/apis/site/v2/sports/soccer/:league/scoreboard';
    //if the sport is hockey, we set the API URL to the hockey API.
    //find APIs here: https://gist.github.com/akeaswaran/b48b02f1c94f873c6655e7129910fc3b

  } else {
    console.log('need to add support for more sports!');
  }

  //now this part is a little high level, but we are basically going to request data from the API
  //we will do this using an HTTP GET request
  //this function is built right into javascript and made available by the pebble sdk and runtime environment
  //the syntax is pretty tricky so don't think too hard about the section until you are ready
  //the important thing is that the 'sportsData' object will be where the sport data is stored!
  var req = new XMLHttpRequest();
  req.open('GET', APIURL, true);
  req.onload = function(e) {
      if (req.readyState == 4) {
        // 200 - HTTP OK
          if(req.status == 200) {
              var sportsData = JSON.parse(req.responseText); //<-right here
              //console.log(JSON.stringify(sportsData)); // let's log it to console to see what came from the API
              var games = sportsData.events; // after exploring a bit I found that games are actually an array inside this events object
              // for (var i = 0; i < games.length; i++){
              //this will loop through each game and show it's short name in the console
              //console.log(games[i].shortName);
              //there is a lot more data to explore but we can get to that later
              showGamesMenu(sport, games);
              }
            }
          }
      req.send();
}

function showGamesMenu(sport, games){
  var gameMenuItems = [];
  for (var i = 0; i < games.length; i++){
   var gameMenuItem = {
     title: games[i].shortName,
     subtitle: games[i].competitions[0].competitors[1].score + " to " + games[i].competitions[0].competitors[0].score
   }
   gameMenuItems.push(gameMenuItem);
  }
  var gameMenu = new UI.Menu({
    backgroundColor: 'white',
    textColor: 'black',
    highlightBackgroundColor: 'cadet-blue',
    highlightTextColor: 'white',
    sections: [{
      title: sport,
      items: gameMenuItems
    }]
  });

  gameMenu.show();

}
