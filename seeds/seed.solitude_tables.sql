BEGIN;

TRUNCATE
    solitude_users,
    solitude_date_categories,
    solitude_journals
RESTART IDENTITY CASCADE;

INSERT INTO solitude_users (user_name, password)
VALUES
    ('dunder', '$2a$12$lHK6LVpc15/ZROZcKU00QeiD.RyYq5dVlV/9m4kKYbGibkRc5l4Ne'),
    ('b.deboop', '$2a$12$VQ5HgWm34QQK2rJyLc0lmu59cy2jcZiV6U1.bE8rBBnC9VxDf/YQO'),
    ('c.bloggs', '$2a$12$2fv9OPgM07xGnhDbyL6xsuAeQjAYpZx/3V2dnu0XNIR27gTeiK2gK');


INSERT INTO solitude_date_categories (name, userid)
VALUES
    ('2020-01', 1),
    ('2020-03', 3),
    ('2020-02', 2);

INSERT INTO solitude_journals (name, duration, goal, beforemood, aftermood, content, categoryid, userid)
VALUES
    ('Journal 1', 5, 'goal 1', 'beforemood 1', 'aftermood 1', null, 1, 1),
    ('Journal 2', 3, 'goal 2', 'beforemood 2', 'aftermood 2', 'content 2', 2, 3),
    ('Journal 3', 8, 'goal 3', 'beforemood 3', 'aftermood 3', 'content 3', 3, 2),
    ('Journal 4', 10, 'goal 4', 'beforemood 4', 'aftermood 4', null, 1, 1);

COMMIT;