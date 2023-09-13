const db = require("../utils/hspc_db").db;

module.exports = {
    createScore: createScore,
    getScore: getScore,
    getquestions: getquestions,
    getteamscore: getteamscore,
    getteamwrong: getteamwrong
}

/*
* Function used to insert a new event that has been created into the database
    @author: Natalie Laughlin
*/
function createScore(eventDate, teamid) {
    return db.none(`
    INSERT into score (teamid, questionlevelid, questionid, competitionid) 
    SELECT t.teamid, t.questionlevelid, q.questionid, t.competitionid 
    FROM teams AS t 
    INNER JOIN questions AS q on q.questionlevelid= t.questionlevelid 
    INNER JOIN competition AS c on c.competitionid = t.competitionid 
    WHERE t.teamid = $(teamid) and c.eventdate = $(eventDate);`, 
    {teamid, eventDate});
}

/*
* Function to get all the competitions in the Competition table
    @author: Natalie Laughlin
*/
function getScore(eventDate) {
    return db.any(`
    SELECT DISTINCT c.eventName, t.teamname, sc.schoolname, sum(case when s.problemsolved='1' then 1 end) as problemsolved, cast(SUM(s.timeanswered-cast(c.eventtime as time))as varchar(64))as totalTime 
    FROM score AS s 
    INNER JOIN teams AS t ON t.teamid = s.teamid 
    INNER JOIN school AS sc on sc.schoolid = t.schoolid 
    INNER JOIN competition AS c on c.competitionid = s.competitionid
    WHERE eventDate= $(eventDate) 
    GROUP BY t.teamname, sc.schoolname, c.eventName  
    ORDER BY problemsolved Asc;`, 
    {eventDate});

}
/*Function to get all the questions from the score table
* @author: Natalie Laughlin
*/
function getquestions(eventDate){
    return db.any(`
    SELECT DISTINCT questionid 
    FROM score AS s 
    INNER JOIN competition AS c on c.competitionid = s.competitionid 
    WHERE c.eventdate = $(eventDate);`, 
    {eventDate});
}
/*Function to get the teams curent score
* @author: Natalie Laughlin
*/
function getteamscore(teamName){
    return db.any(`select * from score where problemsolved='1' and teamid=(select teamid from teams where teamname= $(teamName));`, {teamName});
}
/*
*function get the questions aswered wrong
* @author: Natalie Laughlin
*/
function getteamwrong(teamName){
    return db.any(`select * from score where problemsolved='0' and teamid=(select teamid from teams where teamname= $(teamName));`, {teamName});
}