const client = require('mongodb').MongoClient;
const config = require('./config');

let connection = undefined;
let db = undefined


module.exports = async () => {
    if (!connection) {
        connection = await client.connect(config.mongoUrl, { useNewUrlParser: true });
        db = await connection.db(config.database);
    }
    return db;
};