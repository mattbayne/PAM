const { createClient } = require('redis');

const client = createClient();

function getUserKey(email) {
    return `user:${email}`
}

client.on('connect', function () {
    console.log('Redis connected!');
});

client.on("error", (err) => {
        console.log(`Redis error: ${err}`);
        throw Error("redis connection error; did you forget to start redis?")
    }
)

async function getRedis() {
    if (!client.isOpen) await client.connect();
    return client
}


// async function getLocation(id) {
//     const redis = await getRedis();
//     const raw = await redis.hGet(locationKey, id)
//     if (raw === null || raw === undefined) {
//         throw Error(`no location found for id ${id}`)
//     }
//     return JSON.parse(raw)
// }
//
//
// async function uploadLocation(location) {
//     // This mutation will create a Location and will be saved in Redis. Outside of the provided values from the
//     // “New Location” form, by default, the following values of Location should be:
//     // liked: false
//     // userPosted: true
//     // id: a uuid
//     const redis = await getRedis();
//     try {
//         await redis.hSet(locationKey, location['id'], JSON.stringify(location))
//     } catch(e) {
//         throw Error(`something went wrong; nothing added to cache: `, e)
//     }
//     return location
// }

module.exports = { }