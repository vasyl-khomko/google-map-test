Template.googleAuth.events({
  'click #login': function() {
    Meteor.loginWithGoogle(
      {requestPermissions: 'email'},
      function (error) {
        if (error) {
          Console.log('errorMessage', error.reason || 'Unknown error');
        }
      });
  },
  'click #logout': function() {
    Meteor.logout(
      function (error) {
        if (error) {
          Console.log('errorMessage', error.reason || 'Unknown error');
        }
        Venues.remove({});
      });
  }
});