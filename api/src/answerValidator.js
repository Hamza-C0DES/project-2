function answerValidator(answer, requiredFirstLetter) {
  const cleanAnswer = answer.trim().toLowerCase();

  if (cleanAnswer.toUpperCase().startsWith(requiredFirstLetter)) {
    return {
      isValid: true,
      cleanAnswer: cleanAnswer,
    };
  } else {
    return {
      isValid: false,
      cleanAnswer: cleanAnswer,
    };
  }
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

function getScore(answer) {
  const score = answer.replaceAll(" ", "");
  return Math.max(1, Math.floor(score.length / 2));
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
  gameIsOver,
  getScore,
  getWinner,
};
