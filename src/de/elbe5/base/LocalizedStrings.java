/*
 Maps - A Java and Leaflet based map viewer and proxy
 Copyright (C) 2009-2018 Michael Roennau

 This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation; either version 3 of the License, or (at your option) any later version.
 This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 You should have received a copy of the GNU General Public License along with this program; if not, see <http://www.gnu.org/licenses/>.
 */
package de.elbe5.base;

import org.apache.commons.text.StringEscapeUtils;

import java.util.*;

public class LocalizedStrings {

    final private static LocalizedStrings instance = new LocalizedStrings();

    public static LocalizedStrings getInstance() {
        return instance;
    }

    private final Map<Locale, Map<String, String>> stringMap = new HashMap<>();

    public void addBundle(String name, Locale locale) {
        ResourceBundle bundle = ResourceBundle.getBundle(name, locale);
        Map<String, String> map = new HashMap<>();
        List<String> presentKeys = new ArrayList<>();
        for (String key : bundle.keySet()) {
            if (map.containsKey(key)) {
                presentKeys.add(key);
            }
            map.put(key, bundle.getString(key));
        }
        Collections.sort(presentKeys);
        for (String key : presentKeys) {
            Log.warn("Replaced key " + key + " with bundle " + name);
        }
        stringMap.put(locale, map);
    }

    public String string(String key, Locale locale) {
        try {
            Map<String, String> map = stringMap.get(locale);
            if (map == null) {
                Log.warn("locale not found: " + locale.getLanguage());
                return "[" + key + "]";
            }
            String s = map.get(key);
            if (s != null)
                return s;
        } catch (Exception e) {
            Log.warn("string not found: " + key);
        }
        return "[" + key + "]";
    }

    public String html(String key, Locale locale) {
        return StringEscapeUtils.escapeHtml4(string(key, locale));
    }

    public String htmlMultiline(String key, Locale locale) {
        return StringEscapeUtils.escapeHtml4(string(key, locale)).replaceAll("\\\\n", "<br/>");
    }

    public String js(String key, Locale locale) {
        return StringEscapeUtils.escapeEcmaScript(string(key, locale));
    }

    public String xml(String key, Locale locale) {
        return StringEscapeUtils.escapeXml11(string(key, locale));
    }

    public String csv(String key, Locale locale) {
        //escape by opencsv
        return string(key, locale);
    }

}


