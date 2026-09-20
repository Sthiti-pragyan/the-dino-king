import { useEffect, useState } from "react";
import "../styles/Lobby.css";
import socket from "../socket/socket";

function Lobby({
  room,
  player,
  onBack,
  onStartGame,
}) {
  const [currentRoom, setCurrentRoom] = useState(room);

  useEffect(() => {
    setCurrentRoom(room);
  }, [room]);

  useEffect(() => {
    const handleRoomUpdated = (updatedRoom) => {
      console.log("ROOM UPDATED:", updatedRoom);

      // Debug only
      updatedRoom.players.forEach((roomPlayer) => {
        console.log(
          "PLAYER COLOR:",
          roomPlayer.name,
          roomPlayer.color,
          roomPlayer.character?.color
        );
      });

      setCurrentRoom(updatedRoom);
    };

    const handleGameStarted = (startedRoom) => {
      console.log("GAME STARTED:", startedRoom);
      setCurrentRoom(startedRoom);

      if (onStartGame) {
        onStartGame(startedRoom);
      }
    };

    socket.on("room-updated", handleRoomUpdated);
    socket.on("game-started", handleGameStarted);

    return () => {
      socket.off("room-updated", handleRoomUpdated);
      socket.off("game-started", handleGameStarted);
    };
  }, [onStartGame]);

  if (!currentRoom) {
    return null;
  }

  const isOwner =
    currentRoom.ownerId === player?.playerId;

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(
        currentRoom.roomCode
      );

      alert("Room code copied!");
    } catch (error) {
      console.error(
        "Failed to copy room code:",
        error
      );
    }
  };

  const handleStartGame = () => {
    if (!isOwner) {
      return;
    }

    console.log(
      "Requesting server to start game..."
    );

    socket.emit("start-game");
  };

  return (
    <div className="lobby-page">
      <div className="lobby-container">

        {/* =========================================
            HEADER
        ========================================= */}

        <div className="lobby-header">
          <button
            className="lobby-back-button"
            onClick={onBack}
          >
            ← Back
          </button>

          <div className="lobby-title-area">
            <p>MULTIPLAYER LOBBY</p>

            <h1>
              {currentRoom.roomName}
            </h1>

            <span>
              {currentRoom.players.length >= 2
                ? "Players are ready!"
                : "Waiting for players..."}
            </span>
          </div>
        </div>


        {/* =========================================
            ROOM CODE
        ========================================= */}

        <div className="room-code-card">
          <div>
            <p>ROOM CODE</p>

            <h2>
              {currentRoom.roomCode}
            </h2>
          </div>

          <button
            onClick={handleCopyCode}
            className="copy-code-button"
          >
            📋 COPY
          </button>
        </div>


        {/* =========================================
            PLAYERS
        ========================================= */}

        <div className="players-section">

          <div className="section-heading">

            <div>
              <span>PLAYERS</span>

              <h2>
                {currentRoom.players.length}/6
              </h2>
            </div>

            <p>
              Each player has a unique Dino color
            </p>

          </div>


          <div className="players-grid">

            {currentRoom.players.map(
              (roomPlayer) => {

                const playerIsOwner =
                  roomPlayer.playerId ===
                  currentRoom.ownerId;

                const isCurrentPlayer =
                  roomPlayer.playerId ===
                  player?.playerId;

                /*
                 * Server stores the color here.
                 *
                 * red
                 * blue
                 * green
                 * yellow
                 * purple
                 * orange
                 */

                const dinoColor =
                  roomPlayer.color ||
                  roomPlayer.character?.color ||
                  "red";

                return (
                  <div
                    className={`player-card ${
                      isCurrentPlayer
                        ? "current-player-card"
                        : ""
                    } color-${dinoColor}`}
                    key={roomPlayer.playerId}
                  >

                    {/* =================================
                        DINO
                    ================================= */}

                    <div
                      className={`lobby-dino dino-${dinoColor}`}
                    >
                      <span className="dino-emoji">
                        🦖
                      </span>

                      <span className="color-dot"></span>
                    </div>


                    {/* =================================
                        PLAYER INFORMATION
                    ================================= */}

                    <div className="player-card-info">

                      <div className="player-name-row">

                        <h3>
                          {roomPlayer.name}
                        </h3>

                        {playerIsOwner && (
                          <span className="owner-badge">
                            👑 OWNER
                          </span>
                        )}

                      </div>

                      <p>
                        {roomPlayer.playerId}
                      </p>

                      {isCurrentPlayer && (
                        <span className="you-badge">
                          YOU
                        </span>
                      )}

                    </div>


                    {/* =================================
                        SCORE
                    ================================= */}

                    <div className="player-score">

                      <span>
                        SCORE
                      </span>

                      <strong>
                        {roomPlayer.score}
                      </strong>

                    </div>

                  </div>
                );
              }
            )}

          </div>

        </div>


        {/* =========================================
            LEADERBOARD
        ========================================= */}

        <div className="leaderboard-section">

          <div className="section-heading">

            <div>
              <span>LEADERBOARD</span>

              <h2>
                Current Scores
              </h2>
            </div>

          </div>


          <div className="leaderboard-list">

            {[...currentRoom.players]
              .sort(
                (a, b) =>
                  b.score - a.score
              )
              .map(
                (roomPlayer, index) => {

                  const dinoColor =
                    roomPlayer.color ||
                    roomPlayer.character?.color ||
                    "red";

                  return (
                    <div
                      className={`leaderboard-row color-${dinoColor}`}
                      key={
                        roomPlayer.playerId
                      }
                    >

                      <div className="rank">
                        #{index + 1}
                      </div>


                      <div
                        className={`small-dino dino-${dinoColor}`}
                      >
                        <span>
                          🦖
                        </span>
                      </div>


                      <div className="leaderboard-name">

                        <strong>
                          {roomPlayer.name}
                        </strong>

                      </div>


                      <div className="leaderboard-score">
                        {roomPlayer.score}
                      </div>

                    </div>
                  );
                }
              )}

          </div>

        </div>


        {/* =========================================
            FOOTER
        ========================================= */}

        <div className="lobby-footer">

          {isOwner ? (
            <>

              <p>
                You are the room owner.
                Start the game when everyone
                is ready.
              </p>

              <button
                className="start-game-button"
                onClick={handleStartGame}
              >
                ▶ START GAME
              </button>

            </>
          ) : (

            <div className="waiting-message">

              <span>
                ⏳
              </span>

              <div>

                <strong>
                  Waiting for room owner
                </strong>

                <p>
                  The game will start when
                  the owner is ready.
                </p>

              </div>

            </div>

          )}

        </div>

      </div>
    </div>
  );
}

export default Lobby;