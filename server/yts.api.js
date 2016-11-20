"use strict";
const request = require('request');
const yifysubs = require('yifysubs');
const unzip = require('unzip');
const srt2vtt = require('srt2vtt');

function getPage(pageNum) {
    return new Promise((resolve, reject) => {
        request(`https://yts.ag/api/v2/list_movies.json?page=${pageNum}`, (error, response, body) => {
            if (!error && response.statusCode == 200) {
                resolve(JSON.parse(body).data.movies);
            } else {
                reject({
                    message: 'An error occurred',
                    error: error
                });
            }
        });
    });
}

function getAllSubs(tt) {
    return new Promise((resolve) => {
        yifysubs.searchSubtitles('All', tt, function(result) {
            return resolve(result);
        });
    });
}

function downloadSub(subURL) {
    return new Promise((resolve, reject) => {
        let file = null;
        let maxSize = 0;
        request(subURL)
            .pipe(unzip.Parse())
            .on('entry', (entry) => {
                if (entry.path.match(/.*\.srt/) && entry.type === 'File' && entry.size > maxSize) {
                    file = entry;
                    maxSize = entry.size;
                } else {
                    entry.autodrain();
                }
            })
            .on('close', () => {
                console.log(file);
                if (file !== null) {
                    resolve();
                } else {
                    reject();
                }

            });
    });
}


/*function downloadSubs(subsURL) {
    if (typeof subs === 'object')
}*/

module.exports = {
    getPage: getPage,
    getAllSubs: getAllSubs,
    downloadSub: downloadSub
};