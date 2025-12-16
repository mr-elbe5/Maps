/*
 Maps - A Java and Leaflet based map viewer and proxy
 Copyright (C) 2009-2025 Michael Roennau

 This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation; either version 3 of the License, or (at your option) any later version.
 This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 You should have received a copy of the GNU General Public License along with this program; if not, see <http://www.gnu.org/licenses/>.
 */

class WayPoint{

    constructor(latlng) {
        this.lat = latlng[0];
        this.lng = latlng[1];
        this.heading = 0;
        this.sign = '';
        this.distance = 0;
        this.surface = '';
        this.text = '';
    }
}

class Route{

    constructor() {
        this.distance = 0;
        this.duration = 0;
        this.points = [];
        this.waypoints = [];
        this.startMarker = undefined;
        this.endMarker = undefined;
        this.polyline = undefined;
        this.signPosts = [];
        this.routeStartIcon = L.icon({
            iconUrl: '/static-content/img/marker-green.svg',
            iconSize: [24, 24],
            iconAnchor: [12, 24],
            className: 'routeIcon'
        });
        this.routeEndIcon = L.icon({
            iconUrl: '/static-content/img/marker-red.svg',
            iconSize: [24, 24],
            iconAnchor: [12, 24],
            className: 'routeIcon'
        });
        this.signpostIcon = L.icon({
            iconUrl: '/static-content/img/signpost.svg',
            iconSize: [16, 16],
            iconAnchor: [8, 16],
            className: 'routeIcon'
        });
    }

    setClickForStart = () => {
        map.off('click');
        this.setRouteCursor(true);
        map.on('click', (e) =>{
            document.querySelector('#routeStartLabel').innerHTML = getLatLonString(e.latlng);
            document.querySelector('#routeStartLatitude').value = e.latlng.lat;
            document.querySelector('#routeStartLongitude').value = e.latlng.lng;
            this.setStartMarker(e.latlng);
            this.setRouteCursor(false);
            this.setMarkerInfo(e.latlng, document.querySelector('#routeStartName'));
        });
        return false;
    }

    setClickForEnd = () => {
        map.off('click');
        this.setRouteCursor(true);
        map.on('click', (e) =>{
            document.querySelector('#routeEndLabel').innerHTML = getLatLonString(e.latlng);
            document.querySelector('#routeEndLatitude').value = e.latlng.lat;
            document.querySelector('#routeEndLongitude').value = e.latlng.lng;
            this.setEndMarker(e.latlng);
            this.setRouteCursor(false);
            this.setMarkerInfo(e.latlng, document.querySelector('#routeEndName'));
        });
        return false;
    }

    setRouteCursor = (flag) => {
        if (flag){
            document.querySelector('#map').classList.add('routeCursor');
        }
        else{
            document.querySelector('#map').classList.remove('routeCursor');
        }
    }

    setStartMarker = (latlng) => {
        this.removeStartMarker();
        this.startMarker = L.marker([latlng.lat, latlng.lng],{
            icon: this.routeStartIcon
        }).addTo(map);
    }

    removeStartMarker = () => {
        if (this.startMarker){
            this.startMarker.remove();
            this.startMarker = undefined;
        }
    }

    setEndMarker = (latlng) => {
        this.removeEndMarker()
        this.endMarker = L.marker([latlng.lat, latlng.lng],{
            icon: this.routeEndIcon
        }).addTo(map);
    }

    removeEndMarker = () => {
        if (this.endMarker){
            this.endMarker.remove();
            this.endMarker = undefined;
        }
    }

    setMarkerInfo = (latlng, target) => {
        nominatim.findAddress(latlng, (address) =>{
            let s = "";
            if (address.street) {
                s += address.street;
            }
            if (address.city) {
                if (s !== ''){
                    s += ', ';
                }
                s += address.city;
            }
            target.innerHTML = s;
        })
    }

    requestRouteFromOSRM = () => {
        map.off('click');
        let url = "https://routing.openstreetmap.de/routed-" +
            document.querySelector('#routeProfile').value +
            "/route/v1/driving/" +
            document.querySelector('#routeStartLongitude').value +
            "," +
            document.querySelector('#routeStartLatitude').value +
            ";" +
            document.querySelector('#routeEndLongitude').value +
            "," +
            document.querySelector('#routeEndLatitude').value +
            "?overview=false&geometries=geojson&generate_hints=false&steps=true";
        fetch(url, {
            method: 'POST'
        }).then(
            response => response.json()
        ).then(json => {
            if (json && json !== '') {
                this.fromOSRMJson(json);
                this.showRoute();

            }
        });
        return false;
    }

