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
        <%=$SH("_search", locale)%>
        <img class="closeIcon" src="/static-content/img/x-lg.svg" alt = "close" onclick="closeModalDialog();"/>
    </div>
    <div class="modalBody">
        <form>
            <div class="formGroup">
                <input type="text" id="searchInput" placeholder="<%=$SH("_searchHint", locale)%>">
                <div class="append">
                    <button onclick="return startSearch();">
                        <img src="/static-content/img/search.svg" alt="<%=$SH("_search", locale)%>"/>
                    </button>
                </div>
            </div>
        </form>
        <div id="searchResults"></div>
    </div>
</div>

<script type="text/javascript">

    let searchInput = document.querySelector('#searchInput');
    setTimeout(function() { searchInput.focus() }, 500);

    searchInput.keypress(function(event){
        let keycode = (event.keyCode ? event.keyCode : event.which);
        if (keycode === 13){
            event.preventDefault();
            startSearch();
        }
    });

</script>

