/*
 Maps - A Java and Leaflet based map viewer and proxy
 Copyright (C) 2009-2025 Michael Roennau

 This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation; either version 3 of the License, or (at your option) any later version.
 This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 You should have received a copy of the GNU General Public License along with this program; if not, see <http://www.gnu.org/licenses/>.

 This file is based on net/balusc/webapp/FileServlet.java of BalusC, Copyright (C) 2009 BalusC, but modernized and adds creating files (as a cache) from the database
 */
package de.elbe5.response;

import de.elbe5.base.StringHelper;
import de.elbe5.request.RequestData;

import jakarta.servlet.ServletContext;
import jakarta.servlet.ServletOutputStream;
import jakarta.servlet.http.HttpServletResponse;
import java.io.*;

public class FileResponse implements IResponse {

    private static final int DEFAULT_BUFFER_SIZE = 0x4000;

    private final File file;
    private final String fileName;

    public FileResponse(File file, String fileName){
        this.file = file;
        this.fileName = fileName;
    }

    public void processResponse(ServletContext context, RequestData rdata, HttpServletResponse response) {
        response.reset();
        response.setBufferSize(DEFAULT_BUFFER_SIZE);
        response.setHeader("Content-Disposition", "inline;filename=\"" + fileName + "\"");
        String contentType = context.getMimeType(file.getName());
        if (contentType == null) {
            contentType = "application/octet-stream";
        }
        if (contentType.startsWith("text")) {
            contentType += ";charset=UTF-8";
        }
        response.setContentType(contentType);

        ServletOutputStream output = null;
        try {
            output = response.getOutputStream();
            response.setStatus(HttpServletResponse.SC_OK);
            response.setHeader("Content-Length", String.valueOf(file.length()));
            copyFromFileToOutput(file, output);
            output.flush();
        } catch (IOException e){
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        } finally {
            if (output!=null) try {output.close();} catch (IOException ignore) { }
        }
    }

    private static void copyFromFileToOutput(File file, OutputStream output) throws IOException
    {
        byte[] buffer = new byte[DEFAULT_BUFFER_SIZE];
        try (FileInputStream input = new FileInputStream(file)) {
            int read;
            long toRead = file.length();
            while (toRead > 0) {
                if (toRead >= DEFAULT_BUFFER_SIZE) {
                    read = input.read(buffer);
                } else {
                    read = input.read(buffer, 0, (int) toRead);
                }
                output.write(buffer, 0, read);
                toRead -= read;
            }
        }
    }

}