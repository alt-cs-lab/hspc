const { resetDatabase, closeConnection, createConnection, login, timeoutSetup, getAdminToken, getAdvisorToken } = require("./testing_helpers");

timeoutSetup();

beforeAll(async () => await createConnection());
afterAll(async () => await closeConnection());
beforeEach(async () => await resetDatabase());

const supertest = require("supertest");
const app = require("../server");
const request = supertest(app);

const defaultTeams = [
    {
        teamId: 1,
        schoolId: 194,
        competitionId: 1,
        teamName: "Wild Cats",
        questionLevelId: 1,
        advisorId: 2,
        waitlisted: false,
        timeCreated: "2000-01-01T00:00:00.000Z",
    },
    {
        teamId: 2,
        schoolId: 137,
        competitionId: 1,
        teamName: "Mean Machines",
        questionLevelId: 1,
        advisorId: 4,
        waitlisted: false,
        timeCreated: "2000-01-01T00:00:00.000Z",
    },
    {
        teamId: 3,
        schoolId: 120,
        competitionId: 5,
        teamName: "Panthers",
        questionLevelId: 1,
        advisorId: 2,
        waitlisted: false,
        timeCreated: "2000-01-01T00:00:00.000Z",
    },
    {
        teamId: 4,
        schoolId: 164,
        competitionId: 6,
        teamName: "Tornados",
        questionLevelId: 2,
        advisorId: 2,
        waitlisted: false,
        timeCreated: "2000-01-01T00:00:00.000Z",
    },
    {
        teamId: 5,
        schoolId: 173,
        competitionId: 3,
        teamName: "Big Rigs",
        questionLevelId: 2,
        advisorId: 4,
        waitlisted: false,
        timeCreated: "2000-01-01T00:00:00.000Z",
    },
    {
        teamId: 6,
        schoolId: 180,
        competitionId: 6,
        teamName: "Test team please ignore",
        questionLevelId: 2,
        advisorId: 2,
        waitlisted: true,
        timeCreated: "2000-01-01T00:00:00.000Z",
    },
];

const defaultTeam1Response = [
    {
        teamId: 1,
        schoolId: 194,
        competitionId: 1,
        teamName: "Wild Cats",
        questionLevelId: 1,
        advisorId: 2,
        waitlisted: false,
        timeCreated: "2000-01-01T00:00:00.000Z",
        members: [
            {
                userId: 3,
                firstName: "Josh",
                lastName: "Werner",
                email: "jwerner@gmail.com",
            },
        ],
    },
];

