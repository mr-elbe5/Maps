<%--
  Maps - A Java and Leaflet based map viewer and proxy
  Copyright (C) 2009-2025 Michael Roennau

  This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation; either version 3 of the License, or (at your option) any later version.
  This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
  You should have received a copy of the GNU General Public License along with this program; if not, see <http://www.gnu.org/licenses/>.
--%>
<%response.setContentType("text/html;charset=UTF-8");%>
<%@ include file="/WEB-INF/_jsp/include/functions.inc.jsp" %>
<%@ page trimDirectiveWhitespaces="true" %>
<%@ page import="java.util.Locale" %>
<%@ page import="de.elbe5.request.RequestData" %>
<%
    RequestData rdata = RequestData.getRequestData (request);
    Locale locale = rdata.getLocale();
%>
<div class="dialog md">
    <div class="modalHeader">
        <%=$SH("_login", locale)%>
        <img class="closeIcon" src="/static-content/img/x-lg.svg" alt = "close" onclick="closeModalDialog();"/>
    </div>
    <div class="modalBody">
        <form action="/user/login" method="post" id="loginForm" name="loginForm" accept-charset="UTF-8">
            <div class="centered">
                <img src="/static-content/img/logo.png" alt="elbe5">
            </div>
            <div class="formGroup">
                <label for="user" class="sr-only"><%=$SH("_user", locale)%>
                </label>
                <input type="text" id="user" name="user" class="form-control"
                       placeholder="<%=$SH("_user", locale)%>" required>
            </div>
            <div class="formGroup">
                <label for="password" class="sr-only"><%=$SH("_password", locale)%>
                </label>
                <input type="password" id="password" name="password" class="form-control"
                       placeholder="<%=$SH("_password", locale)%>" required style="margin: 5px 0;">
            </div>
        </form>
    </div>
    <div class="modalFooter">
        <button class="primary" onclick="document.querySelector('#loginForm').submit();"><%=$SH("_login", locale)%></button>
        <button onclick="closeModalDialog()"><%=$SH("_cancel", locale)%></button>
    </div>
</div>

