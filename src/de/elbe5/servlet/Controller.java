package de.elbe5.servlet;

import de.elbe5.base.LocalizedStrings;
import de.elbe5.request.*;
import de.elbe5.response.IResponse;
import de.elbe5.response.ForwardResponse;

import de.elbe5.response.MasterResponse;
import jakarta.servlet.http.HttpServletResponse;

import java.util.Locale;

public abstract class Controller {

    public static String ENCODING = "UTF-8";

    protected IResponse showHome(RequestData rdata){
        return new MasterResponse("/WEB-INF/_jsp/blank.jsp");
    }

    protected IResponse openAdminPage(RequestData rdata, String jsp, String title) {
        rdata.getAttributes().put(RequestKeys.KEY_JSP, jsp);
        rdata.getAttributes().put(RequestKeys.KEY_TITLE, title);
        return new ForwardResponse("/WEB-INF/_jsp/administration/adminMaster.jsp");
    }

    protected IResponse showSystemAdministration(RequestData rdata) {
        return openAdminPage(rdata, "/WEB-INF/_jsp/administration/systemAdministration.jsp", $S("_systemAdministration", rdata.getLocale()));
    }

    protected IResponse showPersonAdministration(RequestData rdata) {
        return openAdminPage(rdata, "/WEB-INF/_jsp/administration/personAdministration.jsp", $S("_personAdministration", rdata.getLocale()));
    }

    protected void assertLoggedIn(RequestData rdata){
        if (!rdata.isLoggedIn())
            throw new ResponseException(HttpServletResponse.SC_UNAUTHORIZED);
    }

    protected String $S(String key, Locale locale){
        return LocalizedStrings.getInstance().string(key, locale);
    }

    protected String $SH(String key, Locale locale){
        return LocalizedStrings.getInstance().html(key, locale);
    }

    public String $SHM(String key, Locale locale){
        return LocalizedStrings.getInstance().htmlMultiline(key, locale);
    }

}
