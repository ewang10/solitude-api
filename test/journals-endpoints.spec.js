const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe.only('Journal Endpoints', () => {
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
    const testUser = testUsers[0];
    const testCategories = helpers.makeDateCategoriesArray();
    const testCategory = testCategories[0];
    const testJournals = helpers.makeJournalsArray();
    const testJournal = testJournals[0];

    beforeEach('insert users', () =>
        helpers.seedUsers(db, testUsers)
    );

    beforeEach('insert categories', () =>
        helpers.seedDateCategories(db, testCategories)
    );

    describe('GET /api/journals', () => {
        context('Given there are no journals in db', () => {
            it('responds with 200 and an empty list', () => {
                return supertest(app)
                    .get('/api/journals')
                    .set('Authorization', helpers.makeAuthHeader(testUser))
                    .expect(200, []);
            });
        });
        context('Given there are journals in db', () => {
            beforeEach('insert journals', () =>
                helpers.seedJournals(db, testJournals)
            );
            it('responds with 200 and journals from specific user', () => {
                const expectedJournals = helpers.expectedJournals(testUser.id, testJournals);
                return supertest(app)
                    .get('/api/journals')
                    .set('Authorization', helpers.makeAuthHeader(testUser))
                    .expect(200, expectedJournals);
            });
        });
        context('Given an XSS attack journal', () => {
            const { maliciousJournal, expectedJournal } = helpers.makeMaliciousJournal();
            beforeEach('insert malicious journal', () =>
                helpers.seedJournals(db, maliciousJournal)
            );
            it('responds with 200 and removes XSS content', () => {
                return supertest(app)
                    .get('/api/journals')
                    .set('Authorization', helpers.makeAuthHeader(testUser))
                    .expect(200)
                    .expect(res => {
                        expect(res.body[0].name).to.eql(expectedJournal.name);
                        expect(res.body[0].content).to.eql(expectedJournal.content);
                        expect(res.body[0].goal).to.eql(expectedJournal.goal);
                        expect(res.body[0].beforemood).to.eql(expectedJournal.beforemood);
                        expect(res.body[0].aftermood).to.eql(expectedJournal.aftermood);
                    });
            });
        });
    });

    describe('GET /api/journals/:journal_id', () => {
        context('Given there are no journals in db', () => {
            it('responds with 404', () => {
                const journalid = 1234;
                return supertest(app)
                    .get(`/api/journals/${journalid}`)
                    .set('Authorization', helpers.makeAuthHeader(testUser))
                    .expect(404, {
                        error: { message: 'Journal not found' }
                    });
            });
        });
        context('Given there are journals in db', () => {
            beforeEach('insert journals', () =>
                helpers.seedJournals(db, testJournals)
            );
            it('responds with 200 and specific journal', () => {
                const journalid = 2;
                const expectedJournal = helpers.expectedJournal(testJournals, journalid);
                return supertest(app)
                    .get(`/api/journals/${journalid}`)
                    .set('Authorization', helpers.makeAuthHeader(testUser))
                    .expect(200, expectedJournal);
            });
        });
        context('Given an XSS attack journal', () => {
            const { maliciousJournal, expectedJournal } = helpers.makeMaliciousJournal();
            beforeEach('insert malicious journal', () =>
                helpers.seedJournals(db, maliciousJournal)
            );
            it('responds with 200 and removes XSS content', () => {
                return supertest(app)
                    .get(`/api/journals/${maliciousJournal.id}`)
                    .set('Authorization', helpers.makeAuthHeader(testUser))
                    .expect(200)
                    .expect(res => {
                        expect(res.body.name).to.eql(expectedJournal.name);
                        expect(res.body.content).to.eql(expectedJournal.content);
                        expect(res.body.goal).to.eql(expectedJournal.goal);
                        expect(res.body.beforemood).to.eql(expectedJournal.beforemood);
                        expect(res.body.aftermood).to.eql(expectedJournal.aftermood);
                    });
            });
        });
    });
    describe('POST /api/journals', () => {
        const requiredFields = ['name', 'duration', 'goal', 'beforemood', 'aftermood', 'categoryid'];
        requiredFields.forEach(field => {
            const newJournal = {
                name: 'new name',
                duration: 5,
                goal: 'new goal',
                beforemood: 'new before mood',
                aftermood: 'new after mood',
                categoryid: 1
            };

            it(`responds with 400 when '${field}' is missing`, () => {
                delete newJournal[field];

                return supertest(app)
                    .post('/api/journals')
                    .send(newJournal)
                    .set('Authorization', helpers.makeAuthHeader(testUser))
                    .expect(400, {
                        error: { message: `Missing '${field}' in request body` }
                    });
            });
        });
        it('responds with 201 and newly created journal', () => {
            const newJournal = {
                name: 'new name',
                duration: 5,
                goal: 'new goal',
                beforemood: 'new before mood',
                aftermood: 'new after mood',
                content: '',
                categoryid: 2
            };
            return supertest(app)
                .post('/api/journals')
                .send(newJournal)
                .set('Authorization', helpers.makeAuthHeader(testUser))
                .expect(201)
                .expect(res => {
                    expect(res.body).to.have.property('id');
                    expect(res.body).to.have.property('userid');
                    expect(res.body.name).to.eql(newJournal.name);
                    expect(res.body.duration).to.eql(newJournal.duration);
                    expect(res.body.goal).to.eql(newJournal.goal);
                    expect(res.body.beforemood).to.eql(newJournal.beforemood);
                    expect(res.body.aftermood).to.eql(newJournal.aftermood);
                    expect(res.body.categoryid).to.eql(newJournal.categoryid);
                    expect(res.headers.location).to.eql(`/api/journals/${res.body.id}`);
                    const expectedDate = new Intl.DateTimeFormat('en-US').format(new Date());
                    const actualDate = new Intl.DateTimeFormat('en-US').format(new Date(res.body.date));
                    expect(actualDate).to.eql(expectedDate);
                })
                .then(res =>
                    supertest(app)
                        .get(`/api/journals/${res.body.id}`)
                        .set('Authorization', helpers.makeAuthHeader(testUser))
                        .expect(res.body)
                );
        });
        it('removes XSS attack content from response', () => {
            const { maliciousJournal, expectedJournal } = helpers.makeMaliciousJournal();
            return supertest(app)
                .post('/api/journals')
                .send(maliciousJournal)
                .set('Authorization', helpers.makeAuthHeader(testUser))
                .expect(201)
                .expect(res => {
                    expect(res.body.name).to.eql(expectedJournal.name);
                    expect(res.body.content).to.eql(expectedJournal.content);
                    expect(res.body.goal).to.eql(expectedJournal.goal);
                    expect(res.body.beforemood).to.eql(expectedJournal.beforemood);
                    expect(res.body.aftermood).to.eql(expectedJournal.aftermood);
                });
        });
    });

    describe('DELETE /api/journals/:journal_id', () => {
        context('Given there are no journals in db', () => {
            it('responds with 404', () => {
                const journalToDelete = 1234;
                return supertest(app)
                    .delete(`/api/journals/${journalToDelete}`)
                    .set('Authorization', helpers.makeAuthHeader(testUser))
                    .expect(404, {
                        error: { message: 'Journal not found' }
                    });
            });
        });
        context('Given there are journals in db', () => {
            beforeEach('insert journals', () =>
                helpers.seedJournals(db, testJournals)
            );
            it('responds with 204 and removes the journal', () => {
                const journalToDelete = 1;
                const expectedJournals = helpers.expectedJournalsAfterDelete(
                    testJournals,
                    journalToDelete
                );
                return supertest(app)
                    .delete(`/api/journals/${journalToDelete}`)
                    .set('Authorization', helpers.makeAuthHeader(testUser))
                    .expect(204)
                    .then(() =>
                        supertest(app)
                            .get('/api/journals')
                            .set('Authorization', helpers.makeAuthHeader(testUser))
                            .expect(expectedJournals)
                    );
            });
        });
    });
});