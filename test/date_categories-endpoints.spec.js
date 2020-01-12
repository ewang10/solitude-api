const app = require('../src/app');
const knex = require('knex');
const helpers = require('./test-helpers');

describe.only('Date Categories Endpoints', () => {
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
    const testCategories = helpers.makeDateCategoriesArray();
    const testCategory = testCategories[0];

    beforeEach('insert users', () =>
        helpers.seedUsers(db, testUsers)
    );

    describe('GET /api/date_categories', () => {
        context('Given there are no categories', () => {
            it('responds with 200 and an empty list', () => {
                return supertest(app)
                    .get('/api/date_categories')
                    .set('Authorization', helpers.makeAuthHeader(testUser))
                    .expect(200, [])
            });
        });

        context('Given there are categories in db', () => {
            beforeEach('insert categories', () =>
                helpers.seedDateCategories(db, testCategories)
            );
            it('responds with 200 and categories for specific user', () => {
                const expectedCategories = helpers.expectedCategories(testUser.id, testCategories);
                return supertest(app)
                    .get('/api/date_categories')
                    .set('Authorization', helpers.makeAuthHeader(testUser))
                    .expect(200, expectedCategories)
            });
        });

        context('Given an XSS attack category', () => {
            const { maliciousDateCategory, expectedDateCategory } = helpers.makeMaliciousDateCategory();
            beforeEach('insert malicious date category', () =>
                helpers.seedDateCategories(db, maliciousDateCategory)
            );
            it('responds with 200 and removes XSS content', () => {
                return supertest(app)
                    .get('/api/date_categories')
                    .set('Authorization', helpers.makeAuthHeader(testUser))
                    .expect(200)
                    .expect(res => {
                        expect(res.body[0].name).to.eql(expectedDateCategory.name);
                    });
            });
        });
    });

    describe('GET /api/date_categories/:id', () => {
        context('Given there are no categories in db', () => {
            it('responds with 404', () => {
                const categoryId = 1234;
                return supertest(app)
                    .get(`/api/date_categories/${categoryId}`)
                    .set('Authorization', helpers.makeAuthHeader(testUser))
                    .expect(404, {
                        error: { message: 'Category not found' }
                    });
            });
        });
        context('Given there are categories in db', () => {
            beforeEach('insert categories', () => 
                helpers.seedDateCategories(db, testCategories)
            );
            it('responds with 200 and specified category', () => {
                const categoryId = 2;
                const expectedCategory = helpers.expectedCategory(testCategories, categoryId);
                return supertest(app)
                    .get(`/api/date_categories/${categoryId}`)
                    .set('Authorization', helpers.makeAuthHeader(testUser))
                    .expect(200, expectedCategory);
            });
        });
        context('Given an XSS attack category', () => {
            const { maliciousDateCategory, expectedDateCategory } = helpers.makeMaliciousDateCategory();
            beforeEach('insert malicious date category', () =>
                helpers.seedDateCategories(db, maliciousDateCategory)
            );
            it('responds with 200 and removes XSS content', () => {
                return supertest(app)
                    .get(`/api/date_categories/${maliciousDateCategory.id}`)
                    .set('Authorization', helpers.makeAuthHeader(testUser))
                    .expect(200)
                    .expect(res => {
                        expect(res.body.name).to.eql(expectedDateCategory.name);
                    });
            });
        });
    });

    describe('POST /api/date_categories', () => {
        it('responds with 400 when "name" is missing', () => {
            const newAttemptCategory = {
                name: 'new category'
            };

            delete newAttemptCategory['name'];

            return supertest(app)
                .post('/api/date_categories')
                .send(newAttemptCategory)
                .set('Authorization', helpers.makeAuthHeader(testUser))
                .expect(400, {
                    error: {message: `Missing 'name' in request body`}
                });
        });
        it('responds with 201 and new category', () => {
            const newCategory = {
                name: '2020-01'
            };
            return supertest(app)
                .post('/api/date_categories')
                .send(newCategory)
                .set('Authorization', helpers.makeAuthHeader(testUser))
                .expect(201)
                .expect(res => {
                    expect(res.body).to.have.property('id');
                    expect(res.body).to.have.property('userid');
                    expect(res.body.name).to.eql(newCategory.name);
                    expect(res.headers.location).to.eql(`/api/date_categories/${res.body.id}`);
                })
                .then(res =>
                    supertest(app)
                        .get(`/api/date_categories/${res.body.id}`)
                        .set('Authorization', helpers.makeAuthHeader(testUser))
                        .expect(res.body)    
                );
        });
    });
});