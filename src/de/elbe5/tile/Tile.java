/*
 Maps - A Java and Leaflet based map viewer and proxy
 Copyright (C) 2009-2025 Michael Roennau

 This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation; either version 3 of the License, or (at your option) any later version.
 This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 You should have received a copy of the GNU General Public License along with this program; if not, see <http://www.gnu.org/licenses/>.
 */
package de.elbe5.tile;

import de.elbe5.application.Configuration;
import de.elbe5.base.Log;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;

public class Tile {

    public TileType type;
    public int zoom;
    public int x;
    public int y;
    public String localPath = "";
    public String remoteUrl = "";

    public int loadResult = 0;
    public byte[] bytes;
    public int loadAttempts = 0;

    public Tile(TileType type, int zoom, int x, int y) {
        this.type = type;
        this.zoom = zoom;
        this.x = x;
        this.y = y;
    }

    public String name(){
        return type.name + "/"
                + Integer.toString(zoom) + "/"
                + Integer.toString(x) + "/"
                + Integer.toString(y);
    }

    public void setLocalPath(){
        localPath = Configuration.getTilePath() + "/"
                + type.name + "/"
                + Integer.toString(zoom) + "/"
                + Integer.toString(x) + "/"
                + Integer.toString(y)
                + ".png";
    }

    public void assertLocalPath(){
        if (localPath.isEmpty()) {
            setLocalPath();
        }
    }

    public void setRemoteUrl(){
        remoteUrl = type.getUrlPattern()
                .replace("{z}", Integer.toString(zoom))
                .replace("{x}", Integer.toString(x))
                .replace("{y}", Integer.toString(y));
    }

    public void assertRemoteUrl(){
        if (remoteUrl.isEmpty()) {
            setRemoteUrl();
        }
    }

    public boolean fileExists() {
        assertLocalPath();
        return new File(localPath).exists();
    }

    public boolean readLocalFile(){
        assertLocalPath();
        File file = new File(localPath);
        if (!file.exists() || file.length() == 0) {
            return false;
        }
        try {
            int len = (int)file.length();
            FileInputStream fin = new FileInputStream(file);
            byte[] bytes = new byte[len];
            if (fin.read(bytes, 0, len) != len){
                bytes = null;
            }
            fin.close();
            this.bytes = bytes;
            return bytes != null;
        } catch (IOException e) {
            return false;
        }
    }

    boolean saveLocalFile() {
        if (bytes == null) {
            Log.error("tile has no bytes to save");
            return false;
        }
        //Log.info("Saving tile to " + localPath);
        assertLocalPath();
        File file = new File(localPath);
        try {
            if (file.exists() && !file.delete()) {
                Log.error("could not delete old tile file " + localPath);
                return false;
            }
            if (!assertDirectory(file.getParentFile())) {
                Log.error("could not assert directories for tile at " + localPath);
                return false;
            }
            if (!file.createNewFile())
                throw new IOException("tile file create error");
            FileOutputStream fout = new FileOutputStream(file);
            fout.write(bytes);
            fout.flush();
            fout.close();
        }
        catch (IOException e){
            Log.error("could not save tile file", e);
            return false;
        }
        return true;
    }

    private boolean assertDirectory(File dir){
        if (dir.exists()){
            return true;
        }
        dir.mkdirs();
        return dir.exists();
    }

}
