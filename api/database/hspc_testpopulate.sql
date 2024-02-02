/*
MIT License
Copyright (c) 2019 KSU-CS-Software-Engineering
*/

-- dummy data for testing purposes
-- Import SchoolDirectoryCSV before using this file

/*If the database has been created already:x
    navigate to api database in powershell
    run \i hspc_testpopulate.sql
*/

INSERT INTO Competitions
    (CompetitionID, EventLocation, EventDate, EventTime, EventName, EventDescription, TeamCapacity)
VALUES
    (7, 'Central High School', '2024-03-15', '09:00', 'Spring Coding Challenge', 'An engaging competition for high school students to showcase their programming skills.', 4),
    (8, 'Eastside Community College', '2024-04-20', '10:00', 'ECC Tech Fest', 'A technology festival and competition for local high school and college students.', 3);

/*
Insert Values into Roles Table
*/
INSERT INTO Roles
    ("Level", "Role")
VALUES
    (20, 'Volunteer'),
    (40, 'Judge'),
    (60, 'Advisor'),
    (80, 'Admin'),
    (100, 'Master');

/*
Insert Values into Team Status Table
*/
INSERT INTO TeamStatus
    (StatusID, Status)
VALUES
    (1, 'Unregistered'),
    (2, 'Waitlisted'),
    (3, 'Registered'),
    (4, 'Denied');

/*
Insert Values into Skill Levels Table
*/
INSERT INTO SkillLevels
    (SkillLevelID, SkillLevel)
VALUES
    (1, 'Beginner'),
    (2, 'Advanced');

/*
Insert Dummy Values into Users Table
*/
INSERT INTO Users
    (UserID, Phone, FirstName, LastName, EncryptedPassword, AccessLevel, RequestLevel, Email, CreatedOn, AccessedOn)
VALUES
    (18, '234-555-1012', 'Evelyn', 'Smith', '$2a$10$PZAjHhOA0BU3pW9SLRKDoeVxSIN2IhpoPA/1BEuH4iw3kaGUJN1G.', 20, 20, 'evelyn.smith@email.com', '2024-01-03', '2024-01-29'),
    (19, '213-555-1013', 'Frank', 'Wright', '$2a$10$PZAjHhOA0BU3pW9SLRKDoeVxSIN2IhpoPA/1BEuH4iw3kaGUJN1G.', 20, 20, 'frank.wright@email.com', '2024-01-04', '2024-01-28'),
    (20, '762-555-1014', 'Gina', 'Davis', '$2a$10$PZAjHhOA0BU3pW9SLRKDoeVxSIN2IhpoPA/1BEuH4iw3kaGUJN1G.', 40, 40, 'gina.davis@email.com', '2024-01-05', '2024-01-27'),
    (21, '127-555-1015', 'Harry', 'Miller', '$2a$10$PZAjHhOA0BU3pW9SLRKDoeVxSIN2IhpoPA/1BEuH4iw3kaGUJN1G.', 40, 40, 'harry.miller@email.com', '2024-01-06', '2024-01-26'),
    (22, '932-555-1016', 'Irene', 'Wilson', '$2a$10$PZAjHhOA0BU3pW9SLRKDoeVxSIN2IhpoPA/1BEuH4iw3kaGUJN1G.', 60, 60, 'irene.wilson@email.com', '2024-01-07', '2024-01-25'),
    (23, '328-555-1017', 'Jack', 'Thomas', '$2a$10$PZAjHhOA0BU3pW9SLRKDoeVxSIN2IhpoPA/1BEuH4iw3kaGUJN1G.', 60, 60, 'jack.thomas@email.com', '2024-01-08', '2024-01-24'),
    (24, '421-555-1018', 'Kathy', 'Lee', '$2a$10$PZAjHhOA0BU3pW9SLRKDoeVxSIN2IhpoPA/1BEuH4iw3kaGUJN1G.', 80, 80, 'kathy.lee@email.com', '2024-01-09', '2024-01-23'),
    (25, '321-555-1019', 'Leo', 'Garcia', '$2a$10$PZAjHhOA0BU3pW9SLRKDoeVxSIN2IhpoPA/1BEuH4iw3kaGUJN1G.', 80, 80, 'leo.garcia@email.com', '2024-01-10', '2024-01-22'),
    (26, '442-555-1020', 'Josh', 'Weese', '$2a$10$PZAjHhOA0BU3pW9SLRKDoeVxSIN2IhpoPA/1BEuH4iw3kaGUJN1G.', 100, 100, 'maggie.perez@email.com', '2024-01-11', '2024-01-29'),
    (27, '745-555-1021', 'Nathan', 'Bean', '$2a$10$PZAjHhOA0BU3pW9SLRKDoeVxSIN2IhpoPA/1BEuH4iw3kaGUJN1G.', 100, 100, 'nathan.kim@email.com', '2024-01-12', '2024-01-28');

