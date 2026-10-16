/*
 Maps - A Java and Leaflet based map viewer and proxy
 Copyright (C) 2009-2025 Michael Roennau

 This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation; either version 3 of the License, or (at your option) any later version.
 This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 You should have received a copy of the GNU General Public License along with this program; if not, see <http://www.gnu.org/licenses/>.
 */
package de.elbe5.application;

import de.elbe5.base.*;
import de.elbe5.map.MapController;
import de.elbe5.servlet.ControllerCache;
import de.elbe5.servlet.ControllerServlet;
import de.elbe5.user.UserController;
import jakarta.servlet.ServletConfig;
import jakarta.servlet.ServletContext;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;

import java.util.Map;

public class MapsInitServlet extends HttpServlet {

    @Override
    public void init(ServletConfig servletConfig) throws ServletException {
        super.init(servletConfig);
        System.out.println("initializing Maps application...");
        ServletContext context=servletConfig.getServletContext();
        MapsApplicationPath.initializePath(MapsApplicationPath.getCatalinaAppDir(context), MapsApplicationPath.getCatalinaAppROOTDir(context));
        MapsConfiguration.initialize(context);
        Log.initLog(MapsApplicationPath.getAppName());
        BaseStr.init(BaseStr.class, Map.of(
                "de", BaseStr_de.class,
                "en", BaseStr_en.class
        ));
        Str.init(Str.class, Map.of(
                "de", Str_de.class,
                "en", Str_en.class
        ));
        ControllerServlet.defaultController = MapController.getInstance();
        ControllerCache.addController(MapController.getInstance());
        ControllerCache.addController(UserController.getInstance());
        Log.log("remote timeout is " + MapsConfiguration.remoteTimeoutSecs);
        Log.log("Maps initialized");
    }

}
