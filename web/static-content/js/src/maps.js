/*
 Maps - A Java and Leaflet based map viewer and proxy
 Copyright (C) 2009-2025 Michael Roennau

 This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation; either version 3 of the License, or (at your option) any later version.
 This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 You should have received a copy of the GNU General Public License along with this program; if not, see <http://www.gnu.org/licenses/>.
 */

const cookieAccepted = () => {
    return localStorage.getItem("mapsCookieAccepted") !== null;
}

const acceptCookie = () => {
    localStorage.setItem("mapsCookieAccepted", "yes");
    let cookieBanner = document.getElementById("cookieBanner");
    cookieBanner.style.display = "none";
}

const rejectCookie = () => {
    localStorage.removeItem("mapsCookieAccepted");
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
            mapData.updateMapData();
            mapData.saveMapData();
        }
    });
    map.on('zoomend', function () {
        if (cookieAccepted()) {
            mapData.updateMapData();
            mapData.saveMapData();
        }
    });
}

const initializeLoadTilesInputs = () => {
    let tileTypeInput = document.querySelector('#tileType');
    if (!tileTypeInput){
        return;
    }
    tileTypeInput.value = mapData.tileType;
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
    clearMapAddons();
    let routePanel = document.querySelector('#routePanel');
    if (routePanel.style.display === 'none'){
        routePanel.style.display = 'block';
        startRoute();
    }
    else{
        routePanel.style.display = 'none';
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
            track.showTrack(reader.result);

            map.fitBounds(track.getBoundingBox());
        };
        reader.onerror = function () {
            console.log(reader.error);
        };
        closeModalDialog();
    }
}

const finishTrack = () => {
    track.reset();
    return false;
}

// search dialog

const startSearch = () => {
    let searchString = document.querySelector('#searchInput').value;
    if (searchString === '') {
        document.querySelector('#searchResults').innerHTML = '';
        return;
    }
    nominatim.startSearch(searchString, (json) =>{
        let html = '';
        for (i = 0; i < json.length; i++) {
            html += getSearchResultHtml(json[i]);
        }
        document.querySelector('#searchResults').innerHTML = html;
    })
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
        mapData.saveMapData();
    }
    tileLayer.setUrl(getTileLayerUrl(mapSource));
    closeModalDialog();
    return false;
}

// route

const startRoute = () => {
    route.reset();
    return false;
}

const finishRoute = () => {
    map.off('click');
    route.reset();
    return false;
}

// general

const clearMapAddons = () => {
    finishRoute();
    finishTrack();
}

const hideRoutePanel = () => {
    routePanel.style.display = 'none';
}
