/*
MIT License
Copyright (c) 2019 KSU-CS-Software-Engineering
*/

-- dummy data for testing purposes
-- Import SchoolDirectoryCSV before using this file

/*If the database has been created already:
    navigate to api database in powershell
    run \i hspc_testpopulate.sql
*/

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