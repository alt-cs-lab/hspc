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


/*
Insert values into Competition Status Table
*/
INSERT INTO CompetitionStatus
    (StatusID, Status)
VALUES
    (1, 'Unpublished'),
    (2, 'Registerable'),
    (3, 'Active'),
    (4, 'Archived');

/*
Insert values into Competitions Table
*/
INSERT INTO Competitions
    (CompetitionID, EventLocation, EventDate, EventStartTime, EventEndTime, EventName, EventDescription, TeamsperEvent, BeginnerTeamsperEvent, AdvancedTeamsperEvent, TeamsPerSchool, BeginnerTeamsPerSchool, AdvancedTeamsPerSchool, CompetitionStatusID )
VALUES
    (7, 'Central High School', '2023-03-15', '09:00:00 CST', '15:00:00 CST', 'Spring Coding Challenge', 'An engaging competition for high school students to showcase their programming skills.', 100, 50, 50, 5, 3, 3, 4 ),
    (8, 'Eastside Community College', '2026-04-20', '10:00:00 CST', '17:00:00 CST', 'ECC Tech Fest', 'A technology festival and competition for local high school and college students.', 120, 80, 80, 3, 2, 2, 1 ),
    (9, 'Kansas State Alumni Center', '2024-09-20', '11:00:00 CST', '16:00:00 CST', 'High School Programming Contest', 'The contest is open to all high school students. Each team will consist of up to four students with only one laptop per team. In order that beginners as well as more experienced programmers may compete, there will be two divisions: a beginning division consisting of students who have completed at most one semester of programming and have no more than one year programming experience, and an advanced division open to all high school students. Because different schools use different types of machines and different programming languages in their instruction, teams must provide their own computers and software. Any programming language may be used for the contest. Solutions to the contest problems will require numerical calculations, simple string manipulation and logical decisions. The main difference between the two divisions will be in the complexity of the programming logic required to solve the problems. For example, more use of nested loops will be required to solve some advanced division problems. Also, double-dimensioned arrays may be needed to solve advanced problems, whereas single-dimensioned arrays should be sufficient to solve the beginning problems.', 120, 80, 80, 3, 2, 2, 2 );

/*
Insert Values into Roles Table
Bitwise numbers used for roles
*/
INSERT INTO Roles
    ("Level", "Role")
VALUES
    (2, 'Volunteer'),
    (4, 'Judge'),
    (8, 'Advisor'),
    (16, 'Admin'),
    (32, 'Master');

/*
Insert Values into Team Status Table
*/
INSERT INTO TeamStatus
    (StatusID, Status)
VALUES
    (1, 'Waitlisted'),
    (2, 'Registered'),
    (3, 'Denied'),
    (4, 'Archived');

/*
Insert Values into Team Status Table
*/
INSERT INTO AdvisorStatus
    (StatusID, Status)
VALUES
    (1, 'Pending'),
    (2, 'Approved'),
    (3, 'Denied');

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
    (18, '2345551012', 'Evelyn', 'Smith', '$2a$10$PZAjHhOA0BU3pW9SLRKDoeVxSIN2IhpoPA/1BEuH4iw3kaGUJN1G.', 2, 2, 'evelyn.smith@email.com', '2024-01-03', '2024-01-29'),
    (19, '2135551013', 'Frank', 'Wright', '$2a$10$PZAjHhOA0BU3pW9SLRKDoeVxSIN2IhpoPA/1BEuH4iw3kaGUJN1G.', 2, 2, 'frank.wright@email.com', '2024-01-04', '2024-01-28'),
    (20, '7625551014', 'Gina', 'Davis', '$2a$10$PZAjHhOA0BU3pW9SLRKDoeVxSIN2IhpoPA/1BEuH4iw3kaGUJN1G.', 4, 4, 'gina.davis@email.com', '2024-01-05', '2024-01-27'),
    (21, '1275551015', 'Harry', 'Miller', '$2a$10$PZAjHhOA0BU3pW9SLRKDoeVxSIN2IhpoPA/1BEuH4iw3kaGUJN1G.', 4, 4, 'harry.miller@email.com', '2024-01-06', '2024-01-26'),
    (22, '9325551016', 'Irene', 'Wilson', '$2a$10$PZAjHhOA0BU3pW9SLRKDoeVxSIN2IhpoPA/1BEuH4iw3kaGUJN1G.', 8, 8, 'irene.wilson@email.com', '2024-01-07', '2024-01-25'),
    (23, '3285551017', 'Jack', 'Thomas', '$2a$10$PZAjHhOA0BU3pW9SLRKDoeVxSIN2IhpoPA/1BEuH4iw3kaGUJN1G.', 8, 8, 'jack.thomas@email.com', '2024-01-08', '2024-01-24'),
    (28, '9132224767', 'Donkey', 'Kong', '$2a$10$PZAjHhOA0BU3pW9SLRKDoeVxSIN2IhpoPA/1BEuH4iw3kaGUJN1G.', 8, 8, 'dk@email.com', '2024-05-01', '2024-05-01'),
    (24, '4215551018', 'Kathy', 'Lee', '$2a$10$PZAjHhOA0BU3pW9SLRKDoeVxSIN2IhpoPA/1BEuH4iw3kaGUJN1G.', 16, 16, 'kathy.lee@email.com', '2024-01-09', '2024-01-23'),
    (25, '3215551019', 'Leo', 'Garcia', '$2a$10$PZAjHhOA0BU3pW9SLRKDoeVxSIN2IhpoPA/1BEuH4iw3kaGUJN1G.', 16, 16, 'leo.garcia@email.com', '2024-01-10', '2024-01-22'),
    (26, '4425551020', 'Josh', 'Weese', '$2a$10$PZAjHhOA0BU3pW9SLRKDoeVxSIN2IhpoPA/1BEuH4iw3kaGUJN1G.', 32, 32, 'josh.@email.com', '2024-01-11', '2024-01-29'),
    (27, '7455551021', 'Nathan', 'Bean', '$2a$10$PZAjHhOA0BU3pW9SLRKDoeVxSIN2IhpoPA/1BEuH4iw3kaGUJN1G.', 32, 32, 'nathan.kim@email.com', '2024-01-12', '2024-01-28');

