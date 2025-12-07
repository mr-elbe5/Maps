<%response.setContentType("text/html;charset=UTF-8");%>
<%@ page trimDirectiveWhitespaces="true" %>
<%
    String url = request.getRequestURL().toString();
    url = url.substring(0, url.lastIndexOf('/')) + "/map/";
%>
<html>
<head><title></title></head>
<body>
&nbsp
</body>
</html>
<script type="text/javascript">
    try {
        window.location.href = '<%=url%>';
    } catch (e) {
    }
</script>

