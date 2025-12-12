class Track{

    constructor(){
        this.points = [];
        this.polyLine = undefined;
    }

    showTrack = (xml) => {
        this.readPoints(xml);
        this.polyline = new L.Polyline(this.points, {
            color: "orange",
            weight: 3,
            opacity: .75,
            smoothFactor: 1
        });
        this.polyline.addTo(map);
    };

    readPoints = (xml) => {
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
    }

    resetTrackView = () => {
        if (this.polyline){
            this.polyline.remove();
            this.polyline = undefined;
        }
    }

    reset = () => {
        this.resetTrackView()
        this.points = [];
    }

}

const track = new Track();