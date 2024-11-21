'use strict';

const RedisClient = require('ioredis');
const uuid = require('uuid');

const client = new RedisClient();

async function createRefreshToken(user) {
  try {
    const key = uuid.v4();
    const token = await client.hset(
      key,
      {
        'user': user,
        'expiry': Math.floor(Date.now() / 1000) + (60 * 60) // 1 hour
      }
    );
    return key;
  } catch(err) {
    console.error(err);
  }
}

async function getToken(uuid) {
  try {
    return await client.hgetall(uuid);
  } catch(err) {
    console.error(err);
  }
}

module.exports = {createRefreshToken, getToken};