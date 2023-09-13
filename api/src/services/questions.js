/*
    Reformated to work with questions Natalie Laughlin
*/

const db = require("../utils/hspc_db").db;

module.exports = {
    getAllquestions: getAllquestions,
    addQuestion: addQuestion,
    removeQuestion: removeQuestion,
};

/*function addPractice(practice){
    return db.none(`INSERT INTO Files(FileData, FileType, FileGroup)
            VALUES(@practice, '${practice.mimetype}', 'Practice')`);
}*/

function getAllquestions(){
    return db.any(`SELECT * FROM questions ORDER BY questionlevelid, questionid ASC`);
}

function addQuestion(id, lvl, description){
    return db.any(`INSERT INTO questions (questionid, questionlevelid, questiondescription) VALUES (
        $(id),
        $(lvl),
        $(description)
    )`, {id, lvl, description});
}

function removeQuestion(id){
    return db.any(`DELETE FROM questions WHERE questionid= $(id)`, {id});
}
