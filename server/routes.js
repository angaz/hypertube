"use strict";

const express = require('express');
const mime = require('mime');
const router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  res.render('index', { title: 'Express' });
});

router.get('/watch/:hash?', (req, res) => {
    let hash = (req.body.hash !== undefined) ? req.body.hash : 'E7F6991C3DC80E62C986521EABCF03AF2420FC9A';

    require('./my_torrent_stream')
        .newStream(hash)
        .then((data) => {
            if (data.name.match(/.*\.mp4$/i)) {
                let range = [];
                res.set('Content-Type', 'video/mp4');
                if (req.headers.range !== undefined) {
                    range = req.headers.range.replace(/bytes=/, '').split('-');
                    range[0] = parseInt(range[0]);
                    if (range[1] === '') {
                        range[1] = data.length;
                    }
                    console.log(range);
                    res.status(206);
                    res.set('Content-Length', range[1] - range[0]);
                    res.set('Accept-Ranges', 'bytes');
                    res.set('Content-Range', `bytes ${range[0]}-${range[1]}/${data.length}`);
                } else {
                    //res.status(206);
                    //res.set('Content-Length', data.length);
                    //res.set('Accept-Ranges', 'bytes');
                    //res.set('Content-Range', `bytes 0-${data.length}/${data.length}`);
                    range[0] = 0;
                    range[1] = data.length;
                }
                data.createReadStream().pipe(res);
            } else {
                res.json('Only mp4 videos allowed');
            }
        })
        .catch((error) => {
            console.log(error);
            res.json(error);
        });
});

module.exports = router;
