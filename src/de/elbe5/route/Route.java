package de.elbe5.route;

public class Route {

    public double startLatitude = 0;
    public double startLongitude = 0;
    public double endLatitude = 0;
    public double endLongitude = 0;

    public boolean gettingStartPoint = false;
    public boolean gettingEndPoint = false;


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
