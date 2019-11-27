'use strict';

require('dotenv').config()
const express = require('express');
let fs = require('fs')

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';
const STORAGE = process.env.STORAGE;

// App
const app = express();
app.get('/:file', (req, res) => {
    const file = req.params.file;
    let content = fs.readFileSync(`${STORAGE}/${file}`).toString();
    res.send(content);
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);