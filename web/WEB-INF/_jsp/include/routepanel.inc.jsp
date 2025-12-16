<%--
  Maps - A Java and Leaflet based map viewer and proxy
  Copyright (C) 2009-2025 Michael Roennau

  This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation; either version 3 of the License, or (at your option) any later version.
  This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
  You should have received a copy of the GNU General Public License along with this program; if not, see <http://www.gnu.org/licenses/>.
--%>
<%response.setContentType("text/html;charset=UTF-8");%>
<%@ page trimDirectiveWhitespaces="true" %>
<%@ page import="de.elbe5.request.RequestData" %>
<%@include file="/WEB-INF/_jsp/include/functions.inc.jsp" %>
<%
  RequestData rdata = RequestData.getRequestData(request);
  Locale locale = rdata.getLocale();
%>
<div class="bold"><%=$SH("_route", locale)%></div>
<form>
  <div class="formGroup">
    <div>
      <span><%=$SH("_routeStart", locale)%></span>&nbsp;<a href="" onclick="return route.setClickForStart();"><%=$SH("_set", locale)%>&nbsp;<img src="/static-content/img/marker-green.svg" alt=""/> </a>
    </div>
    <div id="routeStartLabel"></div>
    <input type="hidden" name="routeStartLatitude" id="routeStartLatitude" value="">
    <input type="hidden" name="routeStartLongitude" id="routeStartLongitude" value="">
    <div id="routeStartName"></div>
  </div>
  <div class="formGroup">
    <div>
      <span><%=$SH("_routeEnd", locale)%></span>&nbsp;<a href="" onclick="return route.setClickForEnd();"><%=$SH("_set", locale)%>&nbsp;<img src="/static-content/img/marker-red.svg" alt=""/></a>
    </div>
    <div id="routeEndLabel"></div>
    <input type="hidden" name="routeEndLatitude" id="routeEndLatitude" value="">
    <input type="hidden" name="routeEndLongitude" id="routeEndLongitude" value="">
    <div id="routeEndName"></div>
  </div>
  <div class="formGroup">
    <div><%=$SH("_routeType", locale)%></div>
    <select name="routeProfile" id="routeProfile">
      <option value="foot"><%=$SH("_foot",locale)%></option>
      <option value="bike"><%=$SH("_bike",locale)%></option>
      <option value="car"><%=$SH("_car",locale)%></option>
    </select>
  </div>
  <button class="primary" onclick="return route.requestRoute();"><%=$SH("_calculate", locale)%></button>
</form>
<div id="routeInstructions" style="margin-top:1rem;"></div>