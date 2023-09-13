const { resetDatabase, closeConnection, createConnection, login, timeoutSetup, getAdminToken } = require("./testing_helpers");

beforeAll(async () => await createConnection());
afterAll(async () => await closeConnection());
beforeEach(async () => await resetDatabase());

timeoutSetup();

const supertest = require("supertest");
const app = require("../server");
const request = supertest(app);

const defaultEvents =[
    {
        "name": "HSPC",
        "id": 1,
        "location": "Kansas State University",
        "date": "2022-10-6",
        "time": "08:30",
        "teamsPerSchool": 3,
        "teamsPerEvent": 50,
        "description": "High School Programming Competition"
    },
    {
        "name": "MLH Competition",
        "id": 2,
        "location": "Hutchinson Community College",
        "date": "2022-6-5",
        "time": "10:30",
        "teamsPerSchool": 2,
        "teamsPerEvent": 50,
        "description": "Major League Hacking Competition"
    },
    {
        "name": "MLH",
        "id": 3,
        "location": "Wichita State University",
        "date": "2022-5-11",
        "time": "11:30",
        "teamsPerSchool": 2,
        "teamsPerEvent": 50,
        "description": "MLH Programming Competition"
    },
    {
        "name": "Who Cares",
        "id": 4,
        "location": "Kansas University",
        "date": "2022-7-13",
        "time": "09:30",
        "teamsPerSchool": 5,
        "teamsPerEvent": 50,
        "description": "Programming Competition"
    },
    {
        "name": "Test Event One",
        "id": 5,
        "location": "Somewhere",
        "date": "2022-5-12",
        "time": "08:45",
        "teamsPerSchool": 1,
        "teamsPerEvent": 5,
        "description": "Test programming competition"
    },
    {
        "name": "Test Event Two",
        "id": 6,
        "location": "Somewhere",
        "date": "2022-6-8",
        "time": "13:30",
        "teamsPerSchool": 2,
        "teamsPerEvent": 10,
        "description": "Test programming competition"
    }
]

describe("Event Testing Suite", () => {

    describe("/view", () => {
        it("should return all events", async () => {
            const response = await request.get("/api/event/view");
            expect(response.statusCode).toBe(200);
            const events = JSON.parse(response.text);
            expect(events.length).toBe(defaultEvents.length);
            // compare the names of the events
            const eventNames = events.map(event => event.eventname);
            const defaultEventNames = defaultEvents.map(event => event.eventname);
            expect(eventNames).toEqual(expect.arrayContaining(defaultEventNames));
        });
    });
    
    describe("/create", () => {

        it("should return 401 if not logged in", async () => {
            const response = await request.post("/api/event/create");
            expect(response.statusCode).toBe(401);
        });
        
        it('should return 401 if not an admin', async () => {
            const response = await login('jcarter@gmail.com', 'password1234');
            const tokenString = response.body.token;
            const viewResponse = await request.get("/api/upgrade/view").set("Authorization", tokenString);
            expect(viewResponse.statusCode).toBe(401);
        });

        it("should return 400 if missing event details", async () => {
            const createResponse = await request.post("/api/event/create").set("Authorization", getAdminToken());
            expect(createResponse.statusCode).toBe(400);
        });

        it("should create a new event and return 200", async () => {
            const eventDetails = {
                name: "Created Test Event",
                description: "This is a newly test event",
                date: "2022-12-25",
                time: "12:00:00",
                location: "Test Location",
                teamsPerSchool: 2
            };
            const createResponse = await request.post("/api/event/create").set("Authorization", getAdminToken()).send(eventDetails);
            expect(createResponse.statusCode).toBe(201);
            const viewResponse = await request.get("/api/event/view").set("Authorization", getAdminToken());
            expect(viewResponse.statusCode).toBe(200);
            const responseEvents = JSON.parse(viewResponse.text);
            const newEvent = responseEvents.find(event => event.name === "Created Test Event");
            expect(newEvent).toBeTruthy();
        });
    });
});
