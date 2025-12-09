package de.elbe5.route;

import java.util.Locale;

public class Route {

    public enum Profile{
        foot,
        car
    }

    public double startLatitude = 0;
    public double startLongitude = 0;
    public double endLatitude = 0;
    public double endLongitude = 0;
    public Profile profile = Profile.foot;

    static String routePattern = """
            {
              "points": [
                [
                  %f,
                  %f
                ],
                [
                  %f,
                  %f
                ]
              ],
              "snap_preventions": [
                "motorway"
              ],
              "details": [
                "road_class",
                "surface"
              ],
              "profile": "%s",
              "locale": "%s",
              "instructions": true,
              "calc_points": true,
              "points_encoded": false
            }
            """;


    public Route(double startLatitude, double startLongitude, double endLatitude, double endLongitude) {
        this.startLatitude = startLatitude;
        this.startLongitude = startLongitude;
        this.endLatitude = endLatitude;
        this.endLongitude = endLongitude;
    }

    public String getRequestBody(Locale locale) {
        return String.format(Locale.ENGLISH, routePattern, startLongitude, startLatitude, endLongitude, endLatitude, profile.name(), locale.getLanguage());
    }

}
