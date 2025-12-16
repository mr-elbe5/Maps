const getModalDialog = () => {
    return document.querySelector("dialog");
};

const openModalDialog = (url, action) => {
    let modalDialog = getModalDialog();
    fetch(url, {
        method: "GET"
    }).then(response => response.text()).then(text => {
        if (text && text !== "") {
            modalDialog.innerHTML = text;
            modalDialog.showModal();
            if (action) {
                action();
            }
        }
    });
    return false;
};

const openModalDialogForHtml = (url, json) => {
    let modalDialog = getModalDialog();
    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(json)
    }).then(response => response.text()).then(text => {
        if (text && text !== "") {
            modalDialog.innerHTML = text;
            modalDialog.showModal();
        }
    });
    return false;
};

const closeModalDialog = () => {
    let modalDialog = getModalDialog();
    modalDialog.innerHTML = "";
    modalDialog.close();
    return false;
};

const postForHtml = (url, target) => {
    fetch(url, {
        method: "POST"
    }).then(response => response.text()).then(text => {
        target.innerHTML = text;
    });
};

const getFormDataFromForm = form => {
    let formData = new FormData();
    let hasFiles = false;
    for (const field of form.elements) {
        if (field.name) {
            if (field.type === "file") {
                console.log("adding files: " + field.files.length);
                for (i = 0; i < field.files.length; i++) {
                    let file = field.files[i];
                    console.log("adding file");
                    formData.append(field.name, file);
                    hasFiles = true;
                }
            } else {
                formData.append(field.name, field.value);
            }
        }
    }
    if (!hasFiles) {
        return null;
    }
    for (let p of formData) {
        let name = p[0];
        let value = p[1];
        console.log(name, value);
    }
    return formData;
};

const postFormAsData = (url, formId) => {
    const form = document.getElementById(formId);
    let formData = getFormDataFromForm(form);
    if (formData) {
        return postFormData(url, formData);
    }
    return false;
};

const postFormData = (url, formData) => {
    fetch(url, {
        method: "POST",
        body: formData
    });
};

const postFormAsDataForHtml = (url, formId, target) => {
    const form = document.getElementById(formId);
    let formData = getFormDataFromForm(form);
    if (formData) {
        return postFormDataForHtml(url, formData, target);
    }
    return false;
};

const postFormDataForHtml = (url, formData, target) => {
    fetch(url, {
        method: "POST",
        body: formData
    }).then(response => response.text()).then(text => {
        target.innerHTML = text;
    });
};

const getJsonFromForm = form => {
    let json = {};
    for (const field of form.elements) {
        if (field.name) {
            json[field.name] = field.value;
        }
    }
    return json;
};

const postFormAsJson = (url, formId) => {
    const form = document.getElementById(formId);
    let json = getJsonFromForm(form);
    return postJson(url, json);
};

const postJson = (url, json) => {
    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(json)
    });
};

const postFormAsJsonForHtml = (url, formId, target) => {
    const form = document.getElementById(formId);
    let json = getJsonFromForm(form);
    return postJsonForHtml(url, json, target);
};

const postJsonForHtml = (url, json, target) => {
    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(json)
    }).then(response => response.text()).then(text => {
        target.innerHTML = text;
    });
};

const linkTo = url => {
    window.location.href = url;
};

const setCookie = (cname, cvalue, exdays) => {
    const d = new Date();
    d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1e3);
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
};

const clearCookie = cname => {
    setCookie(cname, "", 0);
};

const getCookie = cname => {
    let name = cname + "=";
    let ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === " ") {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
};

const getTileLayerUrl = value => {
    return "/" + value + "/{z}/{x}/{y}.png";
};

const format5Decimals = value => {
    return (Math.floor(value * 1e5) / 1e5).toString();
};

