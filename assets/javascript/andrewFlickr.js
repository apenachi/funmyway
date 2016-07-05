/////////////////////////////////////////////////////////////////////
var apiKey = "6c9383804a184a8897941b63b639a0d5";
function getFlickr (location) {
	$.get("https://api.flickr.com/services/rest/?&method=flickr.photos.search",
						{ "method":"flickr.photos.search",
							"api_key": apiKey,
							"text": location, 
						"format":"json",
						"nojsoncallback":"1"})
		.done(function(response){
			console.log(response);
			if(response.stat === "ok") {
				var photos = response.photos.photo[0];
				var photosImageURL = "https://farm" + photos.farm + ".staticflickr.com/" + photos.server + "/" + photos.id + "_" + photos.secret + "_m.jpg";
				var photosimg = $("<img/>");
				photosimg.attr({
					'src': photosImageURL,
					'class': 'img-rounded'
				});
				$(".flickrWell").append(photosimg);
			} else {
				console.log("Error!")
			}
	 	})
		.fail(function(response){
		console.log("Error!");
	});
};
getFlickr('Barnes Museum, Southington, Connecticut, United States of America');

app.child('point_of_interest').on('value', function (snapshot) {
	console.log(snapshot.val());
	for(i = 0; i < snapshot.val().length; i++){
		var place = snapshot.val()[i].name
		// console.log('where : ' + place.split(',')[i]);
		console.log('i ' + place);
		getFlickr(place);
	};
	// var place = snapshot.val()[0].name
	// console.log(place.split(',')[0]);
	// getFlickr(place.split(',')[0]);

});