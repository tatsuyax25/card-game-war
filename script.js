import Deck from "./deck";

const computerCardSlot = document.querySelector('.computer-card-slot')

const deck = new Deck()
deck.shuffle()
console.log(deck.cards)

computerCardSlot.appendChild(deck.cards[0].getHTML())