const getLatLonString = latlng => {
    let lat = latlng.lat;
    let latExt = lat >= 0 ? "°N" : "°S";
    let lng = latlng.lng;
    let lngExt = lng >= 0 ? "°E" : "°W°";
    return format5Decimals(Math.abs(latlng.lat)) + latExt + ", " + format5Decimals(Math.abs(latlng.lng)) + lngExt;
};

const getBoundsString = (sw, ne) => {
    let swLatExt = sw.lat >= 0 ? "°N" : "°S";
    let swLngExt = sw.lng >= 0 ? "°E" : "°W°";
    let neLatExt = ne.lat >= 0 ? "°N" : "°S";
    let neLngExt = ne.lng >= 0 ? "°E" : "°W°";
    return format5Decimals(Math.abs(sw.lat)) + swLatExt + " - " + format5Decimals(Math.abs(ne.lat)) + neLatExt + ", " + format5Decimals(Math.abs(sw.lng)) + swLngExt + " - " + format5Decimals(Math.abs(ne.lng)) + neLngExt;
};

const getDurationString = secs => {
    if (secs < 60) {
        return secs + "s";
    }
    let m = Math.floor(secs / 60);
    let s = secs % 60;
    if (m < 60) {
        return m + "m " + s + "s";
    }
    let h = Math.floor(m / 60);
    m = m % 60;
    return h + "h " + m + "m " + s + "s";
};

const toLatLng = lnglat => {
    return [ lnglat[1], lnglat[0] ];
};

class MapData {
    constructor(zoom, latitude, longitude, tileType) {
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
        if (data.zoom && data.zoom !== "null") this.zoom = data.zoom;
        if (data.latitude && data.latitude !== "null") this.latitude = data.latitude;
        if (data.longitude && data.longitude !== "null") this.longitude = data.longitude;
        if (data.tileType && data.tileType !== "null") this.tileType = data.tileType;
    };
    saveMapData = () => {
        let dataString = JSON.stringify(this);
        setCookie("mapData", dataString, 365);
    };
    updateMapData = () => {
        this.zoom = map.getZoom();
        let latlng = map.getCenter();
        if (latlng) {
            this.latitude = latlng.lat;
            this.longitude = latlng.lng;
        }
    };
}

let mapData;

const cookieAccepted = () => {
    return localStorage.getItem("mapsCookieAccepted") !== null;
};

const acceptCookie = () => {
    localStorage.setItem("mapsCookieAccepted", "yes");
    let cookieBanner = document.getElementById("cookieBanner");
    cookieBanner.style.display = "none";
};

const rejectCookie = () => {
    localStorage.removeItem("mapsCookieAccepted");
};

const initializeCookieBanner = () => {
    let cookieAccepted = localStorage.getItem("mapsCookieAccepted");
    if (!cookieAccepted) {
        let cookieBanner = document.getElementById("cookieBanner");
        cookieBanner.style.display = "block";
    }
};

const initializeMapEvents = () => {
    map.on("move", function() {
        document.querySelector("#latlng").innerHTML = getLatLonString(map.getCenter());
    });
    map.on("moveend", function() {
        if (cookieAccepted()) {
            mapData.updateMapData();
            mapData.saveMapData();
        }
    });
    map.on("zoomend", function() {
        if (cookieAccepted()) {
            mapData.updateMapData();
            mapData.saveMapData();
        }
    });
};

const initializeLoadTilesInputs = () => {
    let tileTypeInput = document.querySelector("#tileType");
    if (!tileTypeInput) {
        return;
    }
    tileTypeInput.value = mapData.tileType;
    let bounds;
    if (areaSelect) {
        bounds = areaSelect.getBounds();
    } else {
        bounds = map.getBounds();
    }
    document.querySelector("#topLatitude").value = Math.min(85, bounds.getNorthWest().lat);
    document.querySelector("#leftLongitude").value = Math.max(-180, bounds.getNorthWest().lng);
    document.querySelector("#bottomLatitude").value = Math.max(-85, bounds.getSouthEast().lat);
    document.querySelector("#rightLongitude").value = Math.min(180, bounds.getSouthEast().lng);
    document.querySelector("#zoom").value = mapData.zoom;
};