    fromOSRMJson(json){
        console.log(json);
        this.points = [];
        this.waypoints = [];
        let leg = json.routes[0].legs[0];
        this.distance = Math.round(leg.distance);
        this.duration = Math.round(leg.duration);
        let steps = leg.steps;
        for (let i=0;i<steps.length;i++) {
            let step = steps[i];
            let coordinates = step.geometry.coordinates;
            for (let j = 0; j < coordinates.length; j++) {
                let coordinate = coordinates[j];
                this.points.push(toLatLng(coordinate));
            }
            let maneuver = step.maneuver;
            let waypoint = new WayPoint(toLatLng(maneuver.location));
            waypoint.distance = Math.floor(step.distance);
            if (maneuver.type === 'depart') {
                waypoint.sign = '';
                waypoint.text = strings[locale].startOn + step.name;
            } else if (maneuver.type === 'arrive') {
                waypoint.sign = '';
                waypoint.text = strings[locale].arrivedAt + step.name;
            } else {
                waypoint.text = step.name;
                switch (maneuver.modifier) {
                    case 'left':
                    case 'slight-left':
                        waypoint.sign = 'sign-turn-left';
                        if (waypoint.text.length === 0) {
                            waypoint.text = strings[locale].turnLeft;
                        } else {
                            waypoint.text = strings[locale].turnLeftTo + waypoint.text;
                        }
                        break;
                    case 'right':
                    case 'slight-right':
                        waypoint.sign = 'sign-turn-right';
                        if (waypoint.text.length === 0) {
                            waypoint.text = strings[locale].turnRight;
                        } else {
                            waypoint.text = strings[locale].turnRightTo + waypoint.text;
                        }
                        break;
                    case 'uturn':
                        waypoint.sign = 'sign-turn-left';
                        if (waypoint.text.length === 0) {
                            waypoint.text = strings[locale].uturn;
                        } else {
                            waypoint.text = strings[locale].uturnTo + waypoint.text;
                        }
                        break;
                    default:
                        waypoint.sign = 'straight';
                        if (waypoint.text.length === 0) {
                            waypoint.text = strings[locale].straightAhead;
                        } else {
                            waypoint.text = strings[locale].straightAheadTo + waypoint.text;
                        }
                        break;
                }
            }
            this.waypoints.push(waypoint);
        }
    }

    requestRouteFromGraphhopper = () => {
        map.off('click');
        let url = "/map/requestRoute?startLat=" +
            document.querySelector('#routeStartLatitude').value +
            "&startLon=" +
            document.querySelector('#routeStartLongitude').value +
            "&endLat=" +
            document.querySelector('#routeEndLatitude').value +
            "&endLon=" +
            document.querySelector('#routeEndLongitude').value +
            "&profile=" +
            document.querySelector('#routeProfile').value;
        fetch(url, {
            method: 'POST'
        }).then(
            response => response.json()
        ).then(json => {
            if (json && json !== '') {
                this.fromGraphhopperJson(json);
                this.showRoute();

            }
        });
        return false;
    }

    fromGraphhopperJson = (json) => {
        this.points = [];
        this.waypoints = [];
        let path = json.paths[0]
        this.distance = Math.round(path.distance);
        let coordinates = path.points.coordinates;
        for (let i= 0; i<coordinates.length; i++){
            let coord = coordinates[i];
            this.points.push([coord[1], coord[0]]) ;
        }
        let arr = path.instructions;
        for (let i=0; i<arr.length;i++) {
            let obj = arr[i];
            let pnt = this.points[obj.interval[0]];
            if (pnt) {
                let waypoint = new WayPoint(pnt)
                switch (obj.sign){
                    case -1:
                    case -2:
                    case -3:
                        waypoint.sign = 'sign-turn-left';
                        break;
                    case 0:
                        if (i>0) {
                            waypoint.sign = 'straight';
                        }
                        break;
                    case 1:
                    case 2:
                    case 3:
                        waypoint.sign = 'sign-turn-right';
                        break;
                }
                waypoint.heading = obj.heading;
                waypoint.text = obj.text;
                waypoint.distance = Math.round(obj.distance);
                waypoint.surface = obj.surface;
                this.waypoints.push(waypoint);
            }
        }
    }

