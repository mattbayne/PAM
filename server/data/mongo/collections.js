const dbcon = require('./connection');

const getCollection = name => {
    let collection = undefined;

    return async () => {
        if (!collection) {
            const db = await dbcon();
            collection = await db.collection(name);
        }
        return collection;
    };
};

module.exports = {
    userCollection: getCollection('users'),
}