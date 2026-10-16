package de.elbe5.user;

import de.elbe5.application.Str;
import de.elbe5.request.RequestData;
import de.elbe5.template.HtmlTemplate;

import java.io.Writer;

public class LoginTemplate extends HtmlTemplate {

    public static LoginTemplate instance = new LoginTemplate();

    public LoginTemplate() {
        super("login");
    }

    @Override
    public void displayContent(Writer writer, RequestData rdata) {
        write(writer, getHtmlPart(0),
                Str._login.getHtml(rdata),
                Str._user.getHtml(rdata),
                Str._password.getHtml(rdata),
                Str._login.getHtml(rdata),
                Str._cancel.getHtml(rdata)
        );
    }
}
