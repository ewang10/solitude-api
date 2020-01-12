const path = require('path');
const express = require('express');
const DateCategoriesService = require('./date_categories-service');
const { requireAuth } = require('../middleware/jwt-auth');

const dateCategoriesRouter = express.Router();
const jsonParser = express.json();

dateCategoriesRouter
    .route('/')
    .all(requireAuth)
    .get((req, res, next) => {
        DateCategoriesService.getCategoriesByUserID(
            req.app.get('db'),
            req.user.id
        )
            .then(categories => {
                res.json(categories.map(
                    DateCategoriesService.serializeCategories
                ))
            })
            .catch(next);
    })
    .post(jsonParser, (req, res, next) => {
        const {name} = req.body;
        if (!name) {
            return res.status(400).json({
                error: {message: `Missing 'name' in request body`}
            });
        }

        const newCategory = {name};
        newCategory.userid = req.user.id;

        DateCategoriesService.insertCategory(
            req.app.get('db'),
            newCategory
        )
            .then(category => {
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${category.id}`))
                    .json(DateCategoriesService.serializeCategories(category))
            })
            .catch(next);
    });

dateCategoriesRouter
    .route('/:category_id')
    .all(requireAuth)
    .all(checkCategoryExist)
    .get((req, res, next) => {
        res.json(DateCategoriesService.serializeCategories(req.category));
    })


async function checkCategoryExist(req, res, next) {
    try {
        const category = await DateCategoriesService.getCategoryByID(
            req.app.get('db'),
            req.params.category_id
        );

        if (!category) {
            return res.status(404).json({
                error: {message: 'Category not found'}
            });
        }

        req.category = category;
        next();
    } catch(error) {
        next(error);
    }
}


module.exports = dateCategoriesRouter;