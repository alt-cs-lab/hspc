const {
    resetDatabase,
    closeConnection,
    createConnection,
    login,
    timeoutSetup,
    getAdminToken
} = require("./testing_helpers");

timeoutSetup();

beforeAll(async () => await createConnection());
afterAll(async () => await closeConnection());
beforeEach(async () => await resetDatabase());

const supertest = require("supertest");
const app = require("../server");
const request = supertest(app);

// Users in the test database that already have outstanding upgrade requests
const defaultUpgrades = [
    {
        firstName: "Carl",
        lastName: "Schwarts",
        requestLevel: 20,
        accessLevel: 1,
        phone: null,
        email: "cschwarts@gmail.com"
    },
    {
        firstName: "Harry",
        lastName: "Potter",
        requestLevel: 20,
        accessLevel: 1,
        phone: null,
        email: "hpotter@outlook.com"
    },
    {
        firstName: "Tim",
        lastName: "Sharps",
        requestLevel: 60,
        accessLevel: 1,
        phone: null,
        email: "tsharps@gmail.com"
    }
]

describe("Upgrade Testing Suite", () => {
    
    describe("/view", () => {
        it ("should return 401 if not logged in", async () => {
            const response = await request.get("/api/upgrade/view");
            expect(response.statusCode).toBe(401);
        });

        it('should return 401 if not an admin', async () => {
            const response = await login('jcarter@gmail.com', 'password1234');
            const tokenString = response.body.token;
            const viewResponse = await request.get("/api/upgrade/view").set("Authorization", tokenString);
            expect(viewResponse.statusCode).toBe(401);
        });

        it("should return all outstanding upgrade requests", async () => {
            const viewResponse = await request.get("/api/upgrade/view").set("Authorization", getAdminToken());
            expect(viewResponse.statusCode).toBe(200)
            const responseUpgrades = JSON.parse(viewResponse.text);
            expect(responseUpgrades.length).toBe(defaultUpgrades.length);
            // compare the emails of the upgrades
            const responseEmails = responseUpgrades.map(upgrade => upgrade.email);
            const defaultEmails = defaultUpgrades.map(upgrade => upgrade.email);
            expect(responseEmails).toEqual(expect.arrayContaining(defaultEmails));
        })
    })

    describe("/accept", () => {

        it("should accept a valid upgrade request and return 200", async () => {
            const email = "cschwarts@gmail.com";
            const acceptResponse = await request.post("/api/upgrade/accept").set("Authorization", getAdminToken()).send({ email });
            expect(acceptResponse.statusCode).toBe(200);
            // check that Carl is no longer in the upgrade requests by calling /view 
            const viewResponse = await request.get("/api/upgrade/view").set("Authorization", getAdminToken());
            const responseUpgrades = JSON.parse(viewResponse.text);
            const rejectedUpgrade = responseUpgrades.find(
                upgrade => upgrade.email === "cschwarts@gmail.com"
            );
            expect(rejectedUpgrade).toBe(undefined);
        });

        it("should return 401 if not logged in ", async () => {
            const response = await request.post("/api/upgrade/accept").send({ email: "cschwarts@gmail.com", requestLevel: 20 });
            expect(response.statusCode).toBe(401);
        });
    
        it("should return 401 if not an admin", async () => {
            const response = await login("jcarter@gmail.com", "password1234");
            const tokenString = response.body.token;
            const acceptResponse = await request.post("/api/upgrade/accept").set("Authorization", tokenString).send({ email: "cschwarts@gmail.com", requestLevel: 20 });
            expect(acceptResponse.statusCode).toBe(401);
        });

        it("should return 400 if the email is absent", async () => {
            const requestLevel = 20;
            const acceptResponse = await request.post("/api/upgrade/accept").set("Authorization", getAdminToken()).send({ requestLevel });
            expect(acceptResponse.statusCode).toBe(400);
        });

    });

    describe("/reject", () => {
        it("should return 401 if not logged in", async () => {
            const response = await request.post("/api/upgrade/reject").send({
                email: "cschwarts@gmail.com"
            });
            expect(response.statusCode).toBe(401);
        });
    
        it("should return 401 if not an admin", async () => {
            const response = await login("jcarter@gmail.com", "password1234");
            const tokenString = response.body.token;
            const rejectResponse = await request
                .post("/api/upgrade/reject")
                .send({ email: "cschwarts@gmail.com" })
                .set("Authorization", tokenString);
            expect(rejectResponse.statusCode).toBe(401);
        });
    
        it("should successfully reject an upgrade request", async () => {
            const rejectResponse = await request
                .post("/api/upgrade/reject")
                .send({ email: "cschwarts@gmail.com" })
                .set("Authorization", getAdminToken());
            expect(rejectResponse.statusCode).toBe(200);
            const viewResponse = await request
                .get("/api/upgrade/view")
                .set("Authorization", getAdminToken());
            const responseUpgrades = JSON.parse(viewResponse.text);
            const rejectedUpgrade = responseUpgrades.find(
                upgrade => upgrade.email === "cschwarts@gmail.com"
            );
            expect(rejectedUpgrade).toBe(undefined);
        });
    
        it("should return 400 if email not provided", async () => {
            const rejectResponse = await request
                .post("/api/upgrade/reject")
                .send({})
                .set("Authorization", getAdminToken());
            expect(rejectResponse.statusCode).toBe(400);
        });
    });
});