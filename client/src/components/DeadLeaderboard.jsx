import { useEffect, useState } from "react";
import "../styles/DeadLeaderboard.css";
import socket from "../socket/socket";

function DeadLeaderboard({
  room,
  player,
  onBackToLobby,
  onPlayAgain,
}) {
  const [currentRoom, setCurrentRoom] =
    useState(room);

  // =========================================================
  // KEEP ROOM DATA UPDATED
  // =========================================================

  useEffect(() => {
    setCurrentRoom(room);
  }, [room]);

  // =========================================================
  // LISTEN FOR SERVER ROOM UPDATES
  // =========================================================

  useEffect(() => {
    const handleRoomUpdated = (
      updatedRoom
    ) => {
      console.log(
        "DEAD LEADERBOARD ROOM UPDATE:",
        updatedRoom
      );

      setCurrentRoom(updatedRoom);
    };

    socket.on(
      "room-updated",
      handleRoomUpdated
    );

    return () => {
      socket.off(
        "room-updated",
        handleRoomUpdated
      );
    };
  }, []);

  // =========================================================
  // NO ROOM
  // =========================================================

  if (!currentRoom) {
    return null;
  }

  // =========================================================
  // SORT PLAYERS BY SCORE
  // =========================================================

  const rankedPlayers = [
    ...currentRoom.players,
  ].sort(
    (a, b) => b.score - a.score
  );

  // =========================================================
  // CURRENT PLAYER
  // =========================================================

  const currentPlayer =
    currentRoom.players.find(
      (roomPlayer) =>
        roomPlayer.playerId ===
        player?.playerId
    );

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="dead-page">

      <div className="dead-container">

        {/* ===================================================
            HEADER
        =================================================== */}

        <div className="dead-header">

          <div className="dead-icon">
            💀
          </div>

          <div>

            <p className="dead-label">
              GAME FINISHED
            </p>

            <h1>
              Dead Leaderboard
            </h1>

            <p className="dead-subtitle">
              Final player status and scores
            </p>

          </div>

        </div>

        {/* ===================================================
            ROOM INFORMATION
        =================================================== */}

        <div className="dead-room-card">

          <div>
            <span>
              ROOM
            </span>

            <strong>
              {currentRoom.roomName}
            </strong>
          </div>

          <div>
            <span>
              ROOM CODE
            </span>

            <strong>
              {currentRoom.roomCode}
            </strong>
          </div>

          <div>
            <span>
              PLAYERS
            </span>

            <strong>
              {currentRoom.players.length}/6
            </strong>
          </div>

        </div>

        {/* ===================================================
            YOUR RESULT
        =================================================== */}

        {currentPlayer && (
          <div className="your-result">

            <div
              className={`result-dino dino-${currentPlayer.color}`}
            >
              🦖
            </div>

            <div className="your-result-info">

              <span>
                YOUR RESULT
              </span>

              <h2>
                {currentPlayer.name}
              </h2>

              <p>
                {currentPlayer.playerId}
              </p>

            </div>

            <div className="your-result-score">

              <span>
                SCORE
              </span>

              <strong>
                {currentPlayer.score}
              </strong>

            </div>

          </div>
        )}

        {/* ===================================================
            LEADERBOARD
        =================================================== */}

        <div className="dead-leaderboard">

          <div className="dead-section-title">

            <div>
              <span>
                FINAL RESULTS
              </span>

              <h2>
                Player Rankings
              </h2>
            </div>

            <div className="total-players">
              {currentRoom.players.length} PLAYERS
            </div>

          </div>

          <div className="dead-list">

            {rankedPlayers.map(
              (roomPlayer, index) => {

                const isCurrentPlayer =
                  roomPlayer.playerId ===
                  player?.playerId;

                const isDead =
                  roomPlayer.status ===
                  "dead";

                return (
                  <div
                    key={
                      roomPlayer.playerId
                    }
                    className={`dead-player-row ${
                      isCurrentPlayer
                        ? "my-dead-row"
                        : ""
                    }`}
                  >

                    {/* RANK */}

                    <div
                      className={`dead-rank rank-${index + 1}`}
                    >
                      #{index + 1}
                    </div>

                    {/* DINO */}

                    <div
                      className={`dead-dino dino-${roomPlayer.color}`}
                    >
                      🦖
                    </div>

                    {/* PLAYER */}

                    <div className="dead-player-info">

                      <div className="dead-player-name">

                        <h3>
                          {roomPlayer.name}
                        </h3>

                        {isCurrentPlayer && (
                          <span className="you-small">
                            YOU
                          </span>
                        )}

                      </div>

                      <p>
                        {roomPlayer.playerId}
                      </p>

                    </div>

                    {/* STATUS */}

                    <div
                      className={`player-status ${
                        isDead
                          ? "status-dead"
                          : "status-playing"
                      }`}
                    >

                      <span className="status-dot">
                        ●
                      </span>

                      {isDead
                        ? "DEAD"
                        : "PLAYING"}

                    </div>

                    {/* SCORE */}

                    <div className="dead-score">

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

        {/* ===================================================
            BUTTONS
        =================================================== */}

        <div className="dead-actions">

          <button
            className="dead-back-button"
            onClick={onBackToLobby}
          >
            ← BACK TO LOBBY
          </button>

          <button
            className="dead-play-button"
            onClick={onPlayAgain}
          >
            🔄 PLAY AGAIN
          </button>

        </div>

      </div>

    </div>
  );
}

export default DeadLeaderboard;