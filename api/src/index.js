const express = require("express");
const prisma = require("./prisma");
const { pickRandomLetter, pickRandomTopic } = require("./gameData");
const {
  answerValidator,
  gameIsOver,
  getScore,
  getWinner,
} = require("./answerValidator");

const app = express();
const port = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Scattergories is running" });
});

app.post("/games", async (req, res) => {
  const { roomCode } = req.body;

  if (!roomCode) {
    return res.status(400).json({ error: "Room code is required" });
  }

  try {
    const game = await prisma.game.create({
      data: {
        roomCode: roomCode,
        letter: pickRandomLetter(),
        topic: pickRandomTopic(),
      },
    });
    res.status(201).json({
      id: game.id,
      roomCode: game.roomCode,
      letter: game.letter,
      topic: game.topic,
      active: game.active,
      createdAt: game.createdAt.toLocaleString("en-US", {
        dateStyle: "short",
        timeStyle: "short",
      }),
    });
  } catch (error) {
    console.error(error);
    // In prisma P2002 = "Unique constraint failed on the {constraint}"
    if (error.code === "P2002") {
      return res.status(409).json({ error: "Room code already exists" });
    }

    res.status(500).json({ error: "Could not create game" });
  }
});

app.get("/leaderboard", async (req, res) => {
  try {
    const games = await prisma.game.findMany({
      orderBy: {
        createdAt: "asc",
      },
      include: {
        answers: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    const leaderboard = [];

    for (const game of games) {
      if (gameIsOver(game.createdAt)) {
        leaderboard.push({
          roomCode: game.roomCode,
          letter: game.letter,
          topic: game.topic,
          winner: getWinner(game.answers),
        });
      }
    }

    res.json(leaderboard.slice(0, 10));
  } catch (error) {
    console.error(error);

    res.status(500).json({ error: "Could not get leaderboard" });
  }
});

app.get("/leaderboard/:count", async (req, res) => {
  const count = Number(req.params.count);

  if (isNaN(count) || count <= 0) {
    return res
      .status(400)
      .json({ error: "Count must be a number greater than 0" });
  }

  try {
    const games = await prisma.game.findMany({
      orderBy: {
        createdAt: "asc",
      },
      include: {
        answers: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    const leaderboard = [];

    for (const game of games) {
      if (gameIsOver(game.createdAt)) {
        leaderboard.push({
          roomCode: game.roomCode,
          letter: game.letter,
          topic: game.topic,
          winner: getWinner(game.answers),
        });
      }
    }

    res.json(leaderboard.slice(0, count));
  } catch (error) {
    console.error(error);

    res.status(500).json({ error: "Could not get leaderboard" });
  }
});

app.get("/games", async (req, res) => {
  try {
    const games = await prisma.game.findMany({
      select: {
        roomCode: true,
        letter: true,
        topic: true,
        active: true,
        createdAt: true,
        answers: {
          orderBy: {
            createdAt: "asc",
          },
          select: {
            username: true,
            answer: true,
            score: true,
          },
        },
      },
    });

    const gamesWithWinners = games.map((game) => {
      let winner = null;

      if (gameIsOver(game.createdAt)) {
        winner = getWinner(game.answers);
      }

      return {
        roomCode: game.roomCode,
        letter: game.letter,
        topic: game.topic,
        active: game.active,
        winner: winner,
      };
    });

    res.json(gamesWithWinners);
  } catch (error) {
    console.error(error);

    res.status(500).json({ error: "Could not get games" });
  }
});

app.post("/answers", async (req, res) => {
  const { roomCode, username, answer } = req.body;
  if (!roomCode || !username || !answer) {
    return res
      .status(400)
      .json({ error: "Room code, username, and answer are required" });
  }

  try {
    const game = await prisma.game.findUnique({
      where: {
        roomCode: roomCode,
      },
      include: {
        answers: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    if (!game) {
      return res.status(404).json({ error: "Game not found" });
    }

    const answerCheck = answerValidator(answer, game.letter);
    const cleanAnswer = answerCheck.cleanAnswer;

    if (!cleanAnswer) {
      return res.status(400).json({ error: "Answer is required" });
    }

    if (gameIsOver(game.createdAt)) {
      return res.status(400).json({
        error: "Game is over",
        winner: getWinner(game.answers),
      });
    }

    if (!answerCheck.isValid) {
      return res
        .status(400)
        .json({ error: `Answer must start with ${game.letter}` });
    }

    const score = getScore(cleanAnswer);

    await prisma.answer.create({
      data: {
        username: username,
        answer: cleanAnswer,
        score: score,
        gameId: game.id,
      },
    });
    res.json({ accepted: true, score: score });
  } catch (error) {
    console.error(error);

    if (error.code === "P2002") {
      return res.status(409).json({ error: "Answer already taken" });
    }

    res.status(500).json({ error: "Could not submit answer" });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
