# 🖥️ StationBook

## What is StationBook?

A web-based application for booking workstations/desktops for a defined timeslot for a Coding School. The school currently has more students than workstations, and now it requires a booking system to better manage its resources.

## Architecture

- A Prisma/Express/Postgres stack application
- Server side that exposes API endpoints with guarded routes through stateless JWT instead of sessions, has a centralized errorHandler middleware standardizing errors
- Uses prisma ORM to quickly query the PostgreSQL database with a Prisma client, and
- Provides robust and meaningful responses to the client.

Design:

request -> middleware -> routeguard -> router -> service -> Prisma -> Postgres -> error handler -> response

Prisma Models:

- **User**
- **Workstation**
- **Booking**

## Design Decisions

1. **Partial Unique Index**: We create a partial unique index condition at the database level. A booking must have a unique workstation and startTime as long as its Status reads 'Booked'. Database enforces that two simultaneous requests do not get recorded, which would not be possible with an application level conditional.

2. **Multiple Active User Bookings Not Allowed**: Users are not allowed to have two (2) active bookings, this prevents users to exploit the app and monopolise scheduling. This is enforced in application code rather than by a database constraint, so unlike the rule above it is not safe against two simultaneous requests... a known limitation.

3. **Timeslots Are Predefined**: For simplicity, currently, timeslots are predefined, extracted from a constant. Ideally, in a near future, flexible timeslots will be introduced with the addition of a Slot table.

4. **Keeping Cancelled Bookings**: To prevent abuse of the booking cancelation feature, we are keeping and tracking all cancelled bookings. This will serve for future action by administration.

## Tests

Currently we are testing the following endpoints and configurations:

1. POST /auth/register
2. POST /auth/login
3. POST /api/bookings
4. Correct injection on test environment variables

Important written tests:

1. POST /auth/login
   1.Unauthorized Requests:
   1. Returns 401 for invalid/unknown email or password
   2. Returns same status code and response body for invalid/unknown email or password
2. POST /api/bookings
   1. Checking for Database enforcement on double workstation booking

## How to Run the App

Steps to run the app:

1. Clone repository - `git clone git@github.com:cnapolea/stationbook.git`
2. Install dependencies and dev dependencies (if you wish to run tests) - `pnpm install `
3. Create both db (for testing and development) - `createdb <stationbook_dev | stationbook_test>`
4. Create .env files (see below)
5. Migrate - `prisma migrate deploy`
6. Seed - `prisma db seed`
7. Run - `pnpm run dev`

The application run with:

- Node.js version 22.23.1
- PostgreSQL version 17
- ENV file name convention: `.env.<purpose>`
- You must create two (2) .env files (one to run the app and the other for testing):

1. .env
2. .env.test

```
.env structure

DATABASE_URL="postgres://<username>@localhost:5432/<database_name>"
JWT_SECRET="XXXXXXXXXX"
PORT=XXXX
```

```
.env.test structure

DATABASE_URL="postgres://<username>@localhost:5432/<database_name>"
JWT_SECRET="XXXXXXXXXX"
```

To quickly start the server, you must move to **server/** and run `<package-manager> run dev` example `pnpm run dev`.

To run tests, you have to execute the following scripts in order:

1. (Every time migration changes, and/or after each cloning) `pnpm test:migrate`
2. (First time running tests only) `pnpm test:seed`
3. `pnpm test`

## What is not built

1. Integration w/ 42 Intranet: This is part of the second part of development. Postponing this feature in order to ship a production grade app before adding OAuth authentication
2. Flexible timeslots mechanism: Postpone for a later stage of development to allow for a rapid development and shipment of the app
3. React client side: To be implemented in the next phase of development. Pending development of regression suite for backend hardening.
