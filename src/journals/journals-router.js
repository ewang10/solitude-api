const path = require('path');
const express = require('express');
const JournalsService = require('./journals-service');
const { requireAuth } = require('../middleware/jwt-auth');

const journalsRouter = express.Router();
const jsonParser = express.json();

journalsRouter
    .route('/')
    .all(requireAuth)
    .get((req, res, next) => {
        JournalsService.getJournalsByUserID(
            req.app.get('db'),
            req.user.id
        )
            .then(journals => {
                res.json(journals.map(JournalsService.serializeJournals))
            })
            .catch(next);
    })
    .post(jsonParser, (req, res, next) => {
        const {name, duration, goal, beforemood, aftermood, categoryid, content} = req.body;
        const newJournal = {name, duration, goal, beforemood, aftermood, categoryid};
        for (const [key, value] of Object.entries(newJournal)) {
            if (value == null) {
                return res.status(400).json({
                    error: { message: `Missing '${key}' in request body`}
                });
            }
        }

        newJournal.content = content;
        newJournal.userid = req.user.id;

        JournalsService.insertJournal(
            req.app.get('db'),
            newJournal
        )
            .then(journal => {
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${journal.id}`))
                    .json(JournalsService.serializeJournals(journal))
            })
            .catch(next);
    })


journalsRouter
    .route('/:journal_id')
    .all(requireAuth)
    .all(checkJournalExist)
    .get((req, res, next) => {
        res.json(JournalsService.serializeJournals(req.journal));
    })
    .delete((req, res, next) => {
        JournalsService.deleteJournal(
            req.app.get('db'),
            req.params.journal_id
        )
            .then(() => {
                res.status(204).end()
            })
            .catch(next);
    })
    .patch(jsonParser, (req, res, next) => {
        const {name, duration, goal, beforemood, aftermood, content, categoryid} = req.body;
        const updatedJournal = {name, duration, goal, beforemood, aftermood, content, categoryid};
        const numberOfValues = Object.values(updatedJournal).filter(Boolean).length;
        if (numberOfValues === 0) {
            return res.status(400).json({
                error: {message: `Request body must contain either 'name', 'duration', 'goal', 'beforemood', 'aftermood', 'content', or 'categoryid'`}
            });
        }
        JournalsService.updateJournal(
            req.app.get('db'),
            req.params.journal_id,
            updatedJournal
        )
            .then(() => {
                res.status(204).end();
            })
            .catch(next);
    })


async function checkJournalExist(req, res, next) {
    try {
        const journal = await JournalsService.getJournalByID(
            req.app.get('db'),
            req.params.journal_id
        );

        if (!journal) {
            return res.status(404).json({
                error: {message: 'Journal not found'}
            });
        }

        req.journal = journal;
        next();
    } catch (error) {
        next(error);
    }
}

module.exports = journalsRouter;