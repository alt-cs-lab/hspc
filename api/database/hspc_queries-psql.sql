/*
MIT License
Copyright (c) 2019 KSU-CS-Software-Engineering
*/

-- example if created the database already:
--   psql -U postgres -W -d hspc -f hspc_queries-psql.sql
-- CREATE DATABASE hspc;

-- Devin Richards (01/29/2024)
-- Below is a prototype for the new database.

DROP TABLE IF EXISTS Roles CASCADE;
DROP TABLE IF EXISTS Users CASCADE;
DROP TABLE IF EXISTS Volunteers CASCADE;
DROP TABLE IF EXISTS Competitions CASCADE;
DROP TABLE IF EXISTS SchoolAdvisors CASCADE;
DROP TABLE IF EXISTS Schools CASCADE;
DROP TABLE IF EXISTS TeamStatus CASCADE;
DROP TABLE IF EXISTS SkillLevels CASCADE;
DROP TABLE IF EXISTS Teams CASCADE;
DROP TABLE IF EXISTS "Rounds" CASCADE;
DROP TABLE IF EXISTS Questions CASCADE;
DROP TABLE IF EXISTS ScoreAttempts CASCADE;
DROP TABLE IF EXISTS HighSchoolStudents CASCADE;
DROP TABLE IF EXISTS TeamMembers CASCADE;
DROP TABLE IF EXISTS TestCases CASCADE;
DROP TABLE IF EXISTS TestCaseAttempts CASCADE;
DROP TABLE IF EXISTS Files CASCADE;
DROP TABLE IF EXISTS Articles CASCADE;

SET TIME ZONE '-06:00';

CREATE TABLE Roles (
	"Level" SMALLINT,
	"Role" VARCHAR(15),
	PRIMARY KEY ("Level")
);

-- Holds information on every user. 
-- TODO: add check for nullable password (must be ksu.edu)
CREATE TABLE Users (
	UserID SERIAL NOT NULL,
	Phone VARCHAR(12),
	FirstName VARCHAR(100) NOT NULL,
	LastName VARCHAR(100) NOT NULL,
	EncryptedPassword VARCHAR(100),
	AccessLevel SMALLINT,
	RequestLevel SMALLINT,
	Email VARCHAR(320),
        CreatedOn TIMESTAMP,
        AccessedOn TIMESTAMP,
	PRIMARY KEY (UserID),
	UNIQUE (Email),
	FOREIGN KEY (AccessLevel) REFERENCES Roles("Level"), -- "Level"
	FOREIGN KEY (RequestLevel) REFERENCES Roles("Level") -- "Level"
);

CREATE TABLE Competitions (
	CompetitionID SERIAL NOT NULL,
	EventLocation VARCHAR(64),
	EventDate VARCHAR(64),
	EventTime VARCHAR(64),
	EventName VARCHAR(64),
	EventDescription VARCHAR(1250),
	TeamsPerEvent INT,
	BeginnerTeamsPerEvent INT,
	AdvancedTeamsPerEvent INT,
	TeamsPerSchool INT,
	BeginnerTeamsPerSchool INT,
	AdvancedTeamsPerSchool INT,
	PRIMARY KEY (CompetitionID)
);

CREATE TABLE Volunteers (
	VolunteerID SERIAL NOT NULL,
	UserID INT,
	CompetitionID INT,
	Availability VARCHAR(2000),
	ScheduledTime VARCHAR(2000),
	PRIMARY KEY (VolunteerID),
	UNIQUE (UserID, CompetitionID),
	FOREIGN KEY (UserID) REFERENCES Users(UserID),
	FOREIGN KEY (CompetitionID) REFERENCES Competitions(CompetitionID)
);

-- Holds information on high schools in Kansas. 
CREATE TABLE Schools (
	SchoolID SERIAL NOT NULL,
	SchoolName VARCHAR(64),
	AddressLine1 VARCHAR(128),
	AddressLine2 VARCHAR(128),
	City VARCHAR(64),
	"State" VARCHAR(32),
	PostalCode VARCHAR(10),
	USDCode SMALLINT,
	PRIMARY KEY (SchoolID),
        CONSTRAINT school_usd_code_unique UNIQUE (SchoolName, USDCode)
);

CREATE TABLE TeamStatus (
	StatusID SMALLINT,
	Status VARCHAR(15),
	UNIQUE (StatusID) -- Add
);

CREATE TABLE SkillLevels (
	SkillLevelID SERIAL NOT NULL,
	SkillLevel VARCHAR(24),
	PRIMARY KEY (SkillLevelID)
);

