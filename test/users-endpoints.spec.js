const app = require('../src/app');
const knex = require('knex');
const helpers = require('./test-helpers');

describe('Users Endpoint', () => {
    let db;
    before('create kenx instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL
        });
        app.set('db', db);
    });

    after('disconnect from db', () => db.destroy());

    before('cleanup', () => helpers.cleanTables(db));
    afterEach('cleanup', () => helpers.cleanTables(db));

    const testUsers = helpers.makeUsersArray();
    const testUser = testUsers[0];

    describe('POST /api/users', () => {
        context('user validation', () => {
            beforeEach('insert users', () =>
                helpers.seedUsers(db, testUsers)
            );
            const requiredFields = ['user_name', 'password'];
            requiredFields.forEach(field => {
                const newUser = {
                    user_name: 'new user_name',
                    password: 'new password'
                };

                it(`responds with 400 when ${field} is missing`, () => {
                    delete newUser[field];

                    return supertest(app)
                        .post('/api/users')
                        .send(newUser)
                        .expect(400, {
                            error: `Missing '${field}' in request body`
                        });
                });
            });
        });
    });
});