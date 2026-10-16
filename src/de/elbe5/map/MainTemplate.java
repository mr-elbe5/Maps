package de.elbe5.map;

import de.elbe5.application.MapsConfiguration;
import de.elbe5.application.Str;
import de.elbe5.request.RequestData;
import de.elbe5.template.HtmlTemplate;
import de.elbe5.tile.TileType;
import de.elbe5.user.UserController;

import java.io.Writer;

public class MainTemplate extends HtmlTemplate {

    public static MainTemplate instance = new MainTemplate();

    public MainTemplate() {
        super("main");
    }

    @Override
    public void displayContent(Writer writer, RequestData rdata) {
        write(writer, getHtmlPart(0),
                rdata.getLocale().getLanguage(),
                Str._toggleSelector.getHtml(rdata),
                Str._toggleSelector.getHtml(rdata),
                Str._toggleCross.getHtml(rdata),
                Str._toggleCross.getHtml(rdata),
                Str._mapSource.getHtml(rdata),
                Str._mapSource.getHtml(rdata),
                Str._layerSource.getHtml(rdata),
                Str._layerSource.getHtml(rdata),
                Str._toggleRoutePanel.getHtml(rdata),
                Str._toggleRoutePanel.getHtml(rdata),
                Str._addTrack.getHtml(rdata),
                Str._addTrack.getHtml(rdata),
                Str._search.getHtml(rdata),
                Str._search.getHtml(rdata)
        );
        if (UserController.isLoggedIn(rdata)) {
            write(writer, getHtmlPart(1),
                    Str._logout.getHtml(rdata),
                    Str._logout.getHtml(rdata)
            );
        }
        else{
            write(writer, getHtmlPart(2),
                    Str._login.getHtml(rdata),
                    Str._login.getHtml(rdata)
            );
        }
        write(writer, getHtmlPart(3),
                Str._route.getHtml(rdata),
                Str._routeStart.getHtml(rdata),
                Str._set.getHtml(rdata),
                Str._routeEnd.getHtml(rdata),
                Str._set.getHtml(rdata),
                Str._routeType.getHtml(rdata),
                Str._foot.getHtml(rdata),
                Str._bike.getHtml(rdata),
                Str._car.getHtml(rdata),
                Str._calculate.getHtml(rdata),
                Str._copyright.getHtml(rdata),
                Str._imprintAddress.getHtml(rdata),
                Str._imprint.getHtml(rdata),
                Str._cookieAcceptText.getHtml(rdata),
                Str._ok.getHtml(rdata),
                rdata.getLocale().getLanguage()
        );
        for (TileType type: MapsConfiguration.getTileTypes()) {
            write(writer, getHtmlPart(4),
                    type.getName(),
                    type.getUrlPattern()
            );
        }
        for (TileType type: MapsConfiguration.getLayerTypes()) {
            write(writer, getHtmlPart(5),
                    type.getName(),
                    type.getUrlPattern()
            );
        }
        if (MapsConfiguration.getCurrentLayerType() != null) {
            write(writer, getHtmlPart(6),
                    MapsConfiguration.getCurrentLayerType().getName()
            );
        }
        write(writer, getHtmlPart(7),
                toString(MapsConfiguration.getStartZoom()),
                toString(MapsConfiguration.getStartLatitude()),
                toString(MapsConfiguration.getStartLongitude()),
                MapsConfiguration.getCurrentTileType().getName()
        );
    }
}
