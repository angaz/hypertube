"use strict";

const express = require('express');
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
            res.set('Content-Type', 'video/mp4');
            data.pipe(res);
        })
        .catch((error) => {
            console.log(error);
            res.json(error);
        });
});

module.exports = router;
