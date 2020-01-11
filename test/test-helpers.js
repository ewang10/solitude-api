const bcrypte = require('bcryptjs');

function cleanTables(db) {
    return db.raw(
        `TRUNCATE
            solitude_users,
            solitude_date_categories,
            solitude_journals
        RESTART IDENTITY CASCADE`
    );
}

function makeUsersArray() {
    return [
        {
            id: 1,
            user_name: 'test user1',
            password: 'password'
        }, {
            id: 2,
            user_name: 'test user2',
            password: 'password'
        }, {
            id: 3,
            user_name: 'test user3',
            password: 'password'
        }
    ];
}

function makeDateCategoriesArray() {
    return [
        {
            id: 1,
            name: "2020-01",
            userid: 1
        }, {
            id: 2,
            name: "2020-02",
            userid: 2
        }, {
            id: 3,
            name: "2020-03",
            userid: 3
        }
    ];
}


function makeJournalsArray() {
    return [
        {
            id: 1,
            name: "Journal 1",
            duration: 5,
            date: new Date(),
            goal: 'goal 1',
            beforemood: 'before mood 1',
            aftermood: 'after mood 1',
            content: 'content 1',
            categoryid: 1,
            userid: 1
        }, 
        {
            id: 2,
            name: "Journal 2",
            duration: 10,
            date: new Date(),
            goal: 'goal 2',
            beforemood: 'before mood 2',
            aftermood: 'after mood 2',
            content: 'content 2',
            categoryid: 2,
            userid: 2
        },
        {
            id: 3,
            name: "Journal 3",
            duration: 15,
            date: new Date(),
            goal: 'goal 3',
            beforemood: 'before mood 3',
            aftermood: 'after mood 3',
            content: 'content 3',
            categoryid: 3,
            userid: 3
        }
    ];
}

function seedUsers(db, users) {
    const prepUsers = users.map(user =>
            ({
                ...user,
                password: bcrypte.hashSync(user.password, 1)
            })

            
        );
    return db
            .insert(prepUsers)
            .into('solitude_users');
}

module.exports = {
    cleanTables,
    makeUsersArray,
    makeDateCategoriesArray,
    makeJournalsArray,
    seedUsers
}