const initializeMapSourceRadios = () => {
    var radios = document.getElementsByName("mapSource");
    let activeRadio = radios[0];
    for (var i = 0; i < radios.length; i++) {
        let radio = radios[i];
        if (radio.value === mapData.tileType) {
            radio.checked = true;
            activeRadio = radio;
            break;
        }
    }
    setTimeout(function() {
        activeRadio.focus();
    }, 500);
};

const initializeCenterInfo = () => {
    let latlng = map.getCenter();
    let url = "https://nominatim.openstreetmap.org/reverse?lat=" + latlng.lat + "&lon=" + latlng.lng + "&format=json&addressdetails=1";
    fetch(url, {
        method: "GET"
    }).then(response => response.json()).then(json => {
        if (json) {
            if (json.name) {
                document.querySelector("#centerName").innerHTML = json.name;
            }
            if (json.address) {
                let address = getAddress(json.address);
                if (address.street) {
                    document.querySelector("#centerStreet").innerHTML = address.street;
                }
                if (address.city) {
                    document.querySelector("#centerCity").innerHTML = address.city;
                }
            }
        }
    });
    document.querySelector("#centerLatlngInfo").innerHTML = getLatLonString(latlng);
    url = "https://gdalserver.elbe5.de/elevation?longitude=" + latlng.lng + "&latitude=" + latlng.lat;
    fetch(url, {
        method: "GET"
    }).then(response => response.text()).then(text => {
        if (text) {
            document.querySelector("#centerAltitude").innerHTML = text + "m";
        }
    });
};

const toggleCenterCross = () => {
    let centerCross = document.querySelector("#centerCross");
    if (centerCross.style.display === "none") {
        centerCross.style.display = "block";
    } else {
        centerCross.style.display = "none";
    }
    return false;
};

const toggleAreaSelector = () => {
    if (areaSelect == null) {
        areaSelect = L.areaSelect({
            width: 200,
            height: 250
        });
        areaSelect.on("change", function() {
            var bounds = this.getBounds();
            document.querySelector("#latlng").innerHTML = getBoundsString(bounds.getSouthWest(), bounds.getNorthEast());
        });
        areaSelect.addTo(map);
    } else {
        areaSelect.off("change");
        areaSelect.remove();
        areaSelect = null;
    }
};

const toggleRoutePanel = () => {
    clearMapAddons();
    let routePanel = document.querySelector("#routePanel");
    if (routePanel.style.display === "none") {
        routePanel.style.display = "block";
        startRoute();
    } else {
        routePanel.style.display = "none";
    }
    return false;
};

const addGPXTrack = fileInput => {
    let input = document.querySelector(fileInput);
    let file = input.files[0];
    if (file) {
        let reader = new FileReader();
        reader.readAsText(file, "UTF-8");
        reader.onload = function() {
            track.showTrack(reader.result);
            map.fitBounds(track.getBoundingBox());
        };
        reader.onerror = function() {
            console.log(reader.error);
        };
        closeModalDialog();
    }
};

const finishTrack = () => {
    track.reset();
    return false;
};

const startSearch = () => {
    let searchString = document.querySelector("#searchInput").value;
    if (searchString === "") {
        document.querySelector("#searchResults").innerHTML = "";
        return;
    }
    nominatim.startSearch(searchString, json => {
        let html = "";
        for (i = 0; i < json.length; i++) {
            html += getSearchResultHtml(json[i]);
        }
        document.querySelector("#searchResults").innerHTML = html;
    });
    return false;
};

const getSearchResultHtml = obj => {
    let s = '<div class="searchResult">';
    s += '<a href="" ';
    s += 'onclick="return openSearchResult(';
    s += obj.lat + "," + obj.lon + "," + obj.boundingbox;
    s += ');">';
    s += obj.display_name;
    s += "</a></div>";
    return s;
};

