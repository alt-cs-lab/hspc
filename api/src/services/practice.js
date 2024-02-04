/*
MIT License
Copyright (c) 2019 KSU-CS-Software-Engineering
*/
const db = require("../utils/hspc_db").db;

module.exports = {
    addPractice: addPractice,
    getAllPractice: getAllPractice
};

//inserts the file into the table modified by Natalie Laughlin
function addPractice(practice){

    return db.none(`INSERT INTO Files(FileData, FileType, FileGroup)
    VALUES($(practice), $(practice.mimetype), 'Practice')`, {practice});//OLD CODE VALUES(@practice, '${practice.mimetype}', 'Practice')`);
   }

//gets all the practice questions Added the where statment  Natalie Laughlin
function getAllPractice(){
    return db.any(`SELECT * FROM Files where filegroup='Practice'`);
}

