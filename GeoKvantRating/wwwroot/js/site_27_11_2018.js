// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

/* Функция для возврата камеры в исходное состояние (полынй охват России) */
$("#getFullExtent-btn").click(function() {
	geoMap.setView([66.441111, 94.230278], 3);
	return false;
  });
/* При закрытии модального окна со свойствами объекта очищать заголовок и тело модального окна */
$("#featureModalClose-btn").click(function() {
	$("#feature-title").html("name");
	$("#base-info-body").html("base-info");
	$("#artifact-body").html("artifact");
});

/* Получение рейтинга геоквантума по id */
function getGeoRatingByName(id) {
	var rating;
	var fetchInit = {
		method: 'GET'
	}
	return fetch('./Home/GetGeokvantumRating?id='+id, fetchInit)
		.then((response) => response.text())
		.then((responseData) => {
			console.warn(responseData);
			return responseData;
		})
		.catch(error => console.warn(error));
};

function getAdditionalInfo(id) {
	var fetchInit = {
		method: 'GET'
	}
	return fetch('./Home/GetAdditionalInfoForGeokvantum?id='+id, fetchInit)
		.then((response) => response.json())
		.then((responseData) => {
			console.warn(responseData);
			return responseData;
		})
		.catch(error => console.warn(error));
}

// Создаём карту и наводим камеру на географический центр России
var geoMap = L.map('mapid').setView([66.441111, 94.230278], 3);
// Создаём слой OSM
var OpenStreetMap_Mapnik = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(geoMap);

var geokvantumsClusterGroup = L.markerClusterGroup({
	maxClusterRadius: 30
});

// Иконка Геоквантума для отображения на карте
var geokvantumIcon = L.icon({
	iconUrl: './images/geo_small.png',
	iconSize:	[32, 32],
	iconAnchor:	[16, 16],
	popupAnchor: [16, -5] // [X, Y]. [0, 0] - Left-Top
});
// Формирование векторного слоя геоквантумов с маркерами (иконками) 
var geokvantumsGeoJSON = L.geoJSON(null, {
	pointToLayer: function (feature, latlng) {
		return L.marker(latlng, {icon: geokvantumIcon});
	},
	onEachFeature: function (feature, layer) {
		layer.on({
			click: function(e) {
				var name;
				var content;
				var marker = e.target
				// Формируем имя для запроса таблицы из Google
				if(marker.feature.properties.extra_name!="" & marker.feature.properties.extra_name != null) {name = marker.feature.properties.city + " ("+marker.feature.properties.extra_name+")"}
				else {name = marker.feature.properties.city}
				// Получаем рейтинг из таблицы Google
				/*
				getGeoRatingByName(marker.feature.properties.geokvantum_locations_id).then((response) => {
					console.log(response);
					var rating = parseInt(response);
					if(typeof(rating)=="number"){
						marker.feature.properties.base_rating_done = rating;
						marker.feature.properties.base_rating_not_done = 8 - rating;
						console.log(marker.feature.properties.base_rating_done);
						content = "<table class='table table-striped table-bordered table-condensed'>"+
							"<tr><th>Rating</th><td>" + feature.properties.base_rating_done + "/8</td></tr>"+
							"</table>";
						$("#feature-title").html(name);
						$("#feature-info").html(content);
					}
				});
				*/
				getAdditionalInfo(marker.feature.properties.geokvantum_locations_id).then((response) => {
					console.log(response);
					
					if(typeof(response.base_rating_done)=="number"){
						marker.feature.properties.base_rating_done = response.base_rating_done;
						marker.feature.properties.base_rating_not_done = response.base_rating_not_done;
						console.log(marker.feature.properties.base_rating_done);
						var doneJobsTableRows = "";
						for (var key in response.done_jobs) {
							doneJobsTableRows = doneJobsTableRows +
								"<tr><th>" + key + "</th><td><a target='_blank' rel='noopener noreferrer' href='"+ response.done_jobs[key] +"'>" + response.done_jobs[key] + "</a></td></tr>";
						}
						
						var names = "";
						for (var nameKey in response.tutors_full_names) {
							names = names + response.tutors_full_names[nameKey] + "<br>";
						}
						content = "<table class='table table-condensed'>"+
							"<tr><th>Наставник(и)</th><td>" + names + "</td></tr>"+
							"<tr><th>Адрес</th><td>" + response.address + "</td></tr>"+
							"<tr><th>Сайт</th><td>" + response.site + "</td></tr>"+
							"<tr><th>Rating</th><td>" + feature.properties.base_rating_done + "/8</td></tr>"+
							"</table>";
						$("#base-info-body").html(content);
						$("#artifact-body").html("<table class='table table-condensed'>" + doneJobsTableRows + "</table>");
						
						/*
						content = "<table class='table table-condensed'>"+
							"<tr><th>Наставник</th><td>" + "Фамилия Имя Отчество" + "</td></tr>"+
							"<tr><th>Адрес</th><td>" + response.address + "</td></tr>"+
							"<tr><th>Сайт</th><td>" + response.site + "</td></tr>"+
							"<tr><th>Rating</th><td>" + feature.properties.base_rating_done + "/8</td></tr>"+
							"</table> <br>"+
							"<div class='panel panel-default'><div class='panel-heading'>Артефакты:</div><div class='panel-body'>"+
							"<div class='well well-sm'>Артефакты</div>"+
							"<table class='table table-bordered table-condensed'>"+
							doneJobsTableRows+
							"</table>"+
							"</div></div>";
						*/
							
						$("#feature-title").html(name);
						//$("#feature-info").html(content);
					}
				});
				$("#featureModal").modal("show");
			}
		});
	}
});
/*
var content;
var geokvantumsGeoJSON = L.geoJSON(null, {
	pointToLayer: function (feature, latlng) {
		return L.marker(latlng, {icon: geokvantumIcon});
	},
	onEachFeature: function (feature, layer) {
		layer.on({
			click: function(e) {
				var name;
				//var content;
				var marker = e.target
				// Формируем имя для запроса таблицы из Google
				if(marker.feature.properties.extra_name!="" & marker.feature.properties.extra_name != null) {name = marker.feature.properties.city + " ("+marker.feature.properties.extra_name+")"}
				else {name = marker.feature.properties.city}
				content = "<table class='table table-striped table-bordered table-condensed'>"+
					"<tr><th>Base Rating</th><td>" + marker.feature.properties.base_rating_done + "/8</td></tr>"+
					"</table>";
				$("#feature-title").html(name);
				$("#feature-info").html(content);
				$("#featureModal").modal("show");
			}
		});
	}
});
*/

