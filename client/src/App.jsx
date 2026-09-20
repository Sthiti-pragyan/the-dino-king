import { useEffect, useState } from "react";

import StartMenu from "./components/StartMenu";
import CharacterSelection from "./components/CharacterSelection";
import Settings from "./components/Settings";
import RoomSelection from "./components/RoomSelection";
import Lobby from "./components/Lobby";
import Game from "./game/Game";
import DeadLeaderboard from "./components/DeadLeaderboard";

import socket from "./socket/socket";

function App() {
  // =========================================================
  // SCREEN
  // =========================================================

  const [screen, setScreen] =
    useState("menu");

  // =========================================================
  // PLAYER
  // =========================================================

  const [player, setPlayer] =
    useState(null);

  // =========================================================
  // ROOM
  // =========================================================

  const [room, setRoom] =
    useState(null);

  // =========================================================
  // SOCKET CONNECTION
  // =========================================================

  useEffect(() => {
    const handleConnect = () => {
      console.log(
        "Socket connected:",
        socket.id
      );
    };

    const handleDisconnect = () => {
      console.log(
        "Socket disconnected"
      );
    };

    socket.on(
      "connect",
      handleConnect
    );

    socket.on(
      "disconnect",
      handleDisconnect
    );

    return () => {
      socket.off(
        "connect",
        handleConnect
      );

      socket.off(
        "disconnect",
        handleDisconnect
      );
    };
  }, []);

  // =========================================================
  // ROOM / GAME SOCKET EVENTS
  // =========================================================

  useEffect(() => {
    const handleRoomUpdated = (
      updatedRoom
    ) => {
      console.log(
        "APP ROOM UPDATED:",
        updatedRoom
      );

      setRoom(
        updatedRoom
      );
    };

    const handleGameStarted = (
      startedRoom
    ) => {
      console.log(
        "APP GAME STARTED:",
        startedRoom
      );

      setRoom(
        startedRoom
      );

      setScreen(
        "game"
      );
    };

    socket.on(
      "room-updated",
      handleRoomUpdated
    );

    socket.on(
      "game-started",
      handleGameStarted
    );

    return () => {
      socket.off(
        "room-updated",
        handleRoomUpdated
      );

      socket.off(
        "game-started",
        handleGameStarted
      );
    };
  }, []);

  // =========================================================
  // START MENU
  // =========================================================

  const handlePlay = () => {
    if (!player) {
      setScreen(
        "character"
      );

      return;
    }

    setScreen(
      "room"
    );
  };

  // =========================================================
  // CHARACTER SELECTION
  // =========================================================

  const handleCharacterSelection = () => {
    setScreen(
      "character"
    );
  };

  // =========================================================
  // SETTINGS
  // =========================================================

  const handleSettings = () => {
    setScreen(
      "settings"
    );
  };

  // =========================================================
  // CHARACTER CONTINUE
  // =========================================================

  const handleCharacterContinue = (
    selectedPlayer
  ) => {
    console.log(
      "PLAYER SELECTED:",
      selectedPlayer
    );

    setPlayer(
      selectedPlayer
    );

    setScreen(
      "room"
    );
  };

  // =========================================================
  // CREATE ROOM
  // =========================================================

  const handleRoomCreated = (
    createdRoom
  ) => {
    console.log(
      "ROOM CREATED IN APP:",
      createdRoom
    );

    setRoom(
      createdRoom
    );

    setScreen(
      "lobby"
    );
  };

  // =========================================================
  // JOIN ROOM
  // =========================================================

  const handleRoomJoined = (
    joinedRoom
  ) => {
    console.log(
      "ROOM JOINED IN APP:",
      joinedRoom
    );

    setRoom(
      joinedRoom
    );

    setScreen(
      "lobby"
    );
  };

  // =========================================================
  // BACK FROM CHARACTER
  // =========================================================

  const handleBackFromCharacter =
    () => {
      setScreen(
        "menu"
      );
    };

  // =========================================================
  // BACK FROM ROOM
  // =========================================================

  const handleBackFromRoom =
    () => {
      setScreen(
        "menu"
      );
    };

  // =========================================================
  // BACK FROM LOBBY
  // =========================================================

  const handleBackFromLobby =
    () => {
      setScreen(
        "room"
      );
    };

  // =========================================================
  // GAME OVER
  // =========================================================

  const handleGameOver = (
    gameResult
  ) => {
    console.log(
      "GAME OVER RESULT:",
      gameResult
    );

    // -------------------------------------------------------
    // Update local player
    // -------------------------------------------------------

    if (
      gameResult?.playerId ===
      player?.playerId
    ) {
      setPlayer(
        (previousPlayer) => ({
          ...previousPlayer,

          score:
            gameResult.score,

          status:
            gameResult.status,
        })
      );
    }

    // -------------------------------------------------------
    // Update local room
    // -------------------------------------------------------

    setRoom(
      (previousRoom) => {
        if (!previousRoom) {
          return previousRoom;
        }

        return {
          ...previousRoom,

          players:
            previousRoom.players.map(
              (roomPlayer) =>
                roomPlayer.playerId ===
                gameResult.playerId
                  ? {
                      ...roomPlayer,

                      score:
                        gameResult.score,

                      status:
                        gameResult.status,
                    }
                  : roomPlayer
            ),
        };
      }
    );

    // -------------------------------------------------------
    // PLAY AGAIN
    // -------------------------------------------------------

    if (
      gameResult?.restart
    ) {
      handlePlayAgain();

      return;
    }

    // -------------------------------------------------------
    // EXIT
    // -------------------------------------------------------

    if (
      gameResult?.exit
    ) {
      setScreen(
        "dead-leaderboard"
      );

      return;
    }

    // -------------------------------------------------------
    // NORMAL GAME OVER
    // -------------------------------------------------------

    setScreen(
      "dead-leaderboard"
    );
  };

  // =========================================================
  // BACK TO LOBBY FROM DEAD LEADERBOARD
  // =========================================================

  const handleBackToLobby =
    () => {
      setScreen(
        "lobby"
      );
    };

  // =========================================================
  // PLAY AGAIN
  // =========================================================

  const handlePlayAgain = () => {
    console.log(
      "PLAY AGAIN clicked."
    );

    if (
      !room?.roomCode
    ) {
      console.log(
        "No active room."
      );

      return;
    }

    if (
      room.ownerId ===
      player?.playerId
    ) {
      console.log(
        "Room owner resetting game..."
      );

      socket.emit(
        "reset-game"
      );
    }

    setScreen(
      "lobby"
    );
  };

  // =========================================================
  // SETTINGS SCREEN
  // =========================================================

  if (
    screen === "settings"
  ) {
    return (
      <Settings
        player={
          player
        }
        onBack={() => {
          setScreen(
            "menu"
          );
        }}
      />
    );
  }

  // =========================================================
  // START MENU
  // =========================================================

  if (
    screen === "menu"
  ) {
    return (
      <StartMenu
        onPlay={
          handlePlay
        }
        onCharacter={
          handleCharacterSelection
        }
        onSettings={
          handleSettings
        }
      />
    );
  }

  // =========================================================
  // CHARACTER SELECTION
  // =========================================================

  if (
    screen === "character"
  ) {
    return (
      <CharacterSelection
  existingPlayer={player}
  onBack={handleBackFromCharacter}
  onContinue={handleCharacterContinue}
/>
    );
  }

  // =========================================================
  // ROOM SELECTION
  // =========================================================

  if (
    screen === "room"
  ) {
    return (
      <RoomSelection
        player={
          player
        }
        onBack={
          handleBackFromRoom
        }
        onRoomCreated={
          handleRoomCreated
        }
        onRoomJoined={
          handleRoomJoined
        }
      />
    );
  }

  // =========================================================
  // LOBBY
  // =========================================================

  if (
    screen === "lobby"
  ) {
    return (
      <Lobby
        room={
          room
        }
        player={
          player
        }
        onBack={
          handleBackFromLobby
        }
        onStartGame={() => {
          setScreen(
            "game"
          );
        }}
      />
    );
  }

  // =========================================================
  // GAME
  // =========================================================

  if (
    screen === "game"
  ) {
    return (
      <Game
        player={
          player
        }
        room={
          room
        }
        onGameOver={
          handleGameOver
        }
      />
    );
  }

  // =========================================================
  // DEAD LEADERBOARD
  // =========================================================

  if (
    screen ===
    "dead-leaderboard"
  ) {
    return (
      <DeadLeaderboard
        room={
          room
        }
        player={
          player
        }
        onBackToLobby={
          handleBackToLobby
        }
        onPlayAgain={
          handlePlayAgain
        }
      />
    );
  }

  // =========================================================
  // FALLBACK
  // =========================================================

  return (
    <StartMenu
      onPlay={
        handlePlay
      }
      onCharacter={
        handleCharacterSelection
      }
      onSettings={
        handleSettings
      }
    />
  );
}

export default App;