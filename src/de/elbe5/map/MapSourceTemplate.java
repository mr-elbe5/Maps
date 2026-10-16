package de.elbe5.map;

import de.elbe5.application.MapsConfiguration;
import de.elbe5.application.Str;
import de.elbe5.request.RequestData;
import de.elbe5.template.HtmlTemplate;
import de.elbe5.tile.TileType;

import java.io.Writer;

public class MapSourceTemplate extends HtmlTemplate {

    public static MapSourceTemplate instance = new MapSourceTemplate();

    public MapSourceTemplate() {
        super("mapSource");
    }

    @Override
    public void displayContent(Writer writer, RequestData rdata) {
        write(writer, getHtmlPart(0),
                Str._mapSource.getHtml(rdata)
        );
        for (TileType type: MapsConfiguration.getTileTypes()){
            write(writer, getHtmlPart(1),
                    type.getName(),
                    type.getName(),
                    type.getName(),
                    type.getName()
            );
        }
        write(writer, getHtmlPart(2),
                Str._ok.getHtml(rdata),
                Str._cancel.getHtml(rdata)
        );
    }
}
