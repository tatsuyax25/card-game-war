import Deck from "./deck.js";

// ===== CARD VALUE MAPPING =====
// Maps card values to numeric values for comparison (Ace is highest)
const CARD_VALUE_MAP = {
    "2": 2,
    "3": 3,
    "4": 4,
    "5": 5,
    "6": 6,
    "7": 7,
    "8": 8,
    "9": 9,
    "10": 10,
    "J": 11,
    "Q": 12,
    "K": 13,
    "A": 14
}

// ===== DOM ELEMENT REFERENCES =====
const computerCardSlot = document.querySelector(".computer-card-slot")
const playerCardSlot = document.querySelector(".player-card-slot")
const computerDeckElement = document.querySelector('.computer-deck')
const playerDeckElement = document.querySelector('.player-deck')
const text = document.querySelector('.text')
const flipBtn = document.getElementById('flipBtn')
const restartBtn = document.getElementById('restartBtn')
const infoBtn = document.getElementById('infoBtn')
const modal = document.getElementById('infoModal')
const closeModal = document.querySelector('.close')
const computerScoreElement = document.querySelector('.computer-score')
const playerScoreElement = document.querySelector('.player-score')

// ===== GAME STATE VARIABLES =====
let playerDeck, computerDeck, inRound, stop, computerScore = 0, playerScore = 0

// ===== EVENT LISTENERS =====
flipBtn.addEventListener('click', handleFlip)
restartBtn.addEventListener('click', startGame)
infoBtn.addEventListener('click', () => modal.style.display = 'block')
closeModal.addEventListener('click', () => modal.style.display = 'none')
// Close modal when clicking outside of it
window.addEventListener('click', (e) => {
    if (e.target === modal) modal.style.display = 'none'
})

// Start game on page load
startGame()

// ===== GAME INITIALIZATION =====
/**
 * Initializes a new game by creating and shuffling deck,
 * splitting cards between players, and resetting scores
 */
function startGame() {
    const deck = new Deck()
    deck.shuffle()

    // Split deck in half for each player
    const deckMidpoint = Math.ceil(deck.numberOfCards / 2)
    playerDeck = new Deck(deck.cards.slice(0, deckMidpoint))
    computerDeck = new Deck(deck.cards.slice(deckMidpoint, deck.numberOfCards))
    inRound = false
    stop = false
    computerScore = 0
    playerScore = 0

    updateScores()
    cleanBeforeRound()
    flipBtn.disabled = false
}

/**
 * Clears the board between rounds and updates deck counts
 */
function cleanBeforeRound() {
    inRound = false
    computerCardSlot.innerHTML = ''
    playerCardSlot.innerHTML = ''
    text.innerText = ''
    updateDeckCount()
}

// ===== GAME FLOW HANDLERS =====
/**
 * Handles flip button click - either cleans board or flips new cards
 */
function handleFlip() {
    if (stop) return
    
    if (inRound) {
        cleanBeforeRound()
    } else {
        flipCards()
    }
}

/**
 * Main game logic - flips cards and determines round winner
 */
function flipCards() {
    inRound = true

    // Draw top card from each deck
    const playerCard = playerDeck.pop()
    const computerCard = computerDeck.pop()

    // Display cards on board
    playerCardSlot.appendChild(playerCard.getHTML())
    computerCardSlot.appendChild(computerCard.getHTML())
    playSound('flip')

    updateDeckCount()

    // Determine round winner
    if (isRoundWinner(playerCard, computerCard)) {
        text.innerText = "You Win Round! 🎉"
        playerDeck.push(playerCard)
        playerDeck.push(computerCard)
        playerScore++
        playSound('win')
    } else if (isRoundWinner(computerCard, playerCard)) {
        text.innerText = "Computer Wins Round 💻"
        computerDeck.push(playerCard)
        computerDeck.push(computerCard)
        computerScore++
        playSound('lose')
    } else {
        // Cards are equal - trigger WAR!
        text.innerText = "⚔️ WAR! ⚔️"
        handleWar([playerCard], [computerCard])
        return
    }

    updateScores()
    checkGameOver()
}

// ===== WAR MECHANICS =====
/**
 * Handles WAR scenario when cards are equal
 * Each player plays 3 face-down cards + 1 face-up card
 * @param {Array} playerCards - Array of player's cards in play
 * @param {Array} computerCards - Array of computer's cards in play
 */
