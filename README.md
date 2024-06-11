![Képernyőkép ekkor: 2024-06-12 00-01-32](https://github.com/viktor0556/New-todo-list/assets/134110891/0aeb77d6-8a2e-4022-ab47-4b55b368db6d)


## Built with

- [React](https://react.dev/)
- [Node](https://nodejs.org/en)

To get a local copy of the code, clone it using git:

```
git clone https://github.com/viktor0556/New-todo-list.git
```

Install dependencies:

```
npm install
```

**Database setup:** The application uses PostgreSQL for database management. Make sure you have PostgreSQL installed on your system and create a database for the project.

## PostgreSQL initialization and database creation

1. Download: https://www.postgresql.org/download/
2. Create a database: Open a PostgreSQL service such as pgAdmin or psql. Log in with the appropriate user and then create a new database for the project.
3. Create tables: After you have created the database, create tables to store the necessary data. The following example shows how to create a simple question table:
```
CREATE DATABASE todoapp;

\c todoapp

CREATE TABLE todos (
  id SERIAL PRIMARY KEY,
  description VARCHAR(255) NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT false
);

```
4. Setting environment variables: After you have created the database and tables, don't forget to set the project environment variables so that the application can connect to the database. For example:
```
PG_USER=username
PG_HOST=hostname
PG_DATABASE=database_name
PG_PASSWORD=passowrd
PG_PORT=port
```
These variables are usually stored in the .env file and must be set in the appropriate location to use them in the project.

Now, you can start a local web server by running:

```
cd client/ npm start dev
```
```
nodemon server.js
```

And then open http://localhost:3000/ to view it in the browser.
