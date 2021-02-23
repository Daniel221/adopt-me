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
/* GET users listing. */
router.get('/', async function(req, res, next) {
  const users = await pool.query('select * from users');
  res.status(200).send(users.rows[0]);
});

router.post('/', async (req, res) =>{
  const {name, age} = req.body;
  const user = await pool.query('insert into users(name, age) values ($1, $2) returning *', [name, age]);
  res.status(200).send(users.rows[0]);
});

router.put('/:id', async (req, res) =>{
  const {id} = req.params;
  const {name, age} = req.body;
  const aux = await pool.query('select * from users where userid = $1', [id]);
  if(aux){
    const user = await pool.query('update users set name = $1, age = $2 where userid = $3 returning *', [name || aux.name, age || aux.age, id]);
    res.status(200).send(user);
  }else{
    res.status(200).send("user not found");
  }
});

router.delete('/:id', async (req, res) =>{
  const {id} = req.params;
  const user = pool.query('delete from users where userid = $1 returning *', [id]);
  await pool.query('update pets set owner = null, userid = null where userid = $1', [id]);
  res.status(200).send(user);
});
module.exports = router;
