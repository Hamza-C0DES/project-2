# Scattergories API

Express + Prisma + PostgreSQL API for Scattergories.

## Install

```bash
yarn install
```

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Update `DATABASE_URL` in `.env`:

```text
DATABASE_URL="postgresql://username:password@localhost:5432/scattergories?schema=public"
```

Push the Prisma schema to the database:

```bash
yarn db:push
```

## Usage

Start the API:

```bash
yarn dev
```

The server runs at:

```text
http://localhost:3000
```

Routes:

```text
GET /
POST /games
GET /games
POST /answers
```

Create a game:

```json
POST /games
{
  "roomCode": "PLUM42"
}
```

Submit an answer:

```json
POST /answers
{
  "roomCode": "PLUM42",
  "username": "sam",
  "answer": "Bear"
}
```

Expose the API with ngrok:

```bash
ngrok http 3000
```

Database dumps go in:

```text
data/
```

Use pgAdmin Backup/Restore to export or import the database dump.

## AI Disclosure

Our team used AI as a coding partner while building this project. We used it for planning, debugging, and explanations before implementing code so we could understand what each route, Prisma query, and validation check was doing before writing it out.
