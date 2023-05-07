const { createClient } = require('redis');

const client = createClient();

function getTokensKey(email) {
    return `userTokens:${email}`
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


// tokens:  {
//   access_token: 'ya29.a0AWY7Ckn9-DhJqDOEesRRZDIaVM3a0MSxzYkqk8mSNKarLBsErB_zMRstQeo_GOpdSU6AQW-XZgb1HyAOy9e_nTCGQ2soucmLyGCCxadVJZMS6x7QFykzaEuF3zr1Y91blJyLJ6fXBZsQNzGRIV41GQioWd0JaCgYKAeYSARMSFQG1tDrpsLN833P5-rBjXA7YcurUkA0163',
//   refresh_token: '1//012YUjZKm7gfaCgYIARAAGAESNwF-L9Irc1Jd7XuNqBKTAjasbJGokCkuHzSymm6ThZkMLTbdHnm84Fp7K3QP_Q3eqhcuTKoYVkY',
//   scope: 'https://www.googleapis.com/auth/calendar.readonly',
//   token_type: 'Bearer',
//   expiry_date: 1683491238526
// }

async function cacheTokens(email, tokens) {
    const redis = await getRedis();
    const key = getTokensKey(email);
    return await redis.set(key, tokens)
}


async function getTokens(email) {
    const redis = await getRedis();
    const key = getTokensKey(email);
    console.log(`trying to get data from key: `, key)
    const tokens = await redis.get(key)
    console.log(`found: `, tokens)
    if (tokens === null || tokens === undefined) {
        throw Error(`no tokens found for account ${email}`)
    }
    return JSON.parse(tokens)
}


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

module.exports = { cacheTokens, getTokens }