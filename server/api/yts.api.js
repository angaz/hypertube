"use strict";
const request = require('request');
const yifysubs = require('yifysubs');
const unzip = require('unzip');
const srt2vtt = require('srt2vtt');
const fs = require('fs-extra');
const iso639 = require('iso-639-1').default;

function getPage(pageNum) {
    return new Promise((resolve, reject) => {
        request(`https://yts.ag/api/v2/list_movies.json?page=${pageNum}`, (error, response, body) => {
            if (!error && response.statusCode == 200) {
                resolve(JSON.parse(body).data.movies);
            } else {
                reject({
                    message: 'An error occurred',
                    error: error,
                    status: response.statusCode
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
                        error: error,
                        status: response.statusCode
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
                .then(values => {
                    let newValues = [];
                    values.forEach((item) => {
                        // removes zip file errors and duplicates of the same language
                        if (item !== null && newValues.find(value => value.file === item.file) === undefined) {
                            newValues.push(item);
                        }
                    });
                    resolve(newValues);
                })
                .catch(err => reject(err));
        });
    });
}

function downloadSub(subURL, name, language) {
    let found = false;
    let langCode = iso639.getCode(language.replace(/.*?\-/, ''));
    let filename = `captions/${name}_${langCode}.vtt`;
    return new Promise((resolve, reject) => {
        // First checks if subtitle file exists
        fs.access(`./public/${filename}`, fs.F_OK, err => {
            if (!err) {
                found = true;
                return resolve({
                    language: {
                        code: langCode,
                        name: iso639.getName(langCode),
                        nativeName: iso639.getNativeName(langCode)
                    },
                    file: filename
                });
            } // Don't need an else because of return
            else {
                reject(err);
            }
            fs.mkdirsSync(`${__dirname}/../public/captions`);
            request(subURL)
                .pipe(unzip.Parse())
                // Called for every file in the zip
                .on('entry', entry => {
                    if (entry.path.match(/.*\.srt$/)) {
                        let buff = [];
                        entry.on('data', data => buff.push(data));
                        entry.on('end', () => {
                            srt2vtt(Buffer.concat(buff), (err, vtt) => {
                                if (err) {
                                    return resolve(err);
                                } else {
                                    fs.writeFileSync(`./public/${filename}`, vtt);
                                }
                            });
                            found = true;
                            return resolve({
                                language: {
                                    code: langCode,
                                    name: iso639.getName(langCode),
                                    nativeName: iso639.getNativeName(langCode)
                                },
                                file: filename
                            });
                        });
                    } else {
                        entry.autodrain();
                    }
                })
                .on('close', () => {
                    console.log(`Captions: ${filename} had no srt files`);
                    return resolve(null);
                });
        });

    });
}

module.exports = {
    getPage: getPage,
    getAllSubs: getAllSubs,
    downloadSub: downloadSub,
    getDetails: getDetails
};