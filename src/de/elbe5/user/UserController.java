/*
 Maps - A Java and Leaflet based map viewer and proxy
 Copyright (C) 2009-2025 Michael Roennau

 This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation; either version 3 of the License, or (at your option) any later version.
 This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 You should have received a copy of the GNU General Public License along with this program; if not, see <http://www.gnu.org/licenses/>.
 */
package de.elbe5.user;

import de.elbe5.application.MapsConfiguration;
import de.elbe5.base.*;
import de.elbe5.request.*;
import de.elbe5.response.*;
import de.elbe5.servlet.Controller;

public class UserController extends Controller {

    private static final UserController instance = new UserController();

    public static UserController getInstance() {
        return instance;
    }

    public static void setLoggedIn(boolean loggedIn, RequestData rdata){
        rdata.setSessionObject("login", loggedIn ? Boolean.TRUE : Boolean.FALSE);
    }

    @Override
    public String getKey() {
        return "user";
    }

    public static boolean isLoggedIn(RequestData rdata){
        return rdata.getSessionObject("login") == Boolean.TRUE ;
    }

    public IResponse openLogin(RequestData rdata) {
        return new TemplateResponse(LoginTemplate.instance);
    }

    public IResponse login(RequestData rdata) {
        String user = rdata.getAttributes().getString("user");
        //Log.info("user: " + user);
        String password = rdata.getAttributes().getString("password");
        //Log.info("password: " + password);
        setLoggedIn(MapsConfiguration.getLoginName().equals(user) && MapsConfiguration.getPassword().equals(password), rdata);
        Log.info("logged in: " + isLoggedIn(rdata));
        return new MainResponse();
    }

    public IResponse logout(RequestData rdata) {
        setLoggedIn(false, rdata);
        rdata.resetSession();
        return new MainResponse();
    }

}
