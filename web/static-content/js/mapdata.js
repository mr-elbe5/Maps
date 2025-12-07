/*
 Maps - A Java and Leaflet based map viewer and proxy
 Copyright (C) 2009-2025 Michael Roennau

 This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation; either version 3 of the License, or (at your option) any later version.
 This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 You should have received a copy of the GNU General Public License along with this program; if not, see <http://www.gnu.org/licenses/>.
 */

const getTileLayerUrl = (value) => {
    return '/' + value + '/{z}/{x}/{y}.png';
}
const format5Decimals = (value) =>{
    return (Math.floor(value*100000)/100000).toString();
}
const getLatLonString = (latlng) => {
    let lat = latlng.lat;
    let latExt = lat >= 0 ? '°N' : '°S';
    let lng = latlng.lng;
    let lngExt = lng >= 0 ? '°E' : '°W°';
    return format5Decimals(Math.abs(latlng.lat)) + latExt + ', '
        + format5Decimals(Math.abs(latlng.lng)) + lngExt;
}
const getBoundsString = (sw, ne) => {
    let swLatExt = sw.lat >= 0 ? '°N' : '°S';
    let swLngExt = sw.lng >= 0 ? '°E' : '°W°';
    let neLatExt = ne.lat >= 0 ? '°N' : '°S';
    let neLngExt = ne.lng >= 0 ? '°E' : '°W°';
    return format5Decimals(Math.abs(sw.lat)) + swLatExt + ' - '
        + format5Decimals(Math.abs(ne.lat)) + neLatExt + ', '
        + format5Decimals(Math.abs(sw.lng)) + swLngExt + ' - '
        + format5Decimals(Math.abs(ne.lng)) + neLngExt;
}
const getAddress = (nominatimAddress) =>{
    let address = {
        street : null,
        city: null
    };
    let street = null;
    let s = nominatimAddress.road;
    if (!s) {
        s = nominatimAddress.street;
    }
    if (s) {
        street = s;
        s = nominatimAddress.house_number;
        if (s) {
            street += ' ' + s;
        }
    }
    if (street){
        address.street = street;
    }
    let city = null;
    s = nominatimAddress.postcode;
    if (s) {
        city = s;
    }
    s = nominatimAddress.city;
    if (!s) {
        s = nominatimAddress.town;
    }
    if (!s) {
        s = nominatimAddress.village;
    }
    if (city){
        city += ' ' + s;
    }
    else{
        city = s;
    }
    if (city){
        address.city = city;
    }
    return address;
}

const gpxToLatLngList = (xml) => {
    let points = [];
    let parser = new DOMParser();
    let xmlDoc = parser.parseFromString(xml,"text/xml");
    if (!xmlDoc)
        return points;
    let track = xmlDoc.getElementsByTagName('trk')[0];
    if (!track)
        return points;
    let trackpoints = track.getElementsByTagName('trkpt');
    for (let i = 0; i < trackpoints.length; i++) {
        let trackpoint = trackpoints[i];
        try {
            let lat = parseFloat(trackpoint.attributes.getNamedItem('lat').value);
            let lng = parseFloat(trackpoint.attributes.getNamedItem('lon').value);
            points.push(new L.latLng(lat, lng));
        }
        catch{
        }
    }
    return points;
}

const readMapData = () => {
    let dataString = getCookie("mapData");
    if (!dataString || dataString.length === 0) {
        return;
    }
    let data = JSON.parse(dataString);
    if (data.zoom  && data.zoom !== 'null')
        mapData.zoom = data.zoom;
    if (data.latitude  && data.latitude !== 'null')
        mapData.latitude = data.latitude;
    if (data.longitude  && data.longitude !== 'null')
        mapData.longitude = data.longitude;
    if (data.tileType && data.tileType !== 'null')
        mapData.tileType = data.tileType;
}

const saveMapData = () => {
    let data = {
        zoom : mapData.zoom,
        latitude : mapData.latitude,
        longitude : mapData.longitude,
        tileType : mapData.tileType
    }
    let dataString = JSON.stringify(data);
    setCookie("mapData", dataString, 365);
}

const updateMapData = () => {
    mapData.zoom = map.getZoom();
    let latlng = map.getCenter();
    if (latlng) {
        mapData.latitude = latlng.lat;
        mapData.longitude = latlng.lng;
    }
}

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
