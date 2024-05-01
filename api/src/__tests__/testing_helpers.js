const { db } = require('../utils/hspc_db');
const fs = require('fs');
const pathJoin = require('path').join;
const csv = require('fast-csv');

const supertest = require("supertest");
const app = require("../server");
const { assert } = require('console');
const request = supertest(app);

const dbdir = pathJoin(__dirname, '/../../database');

const queries = fs.readFileSync(`${dbdir}/create_database.sql`, 'utf8');
const schools = `${dbdir}/SchoolDirectoryCSV.csv`;
const populate = fs.readFileSync(`${dbdir}/populate_test_data.sql`, 'utf8');
let adminToken = null;
let advisorToken = null;

async function populate_schools() {
    try {
        //const { db } = require('../utils/hspc_db');
        // read the CSV file
        const stream = fs.createReadStream(schools);

        // parse the CSV data and insert it into the table
        //choolname,addressline1,addressline2,city,State,postalcode,usdcode
        const data = await csv.parseStream(stream, { headers: true, delimiter: ',' }).on('error', error => {
            console.error(error);
        });;
        for await (const row of data) {
            await db.none('INSERT INTO School(SchoolName, AddressLine1, AddressLine2, City, "State", PostalCode, USDCode) VALUES(${SchoolName}, ${AddressLine1}, ${AddressLine2}, ${City}, ${State}, ${PostalCode}, ${USDCode})', {
                SchoolName: row.schoolname,
                AddressLine1: row.addressline1,
                AddressLine2: row.addressline2,
                City: row.city,
                State: row.State,
                PostalCode: row.postalcode,
                USDCode: row.usdcode
            });
        }
    } catch (error) {
        console.error(error);
    }
}

async function createConnection(){
    await db.createTestDB();
}

async function resetDatabase() {
    //Make sure it is empty
    try {
        await db.none('DROP SCHEMA IF EXISTS public CASCADE');
        await db.none('CREATE SCHEMA public');
    } catch (error) {
        console.error('Error reseting public schema:', error);
    }

    await db.none(queries);
    await populate_schools();
    await db.none(populate);

    if (adminToken == null) {
        const loginResponse = await login('dm@gmail.com', 'password1234');
        adminToken = loginResponse.body.token;
    }
    if (advisorToken == null) {
        const loginResponse = await login('jsmith@gmail.com', 'password1234');
        advisorToken = loginResponse.body.token;
    }
}

async function closeConnection() {
    await db.closeTestDB();
}

const login = async (email, password) => {
    const response = await request.post("/api/auth/login").send({
        email,
        password,
    });
    return response;
};

const getMasterToken = async () => {
    const response = await login('dm@gmail.com', 'password1234');
    return response.body.token;
}

function timeoutSetup() {
    // set the timeout to max integer if vscode debugger is attached
    if (process.debugPort) {
        // not working correctly
        jest.setTimeout(10000);
    }else{
        jest.setTimeout(process.env.JEST_TIMEOUT
            ? parseInt(process.env.JEST_TIMEOUT)
            : 10000);
    }
}

module.exports = {

    createConnection,
    resetDatabase,
    closeConnection,
    login,
    getMasterToken,
    getAdvisorToken: () => advisorToken,
    timeoutSetup,
    getAdminToken: () => adminToken
}
