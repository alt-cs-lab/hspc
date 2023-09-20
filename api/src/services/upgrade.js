/*
MIT License
Copyright (c) 2019 KSU-CS-Software-Engineering
*/
const db = require('../utils/hspc_db').db;
const { renameKeys } = require("../utils/extensions");

module.exports = {
    getAllUpgrades: getAllUpgrades,
    getAdminUpgrades: getAdminUpgrades,
    rejectUpgradeRequest: rejectUpgradeRequest,
    acceptUpgradeRequest: acceptUpgradeRequest
};

//function to get all the users who are requesting an upgrade, except for admins
function getAllUpgrades() {
    return db.any(`SELECT U.FirstName,
        U.LastName,
        U.Email,
        U.Phone,
        U.AccessLevel,
        U.RequestLevel
        FROM Users AS U
        WHERE U.RequestLevel != U.AccessLevel AND
        U.RequestLevel != 80 `)
        .then((upgrades) => renameKeys(upgrades,[
            'firstName',
            'lastName',
            'email',
            'phone',
            'accessLevel',
            'requestLevel'
        ]));
}

//function to get all the users who are requesting to upgrade to an admin account
function getAdminUpgrades() {
    return db.any(`SELECT U.FirstName,
        U.LastName,
        U.Email,
        U.AccessLevel,
        U.RequestLevel
        FROM Users AS U
        WHERE U.AccessLevel = 20`)
        .then((aupgrades) => renameKeys(aupgrades,[
            'firstName',
            'lastName',
            'email',
            'accessLevel',
            'requestLevel'
        ]));
}

//function to set the request level to the access level, removing the upgrade request
function rejectUpgradeRequest({email}) {
    return db.none(`UPDATE Users
        set RequestLevel = (
            SELECT AccessLevel
            FROM Users
            WHERE Email = $(email)
        )
        where Email = $(email);`, { email });
        // use to also delete from advisor table but advisors are never part of an upgrade request?
}

//function that gives a user the access level that they request
function acceptUpgradeRequest({email}) {
    // finds a user by email and sets their access level to their request level
    return db.none(`UPDATE Users
        set AccessLevel = 80,
        RequestLevel = 80
        where Email = $(email);`, { email });
}
