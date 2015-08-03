// Set up a collection to contain player information. On the server,
// it is backed by a MongoDB collection named "players".

Players = new Mongo.Collection("players");

if (Meteor.isClient) {
  Meteor.subscribe('playerCount');
}

// On server startup, create some players if the database is empty.
if (Meteor.isServer) {

  Meteor.publish('playerCount', function() {
    Counts.publish(this, 'playerCount', Players.find(), { fastCount : false }); //try setting this to false... eep!
    return []
  });

  Meteor.startup(function () {
    console.log('Inserting 300k players');
    while (Players.find().count() < 300000) {
      var names = ["Ada Lovelace", "Grace Hopper", "Marie Curie",
                   "Carl Friedrich Gauss", "Nikola Tesla", "Claude Shannon"];
      _.each(names, function (name) {
        Players.insert({
          name: name,
          score: Math.floor(Random.fraction() * 10) * 5
        });
      });
    }
    console.log('Done inserting 300k players');
  });
}
