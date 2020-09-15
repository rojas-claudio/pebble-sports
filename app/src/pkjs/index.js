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

leagues.show();

leagues.selection(function(e) {
  console.log('Currently selected item is #' + e.itemIndex + ' of section #' + e.sectionIndex);
  console.log('The item is titled "' + e.item.title + '"');

  if (e.item.title == "NHL") {
  }
});
