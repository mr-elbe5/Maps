/*
 Maps - A Java and Leaflet based map viewer and proxy
 Copyright (C) 2009-2025 Michael Roennau

 This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation; either version 3 of the License, or (at your option) any later version.
 This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 You should have received a copy of the GNU General Public License along with this program; if not, see <http://www.gnu.org/licenses/>.
 */
package de.elbe5.servlet;

import de.elbe5.request.RequestData;
import de.elbe5.response.IResponse;

import jakarta.servlet.annotation.MultipartConfig;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.StringTokenizer;

@MultipartConfig(fileSizeThreshold = 1024 * 1024 * 10, maxFileSize = 1024 * 1024 * 10, maxRequestSize = 1024 * 1024 * 10)
abstract public class ControllerServlet extends WebServlet {

    public static Controller defaultController = null;
    public static String defaultMethod = "showHome";

    protected void processRequest(String method, HttpServletRequest request, HttpServletResponse response) throws IOException {
        request.setCharacterEncoding(Controller.ENCODING);
        String uri = request.getRequestURI();
        RequestData rdata = new RequestData(method, request);
        StringTokenizer stk = new StringTokenizer(uri, "/", false);
        String methodName = "";
        Controller controller;
        if (stk.hasMoreTokens()) {
            //controller name
            stk.nextToken();
            if (stk.hasMoreTokens()) {
                methodName = stk.nextToken();
            }
            else{
                methodName = defaultMethod;
            }
            controller = getController();
        }
        else{
            controller = defaultController;
            methodName = "defaultMethod";
        }
        rdata.init();
        try {
            IResponse result = getResponse(controller, methodName, rdata);
            result.processResponse(getServletContext(), rdata, response);
        } catch (ResponseException ce) {
            handleException(request, response, ce.getResponseCode());
        } catch (Exception | AssertionError e) {
            handleException(request, response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }

    protected abstract Controller getController();

    public IResponse getResponse(Controller controller, String methodName, RequestData rdata) {
        if (controller==null)
            throw new ResponseException(HttpServletResponse.SC_BAD_REQUEST);
        try {
            Method controllerMethod = controller.getClass().getMethod(methodName, RequestData.class);
            Object result = controllerMethod.invoke(controller, rdata);
            if (result instanceof IResponse)
                return (IResponse) result;
            throw new ResponseException(HttpServletResponse.SC_BAD_REQUEST);
        } catch (NoSuchMethodException | InvocationTargetException e){
            throw new ResponseException(HttpServletResponse.SC_BAD_REQUEST);
        }
        catch (IllegalAccessException e) {
            throw new ResponseException(HttpServletResponse.SC_UNAUTHORIZED);
        }
    }
}
