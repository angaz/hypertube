/**
 * Created by angus on 2016/11/16.
 */
"use strict";

const torrentStream = require('torrent-stream');
const mime = require('mime');

mime.define({
    'video/webm': ['mkv']
});

function newStream (hash) {
    return new Promise((resolve, reject) => {
        let engine = new torrentStream(`magnet:?xt=urn:btih:${hash}`);
        let stream = null;
        let streamName = '';
        let totalPieces = 0;

        let destroy = () => {
            return new Promise((callback) => {
                engine.destroy(() => {
                    callback();
                });
            });
        };

        engine.on('ready', () => {
            let maxSize = 0;

            engine.files.forEach((file) => {
                if (file.length > maxSize) {
                    stream = file;
                    maxSize = file.length;
                }
            });

            if (stream !== null && maxSize !== 0) {
                console.log(`Streaming: ${stream.name}`);
                totalPieces = engine.torrent.pieces.length;
                streamName = stream.name;
                resolve({
                    stream: stream,
                    destroy: destroy
                });
            } else {
                reject('An error occurred starting a stream');
            }
        });

        engine.on('download', (index) => {
            console.log(`Downloaded ${index} of ${totalPieces} from ${stream.name} ${parseFloat((index/totalPieces*100).toFixed(4))}%`);
        });

        /*engine.on('idle', () => {
            console.log(`${stream.name} has finished downloading`);
        });*/

        /*engine.on('upload', (pieceIndex, offset, length) => {
            console.log(`${stream.name} uploaded ${pieceIndex} offset ${offset} length ${length}`);
        });*/
    });
}

function watch(req, res) {
    let hash = (req.params.hash !== undefined) ? req.params.hash : 'E7F6991C3DC80E62C986521EABCF03AF2420FC9A';

    newStream(hash)
        .then((data) => {
            let stream = data.stream;

            req.on('close', () => {
                data.destroy().then(() => {
                    console.log('Destroyed due to unexpected disconnect');
                });
            });
            req.on('end', () => {
                data.destroy().then(() => {
                    console.log('Destroyed due to normal disconnect');
                });
            });

            if (stream.name.match(/.*\.(mp4|mkv)$/i)) {
                let range = [];
                if (req.headers.range !== undefined) {
                    range = req.headers.range.replace(/bytes=/, '').split('-');
                    range[0] = parseInt(range[0]);
                    if (range[1] === '') {
                        range[1] = stream.length;
                    }
                    res.status(206);
                } else {
                    range[0] = 0;
                    range[1] = stream.length;
                }
                console.log(`${range[0]}-${range[1]}`);
                res.set('Content-Type', mime.lookup(stream.name));
                res.set('Accept-Ranges', 'bytes');
                res.set('Content-Length', range[1] - range[0]);
                res.set('Content-Range', `bytes ${range[0]}-${range[1] - 1}/${stream.length}`);

                stream.createReadStream({start: range[0], end: range[1]}).pipe(res);
            } else {
                res.json('Only mp4 videos allowed');
            }
        })
        .catch((error) => {
            console.log(error);
            res.json(error);
        });
}

module.exports = {
    watch: watch
};