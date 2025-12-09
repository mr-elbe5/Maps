<%@ page import="de.elbe5.request.RequestData" %>
<%@ page import="java.util.Locale" %>
<%@ include file="/WEB-INF/_jsp/include/functions.inc.jsp" %>
<%@ page contentType="text/html;charset=UTF-8" %>
<%
    RequestData rdata = RequestData.getRequestData(request);
    Locale locale = rdata.getLocale();
%>
<div class="nav">
    <ul>
        <%if (rdata.isLoggedIn()) {%>
        <li>
            <a href="#" onclick="return openModalDialog('/map/loadTiles', initializeLoadTilesInputs);"
               title="<%=$SH("_loadTiles", locale)%>">
                <img class="icon" src="/static-content/img/download.svg" alt="<%=$SH("_loadTiles", locale)%>">
            </a>
        </li>
        <%}%>
        <li>
            <a href="#" onclick="return toggleAreaSelector();" title="<%=$SH("_toggleSelector", locale)%>">
                <img class="icon" src="/static-content/img/bounding-box.svg" alt="<%=$SH("_toggleSelector", locale)%>">
            </a>
        </li>
        <li>
            <a href="" onclick="return toggleCenterCross();" title="<%=$SH("_toggleCross", locale)%>">
                <img src="/static-content/img/crosshair.svg" alt="<%=$SH("_toggleCross", locale)%>">
            </a>
        </li>
        <li>
            <a href="" onclick="return openModalDialog('/map/openMapSource', initializeMapSourceRadios);"
               title="<%=$SH("_mapSource", locale)%>">
                <img src="/static-content/img/map.svg" alt="<%=$SH("_mapSource", locale)%>">
            </a>
        </li>
        <li>
            <a href="#" onclick="return toggleRoutePanel();" title="<%=$SH("_toggleRoutePanel", locale)%>">
                <img class="icon" src="/static-content/img/signpost.svg" alt="<%=$SH("_toggleRoutePanel", locale)%>">
            </a>
        </li>
        <li>
            <a href="" onclick="return openModalDialog('/map/openAddTrack');" title="<%=$SH("_addTrack", locale)%>">
                <img src="/static-content/img/person-walking.svg" alt="<%=$SH("_addTrack", locale)%>">
            </a>
        </li>
        <li>
            <a href="" onclick="return openModalDialog('/map/openSearch');" title="<%=$SH("_search", locale)%>">
                <img src="/static-content/img/search.svg" alt="<%=$SH("_search", locale)%>">
            </a>
        </li>
        <%if (rdata.isLoggedIn()) {%>
        <li>
            <a href="/user/logout" title="<%=$SH("_logout", locale)%>">
                <img src="/static-content/img/person-fill.svg" alt="<%=$SH("_logout", locale)%>">
            </a>
        </li>
        <%} else {%>
        <li>
            <a href="" onclick="return openModalDialog('/user/openLogin');" title="<%=$SH("_login", locale)%>">
                <img src="/static-content/img/person.svg" alt="<%=$SH("_login", locale)%>">
            </a>
        </li>
        <%}%>
    </ul>
</div>