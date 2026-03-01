# ⚔️ War - Card Game

A modern, interactive implementation of the classic card game "War" built with vanilla JavaScript, HTML, and CSS.

![War Card Game](https://img.shields.io/badge/game-war-blue) ![JavaScript](https://img.shields.io/badge/javascript-ES6-yellow) ![License](https://img.shields.io/badge/license-MIT-green)

## 🎮 Game Overview

War is a simple yet engaging card game where two players compete to win all 52 cards. Each round, players flip their top card - the higher card wins both cards. When cards tie, it's WAR! Players play 3 face-down cards and 1 face-up card, with the highest winning all cards in play.

## ✨ Features

- **Proper War Mechanics**: Full implementation of war rounds when cards tie
- **Score Tracking**: Real-time tracking of rounds won by each player
- **Modern UI**: Beautiful gradient design with smooth animations
- **Sound Effects**: Audio feedback for flips, wins, and game events
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Game Instructions**: Built-in modal with complete game rules
- **Visual Feedback**: Card flip animations and color-coded decks

## 🚀 Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- No additional dependencies required!

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/card-game-war.git
```

2. Navigate to the project directory:
```bash
cd card-game-war
```

3. Open `index.html` in your web browser:
```bash
open index.html
```

Or simply double-click the `index.html` file.

## 🎲 How to Play

1. Click **"Flip Cards"** to reveal the top card from each deck
2. The higher card wins both cards (Ace is highest, 2 is lowest)
3. If cards are equal, it's **WAR**:
   - Each player plays 3 face-down cards
   - Then 1 face-up card
   - Highest face-up card wins all cards in play
4. Game continues until one player has all 52 cards
5. Click **"New Game"** to restart anytime

### Card Rankings
```
Ace (highest) > King > Queen > Jack > 10 > 9 > 8 > 7 > 6 > 5 > 4 > 3 > 2 (lowest)
```

## 💻 Project Structure

```
card-game-war/
│
├── index.html      # Main HTML structure
├── styles.css      # Styling and animations
├── script.js       # Game logic and event handlers
├── deck.js         # Deck and Card classes
└── README.md       # Documentation
```

## 🛠️ Technical Details

### Technologies Used

- **HTML5**: Semantic markup and structure
- **CSS3**: Modern styling with flexbox, grid, gradients, and animations
- **JavaScript ES6+**: Modules, classes, arrow functions, and Web Audio API

### Key Components

#### Deck Class (`deck.js`)
- Manages card collection
- Shuffle algorithm (Fisher-Yates)
- Card creation and rendering

#### Game Logic (`script.js`)
- Round management
- War scenario handling
- Score tracking
- Sound generation using Web Audio API

#### Styling (`styles.css`)
- Responsive design with media queries
- CSS animations (card flips, modal transitions)
- Modern gradient backgrounds
- Accessible UI components

## 🌟 Features Breakdown

### 1. War Mechanics
Proper implementation of war rounds:
- Detects tied cards
- Handles multiple consecutive wars
- Manages insufficient cards scenario

### 2. Score System
- Tracks rounds won (not just cards)
- War rounds count as 2 points
- Persistent display throughout game

### 3. Sound Effects
Generated using Web Audio API:
- Card flip sounds
- Win/lose feedback
- Victory/game over themes

### 4. Animations
- Card flip entrance animation
- Button hover effects
- Modal slide-in transition
- Smooth deck count updates

## 📱 Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the project
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the MIT License.

## 👏 Acknowledgments

- Inspired by the classic card game War
- Built as a learning project for vanilla JavaScript
- No external libraries or frameworks used

## 📧 Contact

For questions or suggestions, please open an issue on GitHub.

---

Enjoy playing War! ⚔️🎴
