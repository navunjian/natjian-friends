exports.view = function(req, res) {
	res.render('loggedIn');
}

exports.getStatuses = function(req, res) {

	T.get('statuses/user_timeline', { screen_name: 'natjian' }, function (err, reply) {
		var jsonArray = [];
			
	  		  var tempJSON = {};
	    	  tempJSON.text = reply[i].text;
	    	  jsonArray.push(tempJSON);
	    	 
var data = {statuses: jsonArray} ;

res.render('/loggedIn', data);
});
};
