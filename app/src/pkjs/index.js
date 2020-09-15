require('pebblejs');
var UI = require('pebblejs/ui');

var leagues = new UI.Menu({
  backgroundColor: 'white',
  textColor: 'black',
  highlightBackgroundColor: 'vivid-cerulean',
  highlightTextColor: 'black',
  sections: [{
    title: 'Sports',
    items: [{
      title: 'Favorites',
    }, {
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
      title: 'Soccer',
      icon: 'soccer_ball.png'
    }]
  }]
});


leagues.on('select', function(e) {
  getSportsData(e.item.title);
});

leagues.show();

//this function receives 'sport' which is a string variable. It should be the title of a menu item like Hockey
function getSportsData(sport) {
  //lets make a blank varible called APIURL. This variable will be filled later with a real URL pointing to the appropriate API 
  var APIURL = '';

  //now let's check to see which sport the user selected
  if (sport == "Football") {
    //if the sport is football, we set the API URL to the football API.
    APIURL = 'http://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard';
  } else if (sport == "Hockey") {
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
              for (var i = 0; i < games.length; i++){
                //this will loop through each game and show it's short name in the console
                console.log(games[i].shortName);
                //there is a lot more data to explore but we can get to that later
              }
            }
          }
      }
      req.send();


}