describe("Team Testing Suite", () => {
    describe("get", () => {
        it("should return 401 if not logged in", async () => {
            const response = await request.get("/api/team");
            expect(response.statusCode).toBe(401);
        });

        it("should return 401 if user is not an admin or advisor", async () => {
            const response = await login("jcarter@gmail.com", "password1234");
            const tokenString = response.body.token;
            const viewResponse = await request.get("/api/team").set("Authorization", tokenString);
            expect(viewResponse.statusCode).toBe(401);
        });

        it("should return all teams if no query parameters are provided", async () => {
            const viewResponse = await request.get("/api/team").set("Authorization", getAdminToken());
            expect(viewResponse.statusCode).toBe(200);
            expect(viewResponse.body.length).toBe(defaultTeams.length);
        });

        it("should return teams filtered by schoolId", async () => {
            const viewResponse = await request
                .get("/api/team")
                .query({ schoolId: defaultTeams[0].schoolId })
                .set("Authorization", getAdminToken());
            expect(viewResponse.statusCode).toBe(200);
            expect(viewResponse.body.length).toBe(1);
        });

        it("should return teams filtered by competitionId", async () => {
            const viewResponse = await request
                .get("/api/team")
                .query({ competitionId: defaultTeams[0].competitionId })
                .set("Authorization", getAdminToken());
            expect(viewResponse.statusCode).toBe(200);
            expect(viewResponse.body.length).toBe(2);
        });

        it("should return teams filtered by questionLevelId", async () => {
            const viewResponse = await request
                .get("/api/team")
                .query({ questionLevelId: defaultTeams[0].questionLevelId })
                .set("Authorization", getAdminToken());
            expect(viewResponse.statusCode).toBe(200);
            expect(viewResponse.body.length).toBe(3);
        });

        it("should return team with given ID if teamId is provided", async () => {
            const viewResponse = await request
                .get(`/api/team?teamId=${defaultTeams[0].teamId}`)
                .set("Authorization", getAdminToken());
            expect(viewResponse.statusCode).toBe(200);
            expect(viewResponse.body[0]).toEqual(defaultTeam1Response[0]);
        });

        it("should return teams filters by waitlisted", async () => {
            const viewResponse = await request
                .get("/api/team")
                .query({ waitlisted: true })
                .set("Authorization", getAdminToken());
            expect(viewResponse.statusCode).toBe(200);
            expect(viewResponse.body.length).toBe(1);

            const viewResponse2 = await request
                .get("/api/team")
                .query({ waitlisted: false })
                .set("Authorization", getAdminToken());
            expect(viewResponse2.statusCode).toBe(200);
            expect(viewResponse2.body.length).toBe(5);
        });
    });

    describe("post", () => {
        it("should return 401 if not logged in", async () => {
            const response = await request.post("/api/team").send({
                teamName: "New Team",
                schoolId: 194,
                competitionId: 1,
                questionLevelId: 1,
                advisorId: 2,
            });
            expect(response.statusCode).toBe(401);
        });
        
        it("should return 401 if not advisor or admin", async () => {
            const response = await login('jcarter@gmail.com', 'password1234');
            const tokenString = response.body.token;
            const newTeamResponse = await request.post("/api/team").set("Authorization", tokenString).send({
                teamName: "New Team",
                schoolId: 194,
                competitionId: 1,
                questionLevelId: 1,
                advisorId: 2,
            });
            expect(newTeamResponse.statusCode).toBe(401);
        });
        
        it("should successfully create a new team when given valid data by an advisor", async () => {
            const newTeamResponse = await request.post("/api/team").set("Authorization", getAdvisorToken()).send({
                teamName: "New Team",
                schoolId: 194,
                competitionId: 1,
                questionLevelId: 2,
                advisorId: 2,
            });
            // expect teamId to be 7
            expect(newTeamResponse.statusCode).toBe(200);
            expect(newTeamResponse.body.teamId).toBe(7);
            // call get on team 7 and expect to get the same team back
            const getResponse = await request.get("/api/team").set("Authorization", getAdvisorToken());
            expect(getResponse.body.length).toBe(7);
            // check the last team is the new team
            expect(getResponse.body[6].teamName).toBe("New Team");
            expect(getResponse.body[6].schoolId).toBe(194);
            expect(getResponse.body[6].competitionId).toBe(1);
            expect(getResponse.body[6].questionLevelId).toBe(2);
            expect(getResponse.body[6].advisorId).toBe(2);
        });
        
        it("should fail to create a new team when given invalid data", async () => {
            const newTeamResponse = await request.post("/api/team").set("Authorization", getAdminToken()).send({
                teamName: "",
                schoolId: 194,
                competitionId: 1,
                questionLevelId: 1,
                advisorId: 2,
            });
            expect(newTeamResponse.statusCode).toBe(400);
        });

        it("should fail to create a new team for a school at max teams", async () => {
            const team = {
                teamName: "New Team",
                schoolId: 194,
                competitionId: 1,
                questionLevelId: 1,
                advisorId: 2,
            };
            const newTeamResponse = await request.post("/api/team").set("Authorization", getAdminToken()).send(team);
            // expect teamId to be 7
            expect(newTeamResponse.statusCode).toBe(200);
            expect(newTeamResponse.body.teamId).toBe(7);

            const newTeamResponse2 = await request.post("/api/team").set("Authorization", getAdminToken()).send(team);
            // expect teamId to be 8
            expect(newTeamResponse2.statusCode).toBe(200);
            expect(newTeamResponse2.body.teamId).toBe(8);

            // should not fail even though at max for competition 1 is 3 and 1 was already in the db but am an admin
            const newTeamResponse3 = await request.post("/api/team").set("Authorization", getAdminToken()).send(team);
            expect(newTeamResponse3.statusCode).toBe(200);
            expect(newTeamResponse3.body.teamId).toBe(9);

            // should fail because past max and not admin
            const newTeamResponse4 = await request.post("/api/team").set("Authorization", getAdvisorToken()).send(team);
            expect(newTeamResponse4.statusCode).toBe(400);

            // should succeed because waitlisted
            team.waitlisted = true;
            const newTeamResponse5 = await request.post("/api/team").set("Authorization", getAdvisorToken()).send(team);
            expect(newTeamResponse5.statusCode).toBe(200);
            expect(newTeamResponse5.body.teamId).toBe(10);
        });
    });

    describe("put", () => {
        it("should return 401 if not logged in", async () => {
            const response = await request.put("/api/team").send({
                teamId: 7,
                teamName: "Updated Team Name"
            });
            expect(response.statusCode).toBe(401);
        });
    
        it("should return 401 if not advisor or admin", async () => {
            const response = await login('jcarter@gmail.com', 'password1234');
            const tokenString = response.body.token;
            const updatedTeamResponse = await request.put("/api/team").set("Authorization", tokenString).send({
                teamId: 7,
                teamName: "Updated Team Name"
            });
            expect(updatedTeamResponse.statusCode).toBe(401);
        });
    
        it("should successfully update an existing team when given valid data by an advisor", async () => {
            const updatedTeamResponse = await request.put("/api/team").set("Authorization", getAdvisorToken()).send({
                teamId: 6,
                teamName: "Updated Team Name"
            });
            expect(updatedTeamResponse.statusCode).toBe(200);
    
            // call get on team 6 and expect to get the updated team back
            const getResponse = await request.get("/api/team?teamId=6").set("Authorization", getAdvisorToken());
            const team = JSON.parse(getResponse.text);
            expect(team[0].teamName).toBe("Updated Team Name");
        });
    
        it("should fail to update an existing team when given invalid data", async () => {
            const updatedTeamResponse = await request.put("/api/team").set("Authorization", getAdminToken()).send({
                teamId: 6,
                teamName: ""
            });
            expect(updatedTeamResponse.statusCode).toBe(400);
        });
    
        it("should fail to update a non-existing team", async () => {
            const updatedTeamResponse = await request.put("/api/team/99").set("Authorization", getAdminToken()).send({
                teamName: "Updated Team Name"
            });
            expect(updatedTeamResponse.statusCode).toBe(404);
        });

        it("should fail to update a team for a school at max teams", async () => {
            const team = {
                teamName: "New Team",
                schoolId: 194,
                competitionId: 1,
                questionLevelId: 1,
                advisorId: 2,
            };
            const newTeamResponse = await request.post("/api/team").set("Authorization", getAdminToken()).send(team);
            // expect teamId to be 7
            expect(newTeamResponse.statusCode).toBe(200);
            expect(newTeamResponse.body.teamId).toBe(7);

            const newTeamResponse2 = await request.post("/api/team").set("Authorization", getAdminToken()).send(team);
            // expect teamId to be 8
            expect(newTeamResponse2.statusCode).toBe(200);
            expect(newTeamResponse2.body.teamId).toBe(8);

            // should not fail even though at max for competition 1 is 3 and 1 was already in the db but am an admin
            const newTeamResponse3 = await request.post("/api/team").set("Authorization", getAdminToken()).send(team);
            expect(newTeamResponse3.statusCode).toBe(200);
            expect(newTeamResponse3.body.teamId).toBe(9);

            // should fail because past max and not admin
            const newTeamResponse4 = await request.post("/api/team").set("Authorization", getAdvisorToken()).send(team);
            expect(newTeamResponse4.statusCode).toBe(400);

            // should succeed because waitlisted
            team.waitlisted = true;
            const newTeamResponse5 = await request.post("/api/team").set("Authorization", getAdvisorToken()).send(team);
            expect(newTeamResponse5.statusCode).toBe(200);
            expect(newTeamResponse5.body.teamId).toBe(10);

            // should fail because past max and not admin
            const updatedTeamResponse = await request.put("/api/team").set("Authorization", getAdvisorToken()).send({
                teamId: 10,
                waitlisted: false,
            });
            expect(updatedTeamResponse.statusCode).toBe(400);
            
            // should succeed because now admin
            const updatedTeamResponse2 = await request.put("/api/team").set("Authorization", getAdminToken()).send({
                teamId: 10,
                waitlisted: true,
            });
            expect(updatedTeamResponse2.statusCode).toBe(200);
        });
    });

    describe("delete", () => {
        it("should return 401 if not logged in", async () => {
            const response = await request.delete("/api/team?teamId=6");
            expect(response.statusCode).toBe(401);
        });
    
        it("should return 401 if not advisor or admin", async () => {
            const response = await login('jcarter@gmail.com', 'password1234');
            const tokenString = response.body.token;
            const deleteTeamResponse = await request.delete("/api/team?teamId=6").set("Authorization", tokenString);
            expect(deleteTeamResponse.statusCode).toBe(401);
        });
    
        it("should successfully delete an existing team when called by an advisor", async () => {
            const deleteTeamResponse = await request.delete("/api/team").set("Authorization", getAdminToken()).send({
                teamId: 6
            });
            expect(deleteTeamResponse.statusCode).toBe(200);
    
            // call get on team 6 and expect to get an empty array
            const getResponse = await request.get("/api/team?teamId=6").set("Authorization", getAdminToken());
            const team = JSON.parse(getResponse.text);
            expect(team).toHaveLength(0);
        });
    
        it("should fail to delete a non-existing team", async () => {
            const deleteTeamResponse = await request.delete("/api/team?teamId=99").set("Authorization", getAdminToken());
            expect(deleteTeamResponse.statusCode).toBe(400);
        });

        it("should delete just the student from the team if studentId is passed in", async () => {
            // delete student with userId 3 from team 1
            const deleteStudentResponse = await request.delete("/api/team").set("Authorization", getAdminToken()).send({
                teamId: 1,
                studentId: 3
            });
            expect(deleteStudentResponse.statusCode).toBe(200);
            // check that student with userId 3 is no longer on team 1
            const getResponse = await request.get("/api/team?teamId=1").set("Authorization", getAdminToken());
            expect(getResponse.statusCode).toBe(200);
            const team = JSON.parse(getResponse.text);
            // expect there to not be a students array
            expect(team[0].students).toBeUndefined();
        });
    });
    
});
