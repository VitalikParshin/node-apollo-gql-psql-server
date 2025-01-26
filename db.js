const { Client } = require('pg');
const clientPostgress = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'test',
    password: '12345',
    port: 5432,
});

clientPostgress.connect()
    .then(() => console.log('Connected to PostgreSQL database'))
    .catch(err => console.error('Connection error', err.stack));

module.exports = clientPostgress;