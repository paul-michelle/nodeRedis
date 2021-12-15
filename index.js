const express = require('express');
const axios = require('axios');
const cors = require('cors');

const PORT = 3210
const placeholdingUri = 'https://jsonplaceholder.typicode.com/photos'

const app = express();
const crossOrigin = cors();
app.use(crossOrigin);

app.get(
    '/photos',
    async(req, res) => {
        const albumID = req.query.albumID;
        const { data } = await axios.get(
            placeholdingUri,                // 200 OK 1052 ms 870.84 KB
            {params: {albumID}}
            );  
        res.json(data);
    }
)

app.get(
    '/photos/:id',
    async(req, res) => {
        const singleItemUri = placeholdingUri + '/' + req.params.id;
        console.log(singleItemUri)
        const { data } = await axios.get(singleItemUri);  // 200 OK 445 ms 448 B
        
        res.json(data);
    }
)

app.listen(PORT)