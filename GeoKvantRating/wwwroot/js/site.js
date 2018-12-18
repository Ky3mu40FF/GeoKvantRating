// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.
/* UNSORTED */
/* Изменение размера контрола управления слоями при изменении размера окна браузера */
$(window).resize(function() {
	sizeLayerControl();
});
/* Изменение размера контрола управления слоями */
function sizeLayerControl() {
	$(".leaflet-control-layers").css("max-height", $("#map").height() - 50);
}
/*  */
$("#list-btn").click(function() {
	animateSidebar();
	return false;
});

$("#sidebar-toggle-btn").click(function() {
	animateSidebar();
	return false;
});
  
$("#sidebar-hide-btn").click(function() {
	animateSidebar();
	return false;
});

function animateSidebar() {
	$("#sidebar").animate({
	  width: "toggle"
	}, 350, function() {
	  geoMap.invalidateSize();
	});
  }

function syncSidebar() {
	/* Empty sidebar features */
	$("#feature-list tbody").empty();
	/* Loop through theaters layer and add only features which are in the map bounds */
	geokvantumsClusterGroup.eachLayer(function (layer) {
			if (geoMap.getBounds().contains(layer.getLatLng())) {
				$("#feature-list tbody").append(
					'<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '">'+
						'<td style="vertical-align: middle;"><img width="16" height="18" src="./images/geo_small.png"></td>'+
						'<td class="feature-name">' + layer.feature.properties.city + ' (' + layer.feature.properties.extra_name + ')' + '</td>'+
						'<td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td>'+
					'</tr>');
			}
	});
}

$(document).on("click", ".feature-row", function(e) {
	//$(document).off("mouseout", ".feature-row", clearHighlight);
	sidebarClick(parseInt($(this).attr("id"), 10));
});


function sidebarClick(id) {
	var layer = geokvantumsClusterGroup.getLayer(id);
	geoMap.setView([layer.getLatLng().lat, layer.getLatLng().lng], 16);
	layer.fire("click");
	/* Hide sidebar and go to the map on small screens */
	if (document.body.clientWidth <= 767) {
	$("#sidebar").hide();
		geoMap.invalidateSize();
	}
}


/* Контрол для водяного знака (пока фиксировано лого ДТП "Кванториум") */
L.Control.Watermark = L.Control.extend({
	onAdd: function(map) {
		var imgDiv = L.DomUtil.create('div');
		imgDiv.className = 'watermark-div';

		//var img = L.DomUtil.create('img');
		var img = document.createElement('img');

		img.src = '../images/kvantorium.png';
		img.style.width = '200px';
		imgDiv.appendChild(img);
		return imgDiv;
	},

	onRemove: function(map) {
	// Nothing to do here
	}
});
L.control.watermark = function(opts) {
	return new L.Control.Watermark(opts);
}






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
	//$("#base-info-body-collapse").collapse('show');
});

