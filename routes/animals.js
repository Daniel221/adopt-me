var express = require('express');
var router = express.Router();
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'mysecretpassword',
  port: 5432,
})
/* GET home page. */
router.get('/', async function(req, res) {
  const aux = await pool.query('SELECT * from pets where id < 40010');
  const animals = aux.rows;
  res.render('index', {animals});
});

router.get('/animals', async function(req, res) {
  const aux = await pool.query('SELECT * from pets');
  const animals = aux.rows;
  res.status(200).send(animals);
});

router.get('/animals:id', async function(req, res) {
  const {id} = req.params;
  const aux = await pool.query(`SELECT * from pets where id = $1`, [id]);
  const animal = aux.rows;
  console.log(animal.name);
  res.render('animal',{animal});
});


router.post('/', (req, res) =>{

});

router.put('/:id', (req, res) =>{

});

router.delete('/:id', (req, res) =>{

})

module.exports = router;
