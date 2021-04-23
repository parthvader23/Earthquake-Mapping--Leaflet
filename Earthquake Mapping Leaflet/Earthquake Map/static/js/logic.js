var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson";

d3.json(queryUrl).then(function(data){
    createFeatures(data.features);
});

function createFeatures(earthquakeData){
    var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/streets-v11",
        accessToken: API_KEY
    });
    var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/dark-v10",
        accessToken: API_KEY
    });

    var CircleArray = new Array();

    for (var i = 0; i<earthquakeData.length; i++){
        coordinates = [earthquakeData[i].geometry.coordinates[1],earthquakeData[i].geometry.coordinates[0]]
        properties = earthquakeData[i].properties;

        var color = "#d7191c";
        if (properties.mag<1){
            color = "00ccbc";
        }
        else if (properties.mag<2){
            color = "90eb9d";
        }
        else if (properties.mag<3){
            color = "#f9d057";
        }
        else if (properties.mag<4){
            color = "#f29e2e";
        }
        else if (properties.mag<5){
            color = "#e76818";
        }
        var myCircle = L.circle(coordinates, {
            fillOpacity: 0.75,
            color: color,
            fillColor: color,
            radius: (properties.mag*15000)
        }).bindPopup("<h1>" + properties.place + "</h1> <hr> <h3>Magnitud: " + properties.mag.toFixed(2) + "</h3>");
        CircleArray.push(myCircle);
    }

    var earthquakes = L.layerGroup(CircleArray);
    var baseMaps = {
        "Street Map": streetmap,
        "Dark Map" : darkmap,
    };

    var overlayMaps = {
        Earthquakes: earthquakes
    };

    var myMap = L.map("map", {
        center: [40.73, -74.0059],
        zoom: 5,
        layers: [darkmap, earthquakes]
    });

    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

    var lefend = L.control({position: 'topright'});

    legend.onAdd = function (map){
            var div = L.DomUtil.create('div', 'info legend');
            var grades = ["0-1", "1-2", "2-3", "3-4", "4-5", "5+"];
        var color = ["#00ccbc","#90eb9d","#f9d057","#f29e2e","#e76818","#d7191c"];
            for (var i = 0; i < grades.length; i++){
                    div.innerHTML +=
                        '<p style="margin-left: 15px">' + '<i style="background:' + color[i] + ' "></i>' + '&nbsp;&nbsp;' + grades[i]+ '<\p>';
            }
            return div;

    };

    legend.addTo(myMap)

    myMap.on('overlayadd', function(a){
        legend.addTo(myMap);
    });
    myMap.on('overlayremove', function(a){
        myMap.removeControl(legend);
    });
}