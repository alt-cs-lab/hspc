const {
    resetDatabase,
    closeConnection,
    createConnection,
    login,
    timeoutSetup,
    getAdminToken,
} = require("./testing_helpers");

timeoutSetup();

beforeAll(async () => await createConnection());
afterAll(async () => await closeConnection());
beforeEach(async () => await resetDatabase());

const supertest = require("supertest");
const app = require("../server");
const request = supertest(app);

// Users in the test database that already have outstanding upgrade requests
const defaultAssignments = [
    {
        "assignmentId": 1,
        "eventId": 1,
        "volunteerId": 9,
        "approved": true,
        "timeAssigned": "2000-01-01T00:00:00.000Z"
    },
    {
        "assignmentId": 2,
        "eventId": 2,
        "volunteerId": 9,
        "approved": false,
        "timeAssigned": "2000-01-01T00:00:00.000Z"
    },
    {
        "assignmentId": 3,
        "eventId": 1,
        "volunteerId": 10,
        "approved": true,
        "timeAssigned": "2000-01-01T00:00:00.000Z"
    },
    {
        "assignmentId": 4,
        "eventId": 2,
        "volunteerId": 10,
        "approved": false,
        "timeAssigned": "2000-01-01T00:00:00.000Z"
    },
    {
        "assignmentId": 5,
        "eventId": 1,
        "volunteerId": 11,
        "approved": true,
        "timeAssigned": "2000-01-01T00:00:00.000Z"
    },
    {
        "assignmentId": 6,
        "eventId": 2,
        "volunteerId": 11,
        "approved": false,
        "timeAssigned": "2000-01-01T00:00:00.000Z"
    }
]

const defaultJudgeAssignments = [
    {
        "assignmentId": 1,
        "eventId": 1,
        "volunteerId": 9,
        "approved": true,
        "timeAssigned": "2000-01-01T00:00:00.000Z",
        "judgeAssignmentId": 1,
        "judgeTimeAssigned": "2000-01-01T00:00:00.000Z",
        "judgeApproved": true
    },
    {
        "assignmentId": 2,
        "eventId": 2,
        "volunteerId": 9,
        "approved": false,
        "timeAssigned": "2000-01-01T00:00:00.000Z",
        "judgeAssignmentId": 2,
        "judgeTimeAssigned": "2000-01-01T00:00:00.000Z",
        "judgeApproved": false
    },
    {
        "assignmentId": 3,
        "eventId": 1,
        "volunteerId": 10,
        "approved": true,
        "timeAssigned": "2000-01-01T00:00:00.000Z",
        "judgeAssignmentId": 3,
        "judgeTimeAssigned": "2000-01-01T00:00:00.000Z",
        "judgeApproved": true
    },
    {
        "assignmentId": 4,
        "eventId": 2,
        "volunteerId": 10,
        "approved": false,
        "timeAssigned": "2000-01-01T00:00:00.000Z",
        "judgeAssignmentId": 4,
        "judgeTimeAssigned": "2000-01-01T00:00:00.000Z",
        "judgeApproved": false
    },
    {
        "assignmentId": 5,
        "eventId": 1,
        "volunteerId": 11,
        "approved": true,
        "timeAssigned": "2000-01-01T00:00:00.000Z",
        "judgeAssignmentId": 5,
        "judgeTimeAssigned": "2000-01-01T00:00:00.000Z",
        "judgeApproved": true
    },
    {
        "assignmentId": 6,
        "eventId": 2,
        "volunteerId": 11,
        "approved": false,
        "timeAssigned": "2000-01-01T00:00:00.000Z",
        "judgeAssignmentId": 6,
        "judgeTimeAssigned": "2000-01-01T00:00:00.000Z",
        "judgeApproved": false
    }
]

