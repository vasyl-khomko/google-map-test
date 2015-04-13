Queries = new Mongo.Collection('queries');

Meteor.methods({
  queryInsert: function(queryAttributes) {
    if(this.userId == null) {
    	throw new Meteor.Error(600, "You must be logged in");
    }

    var user = Meteor.user();
    var query = _.extend(queryAttributes, {
      userId: user._id, 
      date: new Date()
    });
    var queryId = Queries.insert(query);
    return {
      _id: queryId
    };
  }
});

Venues = new Mongo.Collection(null);
//Venues.insert({name: "vasyl", age: 21});