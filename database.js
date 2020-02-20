const knex = require("knex");

const database = knex({
    client: "pg", 
    connection: {
    host: "127.0.0.1", 
    user: "postgres", 
    password: "12345", 
    database: "sport" 
    }
}); // \i 'D:/OTHER/projects/test/...'

module.exports = database;