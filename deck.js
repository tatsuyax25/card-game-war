const SUITS = ["♠", "♣", "♥", "♦"]
const VALUES = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"]

export default class Deck {
    constructor(cards = freshDeck()) {
        this.cards = cards
    }

    get numberOfCards() {
        return this.cards.length
    }
    
    shuffle() { // Randomly reshuffle the cards
        for (i = this.numberOfCards - 1; i > 0; i--) {
            const newIndex = Math.floor(Math.random() * (i + 1))
            const oldValue = this.cards[newIndex]
            this.cards[newIndex] = this.cards[i]
            this.cards[i] = oldValue
        }
    }
}

class Card {
    constructor(suit, value) {
        this.suit = suit
        this.value = value
    }

    get color() {
        return this.suit === '♣' || this.suit === '♠' ? 'black' : 'red'
    }

    getHTML() {
        const cardDiv = document.createElement('div')
        cardDiv.innerText = this.suit
        cardDiv.classList.add("card", this.color)
        cardDiv.dataset.value = `${this.value} ${this.suit}`
        return cardDiv
    }
}

function freshDeck() {
    return SUITS.flatMap(suit => { // .flatMap condences all the number of an array into 1 array
        return VALUES.map(value => { // VALUES.map will condence all array into 1 array
            return new Card(suit, value)
        })
    })
}