/*
Insert Dummy Values into School Advisors Table
*/
INSERT INTO SchoolAdvisors
    (UserID, SchoolID)
VALUES
    (22, 194),
    (23, 137);

/*
Insert Dummy Values into High School Students Table
*/
INSERT INTO HighSchoolStudents
    (StudentID, FirstName, LastName, SchoolID, Email, GradDate)
VALUES
    (16, 'Chris', 'Martin', 181, 'chris.martin@school.com', '2025-05-30'),
    (17, 'Diana', 'Ross', 182, 'diana.ross@school.com', '2024-06-15');

/*
Insert Dummy Values into Volunteers Table
*/
INSERT INTO Volunteers
    (VolunteerID, UserID, CompetitionID, Availability, ScheduledTime)
VALUES
    (12, 18, 7, '2024-03-15', '09:00-12:00'),
    (13, 19, 8, '2024-04-20', '10:00-13:00');

/*
Insert Dummy Values into Teams Table
*/
INSERT INTO Teams
    (TeamID, SchoolID, CompetitionID, TeamName, SkillLevelID, AdvisorID, TeamStatusID, TimeCreated)
VALUES
    (7, 181, 7, 'Maple Coders', 1, 22, 1, '2024-01-15T08:00:00.000'),
    (8, 182, 8, 'Riverdale Hackers', 2, 23, 2, '2024-01-20T09:00:00.000');

/*
Insert Dummy Values into Round Table
*/
INSERT INTO "Rounds"
    (RoundID, CompetitionID, RoundNumber, MinutesAllowed, RoundStarted)
VALUES
    (3, 7, 1, 60, '2024-01-15T08:00:00.000'),
    (4, 8, 2, 45, '2024-01-15T09:00:00.000');

/*
Insert Values into Questions Table
*/
INSERT INTO Questions
    (QuestionID, QuestionTitle, QuestionDescription, QuestionSolution, RoundID, SkillLevelID)
VALUES
    (11, 'Array Challenge', 'Solve the given array manipulation problem.', 'Solution text here.', 3, 1),
    (12, 'Database Query', 'Write an SQL query to solve the given problem.', 'Solution text here.', 4, 2);

/*
Insert Dummy Values into Score Attempt Table
*/
INSERT INTO ScoreAttempts
    (ScoreAttemptID, TeamID, QuestionID, VolunteerID, Passed, TimeJudged, Score)
VALUES
    (7, 7, 11, 12, TRUE, '2024-03-15T10:00:00.000', 85),
    (8, 8, 12, 13, FALSE, '2024-04-20T11:30:00.000', 70);

/*
Insert Dummy Values into Test Case Table
*/
INSERT INTO TestCases
    (TestCaseID, QuestionID, "Input", "Output")
VALUES
    (13, 11, 'Input data here', 'Expected output here'),
    (14, 12, 'Input data here', 'Expected output here');

/*
Insert Dummy Values into Test Case Attempt Table
*/
INSERT INTO TestCaseAttempts
    (ScoreAttemptID, TestCaseID, Passed)
VALUES
    (7, 13, TRUE),
    (8, 14, FALSE);

/*
Insert Dummy value into Article Table
*/
INSERT INTO Article
    (ArticleTitle,ArticleSubHeading,ArticleMessage,ArticleDate)
VALUES
('Work being done','Please do not disturb the engineers','Goodbye!','2022-2-18');


