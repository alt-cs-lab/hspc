const { resetDatabase, closeConnection, createConnection, timeoutSetup } = require('./testing_helpers');
timeoutSetup();

beforeAll(async () => await createConnection());
afterAll(async () => await closeConnection());
beforeEach(async () => await resetDatabase());

const supertest = require('supertest');
const app = require('../server');
const request = supertest(app);
const userService = require('../../src/services/user')
const constants = require('../../src/utils/constants')

const axios = require('axios')
jest.mock('axios')


describe('Auth Testing Suite', () => {
	describe('/login', () => {
		it('Can sign in DM', async () => {
			const response = await request.post("/api/auth/login").send({
				"email": "dm@gmail.com",
				"password": "password1234"
			});

			expect(response.error).toBe(false);

			const body = response._body;

			expect(body.success).toBe(true);

		});

		it('Fails to sign in DM with wrong password', async () => {
			const response = await request.post("/api/auth/login").send({
				"email": "dm@gmail.com",
				"password": "badpassword"
			});

			expect(response.error).not.toBeNull();
			expect(response.text).toEqual("Email or password is incorrect.");
		});

		it('Fails to sign in with a bad email', async () => {
			const response = await request.post("/api/auth/login").send({
				"email": "bademail@gmail.com",
				"password": "password1234"
			});

			expect(response.error).not.toBeNull();
			expect(response.text).toEqual("Email or password is incorrect.");
		});
	})


	describe('/verify', () => {
		it('should sign in a registered user', async () => {
			const data = `
				<cas:serviceResponse xmlns:cas='http://www.yale.edu/tp/cas'>
					<cas:authenticationSuccess>
						<cas:user>casuser</cas:user>
						<cas:dirkey>dummy</cas:dirkey>
						<cas:ksuPersonWildcatID>999999</cas:ksuPersonWildcatID>
					</cas:authenticationSuccess>
				</cas:serviceResponse>`

			// const axios = jest.mock('axios')
			axios.get.mockResolvedValueOnce({
				statusCode: 200,
				data: data
			});

			const response = await request
				.post("/api/auth/verify")
				.send({ ticket: "dummyticket" });

			expect(response.statusCode).toBe(200);

		})

		it('should fail to regsiter a locked down person', async () => {
			const casData = `
				<cas:serviceResponse xmlns:cas='http://www.yale.edu/tp/cas'>
					<cas:authenticationSuccess>
						<cas:user>newcas</cas:user>
						<cas:dirkey>dummy</cas:dirkey>
						<cas:ksuPersonWildcatID>999999</cas:ksuPersonWildcatID>
					</cas:authenticationSuccess>
				</cas:serviceResponse>`

			const peopleData = `
				<?xml version="1.0" encoding="ISO-8859-1" standalone="yes"?>
				<results count="0" returned="0" code="200" msg="successful"/>`

			axios.get
				.mockResolvedValueOnce({
					statusCode: 200,
					data: casData
				})
				.mockResolvedValueOnce({
					statusCode: 200,
					data: peopleData
				});

			const response = await request
				.post("/api/auth/verify")
				.send({ ticket: "dummyticket" });

			expect(response.body.lockedDown).toBe(true);
		})

		it('should register a valid unregistered user as volunteer', async () => {
			const casData = `
				<cas:serviceResponse xmlns:cas='http://www.yale.edu/tp/cas'>
					<cas:authenticationSuccess>
						<cas:user>newcas</cas:user>
						<cas:dirkey>dummy</cas:dirkey>
						<cas:ksuPersonWildcatID>999999</cas:ksuPersonWildcatID>
					</cas:authenticationSuccess>
				</cas:serviceResponse>`
			const peopleData = `
				<?xml version= \"1.0\" encoding= \"ISO-8859-1\" standalone= \"yes\"?>
				<results count= \"1\" returned= \"1\" code= \"200\" msg= \"successful\">
					<result order= \"0\">
						<dirkey>DK637dlh2881</dirkey>
						<eid>novelly</eid>
						<email>c03e09602aea3cbc2e0121fa55ab55694721b65f721b</email>
						<fn>Austin</fn>
						<mn>Paul</mn>
						<ln>Novelly</ln>
						<stu>
							<lvl>Senior</lvl>
							<plans>
								<plan>Computer Science</plan>
							</plans>
						</stu>
						<score>101</score>
					</result>
				</results>`

			axios.get
				.mockResolvedValueOnce({
					statusCode: 200,
					data: casData
				})
				.mockResolvedValueOnce({
					statusCode: 200,
					data: peopleData
				});

			const response = await request
				.post("/api/auth/verify")
				.send({ ticket: "dummyticket" });

			expect(response.statusCode).toBe(200);
			const newUser = await userService.getLogin('newcas@ksu.edu')
			expect(newUser.accessLevel).toBe(constants.VOLUNTEER)
		})

		it('should fail to register an invalid ticket', async () => {
			const data = `
				<cas:serviceResponse xmlns:cas='http://www.yale.edu/tp/cas'>
					<cas:authenticationFailure code="INVALID_TICKET">Ticket &#39;dumST-55662-dDhngCQii3ROau-8q8nqqObaJkg-ome-sso-p4-app-01&#39; not recognized</cas:authenticationFailure>
				</cas:serviceResponse>`

			axios.get
				.mockResolvedValueOnce({
					statusCode: 200,
					data: data
				})

			const response = await request
				.post("/api/auth/verify")
				.send({ ticket: "dummyticket" });

			expect(response.statusCode).toBe(400);
		})
	})
});
