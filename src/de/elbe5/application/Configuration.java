/*
 Maps - A Java and Leaflet based map viewer and proxy
 Copyright (C) 2009-2025 Michael Roennau

 This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation; either version 3 of the License, or (at your option) any later version.
 This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 You should have received a copy of the GNU General Public License along with this program; if not, see <http://www.gnu.org/licenses/>.
 */
package de.elbe5.application;

import de.elbe5.base.StringHelper;
import de.elbe5.tile.TileType;
import jakarta.servlet.ServletContext;

import java.io.File;
import java.util.ArrayList;
import java.util.List;
import java.util.StringTokenizer;

public class Configuration{

    static String loginName = "";
    static String password = "";
    static String tilePath = "";
    static String elevationURL = "";
    static String searchURL = "";
    static String reverseSearchURL = "";
    static List<TileType> tileTypes = new ArrayList<>();
    static TileType currentTileType = null;
    static int startZoom = 2;
    static double startLatitude = 30.0;
    static double startLongitude = 10.0;
    static int remoteTimeoutSecs = 30;

    public static void initialize(ServletContext context){
        loginName = getSafeString(context, "loginName");
        password = getSafeString(context, "password");
        tilePath = getSafeString(context,"tilePath");
        File dir = new File(tilePath);
        if (!dir.mkdirs()){
            System.err.println("Could not create tile path: " + tilePath);
        }
        String s = getSafeString(context,"tileTypes");
        StringTokenizer stk = new StringTokenizer(s, ",");
        while (stk.hasMoreTokens()){
            String type = stk.nextToken();
            String url = getSafeString(context, "tileURL_" + type);
            if (!url.isEmpty()){
                tileTypes.add(new TileType(type, url));
            }
        }
        if (tileTypes.isEmpty()){
            currentTileType = tileTypes.getFirst();
        }
        elevationURL = getSafeString(context, "elevationURL");
        searchURL = getSafeString(context, "searchURL");
        reverseSearchURL = getSafeString(context, "reverseSearchURL");
        remoteTimeoutSecs = StringHelper.getSafeInt(context.getInitParameter("remoteTimeoutSecs"));
        if (remoteTimeoutSecs == 0){
            remoteTimeoutSecs = 30;
        }
    }

    public static String getSafeString(ServletContext servletContext, String key){
        String s=servletContext.getInitParameter(key);
        return s==null ? "" : s;
    }

    public static int getSafeInt(ServletContext servletContext, String key){
        String s=servletContext.getInitParameter(key);
        if (s==null) return 0;
        try {
            return Integer.parseInt(s);
        } catch (Exception ignore) {
            return 0;
        }
    }

    public static boolean getSafeBoolean(ServletContext servletContext, String key){
        String s=servletContext.getInitParameter(key);
        if (s==null) return false;
        try {
            return Boolean.parseBoolean(s);
        } catch (Exception ignore) {
            return false;
        }
    }

    public static String getLoginName() {
        return loginName;
    }

    public static String getPassword() {
        return password;
    }

    public static int getStartZoom() {
        return startZoom;
    }

    public static double getStartLatitude() {
        return startLatitude;
    }

    public static double getStartLongitude() {
        return startLongitude;
    }

    public static String getTilePath() {
        return tilePath;
    }

    public static List<TileType> getTileTypes() {
        return tileTypes;
    }

    public static TileType getTileType(String name){
        for (TileType t : tileTypes){
            if (t.getName().equals(name)){
                return t;
            }
        }
        return tileTypes.getFirst();
    }

    public static TileType getCurrentTileType() {
        return currentTileType;
    }

    public static String getElevationURL() {
        return elevationURL;
    }

    public static String getSearchURL() {
        return searchURL;
    }

    public static String getReverseSearchURL() {
        return reverseSearchURL;
    }

    public static int getRemoteTimeoutSecs() {
        return remoteTimeoutSecs;
    }

}
