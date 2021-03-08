var express = require('express');
var router = express.Router();

const {
    Pool
} = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'mysecretpassword',
    port: 5432,
});

router.get('/', async function (req, res) { 
    const aux = await pool.query('SELECT * from pets where id < 40020');
    const animals = aux.rows;
    const loginInfo = req.logMethod;
    console.log(loginInfo);
    res.render('home', {
        animals,
        loginInfo
    });
});

module.exports = router;