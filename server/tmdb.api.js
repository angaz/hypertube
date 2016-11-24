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
                reject({
                    message: 'An error occurred',
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
                reject({
                    message: 'An error occurred',
                    error: error,
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
                getDetails(found.movie_results[0].id)
                    .then(movie => resolve(movie))
                    .catch(getDetailsError => reject(getDetailsError));
                }))
            .catch(findError => reject(findError));
    });
}

module.exports = {
    getDetails: getDetails,
    find: find,
    findByImdb: findByImdb
};