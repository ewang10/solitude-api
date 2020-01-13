const xss = require('xss');

const JournalsService = {
    serializeJournals(journal) {
        return {
            id: journal.id,
            name: xss(journal.name),
            duration: journal.duration,
            date: journal.date,
            goal: xss(journal.goal),
            beforemood: xss(journal.beforemood),
            aftermood: xss(journal.aftermood),
            content: xss(journal.content),
            categoryid: journal.categoryid,
            userid: journal.userid
        };
    },
    getJournalsByUserID(db, user_id) {
        return db('solitude_journals AS journals')
            .select('journals.id', 'journals.name', 'journals.duration', 'journals.date',
                'journals.goal', 'journals.beforemood', 'journals.aftermood',
                'journals.content', 'journals.categoryid', 'journals.userid'
            )
            .join('solitude_users AS users', 'users.id', 'journals.userid')
            .where('users.id', user_id);
    },
    getJournalByID(db, journal_id) {
        return db('solitude_journals AS journals')
            .select('journals.id', 'journals.name', 'journals.duration', 'journals.date',
                'journals.goal', 'journals.beforemood', 'journals.aftermood',
                'journals.content', 'journals.categoryid', 'journals.userid'
            )
            .where('journals.id', journal_id)
            .first();
    },
    insertJournal(db, journal) {
        return db
            .insert(journal)
            .into('solitude_journals')
            .returning('*')
            .then(([journal]) => journal);
    },
    deleteJournal(db, journal_id) {
        return db('solitude_journals')
            .where('id', journal_id)
            .delete();
    }
}

module.exports = JournalsService;