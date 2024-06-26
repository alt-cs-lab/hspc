/**
 * Services for authentication and registration functionality
 * Author: 
 * Modified: 5/1/2024
 */
const bcrypt = require("bcrypt");
//const { XMLParser } = require("fast-xml-parser");
const jwt = require("jsonwebtoken");
const userService = require("./user");
//const { default: axios } = require("axios");

/**
 * Checks if a password matches a hashed password
 */
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

/**
 * Logs in a user and returns their JWT token
 */
function login({ email, password }) {
  return userService.getLogin(email).then((user) => {
    if (user == null) {
      throw new Error("Email or password is incorrect.");
    }
    return checkPassword(password, user.encryptedPassword).then(() => {
      const payload = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        accessLevel: user.accessLevel,
        email: user.email,
      };

      const data = {
        success: true,
        token:
          "Bearer " +
          jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 86400 }),
      };

      return data;
    });
  });
}

/* THIS HAS BEEN POSTPONED UNTIL CAS SYSTEM IS SET UP AGAIN FOR STUDENT LOGIN AS VOLUNTEERS
const loginOrRegister = async (url, firstName, lastName) => {
  const casResponse = await axios.get(url);
  const parser = new XMLParser();
  const casData = parser.parse(casResponse.data);
  if (casData["cas:serviceResponse"]["cas:authenticationFailure"]) {
    throw Error();
  }

  const auth = casData["cas:serviceResponse"]["cas:authenticationSuccess"];
  const eid = auth["cas:user"];

  const email = eid + "@ksu.edu";
  let user = await userService.getLogin(email);
  let lockedDown = false;

  if (!user) {
    const peopleResponse = await axios.get(
      "https://k-state.edu/People/filter/eid=" + eid
    );
    const xmlParser = new XMLParser();
    const peopleData = xmlParser.parse(peopleResponse.data);
    lockedDown = !(peopleData.results && peopleData.results.result);
    if (!lockedDown) {
      let result = peopleData.results.result;
      if (Array.isArray(result)) {
        for (let i = 0; i < result.length; i++) {
          if (result[i].eid === eid) {
            result = result[i];
            break;
          }
        }
      }
      firstName = result.fn;
      lastName = result.ln;
    }

    if (firstName && lastName) {
      await userService.casRegister(firstName, lastName, email);
      user = await userService.getLogin(email);
    }
  }

  if (user) {
    const payload = {
      id: user.id,
      name: user.firstName + " " + user.lastName,
      accessLevel: user.accessLevel,
      email: user.email,
    };

        return {
            success: true,
            token: "Bearer " + jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 86400 }), // 1 day in seconds
        };
    }
    else if (lockedDown) {
        return { lockedDown }
    }
    else {
        throw Error()
    }
}*/

module.exports = {
    checkPassword,
    login,
    //loginOrRegister,
};
