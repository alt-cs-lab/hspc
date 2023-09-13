// database.service.js
const pgp = require('pg-promise')();

class DatabaseService {
  constructor(dbConfig) {
    this.dbConfig = dbConfig;
  }

  async createTestDatabase() {
    // Connect to the database and create a new test database.
    return new Promise( async (res)=>{
      const db = await pgp(this.dbConfig);
      await db.none(`CREATE DATABASE test_db_${process.env.JEST_WORKER_ID}`);
      const testDbConfig = { ...this.dbConfig, database: `test_db_${process.env.JEST_WORKER_ID}` };
      return await pgp(testDbConfig);
    });
  }

  async destroyTestDatabase() {
    // Connect to the database and drop the test database.
    const db = await pgp(this.dbConfig);
    await db.none(`DROP DATABASE test_db_${process.env.JEST_WORKER_ID}`).then(()=>{
      console.log('dropped');
  }).catch((err)=>{
      console.error(err);
  });
  }

}

module.exports = DatabaseService;