const express = require('express');
const axios = require('axios');
const cors = require('cors');
const Redis = require('redis');

const PORT = 3210;
const placeholdingUri = 'https://jsonplaceholder.typicode.com/photos';
const EXPIRATION_TIME = 3600;

const redisCli = Redis.createClient();
redisCli.connect()
const app = express();
const crossOrigin = cors();
app.use(crossOrigin);


app.get(
    '/photos',
    async(req, res) => {
        const albumID = req.query.albumID;
        const { data } = await axios.get(placeholdingUri, {params: {albumID}});  
        dataToStoreInRedis = JSON.stringify(data);
        redisCli.setEx('photos', EXPIRATION_TIME, dataToStoreInRedis);
        res.json(data);
        }
);

app.get(
    '/photos/:id',
    async(req, res) => {
        const singleItemUri = placeholdingUri + '/' + req.params.id;
        const { data } = await axios.get(singleItemUri);  // 200 OK 445 ms 448 B
        
        res.json(data);
    }
);

app.listen(PORT);