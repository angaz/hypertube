/**
 * Created by angus on 2016/11/16.
 */
"use strict";

const torrentStream = require('torrent-stream');

function newStream (hash) {
    return new Promise((resolve, reject) => {
        let engine = torrentStream(`magnet:?xt=urn:btih:${hash}`);

        engine.on('ready', () => {
            let stream = null;
            let maxSize = 0;

            engine.files.forEach((file) => {
                if (file.length > maxSize) {
                    stream = file;
                    maxSize = file.length;
                }
            });

            if (stream !== null && maxSize !== 0) {
                resolve(stream);
            } else {
                reject('An error occurred starting a stream');
            }
        });
    });
}

module.exports = {
    newStream: newStream
};