    showRoute = () => {
        this.resetRouteView()
        this.setPolyline();
        this.setSignPosts();
        this.setInstructions();
    }

    setPolyline = () => {
        this.polyline = new L.Polyline(this.points, {
            color: 'blue',
            weight: 3,
            opacity: 0.75,
            smoothFactor: 1
        });
        this.polyline.addTo(map);
    }

    setSignPosts = () => {
        let container = document.querySelector('#routeInstructions');
        for (let i = 0; i<this.waypoints.length; i++){
            let waypoint = this.waypoints[i];
            if (waypoint.sign !== ''){
                let marker = L.marker([waypoint.lat, waypoint.lng], {
                    icon: this.signpostIcon
                });
                marker.on('click', (e) => {
                    for (let j = 0; j < container.children.length; j++) {
                        container.children[j].classList.remove('bold');
                    }
                    let div = document.querySelector('#waypoint_' + i);
                    div.classList.add('bold');
                });
                this.signPosts.push(marker);
                marker.addTo(map);
            }
        }
    }

    setInstructions = () => {
        let container = document.querySelector('#routeInstructions');
        container.innerHTML = '';
        let div = document.createElement('div');
        let content = document.createTextNode(strings[locale].distance + this.distance + 'm');
        div.appendChild(content);
        div.style = 'margin-bottom:0.5rem'
        container.appendChild(div);
        div = document.createElement('div');
        content = document.createTextNode(strings[locale].duration + getDurationString(this.duration));
        div.appendChild(content);
        div.style = 'margin-bottom:1.0rem'
        container.appendChild(div);
        let lastDistance = 0;
        for (let i = 0; i<this.waypoints.length; i++){
            let waypoint = this.waypoints[i];
            if (lastDistance !== 0){
                div = document.createElement('div');
                content = document.createTextNode(strings[locale].after + lastDistance + 'm:');
                div.appendChild(content);
                container.appendChild(div);
            }
            div = document.createElement('div');
            div.id = 'waypoint_' + i;
            if (waypoint.sign !== '') {
                let icon = document.createElement('img');
                icon.src = '/static-content/img/' + waypoint.sign + '.svg';
                icon.alt = '';
                icon.style = 'margin-right:10px'
                div.appendChild(icon);
            }
            else if (i===0){
                let icon = document.createElement('img');
                icon.src = '/static-content/img/marker-green.svg';
                icon.alt = '';
                icon.style = 'margin-right:10px'
                div.appendChild(icon);
            }
            else if (i===this.waypoints.length - 1){
                let icon = document.createElement('img');
                icon.src = '/static-content/img/marker-red.svg';
                icon.alt = '';
                icon.style = 'margin-right:10px'
                div.appendChild(icon);
            }
            content = document.createTextNode(waypoint.text);
            div.appendChild(content);
            container.appendChild(div);
            lastDistance = waypoint.distance;
        }
    }

    resetRouteView = () => {
        for (let i = 0; i < this.signPosts.length; i++){
            this.signPosts[i].remove();
        }
        this.signPosts = [];
        if (this.polyline){
            this.polyline.remove();
            this.polyline = undefined;
        }
    }

    reset = () => {
        this.resetRouteView()
        this.removeStartMarker();
        this.removeEndMarker();
        this.points = [];
        this.instructions = [];
        document.querySelector('#routeStartLabel').innerHTML = '';
        document.querySelector('#routeStartLatitude').value = 0;
        document.querySelector('#routeStartLongitude').value = 0;
        document.querySelector('#routeStartName').innerHTML = '';
        document.querySelector('#routeEndLabel').innerHTML = '';
        document.querySelector('#routeEndLatitude').value = 0;
        document.querySelector('#routeEndLongitude').value = 0;
        document.querySelector('#routeEndName').innerHTML = '';
        document.querySelector('#routeInstructions').innerHTML = '';
    }
}

const route = new Route();
