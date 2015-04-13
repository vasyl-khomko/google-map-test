Template.queryItem.helpers({
	query: function() {
		return this.query;
	},
	latitude: function() {
		return this.latitude;
	},
	longitude: function() {
		return this.longitude;
	},
	radius: function() {
		return this.radius;
	},
	date: function() {
		return this.date.toLocaleString();
	}
});