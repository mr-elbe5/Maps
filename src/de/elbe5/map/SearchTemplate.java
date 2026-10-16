package de.elbe5.map;

import de.elbe5.application.Str;
import de.elbe5.request.RequestData;
import de.elbe5.template.HtmlTemplate;

import java.io.Writer;

public class SearchTemplate extends HtmlTemplate {

    public static SearchTemplate instance = new SearchTemplate();

    public SearchTemplate() {
        super("search");
    }

    @Override
    public void displayContent(Writer writer, RequestData rdata) {
        write(writer, getHtmlPart(0),
                Str._search.getHtml(rdata),
                Str._searchHint.getHtml(rdata),
                Str._search.getHtml(rdata)
        );
    }
}
