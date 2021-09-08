# SQL

Databases are a vital part of any application. Without them there is no way to store any information relevant to the app or any records of users, orders, or bookings. That might sound great from a personal perspective (no more targeted ads because you looked at something online that one time) but it would also mean we couldn't browse Netflix or sell stuff on eBay. 

Databases come in two different types: **relational** and **non-relational**. The fundamentals are the same, but there is a key difference in terms of structure. Everything we enter into a relational database must follow a clearly-defined format and we can be sure when we read from it that the results will contain the data we need. Non-relational databases are much more flexible and give the user a greater degree of freedom in terms of how they are utilised.

The two types are often referred to as **SQL** and **NoSQL** databases. SQL stands for **S**tructured **Q**uery **L**anguage but it in fact covers many different varieties - examples include MySQL, PostgreSQL, H2 and many more. Each has slight differences, but the fundamentals are the same.

## Setting Up a Database

The data we enter into our database will be stored in **tables**. Tables consist of **columns**, which denote the values being stored, and **rows**, which represent the entries made. In order to set up a table in our database we need to specify the name we want to refer to it by, which should be plural. In this example we're going to keep track of actors and the movies the appear in, so we'll start by creating an `movies` table.

We also need to define the columns, including the **type** of data stored in each. These types are similar to those we've seen already, but have slightly different names (see link at the bottom of this document for a full list). By specifying a type for each column we help prevent data being entered inaccurately.

Once we store our data we'll need to refer back to it at some point, but that can be quite a challenge. If we have two owners with the same name, how can we tell them apart? To address this we'll add a column called `id` which will store a unique identifier for each row. This will have a special type called `SERIAL`, which looks like any other number but has special significance to the database management tool. Serials are assigned automatically when a row is added and won't be reused when a row is deleted, removing a potential source of user error. 

```sql
CREATE TABLE movies (
	id SERIAL,
	title VARCHAR(255),
	duration INT,
	rating VARCHAR(255)
);
```

## Basic Operations - CRUD

### Create

There's no point in having a database if we don't store any information in it. The keyword we use adding new information is `INSERT` and the query follows this format:

```sql
INSERT INTO table_name (column1, column2, column3) VALUES (value1, value2, value3);
``` 

We'll add some owners to our table:

```sql
INSERT INTO movies (title, duration, rating) VALUES ('Alien', 117, '18');
INSERT INTO movies (title, duration, rating) VALUES ('The Imitation Game', 114, '12A');
INSERT INTO movies (title, duration, rating) VALUES ('Iron Man', 181, '12A');
INSERT INTO movies (title, duration, rating) VALUES ('The Martian', 144, '12A');
```

Note that we don't need to include the `id` column here. Because we gave it the type `SERIAL` the database manager will take care of that for us and auto-assign a value to each new entry.

What happens if we miss out some of the information?

```sql
INSERT INTO movies (title, rating) VALUES ('Braveheart', 'PG');
```

Because we're using a relational database there needs to be *something* in the age column, but we haven't provided anything. The database manager ensures there's a value there by inserting `NULL` instead. We can force the user to provide a value by adding `NOT NULL` after the column's data type when we set up our table.

### Read

Just like there's no point in having an empty database, there's no point putting things in if we're never going to look at them again. We can read information from the database using the `SELECT` keyword. The simplest thing we could do is read *everything* from our table, which we do with this query:

```sql
SELECT * FROM movies;
```

Obviously that's not always going to be practical. We can limit the reults in two ways: by column and by row. Replacing the `*` with one or more column names will only give us certain pieces of information back:

```sql
SELECT title FROM movies;
```

We get the requested information for each row in the table. If we want to limit the number of rows we can do so using the `WHERE` keyword:

```sql
SELECT * FROM movies WHERE rating = 'PG';
```

We aren't limited to checking equality, we can compare values (`>`, `<`) and check negatives using `NOT`. We can combine the two as well:

```sql
SELECT title FROM movies WHERE duration > 120;
```

### Update

Once something has been added to our database we may want to change it at a later point. The `UPDATE` keyword lets us do this and the syntax is similar (although not exactly the same) as adding a new item. We need to be more careful here though, since we don't want to accidentally modify more than we need to. Just like we do when we `SELECT`, we can use the `WHERE` keyword to limit the rows we are updating. Usually we will use the `id` property to ensure we only update a specific row, but there may be occasions where we want to use something else to update multiple rows at once.

