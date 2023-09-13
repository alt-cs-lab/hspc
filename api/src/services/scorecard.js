/*
MIT License
Copyright (c) 2019 KSU-CS-Software-Engineering
*/
const db = require("../utils/hspc_db").db;

module.exports = {
    addScore: addScore,
    getAllScores: getAllScores
};
//gets all the scorecards Added the where statment Natalie Laughlin
function getAllScores(){
    return db.any(`SELECT * FROM Files where filegroup = 'Scorecard'`);
}

//inserts the file into the table modified by Natalie Laughlin
function addScore(scorecard){
    console.log(scorecard);
    return db.none(`INSERT INTO Files(FileData, FileType, FileGroup)
    VALUES($(scorecard), $(scorecard.mimetype), 'Scorecard')`, {scorecard});
} //VALUES(@scorecard, '${scorecard.mimetype}', 'Scorecard')`);