/* Получение рейтинга геоквантума по id */
function getGeoRatingByName(id) {
    var rating;
    var fetchInit = {
        method: 'GET'
    };
    return fetch('./Home/GetGeokvantumRating?id=' + id, fetchInit)
        .then((response) => response.text())
        .then((responseData) => {
            console.warn(responseData);
            return responseData;
        })
        .catch(error => console.warn(error));
}
/* Получение дополнительной информации на геоквантум по id */
function getAdditionalInfo(id) {
    var fetchInit = {
        method: 'GET'
    };
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

/* Filter sidebar feature list to only show features in current map bounds */
geoMap.on("moveend", function (e) {
	syncSidebar();
  });


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
                var marker = e.target;
				// Формируем имя для запроса таблицы из Google
				if(marker.feature.properties.extra_name!=="" & marker.feature.properties.extra_name !== null) {name = marker.feature.properties.city + " ("+marker.feature.properties.extra_name+")"}
				else {name = marker.feature.properties.city}
				// Получаем рейтинг из таблицы Google
//https://docs.google.com/document/d/1K7zIOFVF-pqt2x0kA9anfOBEZh4QLsvruEPWolUSWeU/edit?usp=sharing
				getAdditionalInfo(marker.feature.properties.geokvantum_locations_id).then((response) => {
					console.log(response);
					if(typeof(response.base_rating_done)==="number"){
						marker.feature.properties.base_rating_done = response.base_rating_done;
						marker.feature.properties.base_rating_not_done = response.base_rating_not_done;
						console.log(marker.feature.properties.base_rating_done);
						var doneJobsTableRows = "";
						for (var key in response.done_jobs) {
							doneJobsTableRows = doneJobsTableRows +
								"<tr><th>" + key + "</th><td><a target='_blank' rel='noopener noreferrer' href='"+ response.done_jobs[key] +"'>" + response.done_jobs[key] + "</a></td></tr>";
						}
						var tutorsNames = "";
						for (var nameKey in response.tutors_full_names) {
							tutorsNames = tutorsNames + response.tutors_full_names[nameKey] + "<br>";
						}
						content = 
							"<table class='table table-condensed'>"+
								"<tr><th>Наставник(и)</th><td>" + tutorsNames + "</td></tr>"+
								"<tr><th>Адрес</th><td>" + response.address + "</td></tr>"+
								"<tr><th>Сайт</th><td>" + response.site + "</td></tr>"+
								"<tr><th>Базовый рейтинг</th><td>" + feature.properties.base_rating_done + "/8</td></tr>"+
							"</table>"+
							// Следующие две строки - попытка встроить Google Sheets и Google Docs в Popup
							//https://docs.google.com/spreadsheets/d/1FHkpYM-NFajrnKM31tLn41h8whPinSli7fGzsDpLB5o/edit#gid=1065101772
							//"<iframe src='https://docs.google.com/spreadsheets/d/13R8O15c_sZKZT2QRHom1z2SDA3E1O5chUvROnqHCkwE/pubhtml?widget=true&amp;headers=true' style='width:100%;height:100%;'></iframe>"+
							"<iframe src='https://docs.google.com/spreadsheets/d/e/2PACX-1vRbGPUssmMVIBSn19MinkQfKV04gO6jMo0cFeeVkCJFhGaucyoCx5SwAHTywIWYcQHgA_dFO45O5Jh-/pubhtml?gid=1065101772&amp;single=true&amp;widget=true&amp;headers=false' style='width:100%;height:100%;resize:vertical;overflow:auto;'></iframe>"+
							"<iframe width=100% height=100% src='https://docs.google.com/document/d/e/2PACX-1vQVASxPS2KOmu1-z2uHF4fBugX8Mq_wnz_DcGkpoREZevMG23hz9_5H0nHcWHOlWHlt5gZ9TGJxJ4zi/pub?embedded=true'></iframe>";
						$("#base-info-body").html(content);
						$("#artifact-body").html("<table class='table table-condensed'>" + doneJobsTableRows + "</table>");
						$("#feature-title").html(name);
					}
				});
				$("#featureModal").modal("show");
			}
		});
	}
});

// Создание слоя с круговыми диаграммами, отображающими базовый рейтинг (основанный на наличии 8 артефактов)
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

// Запрос данный и загрузка их в сформированные слои
$.getJSON("/Home/GetAllGeoKvantumsPositions", function (data) {
	geokvantumsGeoJSON.addData(data);	
	console.log("Данные о местоположении Геоквантумов получены!");
	geokvantumsClusterGroup.addLayer(geokvantumsGeoJSON).addTo(geoMap);
});
$.getJSON("/Home/GetAllGeoKvantumsPositionsWithRating", function(data) {
	geokvantumsPieChart.addData(data);
	console.log("Данные о местоположении Геоквантумов c рейтингом получены!");
	//document.getElementById("loaderSpinner").style.display = "none";
});

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

// Добавление водяного знака слева снизу
L.control.watermark({ position: 'bottomleft' }).addTo(geoMap);
