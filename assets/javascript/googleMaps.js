console.log('loading GoogleMaps.js');
		var config = {
			apiKey: "AIzaSyDOiUyKYsUXAQB1UczNr47SoElPP2ROCEg",
			authDomain: "fir-app-6c1bf.firebaseapp.com",
			databaseURL: "https://fir-app-6c1bf.firebaseio.com",
			storageBucket: "fir-app-6c1bf.appspot.com",
		};

	// Initialize Firebase  
		firebase.initializeApp(config);		
	// Create a variable to reference the database
		var	db = firebase.database();
		var app = db.ref().child('funmyway');

		////////////////////////////////////////////////////////////////////
		// ***********	Expedia api 	*************

		var ExpKey = 'TqX8GSt3vGi8YnWpsbePFveQBTxRi1dF';
	
		function searchPOI(poi){
			var wikiUrl = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=' + poi + '&format=json&callback=wikiCallbackFunction';
			$.ajax({
				url : wikiUrl,
				crossDomain: true,
				type : 'GET',
				dataType: "jsonp",
				success: function(wikiResponse) {
						console.log(wikiResponse[2][0]);
						return(wikiResponse[2][0]);
				}
			});
		}
		searchPOI('new jersey');

		function findPointOfInterest(lat, lng) {
			var loc = lat + ',' + lng;
			var ExpUrl = 'https://crossorigin.me/http://terminal2.expedia.com/x/geo/features?within=2km&lng=' + lng+ '&lat=' + lat + '&type=point_of_interest&apikey=' + ExpKey;
			$.ajax({
					url : ExpUrl,
					crossDomain: true,
					type: 'GET',
					success: function(data)
					{
							console.log('Expedia API');
							console.log(data);
							app.child('point_of_interest').remove();
							data.forEach(function(item, i){
								app.child('point_of_interest').child(i).set({
									name : item.name,
									longitude : item.position.coordinates[0],
									latitude : item.position.coordinates[1]
								});
							});
							// return data;
					}
			});
		}

		///////////////////////////////////////////////////////////////////////
		// ********			Google maps API 	***********		
		// https://developers.google.com/maps/documentation/javascript/examples/#drawing-on-the-map
		var googleKey = 'AIzaSyBLOar8a6k4Ea0FY1ZX6bLphRXd0XvD9Lo';

		var currentPosition;
		function initialize() {
			var end = document.getElementById('location');
			var autocomplete = new google.maps.places.Autocomplete(end);

			navigator.geolocation.getCurrentPosition(function(position) {
				currentPosition = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
				console.log(position.coords.latitude);
				console.log(position.coords.longitude);
				mapOptions= {
					center: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
					mapTypeId: google.maps.MapTypeId.ROADMAP,
					draggableCursor:'crosshair',
					zoom: 5
				};        

				var map = new google.maps.Map(document.getElementById('map'), mapOptions);
				var marker = new google.maps.Marker({
					position: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
					label: 'A'
				});
				marker.setMap(map);
			}); 
		}

		initialize();

		$('#sumbitForm').on('click', function() {
			var location = $('#location').val();
			$('#location').val('');
			getDirections(currentPosition, location);
		});
		$('#delMarkers').on('click', function() {
			removePointOfInterest();
		})

		app.child('point_of_interest').on('value', function (snapshot) {
			console.log('snapshot.val()');
			placePointOfInterest(snapshot.val(), map);
		});

		mapOptions = {
			center: new google.maps.LatLng(currentPosition),
			zoom: 3,
			panControl:true,
			zoomControl:true,
			mapTypeControl:true,
			scaleControl:true,
			streetViewControl:true,
			overviewMapControl:true,
			rotateControl:true,
			// draggableCursor:'crosshair',
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};
		var map;
		function getDirections(from, to) {
			console.log('from: ' + from);
			console.log('to: ' + to);
			var directionsService = new google.maps.DirectionsService();
			var directionsDisplay = new google.maps.DirectionsRenderer();
			map = new google.maps.Map(document.getElementById('map'), mapOptions);
			
			directionsDisplay.setMap(map);
			directionsDisplay.setPanel(document.getElementById('panel'));
		
			var request = {
				origin: from, 
				destination: to,
				travelMode: google.maps.DirectionsTravelMode.DRIVING
			 };
		
			directionsService.route(request, function(response, status) {
				if (status == google.maps.DirectionsStatus.OK) {
					directionsDisplay.setDirections(response);
				}
			});
			//	Adds markers on map can be used to allow user to check point of interest based on click
			google.maps.event.addListener(map, 'click', function(event) {
				// placeMarker(event.latLng, map);

				findPointOfInterest(event.latLng.lat(), event.latLng.lng());
				console.log('lat.lng: ' + event.latLng.lat() + ',' + event.latLng.lng());
				// Does not work ... add to firebase then when child_added call below function()
				// var pointOfInterest = findPointOfInterest(event.latLng.lat(), event.latLng.lng());
				// placePointOfInterest(pointOfInterest, map);
				// console.log(pointOfInterest);
				
				// $.when(findPointOfInterest(event.latLng.lat(), event.latLng.lng())).done(function(a){placePointOfInterest(a, map)});
				
			});

		}
		var labels = 'CDEFGHIJKLMNOPQRSTUVWXYZ';
		var labelIndex = 0;
		var markers = [];
		function removePointOfInterest() {
			console.log(markers.length);
			for (var i = 0; i < markers.length; i++) {
				markers[i].setMap(null);
			}
			markers = [];
			labelIndex = 0;
		}
		function placePointOfInterest (data, map) {
			console.log(markers);
			removePointOfInterest();
			if (data) {
				console.log(data);
				for (var i = 0; i < data.length; i++) {
					
					var lng = data[i].longitude;
					var lat = data[i].latitude;
					console.log('data -> ' + data[i].name);
					var marker = new google.maps.Marker({
						position: new google.maps.LatLng(lat, lng),
						map: map,
						label: labels[i],
					});
					var infoWindow = new google.maps.InfoWindow({
						content: data[i].name
					});

					markers.push(marker);
					infoWindow.open(map, marker);
					
				}
			} else {
				console.log('Nutin to see here');
			}
		};

		function placeMarker(location, map) {
			var marker = new google.maps.Marker({
				position: location,
				map: map,
				label: labels[labelIndex++ % labels.length],
			});
			var infowindow = new google.maps.InfoWindow({
				content: 'Latitude: ' + location.lat() + '<br>Longitude: ' + location.lng()
			});
			infowindow.open(map,marker);
			markers.push(marker);
		}		

