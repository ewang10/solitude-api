const bcrypte = require('bcryptjs');
const jwt = require('jsonwebtoken');

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


function makeMaliciousDateCategory() {
    const maliciousDateCategory = {
        id: 911,
        name: 'Naughty naughty very naughty <script>alert("xss");</script>',
        userid: 1
    };
    const expectedDateCategory = {
        ...maliciousDateCategory,
        name: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;'
    };

    return { maliciousDateCategory, expectedDateCategory };
}

function makeMaliciousJournal() {
    const maliciousJournal = {
        id: 911,
        name: 'Naughty naughty very naughty <script>alert("xss");</script>',
        duration: 15,
        date: new Date(),
        goal: 'Naughty naughty very naughty <script>alert("xss");</script>',
        beforemood: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`,
        aftermood: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`,
        content: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`,
        categoryid: 1,
        userid: 1
    };

    const expectedJournal = {
        ...maliciousJournal,
        name: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
        goal: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
        beforemood: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`,
        aftermood: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`,
        content: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`
    };

    return { maliciousJournal, expectedJournal };
}

function expectedCategories(user_id, categories) {
    const userCategories = categories.filter(category =>
            category.userid === user_id
        );
    return userCategories;
}

function expectedCategory(categories, category_id) {
    return categories.find(category => 
            category.id === category_id
        );
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

function seedDateCategories(db, categories) {
    return db
        .insert(categories)
        .into('solitude_date_categories');
}

function seedJournals(db, journals) {
    return db
        .insert(journals)
        .into('solitude_djournals');
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
    const token = jwt.sign(
        { user_id: user.id },
        secret,
        {
            subject: user.user_name,
            algorithm: 'HS256'
        }
    );

    return `Bearer ${token}`;
}

module.exports = {
    cleanTables,
    makeUsersArray,
    makeDateCategoriesArray,
    makeJournalsArray,
    makeMaliciousDateCategory,
    makeMaliciousJournal,
    seedUsers,
    seedDateCategories,
    seedJournals,
    makeAuthHeader,
    expectedCategories,
    expectedCategory
}