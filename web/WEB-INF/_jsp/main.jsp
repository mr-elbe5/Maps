<%--
  Maps - A Java and Leaflet based map viewer and proxy
  Copyright (C) 2009-2025 Michael Roennau

  This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation; either version 3 of the License, or (at your option) any later version.
  This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
  You should have received a copy of the GNU General Public License along with this program; if not, see <http://www.gnu.org/licenses/>.
--%>
<%response.setContentType("text/html;charset=UTF-8");%>
<%@ page trimDirectiveWhitespaces="true" %>
<%@include file="/WEB-INF/_jsp/include/functions.inc.jsp" %>
<%@ page import="de.elbe5.request.RequestData" %>
<%@ page import="de.elbe5.base.LocalizedStrings" %>
<%@ page import="de.elbe5.application.Configuration" %>
<%@ page import="java.util.Locale" %>
<%@ page import="de.elbe5.tile.TileType" %>
<%
    RequestData rdata = RequestData.getRequestData(request);
    Locale locale = rdata.getLocale();
%>
<!DOCTYPE html>
<html lang="<%=locale.getLanguage()%>">
<head>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"/>
    <title>OSM Maps</title>
    <meta name="keywords" content="osm openstreetmap map elbe5">
    <meta name="description" content="">
    <link rel="shortcut icon" href="/favicon.ico"/>
    <link rel="stylesheet" href="/static-content/css/leaflet.css"/>
    <link rel="stylesheet" href="/static-content/css/leaflet-areaselect.css"/>
    <link rel="stylesheet" href="/static-content/css/maps.css?v=3"/>
    <script type="text/javascript" src="/static-content/js/leaflet.js"></script>
    <script type="text/javascript" src="/static-content/js/leaflet-hash.js"></script>
    <script type="text/javascript" src="/static-content/js/leaflet-areaselect.js"></script>
    <script type="text/javascript" src="/static-content/js/basics.js?v=3"></script>
    <script type="text/javascript" src="/static-content/js/mapdata.js?v=3"></script>
    <script type="text/javascript" src="/static-content/js/maps.js?v=3"></script>
</head>
<body>
<header>
    <div class="logo-area">
        <img class="logo" src="/static-content/img/logo.png" alt="Bandika"/>
    </div>
    <div class="nav-area">
        <jsp:include page="/WEB-INF/_jsp/include/nav.inc.jsp" flush="true" />
    </div>
</header>
<main id="main" role="main">
    <div id="map"></div>
    <div id="centerCross" style="display: none">
        <a href="#" onclick="openModalDialog('/map/openCenterInfo', initializeCenterInfo);"><img src="/static-content/img/crosshair.svg" alt=""/></a>
    </div>
    <div id="routeStarter" style="display: none">
        <h4><%=$SH("_route", locale)%></h4>
        <form>
            <button onclick="return setRouteStart();"><%=$SH("_setStartPoint", locale)%></button>
            <div class="formGroup">
                <label for="routeStart"><%=$SH("_routeStart", locale)%>
                </label>
                <input type="text" name="routeStart" id="routeStart" placeholder="">
            </div>
            <button onclick="return setRouteEnd();"><%=$SH("_setEndPoint", locale)%></button>
            <div class="formGroup">
                <label for="routeEnd"><%=$SH("_routeEnd", locale)%>
                </label>
                <input type="text" name="routeEnd" id="routeEnd" placeholder="">
            </div>
            <button class="primary" onclick="return calculateRoute();"><%=$SH("_calculate", locale)%></button>
        </form>
        <div id="routeResult"></div>
    </div>
</main>
<footer>
    <div>
        &copy; <%=LocalizedStrings.getInstance().html("copyright", locale)%>
    </div>
    <div>
        <a href="<%=$SH("_imprintAddress", locale)%>" target="_blank"><%=$SH("_imprint", locale)%></a>
    </div>
    <div id="latlng"></div>
</footer>
<dialog></dialog>
<div id="cookieBanner">
    <%=$SH("_cookieAcceptText", locale)%>
    <button onclick="acceptCookie()">
        <%=$SH("_ok", locale)%>
    </button>
</div>
</body>
<script>
    //<![CDATA[
    let tileTypes = {}
    <% for (TileType type : Configuration.getTileTypes()){%>
        tileTypes['<%=type.getName()%>'] = '<%=type.getUrlPattern()%>';
    <%}%>
    let mapData = {
        zoom : <%=Configuration.getStartZoom()%>,
        latitude : <%=Configuration.getStartLatitude()%>,
        longitude : <%=Configuration.getStartLongitude()%>,
        tileType : '<%=Configuration.getCurrentTileType().getName()%>'
    }
    if (cookieAccepted()){
        readMapData();
    }
    let map = L.map('map').setView([mapData.latitude, mapData.longitude], mapData.zoom);
    let tileLayer = L.tileLayer(getTileLayerUrl(mapData.tileType), {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors'
    });
    tileLayer.addTo(map);
    let hash = L.hash(map);
    initializeMapEvents();
    let areaSelect = null;
    initializeCookieBanner();
    //]]>
</script>
</html>
