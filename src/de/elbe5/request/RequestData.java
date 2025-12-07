/*
 Maps - A Java and Leaflet based map viewer and proxy
 Copyright (C) 2009-2025 Michael Roennau

 This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation; either version 3 of the License, or (at your option) any later version.
 This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 You should have received a copy of the GNU General Public License along with this program; if not, see <http://www.gnu.org/licenses/>.
 */
package de.elbe5.request;

import de.elbe5.application.Locales;
import de.elbe5.base.*;
import jakarta.servlet.http.*;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.*;

public class RequestData {

    public static RequestData getRequestData(HttpServletRequest request) {
        return (RequestData) request.getAttribute(RequestKeys.KEY_REQUESTDATA);
    }

    private final KeyValueMap attributes = new KeyValueMap();

    private final HttpServletRequest request;

    private final String method;

    public RequestData(String method, HttpServletRequest request) {
        this.request = request;
        this.method = method;
    }

    public void init(){
        request.setAttribute(RequestKeys.KEY_REQUESTDATA, this);
        readRequestParams();
        initSession();
    }

    public KeyValueMap getAttributes() {
        return attributes;
    }

    public HttpServletRequest getRequest() {
        return request;
    }

    public String getMethod() {
        return method;
    }

    public Locale getLocale() {
        Locale locale = getSessionLocale();
        if (locale != null) {
            return locale;
        }
        return Locale.ENGLISH;
    }

    public boolean isPostback() {
        return method.equals("POST");
    }

    /************ user ****************/

    public boolean isLoggedIn() {
        return getSessionObject("login") == Boolean.TRUE ;
    }

    /************** request attributes *****************/

    public void readRequestParams() {
        if (isPostback()) {
            String type = request.getContentType();
            if (type != null && type.toLowerCase().startsWith("multipart/form-data")) {
                getMultiPartParams();
            } else if (type != null && type.equalsIgnoreCase("application/octet-stream")) {
                getSinglePartParams();
                getByteStream();
            } else if (type != null && type.equalsIgnoreCase("application/json")) {
                getSinglePartParams();
                getJsonStream();
            } else {
                getSinglePartParams();
            }
        }
        else {
            getSinglePartParams();
        }
    }

    private void getByteStream(){
        try {
            InputStream in = request.getInputStream();
            BinaryFile file=new BinaryFile();
            file.setBytesFromStream(in);
            file.setFileSize(file.getBytes().length);
            file.setFileName(request.getHeader("fileName"));
            file.setContentType(request.getHeader("contentType"));
            getAttributes().put("file", file);
        }
        catch (IOException ioe){
            Log.error("input stream error", ioe);
        }
    }

    private void getSinglePartParams() {
        Enumeration<?> enm = request.getParameterNames();
        while (enm.hasMoreElements()) {
            String key = (String) enm.nextElement();
            String[] strings = request.getParameterValues(key);
            getAttributes().put(key, strings);
        }
    }

    private void getMultiPartParams() {
        Map<String, List<String>> params = new HashMap<>();
        Map<String, List<BinaryFile>> fileParams = new HashMap<>();
        try {
            Collection<Part> parts = request.getParts();
            for (Part part : parts) {
                String name = part.getName();
                String fileName = getFileName(part);
                if (fileName != null) {
                    if (fileName.isEmpty())
                        continue;
                    BinaryFile file = getMultiPartFile(part, fileName);
                    if (file != null) {
                        List<BinaryFile> values;
                        if (fileParams.containsKey(name))
                            values = fileParams.get(name);
                        else {
                            values = new ArrayList<>();
                            fileParams.put(name, values);
                        }
                        values.add(file);
                    }
                } else {
                    String param = getMultiPartParameter(part);
                    if (param != null) {
                        List<String> values;
                        if (params.containsKey(name))
                            values = params.get(name);
                        else {
                            values = new ArrayList<>();
                            params.put(name, values);
                        }
                        values.add(param);
                    }
                }
            }
        } catch (Exception e) {
            Log.error("error while parsing multipart params", e);
        }
        for (String key : params.keySet()) {
            List<String> list = params.get(key);
            if (list.size() == 1) {
                getAttributes().put(key, list.getFirst());
            } else {
                String[] strings = new String[list.size()];
                for (int i = 0; i < list.size(); i++) {
                    strings[i] = list.get(i);
                }
                getAttributes().put(key, strings);
            }
        }
        for (String key : fileParams.keySet()) {
            List<BinaryFile> list = fileParams.get(key);
            if (list.size() == 1) {
                getAttributes().put(key, list.getFirst());
            } else {
                BinaryFile[] files = new BinaryFile[list.size()];
                for (int i = 0; i < list.size(); i++) {
                    files[i] = list.get(i);
                }
                getAttributes().put(key, files);
            }
        }
    }

