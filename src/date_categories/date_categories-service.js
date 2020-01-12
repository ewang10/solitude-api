const xss = require('xss');

const DateCategoriesService = {
    serializeCategories(category) {
        return {
            id: category.id,
            name: xss(category.name),
            userid: category.userid
        };
    },
    getCategoriesByUserID(db, user_id) {
        return db('solitude_date_categories AS categories')
            .select('categories.id', 'categories.name', 'categories.userid')
            .join('solitude_users AS users', 'users.id', 'categories.userid')
            .where('users.id', user_id);
    },
    getCategoryByID(db, category_id) {
        return db('solitude_date_categories AS categories')
            .select('categories.id', 'categories.name', 'categories.userid')
            .where({id: category_id})
            .first();
    },
    insertCategory(db, category) {
        return db
            .insert(category)
            .into('solitude_date_categories')
            .returning('*')
            .then(([category]) => category);
    }
}

module.exports = DateCategoriesService;