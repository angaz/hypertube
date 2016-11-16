"use strict";
const request = require('request');

function getPage(pageNum) {
    request(`https://yts.ag/api/v2/list_movies.json?page=${pageNum}`, (error, response, body) => {
        if (!error && response.statusCode == 200) {
            console.log(require('util').inspect(JSON.parse(body), {depth: null}));
        }
    });
}

module.exports = {
    getPage: getPage
};