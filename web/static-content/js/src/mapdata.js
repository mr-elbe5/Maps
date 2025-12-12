/*
 Maps - A Java and Leaflet based map viewer and proxy
 Copyright (C) 2009-2025 Michael Roennau

 This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation; either version 3 of the License, or (at your option) any later version.
 This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 You should have received a copy of the GNU General Public License along with this program; if not, see <http://www.gnu.org/licenses/>.
 */

class MapData{

    constructor(zoom, latitude, longitude, tileType){
        this.zoom = zoom;
        this.latitude = latitude;
        this.longitude = longitude;
        this.tileType = tileType;
    }

    readMapDataCookie = () => {
        let dataString = getCookie("mapData");
        if (!dataString || dataString.length === 0) {
            return;
        }
        let data = JSON.parse(dataString);
        if (data.zoom  && data.zoom !== 'null')
            this.zoom = data.zoom;
        if (data.latitude  && data.latitude !== 'null')
            this.latitude = data.latitude;
        if (data.longitude  && data.longitude !== 'null')
            this.longitude = data.longitude;
        if (data.tileType && data.tileType !== 'null')
            this.tileType = data.tileType;
    }

    saveMapData = () => {
        let dataString = JSON.stringify(this);
        setCookie("mapData", dataString, 365);
    }

    updateMapData = () => {
        this.zoom = map.getZoom();
        let latlng = map.getCenter();
        if (latlng) {
            this.latitude = latlng.lat;
            this.longitude = latlng.lng;
        }
    }
}

let mapData;

