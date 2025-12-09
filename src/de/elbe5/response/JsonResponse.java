/*
 Maps - A Java and Leaflet based map viewer and proxy
 Copyright (C) 2009-2025 Michael Roennau

 This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation; either version 3 of the License, or (at your option) any later version.
 This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 You should have received a copy of the GNU General Public License along with this program; if not, see <http://www.gnu.org/licenses/>.

 This file is based on net/balusc/webapp/FileServlet.java of BalusC, Copyright (C) 2009 BalusC, but modernized and adds creating files (as a cache) from the database
 */
package de.elbe5.response;

import de.elbe5.request.RequestData;
import jakarta.servlet.ServletContext;
import jakarta.servlet.ServletOutputStream;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;
import java.nio.charset.StandardCharsets;

public class JsonResponse implements IResponse {

    private static final int DEFAULT_BUFFER_SIZE = 0x4000;

    private final String json;

    public JsonResponse(String json){
        this.json = json;
    }

    public void processResponse(ServletContext context, RequestData rdata, HttpServletResponse response) {
        response.reset();
        response.setBufferSize(DEFAULT_BUFFER_SIZE);
        response.setContentType("application/json");
        ServletOutputStream output = null;
        try {
            byte[] bytes = json.getBytes(StandardCharsets.UTF_8);
            output = response.getOutputStream();
            response.setStatus(HttpServletResponse.SC_OK);
            response.setHeader("Content-Length", String.valueOf(bytes.length));
            output.write(bytes);
            output.flush();
        } catch (IOException e){
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        } finally {
            if (output!=null) try {output.close();} catch (IOException ignore) { }
        }
    }

}