```sql
UPDATE movies SET rating = '12A' WHERE id = 5;
```

The syntax is slightly different if we want to update multiple columns, where we need to add brackets around the column names and values:

```sql
UPDATE movies SET (duration, rating) = (178, '15') WHERE id = 5;
```

### Delete

The final core action will enable us to remove entries from our database. Again we need to be careful and use `WHERE` to make sure we only remove what we want to.

```sql
DELETE FROM movies WHERE id = 5;
```

If we leave out the `WHERE` clause we'll end up deleting **everything** in the table!

```sql
DELETE FROM movies;
```

## Multiple Tables - One-To-Many Relationships

We're going to add a second table to our databse to represent `actors`, with each actor having a single `movie`. The movies, on the other hand, can have multiple actors. We call this a **one-to-many** relationship: one entry in one table is related to many entries in the other.

This relationship is defined in the code by adding a column to the `actors` table (the **many** side of the relationship) which refers to the `id` property of a row in the `movies` table (the **one** side). The database manager needs to be told that these two columns are linked, which we do by adding **Primary Keys** and **Foreign Keys**.

```sql
-- Drop and re-create owners to add the primary key

DROP TABLE movies;

CREATE TABLE movies (
	id SERIAL PRIMARY KEY,
	title VARCHAR(255),
	duration INT,
	rating VARCHAR(255)
);

CREATE TABLE actors (
	id SERIAL PRIMARY KEY,
	name VARCHAR(255),
	movie_id INT REFERENCES movies(id)
);

INSERT INTO movies (title, duration, rating) VALUES ('Alien', 117, '18');
INSERT INTO movies (title, duration, rating) VALUES ('The Imitation Game', 114, '12A');
INSERT INTO movies (title, duration, rating) VALUES ('Iron Man', 181, '12A');
INSERT INTO movies (title, duration, rating) VALUES ('The Martian', 144, '12A');

INSERT INTO actors (name, movie_id) VALUES ('Sigourney Weaver', 1);
INSERT INTO actors (name, movie_id) VALUES ('Benedict Cumberbatch', 2);
INSERT INTO actors (name, movie_id) VALUES ('Robert Downey Jr', 3);
INSERT INTO actors (name, movie_id) VALUES ('Gwyneth Paltrow', 3);
```

`PRIMARY KEY` indicates that the annotated column is the main identifier for that table, which will almost *always* be the `id` column. `REFERENCES` indicates that the column refers to the primary key of a different table, ie. that it is a foreign key. Using keys like this gives us an extra level of protection, as it tells the database manager that in order for us to add an actor to the database there has to be a movie with the given id already there. It also means that we can't delete a movie if there is an actor record which depends on it.


## Multiple Tables - Many-To-Many Relationships

If we try to add another movie we may run into a problem:

```sql
INSERT INTO movies (title, duration, rating) VALUES ('Avengers: Endgame', 181, '12A');
```

Some of our existing actors are in this film so we need to reflect that in our database, but as things stand each actor can only have a single `movie_id`. We need to update our tables so that an actor can be in more than one movie.

What we now have is a **many-to-many** relationship, which we can represent in our database by adding a **join table**. The rows of a join table will represent the different combinations of movies and actors and so will need two foreign keys, one pointing to the `movies` table and one to `actors`. Although it's doing a specific job this is just another table and so we can add other columns containing any other relevant information (eg. character name), plus an `id` column. 

There is a convention around naming join tables which says that they should be named after the two tables which they connect, in this case `movies_actors`. It's not unusual to see them called something more appropriate though, especially if there is other information included, and that's what we'll do here by creating a table called `castings`.

