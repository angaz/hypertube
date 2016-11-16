"use strict";

const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  res.render('index', { title: 'Express' });
});

router.get('/watch', (res, req) => {
    require('./my_torrent_stream')
        .newStream('6141514CC6D6F02F17FE480E53C37A04BC594FAB')
        .then((data) => {
            //data.pipe(res);
            //res.set('Content-Type', data.contentType);
            data.pipe(res);
        })
        .catch((error) => {
            console.log(error);
            res.json(error);
        });
});

module.exports = router;
