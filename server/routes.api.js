/**
 * Created by angus on 2016/11/20.
 */
"use strict";

const express = require('express');
const yts = require('./yts.api');
const torrent = require('./my_torrent_stream');
const movieApi = require('./movie.api');
const router = express.Router();
const request = require('request');

router.get('/captions/:id?', (req, res) => {
    if (req.params.id === undefined) {
        return res.status(404).json('missing id');
    }
    yts.getDetails(req.params.id)
        .then(captions => res.json(captions))
        .catch(error => res.status(500).json(error));
});

router.get('/movies/:page?', (req, res) => {
    yts.getPage((req.params.page === undefined) ? 1 : parseInt(req.params.page))
        .then(movies => res.json(movies))
        .catch(error => res.status(500).json(error));
});

router.get('/watch/:hash?', (req, res) => {
    torrent.watch(req, res, req.params.hash);
});

router.get('/update', (req, res) => {
    movieApi.update()
        .then(update => res.json(update))
        .catch(error => res.status(500).json(error));
});

module.exports = router;