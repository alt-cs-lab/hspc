const {
    resetDatabase,
    closeConnection,
    createConnection,
    login,
    getMasterToken,
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

const firstSeveralDefaultSchools = [
    {
        "id": 1,
        "name": "500 Reach",
        "addressLine1": "7704 Parallel Pkwy",
        "addressLine2": '',
        "city": "Kansas City ",
        "state": "KS",
        "postalCode": 66112,
        "usdCode": "500"
    },
    {
        "id": 2,
        "name": "Abilene High School",
        "addressLine1": "1300 N Cedar St",
        "addressLine2": '',
        "city": "Abilene ",
        "state": "KS",
        "postalCode": 67410,
        "usdCode": "435"
    },
    {
        "id": 3,
        "name": "Abilene Virtual School",
        "addressLine1": "213 N Broadway",
        "addressLine2": '',
        "city": "Abilene ",
        "state": "KS",
        "postalCode": 67410,
        "usdCode": "435"
    }
];

describe('School Testing Suite', () => {
    describe('/create', () => {
        it('should return 401 if not logged in', async () => {
			const response = await request.post('/api/news/create');
			expect(response.statusCode).toBe(401);
		});
		it('should return 401 if not an admin', async () => {
			const response = await login('cschwarts@gmail.com', 'password1234');
			const tokenString = response.body.token;
			const createResponse = await request.post('/api/news/create').set('Authorization', tokenString);
			expect(createResponse.statusCode).toBe(401);
		});
        it('should create a school', async () => {
            const response = await request.post('/api/school/create')
                .set('Authorization', `${await getMasterToken()}`)
                .send({
                    "name": "Test School",
                    "addressLine1": "123 Test St",
                    "addressLine2": "Apt 1",
                    "city": "Test City",
                    "state": "KS",
                    "postalCode": 12345,
                    "usdCode": "123"
                })
                .expect(200);
            expect(response.statusCode).toBe(200);
        });

        it('should fail to create a school with missing name', async () => {
            const response = await request.post('/api/school/create')
                .set('Authorization', `${await getMasterToken()}`)
                .send({
                    "addressLine1": "123 Test St",
                    "addressLine2": "Apt 1",
                    "city": "Test City",
                    "state": "KS",
                    "postalCode": 12345,
                    "usdCode": "123"
                });
            expect(response.statusCode).toBe(400); // 400 is the status code we
            expect(response.text).toBe("School name is required");
        });

        it('should fail to create a school with invalid addressLine1', async () => {
            const response = await request.post('/api/school/create')
                .set('Authorization', `${await getMasterToken()}`)
                .send({
                    "name": "Test School",
                    "addressLine1": 123,
                    "addressLine2": "Apt 1",
                    "city": "Test City",
                    "state": "KS",
                    "postalCode": 12345,
                    "usdCode": "123"
                })
                .expect(400);
            expect(response.text).toBe("Address line 1 must be a string");
        });
    });
    describe('/view', () => {

        it('should return all schools', async () => {
            const response = await request.get('/api/school/view');   
            expect(response.statusCode).toBe(200);
            // compare the first several schools to the default schools
            for (let i = 0; i < firstSeveralDefaultSchools.length; i++) {
                expect(response.body[i]).toEqual(firstSeveralDefaultSchools[i]);
            }
        });
    
    });
});