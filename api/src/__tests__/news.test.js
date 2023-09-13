const {
    resetDatabase,
    closeConnection,
    createConnection,
    login,
    timeoutSetup,
} = require("./testing_helpers");

timeoutSetup();

beforeAll(async () => await createConnection());
afterAll(async () => await closeConnection());
beforeEach(async () => await resetDatabase());

const supertest = require("supertest");
const app = require("../server");
const request = supertest(app);

const defaultNews = [
    {
        "title": "Work being done",
        "subheading": "Please do not disturb the engineers",
        "body": "Goodbye!",
        "date": "2022-2-18"
    }
]

const testNews = [
	{
		"title": "Test Title",
		"subheading": "Test subheading",
		"body": "Test Body",
		"date": "2022-2-18"
	}
]

describe('News Testing Suite', () => {
	describe ('/create', () => {
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
		it('should return 200 if logged in as admin', async () => {
			const response = await login('dm@gmail.com', 'password1234');
			const tokenString = response.body.token;
			const createResponse = await request.post('/api/news/create').set('Authorization', tokenString)
				.send(testNews[0]);
			expect(createResponse.statusCode).toBe(200);
			// now see if it showed up in the database
			const viewResponse = await request.get('/api/news/view');
			// testNews and defaultNews should be in the response
			expect(viewResponse.body).toEqual([...defaultNews,...testNews]);
		});
	});

	describe('/view', () => {

		it('should return a list of news articles', async () => {
			const response = await request.get('/api/news/view');
			expect(response.body).toEqual(defaultNews);
		});
	});
});
