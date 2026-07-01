# Scattergories Game

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

## Database Setup

Create a PostgreSQL database named:

```text
scattergories
```

Option 1: restore the included dump with pgAdmin.

```text
data/dump.sql
```

In pgAdmin, create an empty database, right-click it, choose Restore, and select `data/dump.sql`.

Option 2: push the Prisma schema:

```bash
yarn db:push
```

## Start

```bash
yarn dev
```

The API runs locally at:

```text
http://localhost:3000
```

## How To Play

Use Insomnia, or a frontend to send requests.

1. Create a game:

```text
POST http://localhost:3000/games
```

Body:

```json
{
  "roomCode": "PLUM42"
}
```

2. List games:

```text
GET http://localhost:3000/games
```

3. Submit an answer:

```text
POST http://localhost:3000/answers
```

Body:

```json
{
  "roomCode": "PLUM42",
  "username": "user1",
  "answer": "Bear"
}
```

The answer must start with the game's letter. Duplicate answers in the same room are rejected.

4. View winners:

```text
GET http://localhost:3000/games
```

After 5 minutes, games show a winner with username, score, and accepted answers.

You can also use:

```text
GET http://localhost:3000/leaderboard
GET http://localhost:3000/leaderboard/5
```

## AI Disclosure

Our team used AI as a coding partner while building this project. We used it for planning, debugging, and explanations before implementing code so we could understand what each route, Prisma query, and validation check was doing before writing it out.
