const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const topics = [
  "Cities",
  "Animals",
  "Foods",
  "Movies",
  "Video Games",
  "Countries",
];

function pickRandomLetter() {
  const randomLetterIndex = Math.floor(Math.random() * letters.length);
  return letters[randomLetterIndex];
}

function pickRandomTopic() {
  const randomTopicIndex = Math.floor(Math.random() * topics.length);
  return topics[randomTopicIndex];
}

module.exports = {
  letters,
  topics,
  pickRandomLetter,
  pickRandomTopic,
};
