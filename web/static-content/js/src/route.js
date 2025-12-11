/*
 Maps - A Java and Leaflet based map viewer and proxy
 Copyright (C) 2009-2025 Michael Roennau

 This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation; either version 3 of the License, or (at your option) any later version.
 This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 You should have received a copy of the GNU General Public License along with this program; if not, see <http://www.gnu.org/licenses/>.
 */

class Route{

    constructor() {
        this.points = [];
        this.instructions = [];
        this.startMarker = undefined;
        this.endMarker = undefined;
        this.polyline = undefined;
        this.signPosts = [];
    }

    fromJson(json){
        console.log(json);
        this.points = [];
        let coordinates = json.paths[0].points.coordinates;
        for (let i= 0; i<coordinates.length; i++){
            let pnt = coordinates[i];
            this.points[i] = [pnt[1], pnt[0]];
        }
        let arr = json.paths[0].instructions;
        this.instructions = [];
        for (let i=0; i<arr.length;i++){
            let obj = arr[i];
            let pnt = this.points[obj.interval[0]];
            let sign = (obj.sign <= -1 || ((obj.sign >= 1) && (obj.sign < 4)));
            this.instructions[i] = {
                lat: pnt[0],
                lng: pnt[1],
                heading: obj.heading,
                sign: sign,
                text: obj.text,
                distance: obj.distance,
            };
        }
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
            icon: routeStartIcon
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
            icon: routeEndIcon
        }).addTo(map);
    }

    removeEndMarker = () => {
        if (this.endMarker){
            this.endMarker.remove();
            this.endMarker = undefined;
        }
    }

    setMarkerInfo = (latlng, target) => {
        let url = "https://nominatim.openstreetmap.org/reverse?lat=" + latlng.lat + "&lon=" + latlng.lng + "&format=json&addressdetails=1"
        fetch(url, {
            method: 'GET'
        }).then(
            response => response.json()
        ).then(json => {
            if (json) {
                if (json.address) {
                    let address = getAddress(json.address);
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
                }
            }
        });
    }

    requestRoute = () => {
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
                this.fromJson(json);
                this.showRoute();

            }
        });
        return false;
    }

    showRoute = () => {
        this.resetRouteView()
        this.setPolyline();
        this.setSignPosts();
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
        let s = '';
        let container = document.querySelector('#routeInstructions');
        container.innerHTML = '';
        for (let i = 0; i<this.instructions.length; i++){
            let instruction = this.instructions[i];
            let div = document.createElement('div');
            div.id = 'instruction_' + i;
            let content = document.createTextNode(instruction.text);
            div.appendChild(content);
            container.appendChild(div);
            if (instruction.sign){
                let marker = L.marker([instruction.lat, instruction.lng], {
                    icon: signpostIcon
                });
                marker.on('click', (e) => {
                    for (let j = 0; j < container.children.length; j++) {
                        container.children[j].classList.remove('bold');
                    }
                    let div = document.querySelector('#instruction_' + i);
                    div.classList.add('bold');
                });
                this.signPosts.push(marker);
                marker.addTo(map);
            }
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
        document.querySelector('#routeStartLabel').value = '';
        document.querySelector('#routeStartLatitude').value = 0;
        document.querySelector('#routeStartLongitude').value = 0;
        document.querySelector('#routeEndLabel').value = '';
        document.querySelector('#routeEndLatitude').value = 0;
        document.querySelector('#routeEndLongitude').value = 0;
    }
}