    private String getMultiPartParameter(Part part) {
        try {
            byte[] bytes = new byte[(int) part.getSize()];
            int read = part.getInputStream().read(bytes);
            if (read > 0) {
                return new String(bytes, StandardCharsets.UTF_8);
            }
        } catch (Exception e) {
            Log.error("could not extract parameter from multipart", e);
        }
        return null;
    }

    private BinaryFile getMultiPartFile(Part part, String fileName) {
        try {
            BinaryFile file = new BinaryFile();
            file.setFileName(fileName);
            file.setContentType(part.getContentType());
            file.setFileSize((int) part.getSize());
            InputStream in = part.getInputStream();
            if (in == null) {
                return null;
            }
            ByteArrayOutputStream out = new ByteArrayOutputStream(file.getFileSize());
            byte[] buffer = new byte[8096];
            int len;
            while ((len = in.read(buffer, 0, 8096)) != -1) {
                out.write(buffer, 0, len);
            }
            file.setBytes(out.toByteArray());
            return file;
        } catch (Exception e) {
            Log.error("could not extract file from multipart", e);
            return null;
        }
    }

    private String getFileName(Part part) {
        for (String cd : part.getHeader("content-disposition").split(";")) {
            if (cd.trim().startsWith("filename")) {
                return cd.substring(cd.indexOf('=') + 1).trim().replace("\"", "");
            }
        }
        return null;
    }

    private void getJsonStream(){
        try {
            InputStream in = request.getInputStream();
            try {
                JSONObject json = (JSONObject) new JsonDeserializer().deserialize(in);
                Log.log("received json: "+ json.toJSONString());
                for (Object key : json.keySet()){
                    Object value = json.get(key);
                    if (value instanceof JSONArray) {
                        KeyValueMap[] valueList = new KeyValueMap[((JSONArray) value).size()];
                        for (int i = 0; i < ((JSONArray) value).size(); i++) {
                            KeyValueMap submap = new KeyValueMap();
                            JSONObject subjson = (JSONObject) ((JSONArray) value).get(i);
                            for (Object subkey : subjson.keySet()) {
                                submap.put(subkey.toString(), subjson.get(subkey));
                            }
                            valueList[i] = submap;
                        }
                        getAttributes().put(key.toString(), valueList);
                    }
                    else {
                        getAttributes().put(key.toString(), json.get(key));
                    }
                }
            }
            catch (Exception e){
                Log.error("unable to get params from json");
            }
            in.close();
        }
        catch (IOException ioe){
            Log.error("json input stream error", ioe);
        }
    }


    /************** request attributes ***************/

    public void setRequestObject(String key, Object obj){
        request.setAttribute(key, obj);
    }

    public Object getRequestObject(String key){
        return request.getAttribute(key);
    }

    /************** session attributes ***************/

    public void initSession() {
        HttpSession session = request.getSession(true);
        if (session.isNew()) {
            StringBuffer url = request.getRequestURL();
            String uri = request.getRequestURI();
            String host = url.substring(0, url.indexOf(uri));
            setSessionHost(host);
        }
        if (getSessionLocale() == null) {
            Locale locale = Locale.forLanguageTag(request.getLocale().getLanguage());
            if (locale != null) {
                Log.info("session locale: " + locale);
                setSessionLocale(locale);
            }
        }
    }

    public void setSessionObject(String key, Object obj) {
        HttpSession session = request.getSession();
        if (session == null) {
            return;
        }
        session.setAttribute(key, obj);
    }

    public Object getSessionObject(String key) {
        HttpSession session = request.getSession();
        if (session == null) {
            return null;
        }
        return session.getAttribute(key);
    }

    private void removeAllSessionObjects(){
        HttpSession session = request.getSession();
        if (session == null) {
            return;
        }
        Enumeration<String>  keys = session.getAttributeNames();
        while (keys.hasMoreElements()){
            String key=keys.nextElement();
            session.removeAttribute(key);
        }
    }

    public <T> T getSessionObject(String key, Class<T> cls) {
        HttpSession session = request.getSession();
        if (session == null) {
            return null;
        }
        try {
            return cls.cast(request.getSession().getAttribute(key));
        }
        catch (NullPointerException | ClassCastException e){
            return null;
        }
    }

    public void setLoggedIn(boolean loggedIn) {
        setSessionObject("login", loggedIn ? Boolean.TRUE : Boolean.FALSE);
    }

    public void setSessionLocale(Locale locale) {
        if (Locales.instance.contains(locale)) {
            setSessionObject(RequestKeys.KEY_LOCALE, locale);
        }
    }

    public Locale getSessionLocale() {
        return getSessionObject(RequestKeys.KEY_LOCALE,Locale.class);
    }

    public void setSessionHost(String host) {
        setSessionObject(RequestKeys.KEY_HOST, host);
    }

    public String getSessionHost() {
        return getSessionObject(RequestKeys.KEY_HOST,String.class);
    }

    public void resetSession() {
        removeAllSessionObjects();
        request.getSession(true);
    }
}








