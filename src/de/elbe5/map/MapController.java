/*
 Maps - A Java and Leaflet based map viewer and proxy
 Copyright (C) 2009-2025 Michael Roennau

 This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation; either version 3 of the License, or (at your option) any later version.
 This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 You should have received a copy of the GNU General Public License along with this program; if not, see <http://www.gnu.org/licenses/>.
 */
package de.elbe5.map;

import de.elbe5.application.Configuration;
import de.elbe5.request.RequestData;
import de.elbe5.response.ForwardResponse;
import de.elbe5.response.IResponse;
import de.elbe5.response.JsonResponse;
import de.elbe5.response.StatusResponse;
import de.elbe5.route.Route;
import de.elbe5.route.RouteProvider;
import de.elbe5.servlet.Controller;
import de.elbe5.tile.*;
import jakarta.servlet.http.HttpServletResponse;

public class MapController extends Controller {

    private static final MapController instance = new MapController();

    public static MapController getInstance() {
        return instance;
    }

    @Override
    public IResponse showHome(RequestData rdata) {
        return new ForwardResponse("/WEB-INF/_jsp/main.jsp");
    }

    public IResponse openMapSource(RequestData rdata) {
        return new ForwardResponse("/WEB-INF/_jsp/ajax/mapSource.ajax.jsp");
    }

    public IResponse openCenterInfo(RequestData rdata) {
        return new ForwardResponse("/WEB-INF/_jsp/ajax/centerInfo.ajax.jsp");
    }

    public IResponse openAddTrack(RequestData rdata) {
        return new ForwardResponse("/WEB-INF/_jsp/ajax/addTrack.ajax.jsp");
    }

    public IResponse openSearch(RequestData rdata) {
        return new ForwardResponse("/WEB-INF/_jsp/ajax/search.ajax.jsp");
    }

    public IResponse requestRoute(RequestData rdata) {
        double startLat = rdata.getAttributes().getDouble("startLat");
        double startLon = rdata.getAttributes().getDouble("startLon");
        double endLat = rdata.getAttributes().getDouble("endLat");
        double endLon = rdata.getAttributes().getDouble("endLon");
        Route route = new Route(startLat, startLon, endLat, endLon);
        String json = RouteProvider.instance.getRouteInfo(route, rdata.getLocale());
        return new JsonResponse(json);
    }

    public IResponse loadTiles(RequestData rdata) {
        if (!rdata.isLoggedIn()){
            return new StatusResponse(HttpServletResponse.SC_UNAUTHORIZED);
        }
        if (TileProvider.instance.isLoading()){
            return showLoadStatus(rdata);
        }
        else{
            return new ForwardResponse("/WEB-INF/_jsp/ajax/loadTiles.ajax.jsp");
        }
    }

    public IResponse startLoadingTiles(RequestData rdata) {
        if (!rdata.isLoggedIn()){
            return new StatusResponse(HttpServletResponse.SC_UNAUTHORIZED);
        }
        double topLatitude = Math.min(85.0,rdata.getAttributes().getDouble("topLatitude"));
        double bottomLatitude = Math.max(-85.0,rdata.getAttributes().getDouble("bottomLatitude"));
        double leftLongitude = Math.max(-180.0,rdata.getAttributes().getDouble("leftLongitude"));
        double rightLongitude = Math.min(180.0,rdata.getAttributes().getDouble("rightLongitude"));
        int zoom = rdata.getAttributes().getInt("zoom");
        TileType type;
        String typeName = rdata.getAttributes().getString("tileType");
        try{
            type = Configuration.getTileType(typeName);
        }
        catch(Exception e) {
            return new StatusResponse(HttpServletResponse.SC_BAD_REQUEST);
        }
        int minX = World.tileX(leftLongitude, zoom);
        int maxX = World.tileX(rightLongitude, zoom) + 1;
        int minY = World.tileY(topLatitude, zoom);
        int maxY = World.tileY(bottomLatitude, zoom) + 1;
        TileProvider.instance.startLoadingQueuedTiles(type, zoom, minX, maxX, minY, maxY );
        return showLoadStatus(rdata);
    }

    private IResponse showLoadStatus(RequestData rdata) {
        return new ForwardResponse("/WEB-INF/_jsp/ajax/loadTilesStatus.ajax.jsp");
    }

    public IResponse cancelLoadingTiles(RequestData rdata) {
        if (!rdata.isLoggedIn()){
            return new StatusResponse(HttpServletResponse.SC_UNAUTHORIZED);
        }
        TileProvider.instance.stopTileLoader();
        return showLoadStatus(rdata);
    }

}
