Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  waitOn: function() { return Meteor.subscribe('queries'); }
});

Router.route('/', {name: 'home'});

var requireLogin = function() {
	if (! Meteor.user()) {
	    if (Meteor.loggingIn()) {
	    	this.render(this.loadingTemplate);
	    } else {
	    	this.render('accessDenied');
	    }
    } else {
    	this.next();
    }
}

Router.onBeforeAction('loading');
Router.onBeforeAction(requireLogin, {only: 'home'});