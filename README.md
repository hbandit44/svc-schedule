## Description

Schedule and Task service for creating schedules and corresponding tasks

## Project setup

```bash
$ cp .env.example .env
```
Create database within same settings as found within .env file and ensure that you can connect to it.
```
$ yarn install
$ yarn migrate:dev
```

## Compile and run the project

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Run tests

```bash
# unit tests
$ yarn run test

# test coverage
$ yarn run test:cov
```

## Deployment

Not tested

```bash
$ yarn install -g mau
$ yarn migrate:prod
$ mau deploy
```

## Improvements

1. Set up different databases for test.
2. Controller tests, ensure that mocked services are called with correct args.
3. Better loading and deleting of fixtures into DB for test.
4. Alter schedule queries so all return calculated **duration** field
5. Confirm all libs required in package.json
6. Return count on /schedule requests to prevent un needed requests to /task endpoint
