const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
// const handlebars = require('express-handlebars');
const { engine } = require('express-handlebars');

const morgan = require('morgan');
const { Pool } = require('pg');
// const pg = require('pg');

require('dotenv').config();

let pool = new Pool();
// let pool2 = new pg.Pool();
const port = process.env.PORT;

const app = express();

//
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }))
app.use(express.json());

//template engine
app.engine("handlebars", engine());
app.set('view engine', 'handlebars');


//Routes and templates
app.get('/', function (req, res) {
    //res.send('Página Inicial')
    res.render('index');
})

app.get('/info/get', (req, res) => {
    try {
        pool.connect(async (error, client, release) => {
            // console.log("CLIENTE", client, error);
            let resp = await client.query('SELECT * FROM teste');
            release();
            res.send(resp.rows);
            // console.log(resp);
        });
    } catch (error) {
        console.log('Ocorreu um erro: ', error);
    }
});

app.post('/info/add', (req, res) => {
    // res.send(req.body);
    try {
        pool.connect(async (error, client, release) => {
            // console.log("CLIENTE", error);
            let resp = await client.query(`INSERT INTO teste (nome) VALUES('${req.body.add}')`);
            // res.send(resp.rows);
            res.redirect('/info/get');
        });
    } catch (error) {
        console.log('Ocorreu um erro: ', error);
    }
});

app.post('/info/update', (req, res) => {
    // res.send(req.body);
    try {
        pool.connect(async (error, client, release) => {
            // console.log("CLIENTE", error);
            let resp = await client.query(`UPDATE teste SET nome = '${req.body.newValue}' WHERE nome = '${req.body.oldValue}'`);
            // res.send(resp.rows);
            res.redirect('/info/get');
        });
    } catch (error) {
        console.log('Ocorreu um erro: ', error);
    }
});

app.post('/info/delete', (req, res) => {
    // res.send(req.body);
    try {
        pool.connect(async (error, client, release) => {
            // console.log("CLIENTE", error);
            let resp = await client.query(`DELETE FROM teste WHERE nome = '${req.body.delete}'`);
            // res.send(resp.rows);
            res.redirect('/info/get');
        });
    } catch (error) {
        console.log('Ocorreu um erro: ', error);
    }
});





//Start Server

app.listen(port, function (req, res) {
    try {
        console.log('servidor rodando no endereço http://localhost:' + port);
    } catch (error) {
        console.error("Ocorreu o seguinte erro: ", error);
    }

});