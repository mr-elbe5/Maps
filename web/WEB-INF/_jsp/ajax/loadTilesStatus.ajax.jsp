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
<%@ page import="de.elbe5.tile.TileProvider" %>
<%@ page import="de.elbe5.tile.TileLoader" %>
<%
    RequestData rdata = RequestData.getRequestData(request);
    Locale locale = rdata.getLocale();
    TileLoader loader = TileProvider.instance.getTileLoader();
%>
<div class="dialog md">
    <div class="modalHeader">
        <%=$SH("_loadingTiles", locale)%>
        <img class="closeIcon" src="/static-content/img/x-lg.svg" alt = "close" onclick="closeModalDialog();"/>
    </div>
    <div class="modalBody">
        <% if (loader == null){%>
        <div>
            <%=$SH("_loadingTilesFinished", locale)%>
        </div>
        <% } else { %>
        <div><%=$SH("_tileType", locale)%>: <%=loader.tileType.getName()%></div>
        <div><%=$SH("_zoom", locale)%>: <%=loader.zoom%></div>
        <div><%=$SH("_allTiles", locale)%>: <%=loader.all%></div>
        <div><%=$SH("_presentTiles", locale)%>: <%=loader.present%></div>
        <div><%=$SH("_loadedTiles", locale)%>: <%=loader.loaded%></div>
        <div><%=$SH("_tilesToLoad", locale)%>: <%=loader.toLoad()%></div>
        <div><%=$SH("_errors", locale)%>: <%=loader.errors%></div>
        <%}%>
    </div>
    <div class="modalFooter">
        <% if (loader != null){%>
        <button class="primary" onclick="postForHtml('/map/loadTiles', getModalDialog());"><%=$SH("_refreshStatus", locale)%></button>
        <button class="primary" onclick="postForHtml('/map/cancelLoadingTiles', getModalDialog());"><%=$SH("_cancelLoading", locale)%></button>
        <%}%>
        <button onclick="closeModalDialog()"><%=$SH("_close", locale)%></button>
    </div>
</div>


