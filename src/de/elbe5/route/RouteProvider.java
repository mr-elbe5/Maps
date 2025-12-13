/*
 Maps - A Java and Leaflet based map viewer and proxy
 Copyright (C) 2009-2025 Michael Roennau

 This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation; either version 3 of the License, or (at your option) any later version.
 This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 You should have received a copy of the GNU General Public License along with this program; if not, see <http://www.gnu.org/licenses/>.
 */
package de.elbe5.route;

import de.elbe5.application.Configuration;
import de.elbe5.base.Log;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.Locale;

public class RouteProvider {

    public static RouteProvider instance = new RouteProvider();

    int timeoutSeconds = 60;
    HttpClient client;

    public RouteProvider() {
        client = HttpClient.newBuilder()
                .version(HttpClient.Version.HTTP_1_1)
                .followRedirects(HttpClient.Redirect.NORMAL)
                .connectTimeout(Duration.ofSeconds(timeoutSeconds))
                .build();
    }

    public String getRouteInfo(Route route, Locale locale) {
        String json = "";
        String url = "https://graphhopper.com/api/1/route?key=" + Configuration.getGraphhopperApiKey();
        String body = route.getRequestBody(locale);
        Log.info(body);
        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .timeout(Duration.ofSeconds(Configuration.getRemoteTimeoutSecs()))
                    .setHeader("User-Agent", "Mozilla/5.0 Firefox/92.0")
                    .setHeader("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(body))
                    .build();
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() != 200){
                Log.error("remote server returned status " + response.statusCode());
                return null;
            }
            json = response.body();
        }
        catch (Exception e){
            Log.error("could not receive remote json", e);
            return null;
        }
        return json;
    }
}
