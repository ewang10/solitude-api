const app = require('../src/app');
const knex = require('knex');
const helpers = require('./test-helpers');
const bcrypt = require('bcryptjs');

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

            it('responds with 400 "Password must be longer than 8 characters" when short password', () => {
                const shortPassword = {
                    user_name: 'test user_name',
                    password: '123456'
                };

                return supertest(app)
                    .post('/api/users')
                    .send(shortPassword)
                    .expect(400, {
                        error: 'Password must be longer than 8 characters'
                    });
            });

            it('responds with 400 "Password must be less than 72 characters" when long password', () => {
                const longPassword = {
                    user_name: 'test user_name',
                    password: ('*').repeat(73)
                };

                return supertest(app)
                    .post('/api/users')
                    .send(longPassword)
                    .expect(400, {
                        error: 'Password must be less than 72 characters'
                    });
            });

            it('responds with 400 when password starts with spaces', () => {
                const userPasswordStartsWithSpaces = {
                    user_name: 'test user_name',
                    password: ' 1!AaaA!1'
                };

                return supertest(app)
                    .post('/api/users')
                    .send(userPasswordStartsWithSpaces)
                    .expect(400, {
                        error: 'Password must not start with or end with spaces'
                    });
            });

            it('responds with 400 when password ends with spaces', () => {
                const userPasswordEndssWithSpaces = {
                    user_name: 'test user_name',
                    password: '1!AaaA!1 '
                };

                return supertest(app)
                    .post('/api/users')
                    .send(userPasswordEndssWithSpaces)
                    .expect(400, {
                        error: 'Password must not start with or end with spaces'
                    });
            });

            it('responds with 400 when password is not complex enough', () => {
                const userPasswordNotComplex = {
                    user_name: 'test user_name',
                    password: 'password123'
                };

                return supertest(app)
                    .post('/api/users')
                    .send(userPasswordNotComplex)
                    .expect(400, {
                        error: 'Password must contain one upper case, lower case, number and special character'
                    });
            });

            it('responds with 400 when user_name is taken', () => {
                const usernameTaken = {
                    user_name: testUser.user_name,
                    password: '1!AaaA!1'
                };

                return supertest(app)
                    .post('/api/users')
                    .send(usernameTaken)
                    .expect(400, {
                        error: 'Username already taken'
                    });
            });
        });
        context('happy path', () => {
            it('responds with 201, serialize user, store bcrypt password', () => {
                const newUser = {
                    user_name: 'new user',
                    password: '1!AaaA!1'
                };

                return supertest(app)
                    .post('/api/users')
                    .send(newUser)
                    .expect(201)
                    .expect(res => {
                        expect(res.body).to.have.property('id');
                        expect(res.body).to.not.have.property('password');
                        expect(res.body.user_name).to.eql(newUser.user_name);
                        expect(res.headers.location).to.eql(`/api/users/${res.body.id}`);
                    })
                    .expect(res => {
                        db('solitude_users')
                            .select('*')
                            .where({id: res.body.id})
                            .first()
                            .then(user => {
                                expect(user.user_name).to.eql(newUser.user_name);
                                return bcrypt.compare(newUser.password, user.password);
                            })
                            .then(compareMatch => {
                                expect(compareMatch).to.be.true;
                            });
                    });
            });
        });
    });
});