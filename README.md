# 🦖 The Dino King

The Dino King is a 2D multiplayer infinite runner game developed as a technical project assessment.

Players can create or join multiplayer rooms, select a Dino character, compete with other players, jump over obstacles, earn scores, and view the final leaderboard after the game.

---

## 🎮 Features

### Start Menu
- Play
- Character Selection
- Change Character
- Player Name
- Player ID
- Settings

### Multiplayer Rooms
- Create A Room
- Join With Code
- Room Name
- Copy Room Code
- Multiplayer Lobby
- Maximum 6 Players

### Lobby
- Player List
- Player Scores
- Room Code
- Leaderboard
- Owner-only Start Game

### Game
- 2D Infinite Runner
- Dino Jump
- Desktop Space Key Controls
- Mobile Tap Controls
- Random Obstacles
- Increasing Game Speed
- Multiplayer Dino Synchronization
- Real-time Score Updates
- Collision Detection

### Game Over
- Dead Leaderboard
- Player Rank
- Player Score
- Playing / Dead Status
- Play Again
- Back to Lobby

---

## 🛠 Technologies Used

### Frontend
- React.js
- Vite
- JavaScript
- HTML5
- CSS3

### Backend
- Node.js
- Express.js
- Socket.IO

### Development Tools
- Visual Studio Code
- Google Chrome
- Git
- GitHub

---

## 📁 Project Structure

```text
the-dino-king/
│
├── client/
│   ├── public/
│   │
│   ├── src/
│   │   ├── components/
│   │   │   ├── StartMenu.jsx
│   │   │   ├── CharacterSelection.jsx
│   │   │   ├── RoomSelection.jsx
│   │   │   ├── Lobby.jsx
│   │   │   ├── DeadLeaderboard.jsx
│   │   │   └── Settings.jsx
│   │   │
│   │   ├── game/
│   │   │   └── Game.jsx
│   │   │
│   │   ├── socket/
│   │   │   └── socket.js
│   │   │
│   │   ├── styles/
│   │   │   ├── StartMenu.css
│   │   │   ├── CharacterSelection.css
│   │   │   ├── RoomSelection.css
│   │   │   ├── Lobby.css
│   │   │   ├── Game.css
│   │   │   ├── DeadLeaderboard.css
│   │   │   └── Settings.css
│   │   │
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── server.js
│   └── package.json
│
├── README.md
└── .gitignore

## 🚀 How to Run This Project

### 1. Start Backend Server

Open Terminal 1 and run:

    cd server
    npm install
    npm run dev

Backend server:

    http://localhost:5000

Keep this terminal running.

### 2. Start Frontend

Open Terminal 2 and run:

    cd client
    npm install
    npm run dev

Vite will display the frontend URL, for example:

    http://localhost:5174

Open the displayed URL in Google Chrome.

### 3. Start Playing

    Start Menu
        ↓
    Play
        ↓
    Character Selection
        ↓
    Create A Room / Join With Code
        ↓
    Multiplayer Lobby
        ↓
    Start Game
        ↓
    Play

### 4. Multiplayer Testing

- Open the game in Browser 1.
- Select Play.
- Select a Dino character.
- Create a room.
- Copy the room code.
- Open another browser or Incognito window.
- Open the same frontend URL.
- Select Play.
- Select a Dino character.
- Select Join With Code.
- Enter the room code.
- Both players will appear in the lobby.
- The room owner clicks START GAME.

### 5. Controls

**Desktop:** Press `SPACE` to jump.

**Mobile:** Tap the game screen to jump.