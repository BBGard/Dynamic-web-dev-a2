# Incense Voice

## Setup
### Database
The databse is provided in `ITECH3108_30399545_a2.sql`

NOTE: The following assumes you have PostgreSQL setup on your pc with a default user of `postgres`
To setup the database:

#### Connect to psql
```
psql -h localhost -U postgres
```

#### Setup the database
```
\i database_setup.sql
```

### Database Notes
The database is setup with the following members:
### Initial user accounts
- `ben: mypassword123`
- `adam: bossman69`
- `julie: elchapo456`
- `crystal: password`

## Run The App
The run the app, enter the following into the terminal
```
deno run --allow-net --allow-env --allow-read server.js
```
## Dev Notes
