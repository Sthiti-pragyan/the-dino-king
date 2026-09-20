const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

const app = express();

const server = http.createServer(app);

// =========================================================
// MIDDLEWARE
// =========================================================

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
    ],
    methods: [
      "GET",
      "POST",
    ],
  })
);

app.use(
  express.json()
);


// =========================================================
// SOCKET.IO
// =========================================================

const io = new Server(
  server,
  {
    cors: {
      origin: [
        "http://localhost:5173",
        "http://localhost:5174",
      ],

      methods: [
        "GET",
        "POST",
      ],
    },
  }
);


// =========================================================
// BASIC TEST ROUTE
// =========================================================

app.get(
  "/",
  (req, res) => {
    res.json({
      message:
        "The Dino King Backend is running!",
    });
  }
);


// =========================================================
// ROOMS
// =========================================================

// For this assessment prototype,
// rooms are stored in memory.

const rooms =
  new Map();


// =========================================================
// DINO COLORS
// =========================================================

const DINO_COLORS = [
  "red",
  "blue",
  "green",
  "yellow",
  "purple",
  "orange",
];


// =========================================================
// GENERATE ROOM CODE
// =========================================================

function generateRoomCode() {
  let code;

  do {
    code =
      Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase();
  } while (
    rooms.has(code)
  );

  return code;
}


// =========================================================
// GENERATE PLAYER ID
// =========================================================

function generatePlayerId() {
  return (
    "DINO-" +
    Math.random()
      .toString(36)
      .substring(2, 7)
      .toUpperCase()
  );
}


// =========================================================
// GET ROOM
// =========================================================

function getRoom(roomCode) {
  if (!roomCode) {
    return null;
  }

  return rooms.get(
    roomCode
  );
}


// =========================================================
// FIND AVAILABLE DINO COLOR
// =========================================================

function getAvailableColor(
  room
) {
  const usedColors =
    room.players.map(
      (player) =>
        player.color
    );

  return DINO_COLORS.find(
    (color) =>
      !usedColors.includes(
        color
      )
  );
}


// =========================================================
// SOCKET CONNECTION
// =========================================================

