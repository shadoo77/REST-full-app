'use strict';

const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const dom = new JSDOM(`<!DOCTYPE html><p>Hello world</p>`);
console.log(dom.window.document.querySelector("p").textContent);

const mysql = require('mysql');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(express.static('./src'));

const server = {
    host: 'http://localhost',
    port: 8080
};

const data = app.get('/test', (req, res) => {
    const connect = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'jjj',
        database: 'shadi'
    });
    connect.query('SELECT * FROM items', (error, rows, fields) => {
        if(error) {
            console.log(`connect to shadi's database is faild`, error);
            return
        }
        return res.send(rows);
    });
});

const port = process.env.PORT || server.port;
app.listen(port, () => {
    console.log(`Listening on ${server.host}:${port} ..`);
});

module.exports = {data};