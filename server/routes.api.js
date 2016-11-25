/**
 * Created by angus on 2016/11/20.
 */
"use strict";

const express = require('express');
const yts = require('./yts.api');
const torrent = require('./my_torrent_stream');
const movieAPI = require('./movie.api');
const tmdb = require('./tmdb.api');
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
/*    yts.getPage((req.params.page === undefined) ? 1 : parseInt(req.params.page))
        .then(movies => res.json(movies))
        .catch(error => res.status(500).json(error));*/
    movieAPI.getPage((req.params.page === undefined) ? 1 : parseInt(req.params.page))
        .then(bagOMovies => res.json(bagOMovies))
        .catch(error => res.status(500).json(error));
});

router.get('/watch/:hash?', (req, res) => {
    torrent.watch(req, res, req.params.hash);
});

router.get('/update', (req, res) => {
    movieAPI.update()
        .then(update => res.json(update))
        .catch(error => res.json(error));
});

router.get('/get_details/:id', (req, res) => {
    tmdb.getDetails(req.params.id)
        .then(details => res.json(details))
        .catch(error => res.status(500).json(error));
});

router.get('/find/:imdb', (req, res) => {
    tmdb.find(req.params.imdb)
        .then(found => res.json(found))
        .catch(error => res.status(500).json(error));
});

module.exports = router;