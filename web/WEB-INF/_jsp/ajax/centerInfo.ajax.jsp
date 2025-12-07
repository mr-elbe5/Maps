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
<div class="dialog md">
    <div class="modalHeader">
        <img class="icon" src="/static-content/img/crosshair.svg" alt=""/>
        <img class="closeIcon" src="/static-content/img/x-lg.svg" alt = "close" onclick="closeModalDialog();"/>
    </div>
    <div class="modalBody">
        <div id="centerName"></div>
        <div id="centerStreet"></div>
        <div id="centerCity"></div>
        <div id="centerLatlngInfo"></div>
        <div id="centerAltitude"></div>
    </div>
</div>

