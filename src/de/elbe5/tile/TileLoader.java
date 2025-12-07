package de.elbe5.tile;

import de.elbe5.application.Configuration;
import de.elbe5.base.BaseThread;
import de.elbe5.base.Log;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.LinkedList;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class TileLoader extends BaseThread {

    public LinkedList<Tile> queue = new LinkedList<>();
    ExecutorService executor;
    HttpClient client;

    public TileType tileType = Configuration.getCurrentTileType();
    public int zoom = 0;
    public int all = 0;
    public int present = 0;
    public int loaded = 0;
    public int errors = 0;

    public TileLoader() {
        super("tileLoadThread");
        executor = Executors.newFixedThreadPool(10);
        client = HttpClient.newBuilder()
                .version(HttpClient.Version.HTTP_1_1)
                .followRedirects(HttpClient.Redirect.NORMAL)
                .connectTimeout(Duration.ofSeconds(Configuration.getRemoteTimeoutSecs()))
                .executor(executor)
                .build();
    }

    @Override
    public void run() {
        //Log.info("Loading tiles with " + present + " present, " + toLoad() + " to load");
        while (!queue.isEmpty()) {
            Tile tile = queue.poll();
            if (tile != null) {
                loadRemoteFile(tile);
            }
        }
        executor.shutdown();
    }

    public int toLoad(){
        return all - present - loaded - errors;
    }

    public boolean finished(){
        return all == present + loaded + errors;
    }

    public void addTile(Tile tile) {
        if (tile.fileExists()) {
            present++;
            return;
        }
        queue.add(tile);
    }

    void loadRemoteFile(Tile tile) {
        tile.assertRemoteUrl();
        //Log.info("loading tile " + tile.name());
        if (tile.loadAttempts > 0) {
            Log.info("retry no: " + tile.loadAttempts);
        }
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(tile.remoteUrl))
                .timeout(Duration.ofSeconds(Configuration.getRemoteTimeoutSecs()))
                .setHeader("User-Agent", "Mozilla/5.0 Firefox/92.0")
                .build();
        CompletableFuture<HttpResponse<byte[]>> cf = client.sendAsync(request, HttpResponse.BodyHandlers.ofByteArray())
                .thenApply((resp) -> {
                    tile.loadResult = resp.statusCode();
                    if (tile.loadResult != 200) {
                        Log.error("Error: " + resp.statusCode());
                    }
                    return resp;
                });
        byte[] bytes = cf.join().body();
        if (tile.loadResult != 200 || bytes == null || bytes.length == 0) {
            if (tile.loadAttempts < 3){
                tile.loadAttempts++;
                Log.info("add to queue again: " + tile.name());
                queue.add(tile);
            }
            else{
                Log.info("could not load in 3 attempts: " + tile.name());
                errors++;
            }
        }
        else {
            //Log.info("bytes: " + bytes.length);
            tile.bytes = bytes;
            tile.saveLocalFile();
            loaded++;
        }
    }

}
