
var map;
var markers = [];

// load map
function init(){
	var myOptions = {
		zoom      : 14,
		center    : { lat:42.360193,lng:-71.094859},
		mapTypeId : google.maps.MapTypeId.ROADMAP,
		styles: [
			{ elementType: "geometry", stylers: [{ color: "#242f3e" }] },
			{ elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
			{ elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
			{
			  featureType: "administrative.locality",
			  elementType: "labels.text.fill",
			  stylers: [{ color: "#d59563" }],
			},
			{
			  featureType: "poi",
			  elementType: "labels.text.fill",
			  stylers: [{ color: "#d59563" }],
			},
			{
			  featureType: "poi.park",
			  elementType: "geometry",
			  stylers: [{ color: "#263c3f" }],
			},
			{
			  featureType: "poi.park",
			  elementType: "labels.text.fill",
			  stylers: [{ color: "#6b9a76" }],
			},
			{
			  featureType: "road",
			  elementType: "geometry",
			  stylers: [{ color: "#38414e" }],
			},
			{
			  featureType: "road",
			  elementType: "geometry.stroke",
			  stylers: [{ color: "#212a37" }],
			},
			{
			  featureType: "road",
			  elementType: "labels.text.fill",
			  stylers: [{ color: "#9ca5b3" }],
			},
			{
			  featureType: "road.highway",
			  elementType: "geometry",
			  stylers: [{ color: "#746855" }],
			},
			{
			  featureType: "road.highway",
			  elementType: "geometry.stroke",
			  stylers: [{ color: "#1f2835" }],
			},
			{
			  featureType: "road.highway",
			  elementType: "labels.text.fill",
			  stylers: [{ color: "#f3d19c" }],
			},
			{
			  featureType: "transit",
			  elementType: "geometry",
			  stylers: [{ color: "#2f3948" }],
			},
			{
			  featureType: "transit.station",
			  elementType: "labels.text.fill",
			  stylers: [{ color: "#d59563" }],
			},
			{
			  featureType: "water",
			  elementType: "geometry",
			  stylers: [{ color: "#17263c" }],
			},
			{
			  featureType: "water",
			  elementType: "labels.text.fill",
			  stylers: [{ color: "#515c6d" }],
			},
			{
			  featureType: "water",
			  elementType: "labels.text.stroke",
			  stylers: [{ color: "#17263c" }],
			},
		  ],
		
	};
	var element = document.getElementById('map');
  	map = new google.maps.Map(element, myOptions);
  	addMarkers();
}



// Add bus markers to map
async function addMarkers(){
	// get bus data
	var locations = await getBusLocations();
  console.log(new Date);
	// loop through data, add bus markers
	locations.forEach(function(bus){
		var marker = getMarker(bus.id);		
		if (marker){
			moveMarker(marker,bus);
		}
		else{
			addMarker(bus);			
		}
	});

	// timer
	setTimeout(addMarkers,15000);
}

// Request bus data from MBTA
async function getBusLocations(){
	var url = 'https://api-v3.mbta.com/vehicles?sort=direction_id&include=route&filter%5Broute%5D=1&api_key=5480903a65764e129cf91c942b08de49';	
	var response = await fetch(url);
	var json = await response.json();
	return json.data;
}
//Adds bus markers to the map.
function addMarker(bus){
	var icon = getIcon(bus);
	var marker = new google.maps.Marker({
	    position: {
	    	lat: bus.attributes.latitude, 
	    	lng: bus.attributes.longitude
	    },
	    map: map,
	    icon: icon,
	    id: bus.id
	});
	markers.push(marker);
}

function getIcon(bus){
	// select icon based on bus direction
	if (bus.attributes.direction_id === 0) {
		return './images/gray.png';
	}
	return './images/white.png';	
}

function moveMarker(marker,bus) {
	// change icon if bus has changed direction
	var icon = getIcon(bus);
	marker.setIcon(icon);

	// move icon to new lat/lon
    marker.setPosition( {
    	lat: bus.attributes.latitude, 
    	lng: bus.attributes.longitude
	});
}
//Checks for existing bus markers and moves them.
function getMarker(id){
	var marker = markers.find(function(item){
		return item.id === id;
	});
	return marker;
}
//initates init function.
window.onload = init;
