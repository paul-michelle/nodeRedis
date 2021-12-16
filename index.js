const express = require('express');
const axios = require('axios');
const cors = require('cors');
const Redis = require('redis');

const PORT = 3211;
const BASE_URI = 'https://jsonplaceholder.typicode.com/photos';
const EXPIRATION_TIME = 3600;

const redisCli = Redis.createClient();
redisCli.connect();
redisCli.on('error', (err) => {'Redis Client Error', err});

const app = express();
const crossOrigin = cors();
app.use(crossOrigin);
app.use(express.urlencoded({ extended: true}));

app.get(
    '/photos',
    async (req, res) => {
        let multimpleItemsUri = BASE_URI;
        const albumId = req.query.albumId;
        if (albumId) {
            multimpleItemsUri += `?albumId=${albumId}`
        }
        const data = await getOrSetCache(multimpleItemsUri);
        res.json(data);
    }
    );

app.get(
    '/photos/:id',
    async(req, res) => {
        const singleItemUri = BASE_URI + '/' + req.params.id;
        const data = await getOrSetCache(singleItemUri);
        res.json(data);
    }
);

async function getOrSetCache(key) {
    const dataAlreadyStoredInRedis = await redisCli.get(key);       // 20 ms 870.84 KB; 4 ms 452 B => extremely faster
    if (dataAlreadyStoredInRedis) {
        return JSON.parse(dataAlreadyStoredInRedis);
    }
    const { data: dataToStoreInRedis } = await axios.get(key);      // 857 ms 870.84 KB; 234 ms 452 B
    redisCli.setEx(
        key, EXPIRATION_TIME, JSON.stringify(dataToStoreInRedis)
        );
    return dataToStoreInRedis;
}


app.listen(PORT);