/*
Insert Dummy Values into School Advisors Table
*/
INSERT INTO SchoolAdvisors
    (UserID, SchoolID, AdvisorStatusID)
VALUES
    (22, 181, 2),
    (22, 182, 1),
    (22, 183, 3),
    (23, 182, 2),
    (28, 228, 2),
    (28, 282, 2),
    (28, 174, 2);

/*
Insert Dummy Values into High School Students Table
*/
INSERT INTO HighSchoolStudents
    (StudentID, FirstName, LastName, SchoolID, Email, GradDate)
VALUES
    (14, 'Tim', 'Smith', 181, 't.smitty@school.com', '2025-05-30'),
    (15, 'Jordan', 'Clarkson', 181, 'j.c@school.com', '2025-05-30'),
    (16, 'Chris', 'Martin', 181, 'chris.martin@school.com', '2025-05-30'),
    (100, 'Ashleigh', 'Toddleson', 181, 'ashleigh.toddleson@school.com', '2025-05-30'),
    (120, 'Andrew', 'Clyde', 181, 'andrew.clyde@school.com', '2025-05-30'),
    (130, 'Rose', 'Potter', 181, 'rose.potter@school.com', '2025-05-30'),
    (140, 'Megan', 'Shrewt', 181, 'megan.shrewt@school.com', '2025-05-30'),
    (141, 'Grant', 'Grad', 181, 'grant.grad@school.com', '2023-05-30'),
    (17, 'Diana', 'Ross', 182, 'diana.ross@school.com', '2025-06-15'),
    (170, 'Matthew', 'Kinder', 182, 'matthew.kinder@school.com', '2025-06-15'),
    (180, 'Greg', 'Newman', 182, 'greg.newman@school.com', '2025-06-15'),
    (190, 'Galliard', 'Strauss', 182, 'galliard.strauss@school.com', '2025-06-15'),
    (200, 'Taylor', 'Lorry', 182, 'taylor.lorry@school.com', '2025-06-15'),
    (201, 'Greg', 'Grad', 182, 'greg.grad@school.com', '2023-05-30'),
    (202, 'Devan', 'Griffin', 228, 'devan.griffin@email.com', '2020-07-28'),
    (203, 'Casey', 'Ring', 228, 'casey.ring@email.com', '2025-05-28'),
    (204, 'Trent', 'Powell', 282, 'trent.powell@email.com', '2026-05-28'),
    (205, 'Devin', 'Richards', 174, 'devin.richards@email.com', '2027-12-28');


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
    (5, 181, 9, 'Acacia Coders', 1, 22, 1, '2024-01-15T08:00:00.000'),
    (6, 181, 9, 'Oak Coders', 1, 22, 2, '2024-01-15T08:00:00.000'),
    (7, 181, 9, 'Maple Coders', 2, 22, 1, '2024-01-15T08:00:00.000'),
    (8, 182, 7, 'Riverdale Hackers', 2, 23, 2, '2024-01-20T09:00:00.000');

/*
Insert Dummy Values Into Team Members
*/
INSERT INTO TeamMembers
    (StudentID, TeamID)
VALUES
    (14, 5),
    (15, 5),
    (130, 6),
    (140, 6),
    (16, 7),
    (100, 7),
    (17, 8),
    (170, 8);

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
INSERT INTO Articles
    (ArticleTitle,ArticleSubHeading,ArticleMessage,ArticleDate)
VALUES
('Work being done','Please do not disturb the engineers','Goodbye!','2022-2-18');