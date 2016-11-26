"use strict";

const request = require('request');
const cheerio = require('cheerio');

const base = "http://eztv.ag";

function strToBytes(str) {
    if (!str){
        return 0;
    }

    let scale = 0;
    switch(str.substr(-2)) {
        case 'KB' :
            scale = 1024;
            break;
        case 'MB' :
            scale = 1048576;
            break;
        case 'GB' :
            scale = 1073741824;
    }

    return parseFloat(str) * scale;
}

function getShows() {
    return new Promise((resolve, reject) => {
        request(`${base}/showlist/`, (error, response, body) => {
            if (!error && response.statusCode == 200) {
                let $ = cheerio.load(body);
                let series = [];

                $('.forum_header_border .thread_link').each((i, elem) => {
                    let href = $(elem).attr('href').replace('/shows/', '').split('/');
                    series.push({
                        id: href[0],
                        slug: href[1],
                        name: $(elem).text()
                    });
                });
                resolve(series);
            } else {
                reject({
                    message: 'EZTV getSeries error',
                    error: new Error(error),
                    code: response.statusCode
                });
            }
        });
    });
}

function getShowInfo(series) {
    return new Promise((resolve) => {
        request(`${base}/shows/${series.id}/${series.slug}/`, (error, response, body) => {
            if (!error && response.statusCode == 200) {
                let $ = cheerio.load(body);

                let imdb = $('.show_info_rating_score > div > a').attr('href').match(/tt[0-9]+/)[0];
                searchByShowId(series.id)
                    .then(show => resolve({
                        episodes: show,
                        imdb: imdb
                    }))
                    .catch(error => console.log(error));
            } else {
                console.log('reject');
                throw new Error({
                    message: 'eztv getEpisodes error',
                    error: error,
                    code: response.statusCode
                });
            }
        });
    });
}

function searchByShowId(id) {
    return new Promise((resolve) => {
        request(`${base}/search/?q1=&q2=${id}&search=Search`, (error, response, body) => {
            if (!error && response.statusCode == 200) {
                let $ = cheerio.load(body);
                let episodes = [];
                $('table tr.forum_header_border').each((i, elem) => {
                    let href = $(elem).find(".epinfo").attr('href');
                    episodes.push(getEpisodeInfo(href));
                });
                Promise.all(episodes).then(allEpisodes => {
                    let bagOEpisodes = {};
                    allEpisodes.forEach(episode => {
                        if (episode) {
                            let season = parseInt(episode[0][0]);
                            if (bagOEpisodes[season] === undefined) {
                                bagOEpisodes[season] = [{
                                    episode: parseInt(episode[0][1]),
                                    name: episode[1],
                                    hash: [episode[2]]
                                }];
                            } else {
                                let exists = false;
                                bagOEpisodes[season].forEach((seasonEpisode, index) => {
                                    if (seasonEpisode.episode === parseInt(episode[0][1])) {
                                        console.log(bagOEpisodes[season][index]);
                                        bagOEpisodes[season][index].hash.push(episode[2]);
                                        exists = true;
                                    }
                                });
                                if (!exists) {
                                    bagOEpisodes[season].push({
                                        episode: parseInt(episode[0][1]),
                                        name: episode[1],
                                        hash: [episode[2]]
                                    });
                                }
                            }

                        }
                    });
                    resolve(bagOEpisodes);
                });
            } else {
                console.log('reject');
                throw new Error({
                    error: error,
                    status: response.status
                });
            }
        });
    });

}

function getEpisodeInfo(href) {
    return new Promise((resolve) => {
        request(`${base}${href}`, (error, response, body) => {
            if (!error && response.statusCode == 200) {
                let $ = cheerio.load(body);
                let name = $('h2 > u').text().match(/([0-9]{1,}E[0-9]{1,}) - (.*)$/);
                if (name) {
                    let number = name[1].split('E');
                    name = name[2];
                    let magnet = $('.magnet');
                    if (magnet) {
                        let hash = magnet.attr('href');
                        if (hash) {
                            hash = hash.match(/[[2-7a-z]{20}|[0-9a-f]{20}/i);
                        } else {
                            console.log(`No hash ${number}`);
                        }
                        if (hash) {
                            return resolve([number, name, hash[0]]);
                        } else {
                            console.log(`No hash ${number}`);
                        }
                    } else {
                        console.log(`No hash ${number}`);
                    }
                } else {
                    console.log(`No number ${href}`);
                }
                resolve(null);
            } else {
                console.log('reject');
                throw new Error(`Error: ${response.status}`);
            }
        });
    });
}

module.exports = {
    getShows: getShows,
    getShowInfo: getShowInfo
};
