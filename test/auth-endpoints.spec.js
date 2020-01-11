const app = require('../src/app');
const knex = require('knex');
const jwt = require('jsonwebtoken');
const helpers = require('./test-helpers');

describe('Auth Endpoint', () => {
    let db;
    before('create knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL
        });
        app.set('db', db);
    });

    after('disconnect db', () => db.destroy());
    before('cleanup', () => helpers.cleanTables(db));
    afterEach('cleanup', () => helpers.cleanTables(db));

    const testUsers = helpers.makeUsersArray();
    const testUser = testUsers[0];

    describe('/api/auth/login', () => {
        beforeEach('insert users', () =>
            helpers.seedUsers(db, testUsers)
        );

        const requiredFields = ['user_name', 'password'];
        requiredFields.forEach(field => {
            const userAttemptLogin = {
                user_name: testUser.user_name,
                password: testUser.password
            };

            it(`responds with 400 when '${field}' is missing`, () => {
                delete userAttemptLogin[field];

                return supertest(app)
                    .post('/api/auth/login')
                    .send(userAttemptLogin)
                    .expect(400, {
                        error: `Missing '${field}' in request body`
                    });
            });
        });

        it('responds with 400 when invalid user_name', () => {
            const userInvalidUserName = {
                user_name: 'invalid user_name',
                password: testUser.password
            };

            return supertest(app)
                .post('/api/auth/login')
                .send(userInvalidUserName)
                .expect(400, {
                    error: 'Incorrect user_name or password'
                });
        });

        it('responds with 400 when invalid password', () => {
            const userInvalidPassword = {
                user_name: testUser.user_name,
                password: 'invalid password'
            };

            return supertest(app)
                .post('/api/auth/login')
                .send(userInvalidPassword)
                .expect(400, {
                    error: 'Incorrect user_name or password'
                });
        });

        it('responds with 200 and JWT auth token using secret when valid credentials', () => {
            const validUser = {
                user_name: testUser.user_name,
                password: testUser.password
            };

            const expectedToken = jwt.sign(
                {user_id: testUser.id},
                process.env.JWT_SECRET,
                {
                    subject: testUser.user_name,
                    expiresIn: process.env.JWT_EXPIRY,
                    algorithm: 'HS256'
                }
            );

            return supertest(app)
                .post('/api/auth/login')
                .send(validUser)
                .expect(200, {
                    authToken: expectedToken
                });
        });
    });

    describe('/api/auth/refresh', () => {
        beforeEach('insert users', () =>
            helpers.seedUsers(db, testUsers)
        );

        it('responds with 200 and JWT auth token using secret', () => {
            const expectedToken = jwt.sign(
                {user_id: testUser.id},
                process.env.JWT_SECRET,
                {
                    subject: testUser.user_name,
                    expiresIn: process.env.JWT_EXPIRY,
                    algorithm: 'HS256'
                }
            );

            return supertest(app)
                .post('/api/auth/refresh')
                .set('Authorization', helpers.makeAuthHeader(testUser))
                .expect(200, {
                    authToken: expectedToken
                });
        });
    });
});