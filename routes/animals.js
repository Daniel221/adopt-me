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
  const animal = aux.rows[0];
  res.render('animal',{animal});
});

router.get('/animals/adoption:id', async(req, res) =>{
  const {id} = req.params;
  const aux = await pool.query('select * from pets where id = $1', [id]);
  const animal = aux.rows[0];
  res.render('adoption', {animal});
})

router.post('/animals', async (req, res) =>{
  const {name, breed, specie, age, colour} = req.body;
  try{
    const idaux = await pool.query('select count(*) from pets');
    const id = 40001 + parseInt(idaux.rows[0].count);
    const query = await pool.query('INSERT INTO pets(id, name, breed, specie, age, colour, owner) values($1, $2, $3, $4, $5, $6, "") returning *', [id, name, breed, specie, age, colour]);
    res.status(200).send(query.rows[0]);
  }catch(error){
    res.status(400).send(error)
  }
});

router.put('/animals:id', async (req, res) =>{
  const {id} = req.params;
  const {name, breed, specie, age, colour} = req.body;
  const animal = await pool.query('select * from pets where id = $1', [id]);

  if(animal){
    const pet = animal.rows[0];
    console.log([name || pet.name, breed || pet.breed, specie || pet.specie, age || pet.age, colour || pet.colour, id]);
    const aux = await pool.query('update pets set name = $1, breed = $2, specie = $3, age = $4, colour = $5 where id = $6 returning *', [name || pet.name, breed || pet.breed, specie || pet.specie, age || pet.age, colour || pet.colour, id]);
    res.status(200).send(aux.rows[0]);
  }else{
    res.status(400).send("animal not found");
  }
});

router.delete('/animals:id', async(req, res) =>{
  const {id} = req.params;
  const pet = await pool.query('delete from pets where id = $1 returning *', [id]);
  res.status(200).send(pet.rows[0]);
})

module.exports = router;