```sql
-- No need to drop movies this time, but need to remove movie_id from actors

DROP TABLE actors;

CREATE TABLE actors (
	id SERIAL PRIMARY KEY,
	name VARCHAR(255)
);

INSERT INTO actors (name) VALUES ('Sigourney Weaver');
INSERT INTO actors (name) VALUES ('Benedict Cumberbatch');
INSERT INTO actors (name) VALUES ('Robert Downey Jr');
INSERT INTO actors (name) VALUES ('Gwyneth Paltrow');

-- Creating join table

CREATE TABLE castings (
	id SERIAL PRIMARY KEY,
	movie_id INT REFERENCES movies(id),
	actor_id INT REFERENCES actors(id),
	character_name VARCHAR(255)
);

INSERT INTO castings (movie_id, actor_id, character_name) VALUES (1, 1, 'Ripley');
INSERT INTO castings (movie_id, actor_id, character_name) VALUES (2, 2, 'Alan Turing');
INSERT INTO castings (movie_id, actor_id, character_name) VALUES (3, 3, 'Tony Stark');
INSERT INTO castings (movie_id, actor_id, character_name) VALUES (3, 4, 'Pepper Potts');
INSERT INTO castings (movie_id, actor_id, character_name) VALUES (5, 2, 'Dr Strange');
INSERT INTO castings (movie_id, actor_id, character_name) VALUES (5, 3, 'Tony Stark');
INSERT INTO castings (movie_id, actor_id, character_name) VALUES (5, 4, 'Pepper Potts');
```

Now a movie can star multiple actors and an actor can appear in multiple movies


## Joining Tables

Although splitting our data across many tables and setting up relationships between them makes it easier to manage, extracting the information becomes more difficult. If we want to find something in a particular table but the only values we have to search by are stored in a different one then a simple `SELECT` query won't work any more. We need to find a way of gathering data from multiple tables at once.

We do this by **joining** tables based on the relationship between them, typically by matching foreign and primary keys. Let's say we want to find information about the movies, but only have the `id` of an actor. The `movies` table doesn't have that information so we need to join it to something that does, in this case the `castings` table. 

```sql
SELECT * FROM movies
INNER JOIN castings
ON movies.id = castings.movie_id;
```

This brings back all of the data for every pairing between `movies` and `castings`. Note that we don't have all of our movies in the resulting table. That's because not all of our movies have cast an actor, so there's nothing to match them with in `castings`. We can limit what we get back by using a `WHERE` clause as before.

```sql
SELECT * FROM movies
INNER JOIN castings
ON movies.id = castings.movie_id
WHERE castings.actor_id = 2;
```

The result of this query is itself a table, but one that doesn't persist in the database. That means we can do the same things to it that we can do to any other table, including joining it to another table. What if we wanted to find the names of the actors cast in a movie? That information isn't included in the result of our last join, so we need to join again.

```sql
SELECT * FROM movies
INNER JOIN castings
ON movies.id = castings.movie_id
INNER JOIN actors
ON castings.actor_id = actors.id;
```

This is getting a bit big to manage, so we can trim down the output by specifying which columns we want to select from each table.

```sql
SELECT movies.title, actors.name FROM movies
INNER JOIN castings
ON movies.id = castings.movie_id
INNER JOIN actors
ON castings.actor_id = actors.id;
```

When dealing with complex table names it can also be helpful to create an **alias** for the table to avoid typing it out in full every time we reference it.

```sql
SELECT m.title, a.name FROM movies AS m
INNER JOIN castings AS c
ON m.id = c.movie_id
INNER JOIN actors AS a
ON c.actor_id = a.id;
```

Often we want to gather all the data from one table, even if there's nothing to match it to. In this case we can use a **left/right join** to include it anyway and fill out the missing values with `NULL`s.

```sql
SELECT * FROM movies
LEFT JOIN castings
ON movies.id = castings.movie_id;
```

## Further Reading

- [PostgreSQL](https://www.postgresql.org/)
- [SQLBolt](https://sqlbolt.com/)
- [Coding Horror - Joins](https://blog.codinghorror.com/a-visual-explanation-of-sql-joins/)
- [SQL Data Types](https://www.postgresql.org/docs/current/datatype.html)
- [Database Structure and Design tutorial](https://www.lucidchart.com/pages/database-diagram/database-design)
- [Database design tools](https://www.holistics.io/blog/top-5-free-database-diagram-design-tools/)
- [MongoDB - A NoSQL database](https://www.mongodb.com/)
- [An Introduction to NoSQL](https://beginnersbook.com/2017/09/introduction-to-nosql/)
