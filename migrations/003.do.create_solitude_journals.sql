CREATE TABLE solitude_journals (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    name TEXT NOT NULL,
    duration INTEGER NOT NULL,
    date TIMESTAMP DEFAULT now() NOT NULL,
    goal TEXT NOT NULL,
    beforemood TEXT NOT NULL,
    aftermood TEXT NOT NULL,
    content TEXT,
    categoryid INTEGER REFERENCES solitude_date_categories(id) ON DELETE CASCADE NOT NULL,
    userid INTEGER REFERENCES solitude_users(id) ON DELETE CASCADE NOT NULL
);