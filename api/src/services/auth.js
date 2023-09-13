/*
MIT License
Copyright (c) 2019 KSU-CS-Software-Engineering
*/
const bcrypt = require("bcrypt");
const { XMLParser } = require("fast-xml-parser");
const jwt = require("jsonwebtoken");
const userService = require("./user");
const { default: axios } = require("axios");
const statusResponse = require("../utils/status-response");
const { lock } = require("../server");

function checkPassword(password, hashedPassword) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, hashedPassword, (err, res) => {
            if (res) {
                resolve();
            } else {
                reject(new Error("Email or password is incorrect."));
            }
        });
    });
}

function login({ email, password }) {
    // retrieve user from database
    return userService.getLogin(email).then((user) => {
        if (user == null) {
            throw new Error("Email or password is incorrect.");
        }
        return checkPassword(password, user.encryptedPassword).then(() => {
            // we only get here if the password is correct
            // Create JWT Payload
            const payload = {
                id: user.id,
                name: user.firstName + " " + user.lastName,
                accessLevel: user.accessLevel,
                email: user.email,
            };

            const data = {
                success: true,
                token: "Bearer " + jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 86400 }), // 1 day in seconds
            };

            // Sign token
            return data;
        });
    });
    
}

const loginOrRegister = async (url) => {
    const casResponse = await axios.get(url)
    const parser = new XMLParser()
    const casData = parser.parse(casResponse.data)
    if(casData['cas:serviceResponse']['cas:authenticationFailure']){
        throw Error()
    }

    const auth = casData['cas:serviceResponse']['cas:authenticationSuccess']
    const eid = auth['cas:user']

    const email = eid + '@ksu.edu'
    let user = await userService.getLogin(email)
    let lockedDown = false

    if (!user) {
        const peopleResponse = await axios.get('https://k-state.edu/People/filter/eid=' + "laskdjkfl")
        const xmlParser = new XMLParser()
        const peopleData = xmlParser.parse(peopleResponse.data)
        lockedDown = !(peopleData.results && peopleData.results.result)
        if (!lockedDown)  {
            const result = peopleData.results.result
            await userService.casRegister(result.fn, result.ln, email)
            user = await userService.getLogin(email)
        }
    }

    if (lockedDown) {
        return { lockedDown }
    }

    if (user) {
        const payload = {
            id: user.id,
            name: user.firstName + " " + user.lastName,
            accessLevel: user.accessLevel,
            email: user.email,
        }

        return {
            success: true,
            token: "Bearer " + jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 86400 }), // 1 day in seconds
        };
    } else {
        throw Error()
    }
}

module.exports = {
    checkPassword,
    login,
    loginOrRegister,
};
