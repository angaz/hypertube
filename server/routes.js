"use strict";

const express = require('express');
const torrent = require('./my_torrent_stream');
const router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
    res.render('index', { title: 'Express' });
});

router.get('/watch/:hash?', (req, res) => {
    torrent.watch(req, res, req.params.hash);
});

module.exports = router;