-- OLD INSERTS
/*
INSERT INTO Competition
    (EventLocation, EventDate, EventTime, EventName, EventDescription, BeginnerTeamsPerSchool, AdvancedTeamsPerSchool, TeamsPerSchool, BeginnerTeamsperEvent, AdvancedTeamsperEvent, TeamsperEvent)
VALUES
('Kansas State University','2022-10-6','08:30','HSPC','High School Programming Competition', 1, 2, 3, 12, 26, 50),
('Hutchinson Community College','2022-6-5','10:30','MLH Competition','Major League Hacking Competition', 1, 1, 2, 25, 25, 50),
('Wichita State University','2022-5-11','11:30','MLH','MLH Programming Competition', 1, 1, 2, 25, 25, 50),
('Kansas University','2022-7-13','09:30','Who Cares','Programming Competition', 2, 3, 5, 20, 30, 50),
('Somewhere','2022-5-12','08:45','Test Event One','Test programming competition', 1, 1, 1, 3, 3, 5),
('Somewhere','2022-6-8','13:30','Test Event Two','Test programming competition', 2, 2, 2, 7, 7, 10);

INSERT INTO Article
    (ArticleTitle,ArticleSubHeading,ArticleMessage,ArticleDate)
VALUES
('Work being done','Please do not disturb the engineers','Goodbye!','2022-2-18');

--All passwords for all users is "password1234"
INSERT INTO Users
    (FirstName,LastName,EncryptedPassword,AccessLevel,Requestlevel,Email)
VALUES
('Default','AdminPerson','$2a$10$PZAjHhOA0BU3pW9SLRKDoeVxSIN2IhpoPA/1BEuH4iw3kaGUJN1G.',100,100,'dm@gmail.com'),
('John','Smith','$2a$10$PZAjHhOA0BU3pW9SLRKDoeVxSIN2IhpoPA/1BEuH4iw3kaGUJN1G.',60,60,'jsmith@gmail.com'),
('Josh','Werner','$2a$10$PZAjHhOA0BU3pW9SLRKDoeVxSIN2IhpoPA/1BEuH4iw3kaGUJN1G.',1,1,'jwerner@gmail.com'),
('Sue','Roberts','$2a$10$PZAjHhOA0BU3pW9SLRKDoeVxSIN2IhpoPA/1BEuH4iw3kaGUJN1G.',60,60,'sroberts@gmail.com'),
('Jeff','Kramer','$2a$10$PZAjHhOA0BU3pW9SLRKDoeVxSIN2IhpoPA/1BEuH4iw3kaGUJN1G.',1,1,'jkramer@gmail.com'),
('Carey','Fisher','$2a$10$PZAjHhOA0BU3pW9SLRKDoeVxSIN2IhpoPA/1BEuH4iw3kaGUJN1G.',80,80,'cfisher@gmail.com'),
('Nancy','Johnson','$2a$10$PZAjHhOA0BU3pW9SLRKDoeVxSIN2IhpoPA/1BEuH4iw3kaGUJN1G.',20,20,'njohnson@gmail.com'),
('Jim','Carter','$2a$10$PZAjHhOA0BU3pW9SLRKDoeVxSIN2IhpoPA/1BEuH4iw3kaGUJN1G.',1,1,'jcarter@gmail.com'),
('Ron','Legends','$2a$10$PZAjHhOA0BU3pW9SLRKDoeVxSIN2IhpoPA/1BEuH4iw3kaGUJN1G.',20,20,'rlegends@gmail.com'),
('Katida','Daniels','$2a$10$PZAjHhOA0BU3pW9SLRKDoeVxSIN2IhpoPA/1BEuH4iw3kaGUJN1G.',20,20,'kdaniels@gmail.com'),
('Tatjana','Hartmann','$2a$10$PZAjHhOA0BU3pW9SLRKDoeVxSIN2IhpoPA/1BEuH4iw3kaGUJN1G.',20,20,'thartmann@gmail.com'),
('Alinafe','Janowski','$2a$10$PZAjHhOA0BU3pW9SLRKDoeVxSIN2IhpoPA/1BEuH4iw3kaGUJN1G.',1,1,'ajanowski@gmail.com'),
('Fadil','Damiani','$2a$10$PZAjHhOA0BU3pW9SLRKDoeVxSIN2IhpoPA/1BEuH4iw3kaGUJN1G.',1,1,'fdamiani@gmail.com'),
('Osin','Frei','$2a$10$PZAjHhOA0BU3pW9SLRKDoeVxSIN2IhpoPA/1BEuH4iw3kaGUJN1G.',1,1,'ofrei@gmail.com'),
--These users have upgrade requests (Requestlevel > Accesslevel)
('Carl','Schwarts','$2a$10$PZAjHhOA0BU3pW9SLRKDoeVxSIN2IhpoPA/1BEuH4iw3kaGUJN1G.',1,20,'cschwarts@gmail.com'),
('Harry','Potter','$2a$10$PZAjHhOA0BU3pW9SLRKDoeVxSIN2IhpoPA/1BEuH4iw3kaGUJN1G.',1,20,'hpotter@outlook.com'),
('Tim','Sharps','$2a$10$PZAjHhOA0BU3pW9SLRKDoeVxSIN2IhpoPA/1BEuH4iw3kaGUJN1G.',1,60,'tsharps@gmail.com'),
('Jim','Sharps','$2a$10$PZAjHhOA0BU3pW9SLRKDoeVxSIN2IhpoPA/1BEuH4iw3kaGUJN1G.',1,80,'jsharps@gmail.com'),
--Dummy cas user
('Cas', 'User', NULL, 20, 20, 'casuser@ksu.edu');

INSERT INTO AdvisorsAffiliation
    (UserID,SchoolID)
VALUES
(2,194),
(4,137);

INSERT INTO student
    (UserID,AdvisorID)
VALUES
(3,2),
(5,4),
(10,4),
(11,4),
(12,2),
(13,4),
(14,2),
(15,2);

INSERT INTO QuestionLevel 
    (QuestionLevel)
Values
('Beginner'),
('Advanced');

INSERT INTO Teams
    (SchoolID,CompetitionID,TeamName,QuestionLevelID,AdvisorID, Waitlisted, TimeCreated)
VALUES
(194,1,'Wild Cats',1,2, FALSE,'2000-01-01T00:00:00.000-00:00'),
(137,1,'Mean Machines',1,4, FALSE,  '2000-01-01T00:00:00.000-00:00'),
(120,5,'Panthers',1,2, FALSE, '2000-01-01T00:00:00.000-00:00'),
(164,6,'Tornados',2,2, FALSE, '2000-01-01T00:00:00.000-00:00'),
(173,3,'Big Rigs',2,4, FALSE, '2000-01-01T00:00:00.000-00:00'),
(180,6,'Test team please ignore',2,2, TRUE, '2000-01-01T00:00:00.000-00:00');

INSERT INTO TeamsUsers
    (UserID,TeamID)
VALUES
(3,1),
(5,2),
(15,6);

INSERT INTO VolunteerAssignment
        (CompetitionID, VolunteerID, Approved, TimeAssigned)
VALUES
(1, 9, TRUE, '2000-01-01T00:00:00.000-00:00'),
(2, 9, FALSE, '2000-01-01T00:00:00.000-00:00'),
(1, 10, TRUE, '2000-01-01T00:00:00.000-00:00'),
(2, 10, FALSE, '2000-01-01T00:00:00.000-00:00'),
(1, 11, TRUE, '2000-01-01T00:00:00.000-00:00'),
(2, 11, FALSE, '2000-01-01T00:00:00.000-00:00');

INSERT INTO JudgeAssignment
        (VolunteerAssignmentID, Approved, TimeAssigned)
VALUES
(1, TRUE, '2000-01-01T00:00:00.000-00:00'),
(2, FALSE, '2000-01-01T00:00:00.000-00:00'),
(3, TRUE, '2000-01-01T00:00:00.000-00:00'),
(4, FALSE, '2000-01-01T00:00:00.000-00:00'),
(5, TRUE, '2000-01-01T00:00:00.000-00:00'),
(6, FALSE, '2000-01-01T00:00:00.000-00:00');
*/