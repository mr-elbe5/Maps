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

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;

public class TileProvider {

    public static TileProvider instance = new TileProvider();

    int timeoutSeconds = 60;
    HttpClient client;

    private TileLoader tileLoader = null;

    public TileProvider() {
        client = HttpClient.newBuilder()
                .version(HttpClient.Version.HTTP_1_1)
                .followRedirects(HttpClient.Redirect.NORMAL)
                .connectTimeout(Duration.ofSeconds(timeoutSeconds))
                .build();
    }

    public TileLoader getTileLoader() {
        return tileLoader;
    }

    public boolean isLoading(){
        return tileLoader != null;
    }

    public boolean loadTileFile(Tile tile) {
        tile.assertLocalPath();
        boolean success = tile.readLocalFile();
        if (success) {
            return true;
        }
        success = getRemoteFile(tile);
        if (success) {
            if (!tile.saveLocalFile()){
                Log.warn("could not save local file");
            }
        }
        return success;
    }

    boolean getRemoteFile(Tile tile) {
        byte[] bytes;
        tile.assertRemoteUrl();
        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(tile.remoteUrl))
                    .timeout(Duration.ofSeconds(Configuration.getRemoteTimeoutSecs()))
                    .setHeader("User-Agent", "Mozilla/5.0 Firefox/92.0")
                    .build();
            HttpResponse<byte[]> response = client.send(request, HttpResponse.BodyHandlers.ofByteArray());
            tile.loadResult = response.statusCode();
            if (tile.loadResult != 200){
                Log.error("remote server returned status " + tile.loadResult);
                return false;
            }
            bytes = response.body();
            tile.bytes = bytes.length > 0 ? bytes : null;
        }
        catch (Exception e){
            Log.error("could not receive remote file", e);
            return false;
        }
        return tile.bytes != null;
    }

    public void startLoadingQueuedTiles(TileType type, int zoom, int minX, int maxX, int minY, int maxY){
        tileLoader = new TileLoader();
        tileLoader.tileType = type;
        tileLoader.zoom = zoom;
        tileLoader.all = (maxX - minX + 1)*(maxY - minY + 1);
        Log.info("loading tiles: " + tileLoader.all);
        for (int y = minY; y <= maxY; y++) {
            for (int x = minX; x <= maxX; x++) {
                Tile tile = new Tile(type, zoom, x, y);
                tileLoader.addTile(tile);
            }
        }
        tileLoader.start();
    }

    public void stopTileLoader(){
        if (tileLoader != null) {
            tileLoader.queue.clear();
            tileLoader = null;
        }
    }

}
