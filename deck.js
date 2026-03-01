// ===== CARD CONSTANTS =====
// All possible card suits
const SUITS = ["♠", "♣", "♥", "♦"]
// All possible card values (Ace through King)
const VALUES = [
    "A",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "J",
    "Q",
    "K"
]

// ===== DECK CLASS =====
/**
 * Represents a deck of playing cards
 */
export default class Deck {
    /**
     * Creates a new deck
     * @param {Array} cards - Optional array of cards (defaults to fresh 52-card deck)
     */
    constructor(cards = freshDeck()) {
        this.cards = cards
    }

    /**
     * Gets the number of cards remaining in deck
     * @returns {number} Number of cards
     */
    get numberOfCards() {
        return this.cards.length
    }

    /**
     * Removes and returns the top card from deck
     * @returns {Card} The top card
     */
    pop() {
        return this.cards.shift()
    }

    /**
     * Adds a card to the bottom of the deck
     * @param {Card} card - Card to add
     */
    push(card) {
        this.cards.push(card)
    }

    /**
     * Shuffles the deck using Fisher-Yates algorithm
     */
    shuffle() {
        for (let i = this.numberOfCards - 1; i > 0; i--) {
            const newIndex = Math.floor(Math.random() * (i + 1))
            const oldValue = this.cards[newIndex]
            this.cards[newIndex] = this.cards[i]
            this.cards[i] = oldValue
        }
    }
}

// ===== CARD CLASS =====
/**
 * Represents a single playing card
 */
class Card {
    /**
     * Creates a new card
     * @param {string} suit - Card suit (♠, ♣, ♥, ♦)
     * @param {string} value - Card value (A, 2-10, J, Q, K)
     */
    constructor(suit, value) {
        this.suit = suit
        this.value = value
    }

    /**
     * Gets the color of the card based on suit
     * @returns {string} "black" for clubs/spades, "red" for hearts/diamonds
     */
    get color() {
        return this.suit === "♣" || this.suit === "♠" ? "black" : "red"
    }

    /**
     * Creates and returns an HTML element representing the card
     * @returns {HTMLElement} Div element with card styling
     */
    getHTML() {
        const cardDiv = document.createElement("div")
        cardDiv.innerText = this.suit
        cardDiv.classList.add("card", this.color)
        cardDiv.dataset.value = `${this.value} ${this.suit}`
        return cardDiv
    }
}

// ===== DECK CREATION =====
/**
 * Creates a fresh 52-card deck
 * @returns {Array<Card>} Array of 52 cards (all suits and values)
 */
function freshDeck() {
    return SUITS.flatMap(suit => {
        return VALUES.map(value => {
            return new Card(suit, value)
        })
    })
}