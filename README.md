# Scattergories

Express + Prisma + PostgreSQL API for the Scattergories group project.

## Project Structure

```text
project-2/
├── api/        # Express + Prisma server
├── client/     # Optional React client
├── data/       # pgAdmin database dump files
└── README.md
```

## Required API Routes

```text
POST /games
GET /games
POST /answers
```

## Setup Notes

1. Create a PostgreSQL database.
2. Add your database URL to `api/.env`.
3. Run the API from the `api` folder.
4. Use ngrok to expose the API when classmates need to play:

```bash
ngrok http 3000
```

## AI Use

GPT was used for planning, guidance, and debugging issues along with code snippets.
