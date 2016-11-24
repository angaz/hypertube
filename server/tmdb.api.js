/**
 * Created by adippena on 11/23/16.
 */
"use strict";
const request = require('request');

function getDetails(id) {
    return new Promise((resolve, reject) => {
        request(`https://api.themoviedb.org/3/movie/${id}?api_key=b5be569ee49cf0a7e3cf39991b982033`, (error, response, body) => {
            if (!error && response.statusCode == 200) {
                resolve(JSON.parse(body));
            } else {
                if (response.statusCode === 429) {
                    console.log('429');
                }
                reject({
                    message: 'TMDB getDetails error',
                    error: error,
                    code: response.statusCode
                });
            }
        });
    });
}

function find(imdb) {
    return new Promise((resolve, reject) => {
        request(`https://api.themoviedb.org/3/find/${imdb}?api_key=b5be569ee49cf0a7e3cf39991b982033&external_source=imdb_id`, (error, response, body) => {
            if (!error && response.statusCode == 200) {
                resolve(JSON.parse(body));
            } else {
                if (response.statusCode === 429) {
                    console.log('429');
                }
                reject({
                    message: 'TMDB find error',
                    error: error,
                    response: response,
                    body: body,
                    code: response.statusCode
                });
            }
        });
    });
}

function findByImdb(imdb) {
    return new Promise((resolve, reject) => {
        find(imdb)
            .then((found => {
                if (found.movie_results.length > 0) {
                    getDetails(found.movie_results[0].id)
                        .then(movie => resolve(movie))
                        .catch(getDetailsError => reject({
                            message: 'getDetails error',
                            error: getDetailsError,
                            imdb: imdb
                        }));
                } else {
                    resolve(undefined);
                }
            }))
            .catch(err => reject({
                message: 'find error',
                error: err,
                imdb: imdb
            }));
    });
}

module.exports = {
    getDetails: getDetails,
    find: find,
    findByImdb: findByImdb
};