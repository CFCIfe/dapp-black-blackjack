import { loadStdlib } from "@reach-sh/stdlib";
import * as backend from "./build/index.main.mjs";
const stdlib = loadStdlib(process.env);

const startingBalance = stdlib.parseCurrency(100);

const [accAlice, accBob] = await stdlib.newTestAccounts(2, startingBalance);
console.log("Hello, Alice and Bob!");

console.log("Launching...");
const ctcAlice = accAlice.contract(backend);
const ctcBob = accBob.contract(backend, ctcAlice.getInfo());
const fmt = (x) => stdlib.formatCurrency(x, 4);
const getBalance = async (who) => fmt(await stdlib.balanceOf(who));

let blackJackGame = {
  deployer: {
    scorespan: 0,
    score: 0,
  },
  attacher: {
    scorespan: 0,
    score: 0,
  },
  cards: ["2", "3", "4", "5", "6", "7", "8", "9", "10", "K", "Q", "J", "A"],
  cardsMap: {
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7,
    8: 8,
    9: 9,
    10: 10,
    K: 10,
    J: 10,
    Q: 10,
    A: [1, 11],
  },
};

const randomCards = () => {
  let randomIndex = Math.floor(Math.random() * 13);
  return blackJackGame["cards"][randomIndex];
};

let AliceCards = [];
let BobCards = [];
let AliceScore = 0;
let BobScore = 0;
let cardValue = {
  value: "",
};
let whoScore = {
  score: 0,
};
let cardA;
const Player = (who) => ({
  ...stdlib.hasRandom,
  PlayerCard: () => {
    let card = randomCards();
    cardA = card;

    who == "Alice"
      ? (whoScore.score = AliceScore)
      : (whoScore.score = BobScore);
    if (card == "A") {
      if (whoScore.score + blackJackGame["cardsMap"][card][1] > 21) {
        cardValue.value = blackJackGame["cardsMap"][card][0];
      } else {
        cardValue.value = blackJackGame["cardsMap"][card][1];
      }
    } else {
      cardValue.value = blackJackGame["cardsMap"][card];
    }

    if (who == "Alice") {
      AliceCards.push(cardValue.value);
      AliceScore = AliceCards.reduce((a, b) => a + b);
      console.log(whoScore.score);
    } else {
      BobCards.push(cardValue.value);
      BobScore = BobCards.reduce((a, b) => a + b);
      console.log(whoScore.score);
    }

    // who == "Alice" ? AliceCards.push(card) : BobCards.push(card);
    console.log(`${who} played ${card}`);

    return cardValue;
  },
  seeCardValue: () => {
    console.log(`${who}(seeCards Obj) cards are ${cardValue.value}`);
    return cardValue.value;
  },
});

console.log("Starting backends...");
await Promise.all([
  backend.Alice(ctcAlice, {
    ...Player("Alice"),
    wager: stdlib.parseCurrency(5),
    aliceScore: () => {
      return AliceScore;
    },
    // implement Alice's interact object here
  }),
  backend.Bob(ctcBob, {
    ...Player("Bob"),
    acceptWager: (amt) => {
      console.log(`Bob accepts the wager of ${fmt(amt)}.`);
    },
    // implement Bob's interact object here
  }),
]);

// AliceScore = AliceCards.reduce((a, b) => a + b);
// AliceScore = AliceCards.reduce((a, b) => a + b);
// BobScore = BobCards.reduce((a, b) => a + b);
console.log(AliceCards);
console.log(BobCards);
console.log(AliceScore);
console.log(BobScore);
console.log("Goodbye, Alice and Bob!");
// To - DO
// Push card in array..
// Implement logic for A card
// implement logic to play when less than 16 or >= 21
