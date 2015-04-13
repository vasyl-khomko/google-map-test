Meteor.publish('queries', function() {
	if(this.userId) {
		return Queries.find({userId: this.userId});
	}
	else {
		this.ready();
	}
});