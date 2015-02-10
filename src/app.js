/**
  *  REDDITJOKES
  *
  *  Simple Pebble application using Pebble.js
  *  
  *  Pulls from /r/jokes as a .json, and formats
  *  jokes into a way that is manageable and
  *  easy-to-display on a Pebble watch.
  *  
  */

//  Declaration of variables, will be using
//  the ajax module to pull from reddit.com 
var UI = require('ui');
var ajax = require('ajax');
var jokeData = [];
var jokes = [];

//  Creates the main "menu" window
var main = new UI.Menu({
  sections: [{
    title: 'JOKES',
    items: []
  }]
});

//  When menu item selected, display the joke (new Card)
//  with the punchline (stored as "punchline" property 
//  of the items array)
main.on('select', function(e){
  var joke = new UI.Card({
    title: e.item.title,
    body: e.item.punchline,
    scrollable: true
  });
  console.log(e.item.title + '\n' + e.item.punchline);
  joke.show();
});

console.log("making ajax call...");

//  Ajax request to reddit.com
ajax({
  //  Limiting to 7 posts for now... running without
  //  limit sometimes fails - likely due to large size
  //  of data?
  url: 'http://www.reddit.com/r/jokes.json?limit=7',
  
  //  For some reason, ajax request would return with
  //  429 error (too many requests, potentially from
  //  generic pebble apps(?)), changing to a unique
  //  user-agent header somehow fixed this
  headers: {'user-agent': 'RedditJokes Pebble Application v1.0.0'}
},
function(data){
  console.log('Got data!');
  console.log(data);
  jokeData = JSON.parse(data).data.children;
  console.log(JSON.stringify(jokeData));
  console.log(jokeData.length);

  //  Adding all jokes received from reddit.com
  for(var i = 0; i < jokeData.length; i++){
    console.log('Adding menu items...');
    jokes[i]={
      //title is joke title
      title: jokeData[i].data.title,
      //subtitle is author name
      subtitle: jokeData[i].data.author,
      //also, punch line of joke
      punchline: jokeData[i].data.selftext
    };
    main.items(0, jokes);
    console.log('Menu items added');
  }

  //  Refresh menu
  console.log('Refreshing menu...');
  main.show();
},
function(err){
  console.log('AJAX ERROR ' + err);
}
);

main.show();

