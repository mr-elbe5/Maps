/*
 Maps - A Java and Leaflet based map viewer and proxy
 Copyright (C) 2009-2025 Michael Roennau

 This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation; either version 3 of the License, or (at your option) any later version.
 This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 You should have received a copy of the GNU General Public License along with this program; if not, see <http://www.gnu.org/licenses/>.
 */
package de.elbe5.tile;

import de.elbe5.application.Configuration;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.OutputStream;
import java.util.StringTokenizer;

public class TileServlet extends HttpServlet {

    protected void doGet(HttpServletRequest request, HttpServletResponse response) {
        // uri should be like /out/z/x/y.png
        String uri = request.getRequestURI().substring(1);
        StringTokenizer stk = new StringTokenizer(uri, "/", false);
        if (stk.countTokens() != 4) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            return;
        }
        try {
            TileType type = Configuration.getTileType(stk.nextToken());
            int z = Integer.parseInt(stk.nextToken());
            int x = Integer.parseInt(stk.nextToken());
            String s = stk.nextToken();
            if (!s.endsWith(".png")) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                return;
            }
            int y = Integer.parseInt(s.substring(0, s.length() - 4));
            Tile tile = new Tile(type, z, x, y);
            if (!TileProvider.instance.loadTileFile(tile)){
                response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                return;
            }
            response.setContentType("image/png");
            response.setHeader("Content-Disposition", "filename=\"" + tile.y + ".png");
            response.setHeader("Content-Length", Long.toString(tile.bytes.length));
            OutputStream out = response.getOutputStream();
            out.write(tile.bytes, 0, tile.bytes.length);
            out.flush();
            response.setStatus(HttpServletResponse.SC_OK);
        }
        catch (Exception e){
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
        }

    }
}
