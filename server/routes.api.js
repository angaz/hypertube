/**
 * Created by angus on 2016/11/20.
 */
"use strict";

const express = require('express');
const yts = require('./yts.api');
const router = express.Router();
const request = require('request');

router.get('/captions/:id?', (req, res) => {
    if (req.params.id === undefined) {
        return res.status(404).json('missing id');
    }
    yts.getDetails(req.params.id)
        .then(result => res.json(result))
        .catch(error => res.status(500).json(error));
});

module.exports = router;