io.on(
  "connection",
  (socket) => {
    console.log(
      "Player connected:",
      socket.id
    );


    // =======================================================
    // CREATE ROOM
    // =======================================================

    socket.on(
      "create-room",
      ({
        roomName,
        player,
      }) => {
        try {
          if (
            !roomName ||
            !roomName.trim()
          ) {
            socket.emit(
              "room-error",
              {
                message:
                  "Room name is required.",
              }
            );

            return;
          }

          if (!player) {
            socket.emit(
              "room-error",
              {
                message:
                  "Player information is missing.",
              }
            );

            return;
          }

          const roomCode =
            generateRoomCode();

          const playerId =
            player.playerId ||
            generatePlayerId();

          const newPlayer = {
            playerId,

            name:
              player.name ||
              "Dino",

            color:
              player.character?.color ||
              "red",

            character:
              player.character ||
              {
                color: "red",
              },

            score: 0,

            status:
              "playing",
          };

          const room = {
            roomCode,

            roomName:
              roomName.trim(),

            ownerId:
              playerId,

            players: [
              newPlayer,
            ],

            gameStarted:
              false,
          };

          rooms.set(
            roomCode,
            room
          );

          socket.join(
            roomCode
          );

          socket.roomCode =
            roomCode;

          socket.playerId =
            playerId;

          console.log(
            `Room created: ${roomCode}`
          );

          console.log(
            `Owner: ${playerId}`
          );

          socket.emit(
            "room-created",
            room
          );
        } catch (error) {
          console.error(
            "CREATE ROOM ERROR:",
            error
          );

          socket.emit(
            "room-error",
            {
              message:
                "Unable to create room.",
            }
          );
        }
      }
    );


    // =======================================================
    // JOIN ROOM
    // =======================================================

    socket.on(
      "join-room",
      ({
        roomCode,
        player,
      }) => {
        try {
          if (
            !roomCode ||
            !roomCode.trim()
          ) {
            socket.emit(
              "room-error",
              {
                message:
                  "Room code is required.",
              }
            );

            return;
          }

          if (!player) {
            socket.emit(
              "room-error",
              {
                message:
                  "Player information is missing.",
              }
            );

            return;
          }

          const code =
            roomCode
              .trim()
              .toUpperCase();

          const room =
            getRoom(code);

          if (!room) {
            socket.emit(
              "room-error",
              {
                message:
                  "Room not found.",
              }
            );

            return;
          }

          if (
            room.players.length >=
            6
          ) {
            socket.emit(
              "room-error",
              {
                message:
                  "Room is full. Maximum 6 players.",
              }
            );

            return;
          }

          if (
            room.gameStarted
          ) {
            socket.emit(
              "room-error",
              {
                message:
                  "Game has already started.",
              }
            );

            return;
          }

          const availableColor =
            getAvailableColor(
              room
            );

          if (
            !availableColor
          ) {
            socket.emit(
              "room-error",
              {
                message:
                  "No Dino colors are available.",
              }
            );

            return;
          }

          const playerId =
            player.playerId ||
            generatePlayerId();

          const newPlayer = {
            playerId,

            name:
              player.name ||
              "Dino",

            color:
              availableColor,

            character: {
              ...(player.character ||
                {}),
              color:
                availableColor,
            },

            score: 0,

            status:
              "playing",
          };

          room.players.push(
            newPlayer
          );

          rooms.set(
            code,
            room
          );

          socket.join(
            code
          );

          socket.roomCode =
            code;

          socket.playerId =
            playerId;

          console.log(
            `${playerId} joined room ${code}`
          );

          socket.emit(
            "room-joined",
            room
          );

          io.to(code).emit(
            "room-updated",
            room
          );
        } catch (error) {
          console.error(
            "JOIN ROOM ERROR:",
            error
          );

          socket.emit(
            "room-error",
            {
              message:
                "Unable to join room.",
            }
          );
        }
      }
    );


    // =======================================================
    // START GAME
    // ONLY ROOM OWNER
    // =======================================================

    socket.on(
      "start-game",
      () => {
        const roomCode =
          socket.roomCode;

        const playerId =
          socket.playerId;

        if (
          !roomCode ||
          !playerId
        ) {
          return;
        }

        const room =
          getRoom(roomCode);

        if (!room) {
          return;
        }

        if (
          room.ownerId !==
          playerId
        ) {
          socket.emit(
            "room-error",
            {
              message:
                "Only the room owner can start the game.",
            }
          );

          return;
        }

        // Reset everyone for
        // the new game round.
        room.gameStarted =
          true;

        room.players =
          room.players.map(
            (player) => ({
              ...player,

              score: 0,

              status:
                "playing",
            })
          );

        rooms.set(
          roomCode,
          room
        );

        console.log(
          `Game started in room ${roomCode}`
        );

        io.to(roomCode).emit(
          "game-started",
          room
        );

        io.to(roomCode).emit(
          "room-updated",
          room
        );
      }
    );


    // =======================================================
    // SCORE UPDATE
    // =======================================================

    socket.on(
      "score-update",
      ({ score }) => {
        const roomCode =
          socket.roomCode;

        const playerId =
          socket.playerId;

        if (
          !roomCode ||
          !playerId ||
          typeof score !==
            "number"
        ) {
          return;
        }

        const room =
          getRoom(roomCode);

        if (!room) {
          return;
        }

        const roomPlayer =
          room.players.find(
            (player) =>
              player.playerId ===
              playerId
          );

        if (!roomPlayer) {
          return;
        }

        // Never allow score
        // to go backwards.
        const newScore =
          Math.max(
            roomPlayer.score,
            Math.floor(score)
          );

        roomPlayer.score =
          newScore;

        room.players =
          room.players.map(
            (player) =>
              player.playerId ===
              playerId
                ? roomPlayer
                : player
          );

        rooms.set(
          roomCode,
          room
        );

        io.to(roomCode).emit(
          "room-updated",
          room
        );
      }
    );


    // =======================================================
    // PLAYER DIED
    // =======================================================

    socket.on(
      "player-died",
      ({ score }) => {
        const roomCode =
          socket.roomCode;

        const playerId =
          socket.playerId;

        if (
          !roomCode ||
          !playerId
        ) {
          return;
        }

        const room =
          getRoom(roomCode);

        if (!room) {
          return;
        }

        const roomPlayer =
          room.players.find(
            (player) =>
              player.playerId ===
              playerId
          );

        if (!roomPlayer) {
          return;
        }

        if (
          typeof score ===
          "number"
        ) {
          roomPlayer.score =
            Math.max(
              roomPlayer.score,
              Math.floor(score)
            );
        }

        roomPlayer.status =
          "dead";

        room.players =
          room.players.map(
            (player) =>
              player.playerId ===
              playerId
                ? roomPlayer
                : player
          );

        rooms.set(
          roomCode,
          room
        );

        console.log(
          `Player ${roomPlayer.name} died with score ${roomPlayer.score}`
        );

        io.to(roomCode).emit(
          "player-status",
          {
            playerId,

            status:
              "dead",

            score:
              roomPlayer.score,
          }
        );

        io.to(roomCode).emit(
          "room-updated",
          room
        );
      }
    );


    // =======================================================
    // RESET GAME
    // =======================================================

    socket.on(
      "reset-game",
      () => {
        const roomCode =
          socket.roomCode;

        const playerId =
          socket.playerId;

        if (
          !roomCode ||
          !playerId
        ) {
          return;
        }

        const room =
          getRoom(roomCode);

        if (!room) {
          return;
        }

        if (
          room.ownerId !==
          playerId
        ) {
          socket.emit(
            "room-error",
            {
              message:
                "Only the room owner can reset the game.",
            }
          );

          return;
        }

        room.gameStarted =
          false;

        room.players =
          room.players.map(
            (player) => ({
              ...player,

              score: 0,

              status:
                "playing",
            })
          );

        rooms.set(
          roomCode,
          room
        );

        console.log(
          `Game reset in room ${roomCode}`
        );

        io.to(roomCode).emit(
          "room-updated",
          room
        );
      }
    );


    // =======================================================
    // NEW — PLAYER POSITION
    // =======================================================

    socket.on(
      "player-position",
      ({
        x,
        y,
        jumping,
      }) => {
        const roomCode =
          socket.roomCode;

        const playerId =
          socket.playerId;

        if (
          !roomCode ||
          !playerId
        ) {
          return;
        }

        const room =
          getRoom(roomCode);

        if (!room) {
          return;
        }

        const roomPlayer =
          room.players.find(
            (player) =>
              player.playerId ===
              playerId
          );

        if (!roomPlayer) {
          return;
        }

        // Send only to the
        // other players.
        socket
          .to(roomCode)
          .emit(
            "player-position",
            {
              playerId,

              x,

              y,

              jumping:
                Boolean(
                  jumping
                ),
            }
          );
      }
    );


    // =======================================================
    // NEW — PLAYER JUMP
    // =======================================================

    socket.on(
      "player-jump",
      () => {
        const roomCode =
          socket.roomCode;

        const playerId =
          socket.playerId;

        if (
          !roomCode ||
          !playerId
        ) {
          return;
        }

        socket
          .to(roomCode)
          .emit(
            "player-jump",
            {
              playerId,
            }
          );
      }
    );


    // =======================================================
    // NEW — PLAYER LEFT GAME
    // =======================================================

    socket.on(
      "player-game-left",
      () => {
        const roomCode =
          socket.roomCode;

        const playerId =
          socket.playerId;

        if (
          !roomCode ||
          !playerId
        ) {
          return;
        }

        socket
          .to(roomCode)
          .emit(
            "player-game-left",
            {
              playerId,
            }
          );
      }
    );


    // =======================================================
    // DISCONNECT
    // =======================================================

    socket.on(
      "disconnect",
      () => {
        console.log(
          "Player disconnected:",
          socket.id
        );

        const roomCode =
          socket.roomCode;

        const playerId =
          socket.playerId;

        if (
          !roomCode ||
          !playerId
        ) {
          return;
        }

        const room =
          getRoom(roomCode);

        if (!room) {
          return;
        }

        room.players =
          room.players.filter(
            (player) =>
              player.playerId !==
              playerId
          );

        // If the owner leaves,
        // give ownership to
        // the next player.
        if (
          room.ownerId ===
            playerId &&
          room.players.length >
            0
        ) {
          room.ownerId =
            room.players[0]
              .playerId;

          console.log(
            `New owner: ${room.ownerId}`
          );
        }

        // If nobody remains,
        // remove the room.
        if (
          room.players.length ===
          0
        ) {
          rooms.delete(
            roomCode
          );

          console.log(
            `Room deleted: ${roomCode}`
          );

          return;
        }

        rooms.set(
          roomCode,
          room
        );

        io.to(roomCode).emit(
          "player-game-left",
          {
            playerId,
          }
        );

        io.to(roomCode).emit(
          "room-updated",
          room
        );
      }
    );
  }
);


// =========================================================
// START SERVER
// =========================================================

const PORT =
  process.env.PORT ||
  5000;

server.listen(
  PORT,
  () => {
    console.log(
      `The Dino King server is running on port ${PORT}`
    );
  }
);