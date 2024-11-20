'use strict';

const { rateLimit } = require('express-rate-limit');
const { RedisStore } = require('rate-limit-redis');
const RedisClient = require('ioredis');

function getLimiter() {
    const client = new RedisClient();

    const limiter = rateLimit({
        windowMs: 15 * 60 * 1000, //15 min
        limit: 30,
        standardHeaders: true,
        store: new RedisStore({
            sendCommand: (...args) => client.call(...args), 
        })
    });
    return limiter;
}

module.exports = getLimiter;