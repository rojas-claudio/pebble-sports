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
    }, {
      title: 'Baseball',
    }, {
      title: 'Hockey',
    }, {
      title: 'Basketball',
    }, {
      title: 'Soccer',
    }]
  }]
});

leagues.show();
