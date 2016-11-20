"use strict";
const request = require('request');
const yifysubs = require('yifysubs');
const unzip = require('unzip');
const srt2vtt = require('srt2vtt');
const fs = require('fs');
const iso639 = require('iso-639-1');

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

function getDetails(id) {
    return new Promise((resolve, reject) => {
        request(`https://yts.ag/api/v2/movie_details.json?movie_id=${id}`, (error, response, body) => {
            if (!error && response.statusCode == 200 && body !== '') {
                body = JSON.parse(body).data.movie;
                if (body.id !== 0) {
                    getAllSubs(body)
                        .then(subs => resolve(subs))
                        .catch(error => reject(error));
                } else {
                    reject({
                        message: 'An error occurred',
                        error: 'ID not in DB'
                    });
                }
            } else {
                if (!error) {
                    reject({
                        message: 'An error occurred',
                        error: 'malformed ID'
                    });
                } else {
                    reject({
                        message: 'An error occurred',
                        error: error
                    });
                }

            }
        });
    });
}

function getAllSubs(movie) {
    return new Promise((resolve, reject) => {
        let allSubs = [];
        yifysubs.searchSubtitles('All', movie.imdb_code, subs => {
            subs = subs[movie.imdb_code];
            for (let sub in subs) {
                if (subs.hasOwnProperty(sub)) {
                    allSubs.push(downloadSub(subs[sub].url, movie.title_long, subs[sub].language));
                }
            }
            Promise.all(allSubs)
                .then(values => resolve(values))
                .catch(err => reject(err));
        });
    });
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function downloadSub(subURL, name, language) {
    let found = false;
    return new Promise((resolve, reject) => {
        request(subURL)
            .pipe(unzip.Parse())
            // Called for every file in the zip
            .on('entry', entry => {
                if (entry.path.match(/.*\.srt$/)) {
                    let buff = [];
                    let langCode = iso639.getCode(capitalizeFirstLetter(language));
                    let filename = `public/subtitles/${name}_${langCode}.vtt`;
                    entry.on('data', data => buff.push(data));
                    entry.on('end', () => {
                        srt2vtt(Buffer.concat(buff), (err, vtt) => {
                            if (err) {
                                return resolve(err);
                            } else {
                                fs.writeFileSync(filename, vtt);
                            }
                        });
                        found = true;
                        let res = {
                            language: {
                                code: langCode,
                                name: iso639.getName(langCode),
                                nativeName: iso639.getNativeName(langCode)
                            },
                            file: filename
                        };
                        resolve(res);
                    });
                } else {
                    entry.autodrain();
                }
            })
            .on('close', () => {
                if (!found) {
                    reject('No srt file');
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
    downloadSub: downloadSub,
    getDetails: getDetails
};