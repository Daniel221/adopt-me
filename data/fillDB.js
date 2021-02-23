const data = require('./data.json');
const {
    Pool
} = require('pg');
const format = require('pg-format');
const axios = require('axios');
const { resolveInclude } = require('ejs');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'mysecretpassword',
    port: 5432,
})
let pets = [];

const petsTableQuery = 'CREATE TABLE pets (id INT PRIMARY KEY, name varchar(30), breed varchar(50), specie varchar(50), age varchar(50), colour varchar(50), img text, owner varchar(50), userid integer, constraint fk_userid FOREIGN KEY(userid) references users(userid))';
const userTableQuery = 'CREATE TABLE users (userid smallserial primary key , name varchar(50), age smallint);';


async function run (){
    // note: we don't try/catch this because if connecting throws an exception
    // we don't need to dispose of the client (it will be undefined)
    for (let i = 0; i < 100; i++) {
        let id = 40000 + i;
        let aux = data[i]; 
        const img = await axios.get('https://api.thecatapi.com/v1/images/search');
        const {data: cat} = img;
        let pet = [id, aux.animalname, aux.breedname, aux.speciesname, aux.animalage, aux.basecolour, cat[0].url ,""];
        pets.push(pet);
    }
    const client = await pool.connect()
    try {
        await client.query('BEGIN')
        const drop = await client.query('drop table if exists pets');
        const drop2 = await client.query('drop table if exists users');
        const res = await client.query(userTableQuery);
        const res2 = await client.query(petsTableQuery);

        const insertPetsQuery = format('INSERT INTO pets (id, name, breed, specie, age, colour, img, owner) values %L', pets)
        const insert = await client.query(insertPetsQuery);
        
        await client.query('COMMIT')
    } catch (e) {
        await client.query('ROLLBACK')
        throw e
    } finally {
        client.release()
    }
}

run();