const openSearchResult = (lat, lng, top, bottom, left, right) => {
    if (left && right && top && bottom) {
        let boundingbox = [ [ top, left ], [ bottom, right ] ];
        map.fitBounds(boundingbox);
    } else {
        map.panTo(new LatLng(lat, lng));
    }
    closeModalDialog();
    return false;
};

const setMapSource = () => {
    let arr = document.getElementsByName("mapSource");
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
};

const startRoute = () => {
    route.reset();
    return false;
};

const finishRoute = () => {
    map.off("click");
    route.reset();
    return false;
};

const clearMapAddons = () => {
    finishRoute();
    finishTrack();
};

const hideRoutePanel = () => {
    routePanel.style.display = "none";
};

class Nominatim {
    startSearch = (searchString, callback) => {
        if (searchString === "") {
            document.querySelector("#searchResults").innerHTML = "";
            return;
        }
        let url = "https://nominatim.openstreetmap.org/search?q=" + encodeURIComponent(searchString) + "&limit=7&format=json";
        fetch(url, {
            method: "GET"
        }).then(response => response.json()).then(json => {
            if (json) {
                callback(json);
            }
        });
        return false;
    };
    getAddress = nominatimAddress => {
        let address = {
            street: null,
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
                street += " " + s;
            }
        }
        if (street) {
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
        if (city) {
            city += " " + s;
        } else {
            city = s;
        }
        if (city) {
            address.city = city;
        }
        return address;
    };
    findAddress = (latlng, callback) => {
        let url = "https://nominatim.openstreetmap.org/reverse?lat=" + latlng.lat + "&lon=" + latlng.lng + "&format=json&addressdetails=1";
        fetch(url, {
            method: "GET"
        }).then(response => response.json()).then(json => {
            if (json) {
                if (json.address) {
                    let address = this.getAddress(json.address);
                    callback(address);
                }
            }
        });
    };
}

const nominatim = new Nominatim();

class WayPoint {
    constructor(latlng) {
        this.lat = latlng[0];
        this.lng = latlng[1];
        this.heading = 0;
        this.sign = "";
        this.distance = 0;
        this.surface = "";
        this.text = "";
    }
}

