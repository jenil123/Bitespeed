# Interview Backend Task - BiteSpeed

## Problem Statement

[Problem Statement Doc Link](https://docs.google.com/document/d/17av-nsBTYyLyoMCS6bu9M8BaqOaAAct4/edit?ouid%3B=113552835232480503506&rtpof%3B=true&sd%3B=true)

### Technology used

* DB
  * Postgres
* Backend
  * Node JS With Typescript

### Explanation

We will first create a postgres user `postgres_user` and set a password. We will then create a DB named BiteSpeed. To connect it to backend we will use `Sequelize` npm package and create a singleton connection. We will then create a table named contact with the schema given in the problem statement. The table will be created by the model written in NodeJS. We will then create a route `/identify` and return the JSON response as expected.

## Pre-requisites

* PostgreSQL
* NodeJS & npm

## Run Project

Create a user `postgres_user` with a password from psql

> ```$ CREATE USER postgres_user PASSWORD "qwerty123456" CREATEDB LOGIN SUPERADMIN```

Use psql with the newly created user and create a database BiteSpeed

> ```$ CREATE DATABASE BiteSpeed```

Run nodejs server

> ```$ npm run start:api```
