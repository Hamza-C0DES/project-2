const express = require("express");
const prisma = require("./prisma");
const { pickRandomLetter, pickRandomTopic } = require("./gameData");

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
    res.status(201).json(game);
  } catch (error) {
    console.error(error);
    // In prisma P2002 = "Unique constraint failed on the {constraint}"
    if (error.code === "P2002") {
      return res.status(409).json({ error: "Room code already exists" });
    }

    res.status(500).json({ error: "Could not create game" });
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
      },
    });
    res.json(games);
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
    });

    if (!game) {
      return res.status(404).json({ error: "Game not found" });
    }
    if (!answer.toUpperCase().startsWith(game.letter)) {
      return res
        .status(400)
        .json({ error: `Answer must start with ${game.letter}` });
    }

    await prisma.answer.create({
      data: {
        username: username,
        answer: answer,
        gameId: game.id,
      },
    });
    res.json({ accepted: true });
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
