/*
 Maps - A Java and Leaflet based map viewer and proxy
 Copyright (C) 2009-2025 Michael Roennau

 This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation; either version 3 of the License, or (at your option) any later version.
 This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 You should have received a copy of the GNU General Public License along with this program; if not, see <http://www.gnu.org/licenses/>.
 */

class Route{
    constructor() {
        let points = [];
        let instructions = [];
    }

    initialize(json){
        this.setPoints(json.paths[0].points.coordinates)
        this.setInstructions(json.paths[0].instructions)
    }

    setPoints(coordinates){
        this.points = [];
        for (let i= 0; i<coordinates.length; i++){
            let pnt = coordinates[i];
            this.points[i] = [pnt[1], pnt[0]];
        }
    }

    setInstructions(arr){
        this.instructions = [];
        for (let i=0; i<arr.length;i++){
            let obj = arr[i];
            let pnt = this.points[obj.interval[0]];
            this.instructions[i] = {
                lat: pnt[0],
                lng: pnt[1],
                heading: obj.heading,
                text: obj.text,
                distance: obj.distance,
            };
        }
    }
}

const initializeCookieBanner = () => {
    let cookieAccepted = localStorage.getItem("mapsCookieAccepted");
    if (!cookieAccepted)
    {
        let cookieBanner = document.getElementById("cookieBanner");
        cookieBanner.style.display = "block";
    }
}

const initializeMapEvents = () => {
    map.on('move', function () {
        document.querySelector('#latlng').innerHTML = getLatLonString(map.getCenter());
    });
    map.on('moveend', function () {
        if (cookieAccepted()) {
            updateMapData();
            saveMapData();
        }
    });
    map.on('zoomend', function () {
        if (cookieAccepted()) {
            updateMapData();
            saveMapData();
        }
    });
}

const initializeLoadTilesInputs = () => {
    document.querySelector('#tileType').value = mapData.tileType;
    let bounds;
    if (areaSelect) {
        bounds = areaSelect.getBounds();
    } else {
        bounds = map.getBounds();
    }
    document.querySelector('#topLatitude').value = Math.min(85.0, bounds.getNorthWest().lat);
    document.querySelector('#leftLongitude').value = Math.max(-180.0, bounds.getNorthWest().lng);
    document.querySelector('#bottomLatitude').value = Math.max(-85.0, bounds.getSouthEast().lat);
    document.querySelector('#rightLongitude').value = Math.min(180.0, bounds.getSouthEast().lng);
    document.querySelector('#zoom').value = mapData.zoom;
}

const initializeMapSourceRadios = () => {
    var radios = document.getElementsByName('mapSource');
    let activeRadio = radios[0];
    for (var i=0;i<radios.length;i++){
        let radio = radios[i];
        if (radio.value === mapData.tileType){
            radio.checked = true;
            activeRadio = radio;
            break;
        }
    }
    setTimeout(function() { activeRadio.focus() }, 500);
}

const initializeCenterInfo = () => {
    let latlng = map.getCenter();
    let url = "https://nominatim.openstreetmap.org/reverse?lat=" + latlng.lat + "&lon=" + latlng.lng + "&format=json&addressdetails=1"
    fetch(url, {
        method: 'GET'
    }).then(
        response => response.json()
    ).then(json => {
        if (json) {
            if (json.name) {
                document.querySelector('#centerName').innerHTML = json.name;
            }
            if (json.address) {
                let address = getAddress(json.address);
                if (address.street) {
                    document.querySelector('#centerStreet').innerHTML = address.street;
                }
                if (address.city) {
                    document.querySelector('#centerCity').innerHTML = address.city;
                }
            }
        }
    });
    document.querySelector('#centerLatlngInfo').innerHTML = getLatLonString(latlng);
    url = "https://gdalserver.elbe5.de/elevation?longitude=" + latlng.lng + "&latitude=" + latlng.lat;
    fetch(url, {
        method: 'GET'
    }).then(
        response => response.text()
    ).then(text => {
        if (text) {
            document.querySelector('#centerAltitude').innerHTML = text + 'm';
        }
    });
}