CREATE TABLE SchoolAdvisors (
    AdvisorID SERIAL,
	UserID INT,
	SchoolID INT,
	PRIMARY KEY (AdvisorID),
	FOREIGN KEY (UserID) REFERENCES Users(UserID),
	FOREIGN KEY (SchoolID) REFERENCES Schools(SchoolID)
);

CREATE TABLE Teams (
	TeamID SERIAL NOT NULL,
	SchoolID INT,
	CompetitionID INT,
	TeamName VARCHAR(64),
	SkillLevelID INT,
	AdvisorID INT,
	TeamStatusID SMALLINT,
	TimeCreated TIMESTAMP,
	PRIMARY KEY (TeamID),
	UNIQUE (CompetitionID, TeamName),
	FOREIGN KEY (SchoolID) REFERENCES Schools(SchoolID),
	FOREIGN KEY (CompetitionID) REFERENCES Competitions(CompetitionID),
	FOREIGN KEY (SkillLevelID) REFERENCES SkillLevels(SkillLevelID),
	FOREIGN KEY (AdvisorID) REFERENCES Users(UserID),
	FOREIGN KEY (TeamStatusID) REFERENCES TeamStatus(StatusID)
);

CREATE TABLE "Rounds" (
	RoundID SERIAL NOT NULL,
	CompetitionID INT,
	RoundNumber INT,
	MinutesAllowed INT,
	RoundStarted TIMESTAMP,
	PRIMARY KEY (RoundID),
	UNIQUE (CompetitionID, RoundNumber),
	FOREIGN KEY (CompetitionID) REFERENCES Competitions(CompetitionID)
);

CREATE TABLE Questions (
	QuestionID SERIAL NOT NULL,
	QuestionTitle VARCHAR(64),
	QuestionDescription VARCHAR(8000),
	QuestionSolution VARCHAR(4000),
	RoundID INT,
	SkillLevelID INT,
	PRIMARY KEY (QuestionID),
	FOREIGN KEY (RoundID) REFERENCES "Rounds"(RoundId),
	FOREIGN KEY (SkillLevelID) REFERENCES SkillLevels(SkillLevelID)
);

CREATE TABLE ScoreAttempts (
	ScoreAttemptID SERIAL NOT NULL,
	TeamID INT,
	QuestionID INT,
	VolunteerID INT,
	Passed BOOLEAN,
	TimeJudged TIMESTAMP,
	Score INT,
	PRIMARY KEY (ScoreAttemptID),
	FOREIGN KEY (TeamID) REFERENCES Teams(TeamID),
	FOREIGN KEY (QuestionID) REFERENCES Questions(QuestionID),
	FOREIGN KEY (VolunteerID) REFERENCES Volunteers(VolunteerID)
);

CREATE TABLE HighSchoolStudents (
	StudentID SERIAL NOT NULL,
	FirstName VARCHAR(100),
	LastName VARCHAR (100),
	SchoolID INT,
	Email VARCHAR(320),
	GradDate DATE,
	PRIMARY KEY (StudentID),
	FOREIGN KEY (SchoolID) REFERENCES Schools(SchoolID),
	UNIQUE (Email)
);

CREATE TABLE TeamMembers (
	StudentID INT,
	TeamID INT,
	PRIMARY KEY (StudentID, TeamID),
	FOREIGN KEY	(StudentID) REFERENCES HighSchoolStudents(StudentID),
	FOREIGN KEY (TeamID) REFERENCES Teams(TeamID)
);

CREATE TABLE TestCases (
	TestCaseID SERIAL NOT NULL,
	QuestionID INT,
	"Input" VARCHAR(80),
	"Output" VARCHAR(80),
	PRIMARY KEY (TestCaseID),
	UNIQUE (QuestionID, "Input"),
	FOREIGN KEY (QuestionID) REFERENCES Questions(QuestionID)
);

CREATE TABLE TestCaseAttempts (
	ScoreAttemptID INT,
	TestCaseID INT,
	Passed BOOLEAN,
	PRIMARY KEY (ScoreAttemptID, TestCaseID),
	FOREIGN KEY (ScoreAttemptID) REFERENCES ScoreAttempts(ScoreAttemptID),
	FOREIGN KEY (TestCaseID) REFERENCES TestCases(TestCaseID)
);

CREATE TABLE Files (
	FileID SERIAL NOT NULL,
	FileData BYTEA,
	FileType VARCHAR(32),
	FileGroup VARCHAR(32),
	PRIMARY KEY (FileID)
);

CREATE TABLE Articles (
	ArticleID SERIAL NOT NULL,
	ArticleTitle VARCHAR(64),
	ArticleSubHeading VARCHAR(256),
	ArticleMessage TEXT,
	ArticleDate VARCHAR(54),
	PRIMARY KEY (ArticleID)
);
