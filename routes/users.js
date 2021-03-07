var express = require('express');
var router = express.Router();
const { Pool } = require('pg');
const Joi = require('joi');
const { number } = require('joi');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'mysecretpassword',
  port: 5432,
})

const schema = Joi.object({
  name: Joi.string().min(5).required(),
  age: Joi.number().greater(0).required()
});
/* GET users listing. */
router.get('/', async function(req, res, next) {
  const users = await pool.query('select * from users');
  res.status(200).send(users.rows);
});

router.post('/', async (req, res) =>{
  const {name, age} = req.body;

  const result = schema.validate({name, age});
  if(result.error) res.status(400).send(result.error.details[0].message);

  const user = await pool.query('insert into users( name, age) values ($1, $2) returning *', [name, age]);
  res.status(200).send(user.rows[0]);
});

router.put('/:id', async (req, res) =>{
  const {id} = req.params;
  const {name, age} = req.body;

  const result = schema.validate({name, age});
  if(result.error) return res.status(400).send(result.error.details[0].message);

  const aux = await pool.query('select * from users where userid = $1', [id]);
  if(aux){
    const user = await pool.query('update users set name = $1, age = $2 where userid = $3 returning *', [name || aux.rows[0].name, age || aux.rows[0].age, id]);
    res.status(200).send(user.rows);
  }else{
    res.status(200).send("user not found");
  }
});

router.delete('/:id', async (req, res) =>{
  const {id} = req.params;
  const user = await pool.query('delete from users where userid = $1 returning *', [id]);
  await pool.query('update pets set owner = null, userid = null where userid = $1', [id]);
  res.status(200).send(user.rows);
});

module.exports = router;
