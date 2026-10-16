package de.elbe5.map;

import de.elbe5.application.Str;
import de.elbe5.request.RequestData;
import de.elbe5.template.HtmlTemplate;

import java.io.Writer;

public class AddTrackTemplate extends HtmlTemplate {

    public static AddTrackTemplate instance = new AddTrackTemplate();

    public AddTrackTemplate() {
        super("addTrack");
    }

    @Override
    public void displayContent(Writer writer, RequestData rdata) {
        write(writer, getHtmlPart(0),
                Str._addTrack.getHtml(rdata),
                Str._addTrackHint.getHtml(rdata),
                Str._load.getHtml(rdata),
                Str._cancel.getHtml(rdata)
        );
    }
}
