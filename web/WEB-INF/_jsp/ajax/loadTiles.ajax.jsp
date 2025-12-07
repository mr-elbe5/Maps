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
<%@ page import="de.elbe5.tile.TileType" %>
<%@ page import="de.elbe5.application.Configuration" %>
<%
    RequestData rdata = RequestData.getRequestData(request);
    Locale locale = rdata.getLocale();
%>
<div class="dialog md">
    <div class="modalHeader">
        <%=$SH("_loadTiles", locale)%>
        <img class="closeIcon" src="/static-content/img/x-lg.svg" alt="close" onclick="closeModalDialog();"/>
    </div>
    <div class="modalBody">
        <form action="/map/startLoadingTiles/" method="POST" id="loadTilesForm" name="loadTilesForm">
            <div class="formGroup">
                <label for="tileType"><%=$SH("_tileType", locale)%>
                </label>
                <select name="tileType" id="tileType">
                    <% for (TileType type: Configuration.getTileTypes()){%>
                    <option><%=type.getName()%>
                    </option>
                    <%}%>
                </select>
            </div>
            <div class="formGroup">
                <label for="topLatitude"><%=$SH("_topLatitude", locale)%>
                </label>
                <input type="text" name="topLatitude" id="topLatitude" placeholder="">
            </div>
            <div class="formGroup">
                <label for="bottomLatitude"><%=$SH("_bottomLatitude", locale)%>
                </label>
                <input type="text" name="bottomLatitude" id="bottomLatitude" placeholder="">
            </div>
            <div class="formGroup">
                <label for="leftLongitude"><%=$SH("_leftLongitude", locale)%>
                </label>
                <input type="text" name="leftLongitude" id="leftLongitude" placeholder="">
            </div>
            <div class="formGroup">
                <label for="rightLongitude"><%=$SH("_rightLongitude", locale)%>
                </label>
                <input type="text" name="rightLongitude" id="rightLongitude" placeholder="">
            </div>
            <div class="formGroup">
                <label for="zoom"><%=$SH("_zoom", locale)%>
                </label>
                <select name="zoom" id="zoom">
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                    <option>6</option>
                    <option>7</option>
                    <option>8</option>
                    <option>9</option>
                    <option>10</option>
                    <option>11</option>
                    <option>12</option>
                    <option>13</option>
                    <option>14</option>
                    <option>15</option>
                    <option>16</option>
                    <option>17</option>
                    <option>18</option>
                </select>
            </div>
        </form>
    </div>
    <div class="modalFooter">
        <button class="primary" onclick="postFormAsJsonForHtml('/map/startLoadingTiles', 'loadTilesForm', getModalDialog());"><%=$SH("_load", locale)%>
        </button>
        <button onclick="closeModalDialog()"><%=$SH("_cancel", locale)%>
        </button>
    </div>
</div>


