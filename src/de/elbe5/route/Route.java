package de.elbe5.route;

public class Route {

    public double startLatitude;
    public double startLongitude;
    public double endLatitude;
    public double endLongitude;

    public Route(double startLatitude, double startLongitude, double endLatitude, double endLongitude) {
        this.startLatitude = startLatitude;
        this.startLongitude = startLongitude;
        this.endLatitude = endLatitude;
        this.endLongitude = endLongitude;
    }

    public String getRequestBody(){
        return "{'elevation':false,'points':[["
                + startLongitude + "," + startLatitude + "],["
                + endLongitude + "," + endLatitude + "]],'profile':'foot'}";
    }

}
