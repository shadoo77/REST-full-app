"use strict";
    

    const path = require('path');
    const mysql = require('mysql');
    const express = require('express');
    const bodyParser = require('body-parser');
    const app = express();

    //To parse URL encoded data
    app.use(bodyParser.urlencoded({ extended: false }));
    //To parse json data
    app.use(bodyParser.json());

    //app.use(express.static('./'));
    app.use(express.static(path.join(__dirname, '/')));

    const server = {
        host: 'http://localhost',
        port: 8080
    };

    function connectDatabase() {
        const connection = mysql.createConnection({
            host: 'localhost',
            user: 'shadi',
            password: '',
            database: 'shadi',
            port: 3307
        });
        return connection;
    }

    const connect = connectDatabase();

   app.get('/home', (req, res) => {
        connect.query('SELECT * FROM items', (error, rows, fields) => {
            if(error) {
                console.log(`connect to shadi's database is failed `, error);
                return
            }
            res.send(rows);
        });
    });

    app.post('/save_data', (req, res) => {
        console.log(req.body.task);
        const data = {
            id: req.body.id,
            task: req.body.task,
            done: req.body.done
        };
        //res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
        res.writeHead(301, {Location: '/'});
        connect.query('INSERT INTO items VALUES(NULL, ?, ?)', [data.task, false], (error, rows, fields) => {
            if(error) {
                console.log(`Error by adding new item to your database `, error);
                return
            }
        });
        console.log("data saved! : ", data);
        res.send();
    });


    app.delete('/delete_data', (req, res) => {
        res.writeHead(301, {Location: '/'});
        connect.query('DELETE FROM items WHERE id = ?', [req.body.index], (error, rows, fields) => {
            if(error) {
                console.log(`Error by deleting item from your database `, error);
                return
            }
        });
        console.log("data deleted! : ");
        res.send();
    });


    
    const port = process.env.PORT || server.port;
    app.listen(port, () => {
        console.log(`Listening on ${server.host}:${port} ..`);
    });