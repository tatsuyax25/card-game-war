import Deck from "./deck.js";

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

let playerDeck, computerDeck, inRound, stop, computerScore = 0, playerScore = 0

flipBtn.addEventListener('click', handleFlip)
restartBtn.addEventListener('click', startGame)
infoBtn.addEventListener('click', () => modal.style.display = 'block')
closeModal.addEventListener('click', () => modal.style.display = 'none')
window.addEventListener('click', (e) => {
    if (e.target === modal) modal.style.display = 'none'
})

startGame()

function startGame() {
    const deck = new Deck()
    deck.shuffle()

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

function cleanBeforeRound() {
    inRound = false
    computerCardSlot.innerHTML = ''
    playerCardSlot.innerHTML = ''
    text.innerText = ''
    updateDeckCount()
}

function handleFlip() {
    if (stop) return
    
    if (inRound) {
        cleanBeforeRound()
    } else {
        flipCards()
    }
}

function flipCards() {
    inRound = true

    const playerCard = playerDeck.pop()
    const computerCard = computerDeck.pop()

    playerCardSlot.appendChild(playerCard.getHTML())
    computerCardSlot.appendChild(computerCard.getHTML())
    playSound('flip')

    updateDeckCount()

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
        text.innerText = "⚔️ WAR! ⚔️"
        handleWar([playerCard], [computerCard])
        return
    }

    updateScores()
    checkGameOver()
}

function handleWar(playerCards, computerCards) {
    if (playerDeck.numberOfCards < 4 || computerDeck.numberOfCards < 4) {
        const winner = playerDeck.numberOfCards >= computerDeck.numberOfCards ? 'player' : 'computer'
        endWarWithInsufficientCards(winner, playerCards, computerCards)
        return
    }

    for (let i = 0; i < 3; i++) {
        playerCards.push(playerDeck.pop())
        computerCards.push(computerDeck.pop())
    }

    const playerWarCard = playerDeck.pop()
    const computerWarCard = computerDeck.pop()
    playerCards.push(playerWarCard)
    computerCards.push(computerWarCard)

    setTimeout(() => {
        playerCardSlot.innerHTML = ''
        computerCardSlot.innerHTML = ''
        playerCardSlot.appendChild(playerWarCard.getHTML())
        computerCardSlot.appendChild(computerWarCard.getHTML())
        playSound('flip')
        updateDeckCount()

        if (isRoundWinner(playerWarCard, computerWarCard)) {
            text.innerText = "You Win WAR! 🏆"
            playerCards.concat(computerCards).forEach(card => playerDeck.push(card))
            playerScore += 2
            playSound('win')
        } else if (isRoundWinner(computerWarCard, playerWarCard)) {
            text.innerText = "Computer Wins WAR! 💻"
            playerCards.concat(computerCards).forEach(card => computerDeck.push(card))
            computerScore += 2
            playSound('lose')
        } else {
            text.innerText = "Another WAR! ⚔️⚔️"
            handleWar(playerCards, computerCards)
            return
        }

        updateScores()
        checkGameOver()
    }, 500)
}

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

function updateDeckCount() {
    computerDeckElement.innerText = computerDeck.numberOfCards
    playerDeckElement.innerText = playerDeck.numberOfCards
}

function updateScores() {
    computerScoreElement.innerText = computerScore
    playerScoreElement.innerText = playerScore
}

function isRoundWinner(cardOne, cardTwo) {
    return CARD_VALUE_MAP[cardOne.value] > CARD_VALUE_MAP[cardTwo.value]
}

function isGameOver(deck) {
    return deck.numberOfCards === 0
}

function playSound(type) {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)
    
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