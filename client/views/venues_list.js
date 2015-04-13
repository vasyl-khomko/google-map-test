Template.venuesList.helpers({
	venues: function() {
		return Venues.find();
	},
	isNotEmpty: function() {
		if(Venues.find().count() <= 0) {
			return false;
		}
		return true;
	}

});

Template.venuesList.events ({
  'click #export': function(event) {
    var text = "";
    var cursor = Venues.find();
    if (!cursor.count()) return;
        cursor.forEach(function (row) {
            text += row.name+","+row.city+",\""+row.address+"\","+row.latitude+","+row.longitude+"\r\n";
        });
    var blob = new Blob([text], {type: "text/plain;charset=utf-8"});
    saveAs(blob, "venues-list.csv");
  }
});