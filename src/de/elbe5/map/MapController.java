/*
 Maps - A Java and Leaflet based map viewer and proxy
 Copyright (C) 2009-2025 Michael Roennau

 This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation; either version 3 of the License, or (at your option) any later version.
 This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 You should have received a copy of the GNU General Public License along with this program; if not, see <http://www.gnu.org/licenses/>.
 */
package de.elbe5.map;

import de.elbe5.request.RequestData;
import de.elbe5.response.IResponse;
import de.elbe5.response.MainResponse;
import de.elbe5.response.TemplateResponse;
import de.elbe5.servlet.Controller;

@SuppressWarnings("unused")
public class MapController extends Controller {

    private static final MapController instance = new MapController();

    public static MapController getInstance() {
        return instance;
    }

    @Override
    public String getKey() {
        return "map";
    }

    public IResponse showHome(RequestData rdata) {
        return new MainResponse();
    }

    public IResponse openMapSource(RequestData rdata) {
        return new TemplateResponse(MapSourceTemplate.instance);
    }

    public IResponse openLayerSource(RequestData rdata) {
        return new TemplateResponse(LayerSourceTemplate.instance);
    }

    public IResponse openCenterInfo(RequestData rdata) {
        return new TemplateResponse(CenterInfoTemplate.instance);
    }

    public IResponse openAddTrack(RequestData rdata) {
        return new TemplateResponse(AddTrackTemplate.instance);
    }

    public IResponse openSearch(RequestData rdata) {
        return new TemplateResponse(SearchTemplate.instance);
    }

}
