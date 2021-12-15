const express = require('express');
const axios = require('axios');
const cors = require('cors');

const PORT = 3210

const app = express();
const crossOrigin = cors();
app.use(crossOrigin);

app.get(
    '/echo',
    async(req, res) => {
        const baseUrl = req.protocol + '://' + req.headers.host + '/';
        const reqUrl = new URL(req.url, baseUrl);
        let reply = `Hello from axios. ${reqUrl}. ${req.body}`
        res.json(reply)
    }
)

app.listen(PORT)