describe("Assignments Testing Suite", () => {
    
    describe("get", () => {
        it ("should return 401 if not logged in", async () => {
            const response = await request.get("/api/assignments");
            expect(response.statusCode).toBe(401);
        });

        it('should return 401 if not an admin and does not pass volunteerId', async () => {
            const response = await login('jcarter@gmail.com', 'password1234');
            const tokenString = response.body.token;
            const viewResponse = await request.get("/api/assignments").set("Authorization", tokenString);
            expect(viewResponse.statusCode).toBe(401);
        });

        it("should return all volunteer assignments", async () => {
            const response = await login('dm@gmail.com', 'password1234');
            const tokenString = response.body.token;
            const viewResponse = await request.get("/api/assignments").set("Authorization", tokenString);
            expect(viewResponse.statusCode).toBe(200)
            const responseAssignments = JSON.parse(viewResponse.text);
            // expect the response to be the same as the default assignments
            expect(responseAssignments.length).toBe(defaultAssignments.length);
            expect(responseAssignments).toEqual(defaultAssignments);

        });

        it("should return a volunteer's assignments", async () => {
            const response = await login('rlegends@gmail.com', 'password1234');
            const tokenString = response.body.token;
            // should use the id in the token to get the volunteer's assignments
            const viewResponse = await request.get("/api/assignments").set("Authorization", tokenString);
            // expect no error
            expect(viewResponse.error).toBe(false);
            expect(viewResponse.statusCode).toBe(200)
            const responseAssignments = JSON.parse(viewResponse.text);
            // each value in defaultAssignments should be in responseAssignments
            expect(responseAssignments.length).toBe(2);
            expect(responseAssignments[0].assignmentId).toBe(defaultAssignments[0].assignmentId);
            expect(responseAssignments[0].eventId).toBe(defaultAssignments[0].eventId);
            expect(responseAssignments[0].volunteerId).toBe(defaultAssignments[0].volunteerId);
            expect(responseAssignments[0].approved).toBe(defaultAssignments[0].approved);
            expect(responseAssignments[0].timeAssigned).toBe(defaultAssignments[0].timeAssigned);
            expect(responseAssignments[1].assignmentId).toBe(defaultAssignments[1].assignmentId);
            expect(responseAssignments[1].eventId).toBe(defaultAssignments[1].eventId);
            expect(responseAssignments[1].volunteerId).toBe(defaultAssignments[1].volunteerId);
            expect(responseAssignments[1].approved).toBe(defaultAssignments[1].approved);
            expect(responseAssignments[1].timeAssigned).toBe(defaultAssignments[1].timeAssigned);

        });

        it('should retrieve all judge assignments', async () => {
            const response = await login('dm@gmail.com', 'password1234');
            const tokenString = response.body.token;
            const viewResponse = await request.get("/api/assignments").set("Authorization", tokenString).query({judgeAssignments: true});
            expect(viewResponse.error).toBe(false);
            expect(viewResponse.statusCode).toBe(200);
            const responseAssignments = JSON.parse(viewResponse.text);
            expect(responseAssignments.length).toBe(defaultJudgeAssignments.length);
            // each value in defaultAssignments should be in responseAssignments
            for (let i = 0; i < defaultJudgeAssignments.length; i++) {
                expect(responseAssignments[i].assignmentId).toBe(defaultJudgeAssignments[i].assignmentId);
                expect(responseAssignments[i].eventId).toBe(defaultJudgeAssignments[i].eventId);
                expect(responseAssignments[i].volunteerId).toBe(defaultJudgeAssignments[i].volunteerId);
                expect(responseAssignments[i].approved).toBe(defaultJudgeAssignments[i].approved);
                expect(responseAssignments[i].timeAssigned).toBe(defaultJudgeAssignments[i].timeAssigned);
                expect(responseAssignments[i].judgeAssignmentId).toBe(defaultJudgeAssignments[i].judgeAssignmentId);
                expect(responseAssignments[i].judgeTimeAssigned).toBe(defaultJudgeAssignments[i].judgeTimeAssigned);
                expect(responseAssignments[i].judgeApproved).toBe(defaultJudgeAssignments[i].judgeApproved);
            }
        });

        it('should retrieve a volunteer\'s judge assignments', async () => {
            const response = await login('rlegends@gmail.com', 'password1234');
            const tokenString = response.body.token;
            const viewResponse = await request.get("/api/assignments").set("Authorization", tokenString).query({judgeAssignments: true});
            expect(viewResponse.error).toBe(false);
            expect(viewResponse.statusCode).toBe(200);
            const responseAssignments = JSON.parse(viewResponse.text);
            expect(responseAssignments.length).toBe(2);
            // each value in defaultAssignments should be in responseAssignments
            for (let i = 0; i < responseAssignments.length; i++) {
                expect(responseAssignments[i].assignmentId).toBe(defaultJudgeAssignments[i].assignmentId);
                expect(responseAssignments[i].eventId).toBe(defaultJudgeAssignments[i].eventId);
                expect(responseAssignments[i].volunteerId).toBe(defaultJudgeAssignments[i].volunteerId);
                expect(responseAssignments[i].approved).toBe(defaultJudgeAssignments[i].approved);
                expect(responseAssignments[i].timeAssigned).toBe(defaultJudgeAssignments[i].timeAssigned);
                expect(responseAssignments[i].judgeAssignmentId).toBe(defaultJudgeAssignments[i].judgeAssignmentId);
                expect(responseAssignments[i].judgeTimeAssigned).toBe(defaultJudgeAssignments[i].judgeTimeAssigned);
                expect(responseAssignments[i].judgeApproved).toBe(defaultJudgeAssignments[i].judgeApproved);
            }
        });
    })

    describe("create", () => {
        it ("should return 401 if not logged in", async () => {
            const response = await request.post("/api/assignments");
            expect(response.statusCode).toBe(401);
        });

        it('should return 401 if not an admin and does not pass volunteerId', async () => {
            const response = await login('jcarter@gmail.com', 'password1234');
            const tokenString = response.body.token;
            const viewResponse = await request.post("/api/assignments").set("Authorization", tokenString);
            expect(viewResponse.statusCode).toBe(401);
        });

        it("should create a new approved assignment", async () => {
            const response = await login('dm@gmail.com', 'password1234');
            const tokenString = response.body.token;
            const newAssignment = {
                "eventId": 1,
                "volunteerId": 11
            }
            const createResponse = await request.post("/api/assignments").set("Authorization", tokenString).send(newAssignment);
            expect(createResponse.error).toBe(false);
            expect(createResponse.statusCode).toBe(200);
            const responseAssignment = JSON.parse(createResponse.text);
            // /create returns all properties of the assignment, but we can't know the timeAssigned
            expect(responseAssignment.assignmentId).toBe(defaultAssignments.length+1);
            expect(responseAssignment.approved).toBe(true);
            expect(responseAssignment.eventId).toBe(newAssignment.eventId);
            expect(responseAssignment.volunteerId).toBe(newAssignment.volunteerId);
        
            // check that the assignment was added to the database
            const viewResponse = await request.get("/api/assignments").set("Authorization", tokenString);
            expect(viewResponse.error).toBe(false);
            expect(viewResponse.statusCode).toBe(200)
            const responseAssignments = JSON.parse(viewResponse.text);
            const newLength = defaultAssignments.length + 1;
            expect(responseAssignments.length).toBe(newLength);
            // check that the new assignment is in the response, manually verify each property except timeAssigned
            expect(responseAssignments[newLength-1].assignmentId).toBe(newLength);
            expect(responseAssignments[newLength-1].approved).toBe(true);
            expect(responseAssignments[newLength-1].eventId).toBe(newAssignment.eventId);
            expect(responseAssignments[newLength-1].volunteerId).toBe(newAssignment.volunteerId);
        });

        it("should create a new unapproved assignment", async () => {
            const response = await login('rlegends@gmail.com', 'password1234');
            const tokenString = response.body.token;
            const newAssignment = {
                "eventId": 1
            }
            const createResponse = await request.post("/api/assignments").set("Authorization", tokenString).send(newAssignment);
            expect(createResponse.error).toBe(false);
            expect(createResponse.statusCode).toBe(200);
            const responseAssignment = JSON.parse(createResponse.text);
            // /create returns all properties of the assignment, but we can't know the timeAssigned
            expect(responseAssignment.assignmentId).toBe(defaultAssignments.length+1);
            expect(responseAssignment.approved).toBe(false);
            expect(responseAssignment.eventId).toBe(newAssignment.eventId);
            expect(responseAssignment.volunteerId).toBe(9);

            // check that the assignment was added to the database
            const viewResponse = await request.get("/api/assignments").set("Authorization", tokenString);
            expect(viewResponse.error).toBe(false);
            expect(viewResponse.statusCode).toBe(200)
            const responseAssignments = JSON.parse(viewResponse.text);
            // as a volunteer we do not see all assignments, just the default ones associated with our userId
            expect(responseAssignments.length).toBe(3); // 2 initial and 1 newly created
        });

        // same tests as above, but for judge assignments
        it("should create a new approved judge assignment", async () => {
            const response = await login('dm@gmail.com', 'password1234');
            const tokenString = response.body.token;
            const newAssignment = {
                "eventId": 1,
                "volunteerId": 11,
                "volunteerAssignmentId": 1
            }
            const createResponse = await request.post("/api/assignments").set("Authorization", tokenString).send(newAssignment).query({judgeAssignments: true});
            expect(createResponse.error).toBe(false);
            expect(createResponse.statusCode).toBe(200);
            const responseAssignment = JSON.parse(createResponse.text);
            // /create returns all properties of the assignment, but we can't know the timeAssigned
            expect(responseAssignment.assignmentId).toBe(defaultJudgeAssignments.length+1);
            expect(responseAssignment.volunteerAssignmentId).toBe(newAssignment.volunteerAssignmentId);
            expect(responseAssignment.approved).toBe(true);

            // check that the assignment was added to the database
            const viewResponse = await request.get("/api/assignments").set("Authorization", tokenString).query({judgeAssignments: true});
            expect(viewResponse.error).toBe(false);
            expect(viewResponse.statusCode).toBe(200)
            const responseAssignments = JSON.parse(viewResponse.text);
            expect(responseAssignments.length).toBe(defaultJudgeAssignments.length + 1);
        });

        it("should create a new unapproved judge assignment", async () => {
            const response = await login('rlegends@gmail.com', 'password1234');
            const tokenString = response.body.token;
            const newAssignment = {
                "eventId": 1,
                "volunteerAssignmentId": 1
            }
            const createResponse = await request.post("/api/assignments").set("Authorization", tokenString).send(newAssignment).query({judgeAssignments: true});
            expect(createResponse.error).toBe(false);
            expect(createResponse.statusCode).toBe(200);
            const responseAssignment = JSON.parse(createResponse.text);
            // /create returns all properties of the assignment, but we can't know the timeAssigned
            expect(responseAssignment.assignmentId).toBe(defaultJudgeAssignments.length+1);
            expect(responseAssignment.volunteerAssignmentId).toBe(newAssignment.volunteerAssignmentId);
            expect(responseAssignment.approved).toBe(false);
            
            // check that the assignment was added to the database
            const viewResponse = await request.get("/api/assignments").set("Authorization", tokenString).query({judgeAssignments: true});
            expect(viewResponse.error).toBe(false);
            expect(viewResponse.statusCode).toBe(200)
            const responseAssignments = JSON.parse(viewResponse.text);
            // as a volunteer we do not see all assignments, just the default ones associated with our userId
            expect(responseAssignments.length).toBe(3); // 2 initial and 1 newly created
        });
    });

    describe("put", () => {
        it ("should return 401 if not logged in", async () => {
            const response = await request.put("/api/assignments");
            expect(response.statusCode).toBe(401);
        });

        it('should return 401 if not an admin and does not pass volunteerId', async () => {
            const response = await login('jcarter@gmail.com', 'password1234');
            const tokenString = response.body.token;
            const viewResponse = await request.put("/api/assignments").set("Authorization", tokenString);
            expect(viewResponse.statusCode).toBe(401);
        });

        it('should approve an assignment', async () => {
            const response = await login('dm@gmail.com', 'password1234');
            const tokenString = response.body.token;
            // the second default assignment is not approved
            const assignmentId = 2;
            const approveResponse = await request.put("/api/assignments").set("Authorization", tokenString).send({volunteerAssignmentId: assignmentId, approved: true});
            expect(approveResponse.error).toBe(false);
            expect(approveResponse.statusCode).toBe(200);
            // check that the assignment was updated in the database
            const viewResponse = await request.get("/api/assignments").set("Authorization", tokenString);
            expect(viewResponse.error).toBe(false);
            expect(viewResponse.statusCode).toBe(200)
            const responseAssignments = JSON.parse(viewResponse.text);
            expect(responseAssignments.length).toBe(defaultAssignments.length);
            // the second default assignment should now be approved
            expect(responseAssignments[1].approved).toBe(true);
        });

        it('should not error when approving an already approved assignment', async () => {
            const response = await login('dm@gmail.com', 'password1234');
            const tokenString = response.body.token;
            // the first default assignment is approved
            const assignmentId = 1;
            const approveResponse = await request.put("/api/assignments").set("Authorization", tokenString).send({volunteerAssignmentId: assignmentId, approved: true});
            expect(approveResponse.error).toBe(false);
            expect(approveResponse.statusCode).toBe(200);
           
            // check that the assignment was not changed in the database
            const viewResponse = await request
                .get("/api/assignments")
                .set("Authorization", tokenString)
                .query({ eventId: 1, volunteerId: 9, approved: true });
            expect(viewResponse.error).toBe(false);
            expect(viewResponse.statusCode).toBe(200)
            const responseAssignments = JSON.parse(viewResponse.text);
            expect(responseAssignments.length).toBe(1);
            // the first default assignment should still be approved
            expect(responseAssignments[0].assignmentId).toBe(assignmentId);
        });

        it('should unapprove an assignment', async () => {
            const response = await login('dm@gmail.com', 'password1234');
            const tokenString = response.body.token;
            // the first default assignment is approved
            const assignmentId = 1;
            const approveResponse = await request.put("/api/assignments").set("Authorization", tokenString).send({volunteerAssignmentId: assignmentId, approved: false});
            expect(approveResponse.error).toBe(false);
            expect(approveResponse.statusCode).toBe(200);
            // check that the assignment was updated in the database
            const viewResponse = await request.get("/api/assignments").set("Authorization", tokenString);
            expect(viewResponse.error).toBe(false);
            expect(viewResponse.statusCode).toBe(200)
            const responseAssignments = JSON.parse(viewResponse.text);
            expect(responseAssignments.length).toBe(defaultAssignments.length);
            // the first default assignment should now be unapproved
            expect(responseAssignments[0].approved).toBe(false);
        });

        it('Should allow approving and unapproving of Judge Assignments', async () => {
            const response = await login('dm@gmail.com', 'password1234');
            const tokenString = response.body.token;
            // the first default judge assignment is approved
            const judgeAssignmentId = 1;
            const approveResponse = await request.put("/api/assignments").set("Authorization", tokenString).send({judgeAssignmentId: judgeAssignmentId, approved: false});
            expect(approveResponse.error).toBe(false);
            expect(approveResponse.statusCode).toBe(200);
            // approve the second default judge assignment
            const judgeAssignmentId2 = 2;
            await request.put("/api/assignments").set("Authorization", tokenString).send({judgeAssignmentId: judgeAssignmentId2, approved: true});
            
            // check that the assignment was updated in the database
            const viewResponse = await request.get("/api/assignments").set("Authorization", tokenString).query({judgeAssignments: true});
            expect(viewResponse.error).toBe(false);
            expect(viewResponse.statusCode).toBe(200)
            const responseAssignments = JSON.parse(viewResponse.text);
            expect(responseAssignments.length).toBe(defaultJudgeAssignments.length);
            // order is not guaranteed, so we have to find the assignment we want
            const assignment = responseAssignments.find(a => a.judgeAssignmentId === judgeAssignmentId);
            const assignment2 = responseAssignments.find(a => a.judgeAssignmentId === judgeAssignmentId2);
            // check assignments were found
            expect(assignment).toBeDefined();
            expect(assignment2).toBeDefined();
            expect(assignment.judgeApproved).toBe(false);
            expect(assignment2.judgeApproved).toBe(true);
        });
    });

    describe("delete", () => {
        it ("should return 401 if not logged in", async () => {
            const response = await request.delete("/api/assignments");
            expect(response.statusCode).toBe(401);
        });

        it('should return 401 if not a volunteer', async () => {
            // login as a student
            const response = await login('jwerner@gmail.com', 'password1234');
            const tokenString = response.body.token;
            const viewResponse = await request.get("/api/assignments").set("Authorization", tokenString);
            expect(viewResponse.statusCode).toBe(401);
        });

        it('should delete an assignment as an admin', async () => {
            const response = await login('dm@gmail.com', 'password1234');
            const tokenString = response.body.token;
            const deleteResponse = await request.delete("/api/assignments").set("Authorization", tokenString).send({volunteerAssignmentId: 1});
            expect(deleteResponse.error).toBe(false);
            expect(deleteResponse.statusCode).toBe(200);
            // check that the assignment was deleted in the database
            const viewResponse = await request.get("/api/assignments").set("Authorization", tokenString);
            expect(viewResponse.error).toBe(false);
            expect(viewResponse.statusCode).toBe(200)
            const responseAssignments = JSON.parse(viewResponse.text);
            expect(responseAssignments.length).toBe(defaultAssignments.length - 1);
        });

        it('should delete an assignment as a volunteer', async () => {
            const response = await login('rlegends@gmail.com', 'password1234');
            const tokenString = response.body.token;
            const deleteResponse = await request.delete("/api/assignments").set("Authorization", tokenString).send({volunteerAssignmentId: 1});
            expect(deleteResponse.error).toBe(false);
            expect(deleteResponse.statusCode).toBe(200);
            // check that the assignment was deleted in the database
            const viewResponse = await request.get("/api/assignments").set("Authorization", tokenString);
            expect(viewResponse.error).toBe(false);
            expect(viewResponse.statusCode).toBe(200)
            const responseAssignments = JSON.parse(viewResponse.text);
            // this volunteer started with 2 assignments, and deleted one, get only returns their assignments
            expect(responseAssignments.length).toBe(1);
        });

        it('should not delete an assignment as a volunteer if not assigned to it', async () => {
            const response = await login('rlegends@gmail.com', 'password1234');
            const tokenString = response.body.token;
            const deleteResponse = await request.delete("/api/assignments").set("Authorization", tokenString).send({volunteerAssignmentId: 3});
            // should get an error (not toBe(false))
            expect(deleteResponse.error).not.toBe(false);
            expect(deleteResponse.statusCode).toBe(400);
        });

        it('should delete a judge assignment as an admin', async () => {
            const response = await login('dm@gmail.com', 'password1234');
            const tokenString = response.body.token;
            const deleteResponse = await request.delete("/api/assignments").set("Authorization", tokenString).send({judgeAssignmentId: 1});
            expect(deleteResponse.error).toBe(false);
            expect(deleteResponse.statusCode).toBe(200);
            // check that the assignment was deleted in the database
            const viewResponse = await request.get("/api/assignments").set("Authorization", tokenString).query({judgeAssignments: true});
            expect(viewResponse.error).toBe(false);
            expect(viewResponse.statusCode).toBe(200)
            const responseAssignments = JSON.parse(viewResponse.text);
            expect(responseAssignments.length).toBe(defaultJudgeAssignments.length - 1);
        });

        it('should delete a judge assignment as a volunteer', async () => {
            const response = await login('rlegends@gmail.com', 'password1234');
            const tokenString = response.body.token;
            const deleteResponse = await request.delete("/api/assignments").set("Authorization", tokenString).send({judgeAssignmentId: 1});
            expect(deleteResponse.error).toBe(false);
            expect(deleteResponse.statusCode).toBe(200);
            // check that the assignment was deleted in the database
            const viewResponse = await request.get("/api/assignments").set("Authorization", tokenString).query({judgeAssignments: true});
            expect(viewResponse.error).toBe(false);
            expect(viewResponse.statusCode).toBe(200)
            const responseAssignments = JSON.parse(viewResponse.text);
            expect(responseAssignments.length).toBe(1);
        });
    });
});