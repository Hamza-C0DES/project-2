function answerValidator(userInput, requiredFirstLetter) {
  if (userInput.toUpperCase().startsWith(requiredFirstLetter)) {
    return true;
  } else {
    return false;
  }
}

function normalizeAnswer(answer) {
  return answer.trim().toLowerCase();
}

function gameIsOver(createdAt) {
  const now = new Date();
  const fiveMinutes = 5 * 60 * 1000;
  const gameAge = now - createdAt;

  if (gameAge > fiveMinutes) {
    return true;
  } else {
    return false;
  }
}

function getScore() {
  return 1;
}

function getWinner(answers) {
  const players = {};
  let winner = null;

  for (const answer of answers) {
    if (!players[answer.username]) {
      players[answer.username] = {
        username: answer.username,
        score: 0,
        answers: [],
      };
    }

    players[answer.username].score =
      players[answer.username].score + answer.score;
    players[answer.username].answers.push(answer.answer);

    if (!winner || players[answer.username].score > winner.score) {
      winner = players[answer.username];
    }
  }

  return winner;
}

module.exports = {
  answerValidator,
  normalizeAnswer,
  gameIsOver,
  getScore,
  getWinner,
};
