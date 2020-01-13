const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('Protected Endpoints', () => {
    let db;

    before('make knex instance', () => {
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
    const testDateCategories = helpers.makeDateCategoriesArray();
    const testJournals = helpers.makeJournalsArray();

    beforeEach('insert users', () =>
        helpers.seedUsers(db, testUsers)
    );

    beforeEach('insert categories', () =>
        helpers.seedDateCategories(db, testDateCategories)
    );

    beforeEach('insert journals', () =>
        helpers.seedJournals(db, testJournals)
    );

    const protectedEndpoints = [
        {
            name: 'GET /api/date_categories',
            path: '/api/date_categories'
        },
        {
            name: 'GET /api/date_categories/:category_id',
            path: '/api/date_categories/1'
        },
        {
            name: 'GET /api/journals',
            path: '/api/journals/'
        },
        {
            name: 'GET /api/journals/:journal_id',
            path: '/api/journals/1'
        }
    ];

    protectedEndpoints.forEach(endpoint => {
        describe(endpoint.name, () => {
            it(`responds with 401 'Missing bearer token' when no bearer token`, () => {
                return supertest(app)
                    .get(endpoint.path)
                    .expect(401, { error: `Missing bearer token` })
            });
            it(`responds 401 'Unauthorized request' when invalid JWT secret`, () => {
                const validUser = testUsers[0];
                const invalidSecret = 'bad-scret';
                return supertest(app)
                    .get(endpoint.path)
                    .set('Authorization', helpers.makeAuthHeader(validUser, invalidSecret))
                    .expect(401, { error: `Unauthorized request` })
            });
            it(`responds 401 'Unauthorized request' when invalid sub in payload`, () => {
                const invalidUser = { user_name: 'user-not-existy', id: 1 };
                return supertest(app)
                    .get(endpoint.path)
                    .set('Authorization', helpers.makeAuthHeader(invalidUser))
                    .expect(401, { error: 'Unauthorized request' })
            });
        });
    });
});