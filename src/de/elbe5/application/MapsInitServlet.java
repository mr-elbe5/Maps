/*
 Maps - A Java and Leaflet based map viewer and proxy
 Copyright (C) 2009-2025 Michael Roennau

 This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation; either version 3 of the License, or (at your option) any later version.
 This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 You should have received a copy of the GNU General Public License along with this program; if not, see <http://www.gnu.org/licenses/>.
 */
package de.elbe5.application;

import de.elbe5.base.LocalizedStrings;
import de.elbe5.base.Log;
import de.elbe5.map.MapController;
import de.elbe5.servlet.ControllerServlet;
import de.elbe5.servlet.InitServlet;
import jakarta.servlet.ServletConfig;
import jakarta.servlet.ServletContext;
import jakarta.servlet.ServletException;

import java.util.Locale;

public class MapsInitServlet extends InitServlet {

    @Override
    public void init(ServletConfig servletConfig) throws ServletException {
        super.init(servletConfig);
        System.out.println("initializing Maps application...");
        ServletContext context=servletConfig.getServletContext();
        ApplicationPath.initializePath(ApplicationPath.getCatalinaAppDir(context), ApplicationPath.getCatalinaAppROOTDir(context));
        Configuration.initialize(context);
        Log.initLog(ApplicationPath.getAppName());
        for (Locale locale : Locales.instance) {
            LocalizedStrings.getInstance().addBundle("strings", locale);
            Log.info("added localized strings for " + locale.getLanguage());
        }
        ControllerServlet.defaultController = MapController.getInstance();

        Log.log("Tile path is " + Configuration.getTilePath());
        Log.log("remote timeout is " + Configuration.remoteTimeoutSecs);
        Log.log("Maps initialized");
    }

}
