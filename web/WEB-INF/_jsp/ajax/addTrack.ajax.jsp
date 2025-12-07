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
    RequestData rdata = RequestData.getRequestData(request);
    Locale locale = rdata.getLocale();
%>
<div class="dialog md">
    <div class="modalHeader">
        <%=$SH("_addTrack", locale)%>
        <img class="closeIcon" src="/static-content/img/x-lg.svg" alt = "close" onclick="closeModalDialog();"/>
    </div>
    <div class="modalBody">
        <form id="form" enctype="multipart/form-data">
            <div class="input-group mb-3">
                <div class="fileInput">
                    <input type="file" name="track" accept=".gpx" class="addTrackInput" id="trackInput" aria-describedby="fileHelp">
                    <label class="hint" for="trackInput">
                        <%=$SH("_addTrackHint", locale)%>
                    </label>
                </div>
            </div>
        </form>
    </div>
    <div class="modalFooter">
        <button class="primary" onclick="addGPXTrack('#trackInput');"><%=$SH("_load", locale)%></button>
        <button onclick="closeModalDialog()"><%=$SH("_cancel", locale)%></button>
    </div>
</div>