var geokvantumsPieChart = new L.PieChartDataLayer(geokvantumsGeoJSON, {
	recordsField: 'features',
	geoJSONField: null,
	locationMode: L.LocationModes.GEOJSON,
	layerOptions: {
		fillOpacity: 0.8,
		opacity: 1,
		weight: 1,
		radius: 20
	},
	tooltipOptions: {
		iconSize: new L.Point(100, 60),
		iconAnchor: new L.Point(-5, 50)
	},
	chartOptions: {
		'properties.base_rating_done': {
			fillColor: '#0F0',
			minValue: 0,
			maxValue: 8,
			maxHeight: 0,
			displayName: 'Выполнено',
			displayText: function(value) {
				return value;
			}
		},
		'properties.base_rating_not_done': {
			fillColor: '#F00',
			minValue: 0,
			maxValue: 8,
			maxHeight: 0,
			displayName: 'Не выполнено',
			displayText: function(value) {
				return value;
			}
		}
	}
});



$.getJSON("/Home/GetAllGeoKvantumsPositions", function (data) {
	geokvantumsGeoJSON.addData(data).addTo(geoMap);	
	console.log("Данные о местоположении Геоквантумов получены!");
	geokvantumsClusterGroup.addLayer(geokvantumsGeoJSON);
});
$.getJSON("/Home/GetAllGeoKvantumsPositionsWithRating", function(data) {
	geokvantumsPieChart.addData(data);
	console.log("Данные о местоположении Геоквантумов c рейтингом получены!");
	//document.getElementById("loaderSpinner").style.display = "none";
});

geoMap.addLayer(geokvantumsClusterGroup);
// Формируем объекты с подложками (baseMaps) и векторными (overlays) слоями 
//  и добавляем в инструмент управления слоями
var baseLayers = {
    "OSM Mapnik": OpenStreetMap_Mapnik
};
var overlays = {
	"GeoKvantums": geokvantumsGeoJSON,
	"GeoKvantums Pie Chart Base Rating": geokvantumsPieChart,
	"Geokvantums Dual Cluster": geokvantumsClusterGroup
};
L.control.layers(baseLayers, overlays).addTo(geoMap);