/*
 Maps - A Java and Leaflet based map viewer and proxy
 Copyright (C) 2009-2025 Michael Roennau

 This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation; either version 3 of the License, or (at your option) any later version.
 This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 You should have received a copy of the GNU General Public License along with this program; if not, see <http://www.gnu.org/licenses/>.
 */
package de.elbe5.map;

public class World {

    static int maxZoom = 18;
    static double tileExtent = 256.0;
    static double fullExtent = Math.pow(2,((double)maxZoom))*tileExtent;

    static double projectedLongitude(double longitude){
        return (longitude + 180)/360.0;
    }

    static double projectedLatitude(double latitude){
        return (1 - Math.log( Math.tan(latitude * Math.PI/180.0 ) + 1/Math.cos(latitude * Math.PI / 180.0 ))/Math.PI)/2;
    }

    static double worldX(double longitude){
        return Math.round(projectedLongitude(longitude)*World.fullExtent);
    }

    static double worldY(double latitude){
        return Math.round(projectedLatitude(latitude)*World.fullExtent);
    }

    static int tileX(double longitude, int zoom){
        return (int) Math.floor(projectedLongitude(longitude)*Math.pow(2.0, zoom));
    }

    static int tileY(double latitude, int zoom){
        return (int) Math.floor(projectedLatitude(latitude)*Math.pow(2.0, zoom));
    }

}
