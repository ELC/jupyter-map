mapboxgl.accessToken = 'pk.eyJ1IjoiZWxjZyIsImEiOiJjamdtemlpbXMwMDZjMnBwOWM0ZmpydDZxIn0.w5gGuIql9j-j5TADhBatHg';

var center =  [10, 20]
var initial = [ -60.643775, -32.954626]
var zoom = 1.5
var url = 'https://raw.githubusercontent.com/ELC/jupyter-map/master/jupyter-map.geojson';
var places; // Get value async below
var filterInput = document.getElementById('filter-input');

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v9',
    center: initial,
    zoom: 4,
    minZoom: zoom
});

// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());


var places;
// Add data

async function addData() {
    const response = await fetch(url);
    places = await response.json();

    // Add a layer of places from external file
    map.addSource('data', { type: 'geojson', data: places });
    map.addLayer({
        "id": "places",
        "type": "symbol",
        "source": 'data',
        "layout": {
            "icon-image": "marker-15",
            "icon-allow-overlap": true,
            "icon-size": 1.5,
            "text-field": "",
            'text-allow-overlap': true,
            'text-size': 16,
            "text-letter-spacing": 0.05,
            "text-offset": [0, 2]
        }
    });

    // Filter by Input

    let layerIDs = [];

    places.features.forEach(function(feature) {
        var symbol = feature.properties['institution_name'];
        var layerID = symbol.trim().toLowerCase();

        // Add a layer for this symbol type if it hasn't been added already.
        if (!map.getLayer(layerID)) {
            map.addLayer({
                "id": layerID,
                "type": "symbol",
                "source": "data",
                "layout": {
                    "icon-image": "marker-15",
                    "icon-allow-overlap": true,
                    "icon-size": 1.5,
                    "text-field": "",
                    'text-allow-overlap': true,
                    'text-size': 14,
                    "text-letter-spacing": 0.05,
                    "text-offset": [0, 2],
                },
                "paint": {
                    "text-color": "#202",
                    "text-halo-color": "#fff",
                    "text-halo-width": 2
                },
                "filter": ["==", "institution_name", symbol]
            });

            layerIDs.push(layerID);
        }
    });

    filterInput.addEventListener('keyup', function(e) {
        // If the input value matches a layerID set
        // it's visibility to 'visible' or else hide it.
        map.setLayoutProperty('places', "visibility",
            !e.target.value ? "visible" : "none");

        var value = e.target.value.trim().toLowerCase();
        layerIDs.forEach(function(layerID) {
            map.setLayoutProperty(layerID, 'visibility',
                layerID.includes(value) ? 'visible' : 'none');
            map.setLayoutProperty(layerID, 'text-field',
                (e.target.value && layerID.includes(value)) ? '{institution_name}' : '');
        });
    });
}

// First time

map.on('load', () => {
    // Initial Animation

    setTimeout(() => {
        map.flyTo({
            center: center,
            zoom: zoom,
            speed: 1
        });
        }, 500)

    // Style Menu
    let layerList = document.getElementById('menu');
    let inputs = layerList.getElementsByTagName('input');

    for (let i = 0; i < inputs.length; i++) {
        inputs[i].onclick = switchLayer;
    }

});

// Load data every time the style is change and also first time

map.on('style.load', addData);

function switchLayer(layer) {
    let layerId = layer.target.id;
    let version = '-v9'
    if (layerId.includes('traffic')){
        version = '-v2'
    }
    map.setStyle('mapbox://styles/mapbox/' + layerId + version);
}


// PopUp on Hover

var popup = new mapboxgl.Popup();

map.on('mouseenter', 'places', function(e) {
    // Change the cursor style as a UI indicator.
    map.getCanvas().style.cursor = 'pointer';

    // Create a popup, but don't add it to the map yet.

    let coordinates = e.features[0].geometry.coordinates.slice();
    let properties = e.features[0].properties;

    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }

    // Populate the popup and set its coordinates based on the features found.

    let contactInfo = `
        <p><strong>Contact: </strong>${properties.contact_name}</p>
        <p><strong>Contact Email: </strong><a href="mailto:${properties.contact_email}" target="_blank">${properties.contact_email}</a></p>`

    if (properties.instructor_name && 0 !== properties.instructor_name.length){
        if (properties.contact_name.localeCompare(properties.instructor_name) !== 0){
            contactInfo = `
                <p><strong>Instructor: </strong>${properties.instructor_name}</p>
                <p><strong>Instructor Email: </strong><a href="mailto:${properties.contact_email}" target="_blank">${properties.instructor_email}</a></p>
                ${contactInfo}`
        } else{
            contactInfo = `
                <p><strong>Instructor: </strong>${properties.instructor_name}</p>
                <p><strong>Instructor Email: </strong><a href="mailto:${properties.contact_email}" target="_blank">${properties.instructor_email}</a></p>`
        }
    }

    let course_url_html = ""
    if (properties.course_url !== ""){
        course_url_html = '<a href=' + properties.course_url + ' target="_blank">' + properties.course_name + '</a>'
    } else{
        course_url_html = properties.course_name
    }

    popup.setLngLat(coordinates)
        .setHTML(`
            <h2><a href="${properties.institution_url}" target="_blank">${properties.institution_name}</a></h2>
            <p><strong>Course Name: </strong> ${course_url_html}</p>
            <p><strong>Course Area: </strong> ${properties.course_area}</p>
            ${contactInfo}`
        )
        .addTo(map);
});

// Fly on click

map.on('click', 'places', function (e) {
    map.flyTo({
        center: e.features[0].geometry.coordinates,
        zoom:16
    });
});

// Auto Display text based on Zoom

map.on('zoomend', function(e) {
    map.setLayoutProperty('places', "text-field",
        map.getZoom() > 4.5 ? "{institution_name}" : "" )
});

// Modify Cursor

map.on('mouseleave', 'places', function(e) {
    map.getCanvas().style.cursor = '';
});

map.on('click', function(e) {
    filterInput.value = ""
    let event = new Event('keyup');
    filterInput.dispatchEvent(event)
    map.getCanvas().style.cursor = '';
});

// Reset Button

document.getElementById('reset').addEventListener('click', function() {
    map.setLayoutProperty('places', "text-field", "")
    map.flyTo({
        center: center,
        zoom: zoom,
        speed: 1.2
    });
});


