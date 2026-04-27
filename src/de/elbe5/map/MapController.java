/*
 Maps - A Java and Leaflet based map viewer and proxy
 Copyright (C) 2009-2025 Michael Roennau

 This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation; either version 3 of the License, or (at your option) any later version.
 This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 You should have received a copy of the GNU General Public License along with this program; if not, see <http://www.gnu.org/licenses/>.
 */
package de.elbe5.map;

import de.elbe5.request.RequestData;
import de.elbe5.response.ForwardResponse;
import de.elbe5.response.IResponse;
import de.elbe5.servlet.Controller;

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

    public IResponse openLayerSource(RequestData rdata) {
        return new ForwardResponse("/WEB-INF/_jsp/ajax/layerSource.ajax.jsp");
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

}
