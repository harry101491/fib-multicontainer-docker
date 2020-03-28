import keys from './keys';

// Express dependencies 
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

// getting a Pool class to get a new connection to Postgres
import { Pool } from 'pg';

// redis setup
import redis from 'redis';

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// creating connection to the postgres
const pgClient = new Pool({
    user: keys.pgUser,
    host: keys.pgHost,
    database: keys.pgDatabase,
    password: keys.pgPassword,
    port: parseInt(keys.pgPort)
});

// checking when connection gets lost
pgClient.on('error', 
    () => console.log(`Connection to the postgres has been lost for this user: ${keys.pgUser}`)
);

// creating a values table that will store the numbers 
pgClient
    .query('CREATE TABLE IF NOT EXISTS values (number INT)')
    .catch((err) => console.log('Something wrong with creating table', err));

// creating redis client
const redisClient = redis.createClient({
    host: keys.redisHost,
    port: parseInt(keys.redisPort),
    retry_strategy: () => 1000
});

// if one connection is used to subscribe then one is used to set the values 
const redisPublisher = redisClient.duplicate();

// Express route handler
app.get('/', async (req, res) => {
    res.send('Hi');
});

app.get('/values/all', async (req, res) => {
    const values = await pgClient.query('SELECT * FROM values');

    res.send(values.rows);
});

app.get('/values/current', async (req, res) => {
    redisClient.hgetall('values', (err, values) => {
        res.send(values);
    });
});

app.post('/values', async (req, res) => {
    const index = req.body.index;

    if (parseInt(index) > 20) {
        res.status(422).send('Index given is too large');
    }

    // Worker will put the required value for the given index
    // publish a new insert event so that worker can fill the value
    redisClient.hset('values', index, 'N/A');
    redisPublisher.publish('insert', index);

    pgClient.query('INSERT INTO values(number) VALUES($1)', [index]);

    res.send({
        working: true
    });
});

app.listen(PORT, () => {
    console.log(`Application is listening on ${PORT}`);
});