// center cross

const toggleCenterCross = () => {
    let centerCross = document.querySelector('#centerCross');
    if (centerCross.style.display === 'none'){
        centerCross.style.display = 'block';
    }
    else{
        centerCross.style.display = 'none';
    }
    return false;
}

// aera selector

const toggleAreaSelector = () => {
    if (areaSelect == null) {
        areaSelect = L.areaSelect({
            width: 200,
            height: 250,
        });
        areaSelect.on("change", function () {
            var bounds = this.getBounds();
            document.querySelector('#latlng').innerHTML = getBoundsString(bounds.getSouthWest(), bounds.getNorthEast());
        });
        areaSelect.addTo(map);
    }
    else{
        areaSelect.off("change");
        areaSelect.remove();
        areaSelect = null;
    }
}

// aera selector

const toggleRoutePanel = () => {
    let routePanel = document.querySelector('#routePanel');
    if (routePanel.style.display === 'none'){
        routePanel.style.display = 'block';
        resetRoute();
    }
    else{
        routePanel.style.display = 'none';
        finishRoute();
    }
    return false;
}

// track dialog

const addGPXTrack = (fileInput) => {
    let input = document.querySelector(fileInput);
    let file = input.files[0];
    if (file) {
        let reader = new FileReader();
        reader.readAsText(file, 'UTF-8');
        reader.onload = function () {
            let points = gpxToLatLngList(reader.result);
            var polyline = new L.Polyline(points, {
                color: 'orange',
                weight: 4,
                opacity: 0.75,
                smoothFactor: 1
            });
            polyline.addTo(map);
            let boundingbox = polyline.getBounds();
            map.fitBounds(boundingbox);
        };
        reader.onerror = function () {
            console.log(reader.error);
        };
        closeModalDialog();
    }
}

// search dialog

const startSearch = () => {
    let searchString = document.querySelector('#searchInput').value;
    if (searchString === '') {
        document.querySelector('#searchResults').innerHTML = '';
        return;
    }
    let url = "https://nominatim.openstreetmap.org/search?q=" + encodeURIComponent(searchString) + "&limit=7&format=json";
    fetch(url, {
        method: 'GET'
    }).then(
        response => response.json()
    ).then(json => {
        if (json) {
            let html = '';
            for (i = 0; i < json.length; i++) {
                html += getSearchResultHtml(json[i]);
            }
            document.querySelector('#searchResults').innerHTML = html;
        }
    });
    return false;
}

const getSearchResultHtml = (obj) => {
    let s = '<div class="searchResult">';
    s += '<a href="" ';
    s += 'onclick="return openSearchResult(';
    s += obj.lat + ',' + obj.lon + ',' + obj.boundingbox;
    s += ');">';
    s += obj.display_name;
    s += '</a></div>';
    return s;
}

const openSearchResult = (lat, lng, top, bottom, left, right) => {
    if (left && right && top && bottom) {
        let boundingbox = [[top, left], [bottom, right]];
        map.fitBounds(boundingbox);
    } else {
        map.panTo(new LatLng(lat, lng));
    }
    closeModalDialog();
    return false;
}

// map source dialog

const setMapSource = () => {
    let arr = document.getElementsByName('mapSource')
    let mapSource = mapData.tileType;
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].checked) {
            mapSource = arr[i].value;
            break;
        }
    }
    mapData.tileType = mapSource;
    if (cookieAccepted()) {
        saveMapData();
    }
    tileLayer.setUrl(getTileLayerUrl(mapSource));
    closeModalDialog();
    return false;
}

// route

