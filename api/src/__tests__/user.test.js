const {
    resetDatabase,
    closeConnection,
    createConnection,
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

describe("User Testing Suite", () => {
    const registerUser = async (body) => {
        const response = await request.post("/api/user/register").send(body);
        return response;
    };
    
    describe("/register", () => {
        it("should fail to register a volunteer", async () => {
            const body = {
                firstName: "John",
                lastName: "Doe",
                email: "johndoe@example.com",
                password: "secretpassword",
                requestLevel: 20,
            };
            const response = await registerUser(body);

            expect(response.statusCode).toBe(400);
            expect(response.text).toEqual("Invalid request level.");
        });

        it("should register a student", async () => {
            const body = {
                firstName: "John",
                lastName: "Doe",
                email: "johndoe@example.com",
                password: "secretpassword",
                requestLevel: 1,
                advisorEmail: "sroberts@gmail.com", // This is a valid advisor email
            };
            const response = await registerUser(body);
            expect(response.statusCode).toBe(201);
        });

        it('should register an advisor', async () => {
            const body = {
                firstName: "John",
                lastName: "Doe",
                email: "johndoe@example.com",
                password: "secretpassword",
                requestLevel: 60,
                schoolId: 3
            };
            const response = await registerUser(body);
            expect(response.statusCode).toBe(201);
        });

        it("should fail to register an invalid request level", async () => {
            const body = {
                firstName: "John",
                lastName: "Doe",
                email: "johndoe@example.com",
                password: "secretpassword",
                requestLevel: 53,
            };
            const response = await registerUser(body);
            expect(response.statusCode).toBe(400);
            expect(response.text).toEqual("Invalid request level.");
        });

        it("should fail to register a student with no advisor email", async () => {
            const body = {
                firstName: "John",
                lastName: "Doe",
                email: "johndoe@example.com",
                password: "secretpassword",
                requestLevel: 1,
            };
            const response = await registerUser(body);
            expect(response.statusCode).toBe(400);
            expect(response.text).toEqual(
                "Advisor email is required for students."
            );
        });

        it("should fail to a bad email", async () => {
            const body = {
                firstName: "John",
                lastName: "Doe",
                email: "bademail",
                password: "secretpassword",
                requestLevel: 1,
                advisorEmail: "sroberts@gmail.com"
            };

            const response = await registerUser(body);
            expect(response.statusCode).toBe(400);
            expect(response.text).toEqual("Invalid email format.");
        });

        // maybe have a per-user role request post-sign in, but should not go through normal registration pipeline
        it('should fail to register an @ksu.edu email', async () => {
            const body = {
                firstName: "John",
                lastName: "Doe",
                email: "johndoe@ksu.edu",
                password: "secretpassword",
                requestLevel: 1,
                advisorEmail: "sroberts@gmail.com"
            };

            const response = await registerUser(body);
            expect(response.statusCode).toBe(400);
            expect(response.text).toEqual("Invalid email format.");
        })
    });

    describe("/view", () => {
        it("should fetch all the users", async () => {
            const response = await request.get("/api/user/view");

            expect(response.error).toBe(false);
            const body = response._body;

            expect(body.length).toBeGreaterThan(0);
        });
    });

    describe("/viewteam", () => {
        it("should fetch the team by name", async () => {
            const response = await request.get("/api/user/viewteam").query({
                teamName: "Wild Cats",
            });

            expect(response.error).toBe(false);
            const body = response._body;

            expect(body.length).toBeGreaterThan(0);
            expect(body[0].email).toBe("jwerner@gmail.com");
        });
    });

    describe("/volunteers", () => {
        it("should fetch all volunteers", async () => {
            const response = await request.get("/api/user/volunteers");

            expect(response.error).toBe(false);
            const body = response._body;

            expect(body.length).toBeGreaterThan(0);
            expect(body[0].firstname).toBe("Nancy");
        });
    });
});
