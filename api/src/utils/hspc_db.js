require('dotenv').config();
const pgp = require('pg-promise')({});


class dbHandler {
    constructor() {

        this.isTest = process.env.NODE_ENV === 'test';
        const isProduction = process.env.NODE_ENV === 'production';

        this.config = {
            host: process.env.DB_HOST || 'localhost',
            port: isProduction ? 5432 : Number(process.env.DB_PORT),
            database: process.env.DB_NAME,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
        }

        this.mainDB = pgp(this.config);

    }

    async createTestDB() {

        // If a test failed there is a chance of the test_db not being properly dropped last time
        try {
            await this.mainDB.none(`DROP DATABASE test_db_${process.env.JEST_WORKER_ID}`);
        }catch(error){
            // We can otherwise safely ignore the error.
            if (error.message !== `database "test_db_${process.env.JEST_WORKER_ID}" does not exist`){
                console.error(error);
            }
        }

        await this.mainDB.query(`CREATE DATABASE test_db_${process.env.JEST_WORKER_ID}`);
        this.testDB = await pgp({ ...this.config, database: `test_db_${process.env.JEST_WORKER_ID}` });
    }

    async connect() {
        return this.mainDB.connect();
    }

    any(query, values) {
        if (this.isTest) {
            return this.testDB.any(query, values);
        } else {
            return this.mainDB.any(query, values);
        }
    }

    none(query, values) {
        if (this.isTest) {
            return this.testDB.none(query, values);
        } else {
            return this.mainDB.none(query, values);
        }
    }

    oneOrNone(query, values) {
        if (this.isTest) {
            return this.testDB.oneOrNone(query, values);
        } else {
            return this.mainDB.oneOrNone(query, values);
        }
    }

    query(query, values) {
        if (this.isTest) {
            return this.testDB.query(query, values);
        } else {
            return this.mainDB.query(query, values);
        }
    }

    tx(t) {
        if (this.isTest) {
            return this.testDB.tx(t);
        } else {
            return this.mainDB.tx(t);
        }
    }

    txIf(t) {
        if (this.isTest) {
            return this.testDB.txIf(t)
        } else {
            return this.mainDB.txIf(t);
        }
    }

    // More functions may need to be added

    async closeTestDB() {
        if (this.testDB) {
            await this.testDB.$pool.end().catch((err)=>{
                console.error(err);
            });
            await this.mainDB.none(`DROP DATABASE test_db_${process.env.JEST_WORKER_ID}`)
            .catch((err)=>{
                console.error(err);
            }).finally(pgp.end);
        }
    }


}

const db = new dbHandler();

module.exports = { db: db }