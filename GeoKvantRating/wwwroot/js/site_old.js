// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

$("#getFullExtent-btn").click(function() {
	geoMap.setView([66.441111, 94.230278], 3);
	return false;
  });

$("#featureModalClose-btn").click(function() {
	$("#feature-title").html("name");
	$("#feature-info").html("properties");
});

function getGeoRatingByName(name) {
	var rating;
	var fetchInit = {
		method: 'GET'
	}/*
	return fetch('./Home/GetGeokvantumRating?name='+name, fetchInit)
		.then(
			function(response) {
				if (response.status !== 200) {
					console.log('There was a problem. Status Code: ' + response.status);
					return -1;
				}
				response.text().then(function(data){
					console.log('Data aquired!');
					return parseInt(data);
				});
			} //function(response)
		) // then
		.catch(function(err) {
			console.log('Fetch Error :-S', err);
		});
	*/
	return fetch('./Home/GetGeokvantumRating?name='+name, fetchInit)
		.then((response) => response.text())
		.then((responseData) => {
			console.warn(responseData);
			return responseData;
		})
		.catch(error => console.warn(error));
	/*
	$.ajax({
		url:"/Home/GetGeokvantumRating",
		type: "get",
		async: false,
		data:{
			name: name
		},
		success: function(data){
			console.log("Rating of " + name + " received!");
			rating = data;
		},
		error: function (xhr) {
		  alert(xhr.statusText)
		}
	  });
	*/
	//return rating;
};


var geoMap = L.map('mapid').setView([66.441111, 94.230278], 3);

var OpenStreetMap_Mapnik = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(geoMap);

var geokvantumIcon = L.icon({
	iconUrl: './images/geo_small.png',
	iconSize:	[32, 32],
	iconAnchor:	[16, 16],
	popupAnchor: [16, -5] // [X, Y]. [0, 0] - Left-Top
});

var geokvGeoJSON = L.geoJSON(null, {
	pointToLayer: function (feature, latlng) {
		return L.marker(latlng, {icon: geokvantumIcon});
	},
	onEachFeature: function (feature, layer) {
		/*
		layer.bindPopup('<h1>'+feature.properties.city+' ('+feature.properties.extra_name+')</h1><br>'+
		'<h2>Rating: ' + feature.properties.rating + '/8</h2>');
		*/

		layer.on({
			click: function(e) {
				var name;
				var content;
				var marker = e.target
				if(marker.feature.properties.extra_name!="" & marker.feature.properties.extra_name != null) {name = marker.feature.properties.city + " ("+marker.feature.properties.extra_name+")"}
				else {name = marker.feature.properties.city}
				getGeoRatingByName(name).then((response) => {
					console.log(response);
					var rating = parseInt(response);
					if(typeof(rating)=="number"){
						marker.feature.properties.rating = rating;
						console.log(marker.feature.properties.rating);
						//content = '<h2>Rating: ' + feature.properties.rating + '/8</h2>';
						content = "<table class='table table-striped table-bordered table-condensed'>"+
							"<tr><th>Rating</th><td>" + feature.properties.rating + "/8</td></tr>"+
							"</table>";
						$("#feature-title").html(name);
						$("#feature-info").html(content);
						/*
						marker.getPopup().setContent('<h1>'+feature.properties.city+' ('+feature.properties.extra_name+')</h1><br>'+
						'<h2>Rating: ' + feature.properties.rating + '/8</h2>');
						*/
					}
				});
				// Если пришло число, то меняем в свойствах. Иначе оставляем исходное значение (-1)
				/*
				if(typeof(rating)=="number"){
					marker.feature.properties.rating = rating;
				}
				*/
				/*
				marker.getPopup().setContent('<h1>'+marker.feature.properties.city+' ('+marker.feature.properties.extra_name+')</h1><br>'+
				'<h2>Rating: ' + marker.feature.properties.rating + '/8</h2>');
				*/

				//var latLngs = [marker.getLatLng()];
				//var markerBounds = L.latLngBounds(latLngs);
				//geoMap.fitBounds(markerBounds);

				//$("#feature-title").html(name);
				//$("#feature-info").html(content);
				$("#featureModal").modal("show");
			}
		});
	}
});
$.getJSON("/Home/GetAllGeoKvantumsPositions", function (data) {
	console.log("Данные о местоположении Геоквантумов получены!");
	geokvGeoJSON.addData(data).addTo(geoMap);
});

var baseLayers = {
    "OSM Mapnik": OpenStreetMap_Mapnik
};
var overlays = {
    "GeoKvantums": geokvGeoJSON
};
L.control.layers(baseLayers, overlays).addTo(geoMap);