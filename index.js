const express = require('express');
const axios = require('axios');
const cors = require('cors');
const Redis = require('redis');

const PORT = 3211;
const placeholdingUri = 'https://jsonplaceholder.typicode.com/photos';
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
        const albumID = req.query.albumID;
        const dataAlreadyStoredInRedis = await redisCli.get('photos');
        if (dataAlreadyStoredInRedis) {
            return res.json(JSON.parse(dataAlreadyStoredInRedis))
        }
        const { data: dataToStoreInRedis } = await axios.get(placeholdingUri, {params: {albumID}});
        redisCli.setEx('photos', EXPIRATION_TIME, JSON.stringify(dataToStoreInRedis));
        res.json(dataToStoreInRedis);
    }
    );

app.get(
    '/photos/:id',
    async(req, res) => {
        const singleItemUri = placeholdingUri + '/' + req.params.id;
        const { data } = await axios.get(singleItemUri);
        
        res.json(data);
    }
);

app.listen(PORT);