const statusResponses = require("./status-response");
const constants = require("./constants");
const { validationResult, body } = require("express-validator");

function fromLowerCase(targetObject, sourceObject) {
    const newObject = {};
    for (const key of targetObject) {
        newObject[key] = sourceObject[key.toLowerCase()];
    }

    return newObject;
}

function fromLowerCaseArr(targetObject, sourceArr) {
    const newObjects = [];
    for (const sourceObject of sourceArr) {
        const newObject = {};
        for (const key of targetObject) {
            newObject[key] = sourceObject[key.toLowerCase()];
        }

        newObjects.push(newObject);
    }

    return newObjects;
}

/**
 * @param {Array} objects - Array of objects to rename keys
 * @param {Array} keys - Array of keys to rename to
 * @returns {Array} - Array of objects with renamed keys
 * @example
 * const objects = [
 *   { id: 1, name: 'John' },
 *   { id: 2, name: 'Jane' }
 * ]
 * const keys = ['userId', 'userName']
 * renameKeys(objects, keys)
 * // returns
 * [
 *  { userId: 1, userName: 'John' },
 *  { userId: 2, userName: 'Jane' }
 * ]
 */
function renameKeys(objects, keys) {
    if (objects === null || objects.length === 0) {
        return [];
    }
    const newObjects = [];
    const oldKeys = Object.keys(objects[0]);
    for (const object of objects) {
        const newObject = {};
        for (let i = 0; i < keys.length; i++) {
            newObject[keys[i]] = object[oldKeys[i]];
        }
        newObjects.push(newObject);
    }
    return newObjects;
}

function badRequestCheck(req, res, next) {
    const errors = validationResult(req).mapped();
    if (Object.keys(errors).length > 0) {
        return statusResponses.badRequest(res, errors);
    }
    next();
}

function accessLevelCheck(level) {
    return (req, res, next) => {
        if (
            req?.user?.accessLevel !== undefined &&
            (req.user.accessLevel == level || req.user.accessLevel == constants.MASTER) &&
            constants.legalLevels.includes(req.user.accessLevel)
        ) {
            next();
        } else {
            statusResponses.unauthorized(res, "Unauthorized");
        }
    };
}

/** 
 * Calls a service function with the request body and returns the result to the client.
 * 
 * @param {Function} service - The service function to call
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
function useService(service, req, res, successType = 'ok') {
    // add all the request params to the body if there is a body
    let info = { ...req.body, ...req.params, ...req.query};
    info.user = req.user;
    service(info)
        .then((data) => {
            if (successType === 'ok') {
                statusResponses.ok(res, data)
            } else if (successType === 'created') {
                statusResponses.created(res, data)
            }
        })
        .catch((err) => {
            statusResponses.serverError(res, err)
        });
}

module.exports = {
    fromLowerCase,
    fromLowerCaseArr,
    renameKeys,
    badRequestCheck,
    accessLevelCheck,
    useService,
};