const resetRoute = () => {
    document.querySelector('#routeStartLabel').value = '';
    document.querySelector('#routeStartLatitude').value = 0;
    document.querySelector('#routeStartLongitude').value = 0;
    document.querySelector('#routeEndLabel').value = '';
    document.querySelector('#routeEndLatitude').value = 0;
    document.querySelector('#routeEndLongitude').value = 0;
    removeRouteStartMarker();
    removeRouteEndMarker();
    return false;
}

const setRouteCursor = (flag) => {
    if (flag){
        document.querySelector('#map').classList.add('routeCursor');
    }
    else{
        document.querySelector('#map').classList.remove('routeCursor');
    }
}

const setRouteStartMarker = (latlng) => {
    removeRouteStartMarker();
    routeStartMarker = L.marker([latlng.lat, latlng.lng],{
        icon: routeStartIcon
    }).addTo(map);
}

const removeRouteStartMarker = () => {
    if (routeStartMarker){
        routeStartMarker.remove();
        routeStartMarker = null;
    }
}

const setRouteEndMarker = (latlng) => {
    removeRouteEndMarker()
    routeEndMarker = L.marker([latlng.lat, latlng.lng],{
        icon: routeEndIcon
    }).addTo(map);
}

const removeRouteEndMarker = () => {
    if (routeEndMarker){
        routeEndMarker.remove();
        routeEndMarker = null;
    }
}

const selectRouteStart = () => {
    map.off('click');
    setRouteCursor(true);
    map.on('click', (e) =>{
        document.querySelector('#routeStartLabel').innerHTML = getLatLonString(e.latlng);
        document.querySelector('#routeStartLatitude').value = e.latlng.lat;
        document.querySelector('#routeStartLongitude').value = e.latlng.lng;
        setRouteStartMarker(e.latlng);
        setRouteCursor(false);
    });
    return false;
}

const selectRouteEnd = () => {
    map.off('click');
    setRouteCursor(true);
    map.on('click', (e) =>{
        document.querySelector('#routeEndLabel').innerHTML = getLatLonString(e.latlng);
        document.querySelector('#routeEndLatitude').value = e.latlng.lat;
        document.querySelector('#routeEndLongitude').value = e.latlng.lng;
        setRouteEndMarker(e.latlng);
        setRouteCursor(false);
    });
    return false;
}

const calculateRoute = () => {
    map.off('click');
    let url = "/map/requestRoute?startLat=" +
        document.querySelector('#routeStartLatitude').value +
        "&startLon=" +
        document.querySelector('#routeStartLongitude').value +
        "&endLat=" +
        document.querySelector('#routeEndLatitude').value +
        "&endLon=" +
        document.querySelector('#routeEndLongitude').value;
    fetch(url, {
        method: 'POST'
    }).then(
        response => response.json()
    ).then(json => {
        if (json && json !== '') {
            let route = new Route();
            route.initialize(json);
            showRoute(route);
        }
    });
    return false;
}

const showRoute = (route) => {
    console.log(route);
    let polyline = new L.Polyline(route.points, {
        color: 'orange',
        weight: 4,
        opacity: 0.75,
        smoothFactor: 1
    });
    polyline.addTo(map);
    let s = '';
    let container = document.querySelector('#routeInstructions');
    container.innerHTML = '';
    for (let i = 0; i<route.instructions.length; i++){
        let instruction = route.instructions[i];
        let div = document.createElement('div');
        div.id = 'instruction_' + i;
        let content = document.createTextNode(instruction.text);
        div.appendChild(content);
        container.appendChild(div);
        let marker = routeEndMarker = L.marker([instruction.lat, instruction.lng],{
            icon: routeStartIcon
        }).addTo(map);
        marker.on('click', (e) => {
            for (let j = 0; j < container.children.length; j++){
                container.children[j].classList.remove('bold');
            }
            let div = document.querySelector('#instruction_' + i);
            div.classList.add('bold');
        });
    }
}

const finishRoute = () => {
    map.off('click');
    return false;
}