function handleWar(playerCards, computerCards) {
    // Check if either player has insufficient cards for war
    if (playerDeck.numberOfCards < 4 || computerDeck.numberOfCards < 4) {
        const winner = playerDeck.numberOfCards >= computerDeck.numberOfCards ? 'player' : 'computer'
        endWarWithInsufficientCards(winner, playerCards, computerCards)
        return
    }

    // Each player plays 3 face-down cards
    for (let i = 0; i < 3; i++) {
        playerCards.push(playerDeck.pop())
        computerCards.push(computerDeck.pop())
    }

    // Draw the face-up war cards
    const playerWarCard = playerDeck.pop()
    const computerWarCard = computerDeck.pop()
    playerCards.push(playerWarCard)
    computerCards.push(computerWarCard)

    // Delay to show war cards
    setTimeout(() => {
        playerCardSlot.innerHTML = ''
        computerCardSlot.innerHTML = ''
        playerCardSlot.appendChild(playerWarCard.getHTML())
        computerCardSlot.appendChild(computerWarCard.getHTML())
        playSound('flip')
        updateDeckCount()

        // Determine war winner
        if (isRoundWinner(playerWarCard, computerWarCard)) {
            text.innerText = "You Win WAR! 🏆"
            playerCards.concat(computerCards).forEach(card => playerDeck.push(card))
            playerScore += 2 // War rounds worth 2 points
            playSound('win')
        } else if (isRoundWinner(computerWarCard, playerWarCard)) {
            text.innerText = "Computer Wins WAR! 💻"
            playerCards.concat(computerCards).forEach(card => computerDeck.push(card))
            computerScore += 2
            playSound('lose')
        } else {
            // Another tie - recursive war!
            text.innerText = "Another WAR! ⚔️⚔️"
            handleWar(playerCards, computerCards)
            return
        }

        updateScores()
        checkGameOver()
    }, 500)
}

/**
 * Handles war when a player doesn't have enough cards
 * @param {string} winner - 'player' or 'computer'
 * @param {Array} playerCards - Player's cards in play
 * @param {Array} computerCards - Computer's cards in play
 */
function endWarWithInsufficientCards(winner, playerCards, computerCards) {
    if (winner === 'player') {
        text.innerText = "You Win WAR! 🏆"
        playerCards.concat(computerCards).forEach(card => playerDeck.push(card))
        playerScore += 2
    } else {
        text.innerText = "Computer Wins WAR! 💻"
        playerCards.concat(computerCards).forEach(card => computerDeck.push(card))
        computerScore += 2
    }
    updateScores()
    checkGameOver()
}

// ===== GAME STATE CHECKS =====
/**
 * Checks if game is over and displays appropriate message
 */
function checkGameOver() {
    if (isGameOver(playerDeck)) {
        text.innerText = '💔 You Lose!'
        stop = true
        flipBtn.disabled = true
        playSound('gameover')
    } else if (isGameOver(computerDeck)) {
        text.innerText = '🎊 You Win!!'
        stop = true
        flipBtn.disabled = true
        playSound('victory')
    }
}

// ===== UI UPDATE FUNCTIONS =====
/**
 * Updates the deck count display for both players
 */
function updateDeckCount() {
    computerDeckElement.innerText = computerDeck.numberOfCards
    playerDeckElement.innerText = playerDeck.numberOfCards
}

/**
 * Updates the score display for both players
 */
function updateScores() {
    computerScoreElement.innerText = computerScore
    playerScoreElement.innerText = playerScore
}

// ===== GAME LOGIC HELPERS =====
/**
 * Compares two cards to determine winner
 * @param {Card} cardOne - First card to compare
 * @param {Card} cardTwo - Second card to compare
 * @returns {boolean} True if cardOne has higher value
 */
function isRoundWinner(cardOne, cardTwo) {
    return CARD_VALUE_MAP[cardOne.value] > CARD_VALUE_MAP[cardTwo.value]
}

/**
 * Checks if a deck is empty (game over condition)
 * @param {Deck} deck - Deck to check
 * @returns {boolean} True if deck has no cards
 */
function isGameOver(deck) {
    return deck.numberOfCards === 0
}

// ===== SOUND EFFECTS =====
/**
 * Generates sound effects using Web Audio API
 * @param {string} type - Type of sound (flip, win, lose, victory, gameover)
 */
function playSound(type) {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)
    
    // Sound configuration for different events
    const sounds = {
        flip: { freq: 400, duration: 0.1 },
        win: { freq: 600, duration: 0.2 },
        lose: { freq: 200, duration: 0.2 },
        victory: { freq: 800, duration: 0.3 },
        gameover: { freq: 150, duration: 0.3 }
    }
    
    const sound = sounds[type] || sounds.flip
    oscillator.frequency.value = sound.freq
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + sound.duration)
    
    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + sound.duration)
}