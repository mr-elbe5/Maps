class Nominatim{

    startSearch = (searchString, callback) => {
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
                callback(json);
            }
        });
        return false;
    }

    getAddress = (nominatimAddress) => {
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

    findAddress = (latlng, callback) => {
        let url = "https://nominatim.openstreetmap.org/reverse?lat=" + latlng.lat + "&lon=" + latlng.lng + "&format=json&addressdetails=1"
        fetch(url, {
            method: 'GET'
        }).then(
            response => response.json()
        ).then(json => {
            if (json) {
                if (json.address) {
                    let address = this.getAddress(json.address);
                    callback(address);
                }
            }
        });
    }

}

const nominatim = new Nominatim();