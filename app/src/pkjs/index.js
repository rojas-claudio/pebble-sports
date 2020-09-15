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
      icon: 'hockey_puck.png'
    }, {
      title: 'Basketball',
    }, {
      title: 'Soccer',
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
