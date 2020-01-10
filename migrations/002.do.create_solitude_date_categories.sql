CREATE TABLE solitude_date_categories (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    name TEXT NOT NULL,
    userid INTEGER REFERENCES solitude_users(id) ON DELETE CASCADE NOT NULL
);