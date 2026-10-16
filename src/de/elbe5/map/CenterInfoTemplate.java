package de.elbe5.map;

import de.elbe5.template.HtmlTemplate;

public class CenterInfoTemplate extends HtmlTemplate {

    public static CenterInfoTemplate instance = new CenterInfoTemplate();

    public CenterInfoTemplate() {
        super("centerInfo");
    }

}