class Route {
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
            iconUrl: "/static-content/img/marker-green.svg",
            iconSize: [ 24, 24 ],
            iconAnchor: [ 12, 24 ],
            className: "routeIcon"
        });
        this.routeEndIcon = L.icon({
            iconUrl: "/static-content/img/marker-red.svg",
            iconSize: [ 24, 24 ],
            iconAnchor: [ 12, 24 ],
            className: "routeIcon"
        });
        this.signpostIcon = L.icon({
            iconUrl: "/static-content/img/signpost.svg",
            iconSize: [ 16, 16 ],
            iconAnchor: [ 8, 16 ],
            className: "routeIcon"
        });
    }
    setClickForStart = () => {
        map.off("click");
        this.setRouteCursor(true);
        map.on("click", e => {
            document.querySelector("#routeStartLabel").innerHTML = getLatLonString(e.latlng);
            document.querySelector("#routeStartLatitude").value = e.latlng.lat;
            document.querySelector("#routeStartLongitude").value = e.latlng.lng;
            this.setStartMarker(e.latlng);
            this.setRouteCursor(false);
            this.setMarkerInfo(e.latlng, document.querySelector("#routeStartName"));
        });
        return false;
    };
    setClickForEnd = () => {
        map.off("click");
        this.setRouteCursor(true);
        map.on("click", e => {
            document.querySelector("#routeEndLabel").innerHTML = getLatLonString(e.latlng);
            document.querySelector("#routeEndLatitude").value = e.latlng.lat;
            document.querySelector("#routeEndLongitude").value = e.latlng.lng;
            this.setEndMarker(e.latlng);
            this.setRouteCursor(false);
            this.setMarkerInfo(e.latlng, document.querySelector("#routeEndName"));
        });
        return false;
    };
    setRouteCursor = flag => {
        if (flag) {
            document.querySelector("#map").classList.add("routeCursor");
        } else {
            document.querySelector("#map").classList.remove("routeCursor");
        }
    };
    setStartMarker = latlng => {
        this.removeStartMarker();
        this.startMarker = L.marker([ latlng.lat, latlng.lng ], {
            icon: this.routeStartIcon
        }).addTo(map);
    };
    removeStartMarker = () => {
        if (this.startMarker) {
            this.startMarker.remove();
            this.startMarker = undefined;
        }
    };
    setEndMarker = latlng => {
        this.removeEndMarker();
        this.endMarker = L.marker([ latlng.lat, latlng.lng ], {
            icon: this.routeEndIcon
        }).addTo(map);
    };
    removeEndMarker = () => {
        if (this.endMarker) {
            this.endMarker.remove();
            this.endMarker = undefined;
        }
    };
    setMarkerInfo = (latlng, target) => {
        nominatim.findAddress(latlng, address => {
            let s = "";
            if (address.street) {
                s += address.street;
            }
            if (address.city) {
                if (s !== "") {
                    s += ", ";
                }
                s += address.city;
            }
            target.innerHTML = s;
        });
    };
    requestRouteFromOSRM = () => {
        map.off("click");
        let url = "https://routing.openstreetmap.de/routed-" + document.querySelector("#routeProfile").value + "/route/v1/driving/" + document.querySelector("#routeStartLongitude").value + "," + document.querySelector("#routeStartLatitude").value + ";" + document.querySelector("#routeEndLongitude").value + "," + document.querySelector("#routeEndLatitude").value + "?overview=false&geometries=geojson&generate_hints=false&steps=true";
        fetch(url, {
            method: "POST"
        }).then(response => response.json()).then(json => {
            if (json && json !== "") {
                this.fromOSRMJson(json);
                this.showRoute();
            }
        });
        return false;
    };
    fromOSRMJson(json) {
        console.log(json);
        this.points = [];
        this.waypoints = [];
        let leg = json.routes[0].legs[0];
        this.distance = Math.round(leg.distance);
        this.duration = Math.round(leg.duration);
        let steps = leg.steps;
        for (let i = 0; i < steps.length; i++) {
            let step = steps[i];
            let coordinates = step.geometry.coordinates;
            for (let j = 0; j < coordinates.length; j++) {
                let coordinate = coordinates[j];
                this.points.push(toLatLng(coordinate));
            }
            let maneuver = step.maneuver;
            let waypoint = new WayPoint(toLatLng(maneuver.location));
            waypoint.distance = Math.floor(step.distance);
            if (maneuver.type === "depart") {
                waypoint.sign = "";
                waypoint.text = strings[locale].startOn + step.name;
            } else if (maneuver.type === "arrive") {
                waypoint.sign = "";
                waypoint.text = strings[locale].arrivedAt + step.name;
            } else {
                waypoint.text = step.name;
                switch (maneuver.modifier) {
                  case "left":
                  case "slight-left":
                    waypoint.sign = "sign-turn-left";
                    if (waypoint.text.length === 0) {
                        waypoint.text = strings[locale].turnLeft;
                    } else {
                        waypoint.text = strings[locale].turnLeftTo + waypoint.text;
                    }
                    break;

                  case "right":
                  case "slight-right":
                    waypoint.sign = "sign-turn-right";
                    if (waypoint.text.length === 0) {
                        waypoint.text = strings[locale].turnRight;
                    } else {
                        waypoint.text = strings[locale].turnRightTo + waypoint.text;
                    }
                    break;

                  case "uturn":
                    waypoint.sign = "sign-turn-left";
                    if (waypoint.text.length === 0) {
                        waypoint.text = strings[locale].uturn;
                    } else {
                        waypoint.text = strings[locale].uturnTo + waypoint.text;
                    }
                    break;

                  default:
                    waypoint.sign = "straight";
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
        map.off("click");
        let url = "/map/requestRoute?startLat=" + document.querySelector("#routeStartLatitude").value + "&startLon=" + document.querySelector("#routeStartLongitude").value + "&endLat=" + document.querySelector("#routeEndLatitude").value + "&endLon=" + document.querySelector("#routeEndLongitude").value + "&profile=" + document.querySelector("#routeProfile").value;
        fetch(url, {
            method: "POST"
        }).then(response => response.json()).then(json => {
            if (json && json !== "") {
                this.fromGraphhopperJson(json);
                this.showRoute();
            }
        });
        return false;
    };
    fromGraphhopperJson = json => {
        this.points = [];
        this.waypoints = [];
        let path = json.paths[0];
        this.distance = Math.round(path.distance);
        let coordinates = path.points.coordinates;
        for (let i = 0; i < coordinates.length; i++) {
            let coord = coordinates[i];
            this.points.push([ coord[1], coord[0] ]);
        }
        let arr = path.instructions;
        for (let i = 0; i < arr.length; i++) {
            let obj = arr[i];
            let pnt = this.points[obj.interval[0]];
            if (pnt) {
                let waypoint = new WayPoint(pnt);
                switch (obj.sign) {
                  case -1:
                  case -2:
                  case -3:
                    waypoint.sign = "sign-turn-left";
                    break;

                  case 0:
                    if (i > 0) {
                        waypoint.sign = "straight";
                    }
                    break;

                  case 1:
                  case 2:
                  case 3:
                    waypoint.sign = "sign-turn-right";
                    break;
                }
                waypoint.heading = obj.heading;
                waypoint.text = obj.text;
                waypoint.distance = Math.round(obj.distance);
                waypoint.surface = obj.surface;
                this.waypoints.push(waypoint);
            }
        }
    };
    showRoute = () => {
        this.resetRouteView();
        this.setPolyline();
        this.setSignPosts();
        this.setInstructions();
    };
    setPolyline = () => {
        this.polyline = new L.Polyline(this.points, {
            color: "blue",
            weight: 3,
            opacity: .75,
            smoothFactor: 1
        });
        this.polyline.addTo(map);
    };
    setSignPosts = () => {
        let container = document.querySelector("#routeInstructions");
        for (let i = 0; i < this.waypoints.length; i++) {
            let waypoint = this.waypoints[i];
            if (waypoint.sign !== "") {
                let marker = L.marker([ waypoint.lat, waypoint.lng ], {
                    icon: this.signpostIcon
                });
                marker.on("click", e => {
                    for (let j = 0; j < container.children.length; j++) {
                        container.children[j].classList.remove("bold");
                    }
                    let div = document.querySelector("#waypoint_" + i);
                    div.classList.add("bold");
                });
                this.signPosts.push(marker);
                marker.addTo(map);
            }
        }
    };
    setInstructions = () => {
        let container = document.querySelector("#routeInstructions");
        container.innerHTML = "";
        let div = document.createElement("div");
        let content = document.createTextNode(strings[locale].distance + this.distance + "m");
        div.appendChild(content);
        div.style = "margin-bottom:0.5rem";
        container.appendChild(div);
        div = document.createElement("div");
        content = document.createTextNode(strings[locale].duration + getDurationString(this.duration));
        div.appendChild(content);
        div.style = "margin-bottom:1.0rem";
        container.appendChild(div);
        let lastDistance = 0;
        for (let i = 0; i < this.waypoints.length; i++) {
            let waypoint = this.waypoints[i];
            if (lastDistance !== 0) {
                div = document.createElement("div");
                content = document.createTextNode(strings[locale].after + lastDistance + "m:");
                div.appendChild(content);
                container.appendChild(div);
            }
            div = document.createElement("div");
            div.id = "waypoint_" + i;
            if (waypoint.sign !== "") {
                let icon = document.createElement("img");
                icon.src = "/static-content/img/" + waypoint.sign + ".svg";
                icon.alt = "";
                icon.style = "margin-right:10px";
                div.appendChild(icon);
            } else if (i === 0) {
                let icon = document.createElement("img");
                icon.src = "/static-content/img/marker-green.svg";
                icon.alt = "";
                icon.style = "margin-right:10px";
                div.appendChild(icon);
            } else if (i === this.waypoints.length - 1) {
                let icon = document.createElement("img");
                icon.src = "/static-content/img/marker-red.svg";
                icon.alt = "";
                icon.style = "margin-right:10px";
                div.appendChild(icon);
            }
            content = document.createTextNode(waypoint.text);
            div.appendChild(content);
            container.appendChild(div);
            lastDistance = waypoint.distance;
        }
    };
    resetRouteView = () => {
        for (let i = 0; i < this.signPosts.length; i++) {
            this.signPosts[i].remove();
        }
        this.signPosts = [];
        if (this.polyline) {
            this.polyline.remove();
            this.polyline = undefined;
        }
    };
    reset = () => {
        this.resetRouteView();
        this.removeStartMarker();
        this.removeEndMarker();
        this.points = [];
        this.instructions = [];
        document.querySelector("#routeStartLabel").innerHTML = "";
        document.querySelector("#routeStartLatitude").value = 0;
        document.querySelector("#routeStartLongitude").value = 0;
        document.querySelector("#routeStartName").innerHTML = "";
        document.querySelector("#routeEndLabel").innerHTML = "";
        document.querySelector("#routeEndLatitude").value = 0;
        document.querySelector("#routeEndLongitude").value = 0;
        document.querySelector("#routeEndName").innerHTML = "";
        document.querySelector("#routeInstructions").innerHTML = "";
    };
}

const route = new Route();

const strings = {
    de: {
        distance: "Distanz: ",
        duration: "Dauer: ",
        startOn: "Starten auf ",
        arrivedAt: "Ziel erreicht auf ",
        after: "nach ",
        turnLeft: "nach links",
        turnRight: "nach rechts",
        uturn: "wenden",
        straightAhead: "weiter geradeaus",
        turnLeftTo: "nach links auf ",
        turnRightTo: "nach rechts auf ",
        uturnTo: "wenden auf ",
        straightAheadTo: "geradeaus auf "
    },
    en: {
        distance: "Distance: ",
        duration: "Duration: ",
        startOn: "Start on ",
        arrivedAt: "Arrived on ",
        after: "after ",
        turnLeft: "turn left",
        turnRight: "turn right",
        uturn: "uturn",
        straightAhead: "straight ahead",
        turnLeftTo: "turn left on ",
        turnRightTo: "turn right on ",
        uturnTo: "uturn on ",
        straightAheadTo: "straight ahead on "
    }
};

class Track {
    constructor() {
        this.points = [];
        this.polyLine = undefined;
    }
    showTrack = xml => {
        this.readPoints(xml);
        this.polyline = new L.Polyline(this.points, {
            color: "orange",
            weight: 3,
            opacity: .75,
            smoothFactor: 1
        });
        this.polyline.addTo(map);
    };
    readPoints = xml => {
        this.points = [];
        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(xml, "text/xml");
        if (!xmlDoc) return;
        let track = xmlDoc.getElementsByTagName("trk")[0];
        if (!track) return;
        let trackpoints = track.getElementsByTagName("trkpt");
        for (let i = 0; i < trackpoints.length; i++) {
            let trackpoint = trackpoints[i];
            try {
                let lat = parseFloat(trackpoint.attributes.getNamedItem("lat").value);
                let lng = parseFloat(trackpoint.attributes.getNamedItem("lon").value);
                this.points.push(new L.latLng(lat, lng));
            } catch (err) {
                console.log(err);
            }
        }
    };
    getBoundingBox = () => {
        return this.polyline.getBounds();
    };
    resetTrackView = () => {
        if (this.polyline) {
            this.polyline.remove();
            this.polyline = undefined;
        }
    };
    reset = () => {
        this.resetTrackView();
        this.points = [];
    };
}

const track = new Track();