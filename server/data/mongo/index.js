const {userCollection} = require('./collections');
// const {ObjectId} = require('mongodb');

const userDefaults = {
    profileImage: null
}


async function getUserProfile(email) {
    console.log(`getting user information for: `, email);
    if (email === undefined) throw Error("email must be provided");
    let result;
    try {
        const coll = await userCollection();
        result = await coll.findOne({ email: email});
    } catch (e) {
        console.log(`failed to get user info: `, e)
        throw e
    }
    // if (!result) throw Error(`no user information found for email: ${email}`);
    return result
}


async function createUserProfile(email, data) {
    if (email === undefined) throw Error("email must be provided");
    const coll = await userCollection();
    const document = {
        ...userDefaults,
        ...data,
        email: email,
    }
    let result;
    try {
        console.log(`inserting document: `, document)
        result = await coll.insertOne(document)
    } catch (e) {
        throw Error("failed to create user profile document");
    }
    return result
}

async function updateUserProfilePicture(email, profilePicture) {
    if (email === undefined) throw Error("email must be provided");
    const coll = await userCollection();
    let result;
    try {
        result = await coll.updateOne({ email: email }, { $set: { "profileImage": profilePicture } });
    } catch (e) {
        throw Error("failed to update profile picture");
    }
    return result
}


module.exports = {
    getUserProfile, updateUserProfilePicture, createUserProfile
}