import {
  useEffect,
  useRef,
  useState,
} from "react";

import "../styles/Game.css";
import socket from "../socket/socket";

function Game({
  player,
  room,
  onGameOver,
}) {
  const gameRef = useRef(null);
  const dinoRef = useRef(null);

  // =========================================================
  // BASIC GAME STATE
  // =========================================================

  const [score, setScore] = useState(0);

  const [isJumping, setIsJumping] =
    useState(false);

  const [isDead, setIsDead] =
    useState(false);

  const scoreRef = useRef(0);

  // =========================================================
  // MULTIPLAYER PLAYERS
  // =========================================================

  const [otherPlayers, setOtherPlayers] =
    useState([]);

  const playerPositionRef =
    useRef(18);

  // =========================================================
  // OBSTACLES
  // =========================================================

  const [obstacles, setObstacles] =
    useState([
      {
        id: 1,
        type: "cactus",
        left: 100,
      },
    ]);

  const obstacleIdRef =
    useRef(1);

  // =========================================================
  // JUMP
  // =========================================================

  const jump = () => {
    if (
      isJumping ||
      isDead
    ) {
      return;
    }

    setIsJumping(true);

    socket.emit("player-jump");

    setTimeout(() => {
      setIsJumping(false);
    }, 600);
  };

  // =========================================================
  // KEYBOARD JUMP
  // =========================================================

  useEffect(() => {
    const handleKeyDown = (
      event
    ) => {
      if (
        event.code === "Space"
      ) {
        event.preventDefault();

        jump();
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [
    isJumping,
    isDead,
  ]);

  // =========================================================
  // RECEIVE OTHER PLAYERS
  // =========================================================

  useEffect(() => {
    const handlePlayersUpdate = (
      players
    ) => {
      console.log(
        "MULTIPLAYER PLAYERS:",
        players
      );

      const filteredPlayers =
        players.filter(
          (roomPlayer) =>
            roomPlayer.playerId !==
            player?.playerId
        );

      setOtherPlayers(
        filteredPlayers
      );
    };

    socket.on(
      "players-update",
      handlePlayersUpdate
    );

    return () => {
      socket.off(
        "players-update",
        handlePlayersUpdate
      );
    };
  }, [
    player?.playerId,
  ]);

  // =========================================================
  // OTHER PLAYER JUMP
  // =========================================================

  useEffect(() => {
    const handlePlayerJump = (
      data
    ) => {
      console.log(
        "OTHER PLAYER JUMPED:",
        data
      );

      setOtherPlayers(
        (previousPlayers) =>
          previousPlayers.map(
            (otherPlayer) =>
              otherPlayer.playerId ===
              data.playerId
                ? {
                    ...otherPlayer,
                    isJumping: true,
                  }
                : otherPlayer
          )
      );

      setTimeout(() => {
        setOtherPlayers(
          (previousPlayers) =>
            previousPlayers.map(
              (otherPlayer) =>
                otherPlayer.playerId ===
                data.playerId
                  ? {
                      ...otherPlayer,
                      isJumping: false,
                    }
                  : otherPlayer
            )
        );
      }, 600);
    };

    socket.on(
      "player-jump",
      handlePlayerJump
    );

    return () => {
      socket.off(
        "player-jump",
        handlePlayerJump
      );
    };
  }, []);

  // =========================================================
  // SEND PLAYER POSITION
  // =========================================================

  useEffect(() => {
    const positionTimer =
      setInterval(() => {
        if (isDead) {
          return;
        }

        socket.emit(
          "player-position",
          {
            x:
              playerPositionRef.current,
          }
        );
      }, 100);

    return () => {
      clearInterval(
        positionTimer
      );
    };
  }, [isDead]);

  // =========================================================
  // RECEIVE OTHER PLAYER POSITION
  // =========================================================

  useEffect(() => {
    const handlePlayerPosition = (
      data
    ) => {
      setOtherPlayers(
        (previousPlayers) =>
          previousPlayers.map(
            (otherPlayer) =>
              otherPlayer.playerId ===
              data.playerId
                ? {
                    ...otherPlayer,
                    x: data.x,
                  }
                : otherPlayer
          )
      );
    };

    socket.on(
      "player-position",
      handlePlayerPosition
    );

    return () => {
      socket.off(
        "player-position",
        handlePlayerPosition
      );
    };
  }, []);

  // =========================================================
  // SCORE
  // =========================================================

  useEffect(() => {
    if (isDead) {
      return;
    }

    const scoreTimer =
      setInterval(() => {
        setScore(
          (previousScore) => {
            const newScore =
              previousScore + 1;

            scoreRef.current =
              newScore;

            socket.emit(
              "score-update",
              {
                score: newScore,
              }
            );

            return newScore;
          }
        );
      }, 100);

    return () => {
      clearInterval(
        scoreTimer
      );
    };
  }, [isDead]);

  // =========================================================
  // OBSTACLE SPAWNER
  // =========================================================

  useEffect(() => {
    if (isDead) {
      return;
    }

    const obstacleSpawner =
      setInterval(() => {
        setObstacles(
          (previousObstacles) => {
            if (
              previousObstacles.length >=
              3
            ) {
              return previousObstacles;
            }

            const random =
              Math.random();

            let type =
              "cactus";

            if (
              random < 0.33
            ) {
              type =
                "cactus";
            } else if (
              random < 0.66
            ) {
              type =
                "rock";
            } else {
              type =
                "double-cactus";
            }

            const newObstacle = {
              id:
                obstacleIdRef.current++,

              type,

              left: 105,
            };

            return [
              ...previousObstacles,
              newObstacle,
            ];
          }
        );
      }, 2200);

    return () => {
      clearInterval(
        obstacleSpawner
      );
    };
  }, [isDead]);

  // =========================================================
  // OBSTACLE MOVEMENT
  // =========================================================

  useEffect(() => {
    if (isDead) {
      return;
    }

    const movementTimer =
      setInterval(() => {
        setObstacles(
          (previousObstacles) => {
            const speed =
              Math.min(
                0.8 +
                  scoreRef.current *
                    0.002,
                1.8
              );

            return previousObstacles
              .map(
                (obstacle) => ({
                  ...obstacle,

                  left:
                    obstacle.left -
                    speed,
                })
              )
              .filter(
                (obstacle) =>
                  obstacle.left >
                  -15
              );
          }
        );
      }, 20);

    return () => {
      clearInterval(
        movementTimer
      );
    };
  }, [isDead]);

  // =========================================================
  // COLLISION
  // =========================================================

  useEffect(() => {
    if (isDead) {
      return;
    }

    const collisionTimer =
      setInterval(() => {
        if (
          !dinoRef.current
        ) {
          return;
        }

        const dino =
          dinoRef.current.getBoundingClientRect();

        const obstacleElements =
          document.querySelectorAll(
            ".runner-obstacle"
          );

        for (
          const obstacleElement of obstacleElements
        ) {
          const obstacle =
            obstacleElement.getBoundingClientRect();

          const collision =
            dino.left <
              obstacle.right &&
            dino.right >
              obstacle.left &&
            dino.top <
              obstacle.bottom &&
            dino.bottom >
              obstacle.top;

          if (
            collision
          ) {
            setIsDead(true);

            break;
          }
        }
      }, 20);

    return () => {
      clearInterval(
        collisionTimer
      );
    };
  }, [isDead]);

  // =========================================================
  // PLAYER DIED
  // =========================================================

  useEffect(() => {
    if (!isDead) {
      return;
    }

    const finalScore =
      scoreRef.current;

    console.log(
      "Player died. Final score:",
      finalScore
    );

    socket.emit(
      "player-died",
      {
        score: finalScore,
      }
    );

    const timer =
      setTimeout(() => {
        if (onGameOver) {
          onGameOver({
            playerId:
              player?.playerId,

            name:
              player?.name,

            score:
              finalScore,

            status:
              "dead",
          });
        }
      }, 500);

    return () => {
      clearTimeout(
        timer
      );
    };
  }, [
    isDead,
    onGameOver,
    player,
  ]);

  // =========================================================
  // RESTART
  // =========================================================

  const restartGame = () => {
    console.log(
      "PLAY AGAIN clicked."
    );

    if (onGameOver) {
      onGameOver({
        playerId:
          player?.playerId,

        name:
          player?.name,

        score:
          scoreRef.current,

        status:
          "dead",

        restart:
          true,
      });
    }
  };

  // =========================================================
  // EXIT
  // =========================================================

  const exitGame = () => {
    const finalScore =
      scoreRef.current;

    if (!isDead) {
      socket.emit(
        "player-died",
        {
          score: finalScore,
        }
      );
    }

    if (onGameOver) {
      onGameOver({
        playerId:
          player?.playerId,

        name:
          player?.name,

        score:
          finalScore,

        status:
          "dead",

        exit:
          true,
      });
    }
  };

  // =========================================================
  // OBSTACLE EMOJI
  // =========================================================

  const getObstacleEmoji = (
    type
  ) => {
    if (
      type === "rock"
    ) {
      return "🪨";
    }

    if (
      type ===
      "double-cactus"
    ) {
      return "🌵🌵";
    }

    return "🌵";
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div
      className="game-page"
      ref={gameRef}
      onClick={jump}
    >
      {/* =====================================================
          HUD
      ====================================================== */}

      <div className="game-hud">

        <div className="game-player">
          <span>
            PLAYER
          </span>

          <strong>
            {player?.name ||
              "Dino"}
          </strong>
        </div>

        <div className="game-score">
          <span>
            SCORE
          </span>

          <strong>
            {score}
          </strong>
        </div>

        <div className="game-room">
          <span>
            ROOM
          </span>

          <strong>
            {room?.roomCode ||
              "---"}
          </strong>
        </div>

      </div>

      {/* =====================================================
          GAME WORLD
      ====================================================== */}

      <div className="game-world">

        {/* SUN */}

        <div className="game-sun">
          ☀️
        </div>

        {/* CLOUDS */}

        <div className="cloud cloud-one">
          ☁️
        </div>

        <div className="cloud cloud-two">
          ☁️
        </div>

        <div className="cloud cloud-three">
          ☁️
        </div>

        {/* HILLS */}

        <div className="game-hills">

          <div className="hill hill-one"></div>

          <div className="hill hill-two"></div>

          <div className="hill hill-three"></div>

        </div>

        {/* =================================================
            CURRENT PLAYER
        ================================================== */}

        <div
          ref={dinoRef}
          className={`game-dino ${
            isJumping
              ? "dino-jump"
              : "dino-running"
          }`}
          style={{
            borderColor:
              player?.character
                ?.color ||
              "red",
          }}
        >
          🦖

          {/* NAME HIDDEN DURING JUMP */}

        </div>

        {/* =================================================
            OTHER PLAYERS
        ================================================== */}

        {otherPlayers.map(
          (otherPlayer) => (
            <div
              key={
                otherPlayer.playerId
              }
              className={`other-player-dino ${
                otherPlayer.isJumping
                  ? "other-dino-jump"
                  : "other-dino-running"
              }`}
              style={{
                left: `${
                  otherPlayer.x ??
                  30
                }%`,

                borderColor:
                  otherPlayer
                    ?.character
                    ?.color ||
                  otherPlayer.color ||
                  "blue",
              }}
            >
              <div className="other-dino-character">
                🦖
              </div>

              {/* NAME HIDDEN DURING JUMP */}

              
            </div>
          )
        )}

        {/* =================================================
            OBSTACLES
        ================================================== */}

        {obstacles.map(
          (obstacle) => (
            <div
              key={
                obstacle.id
              }
              className={`runner-obstacle obstacle-${obstacle.type}`}
              style={{
                left: `${obstacle.left}%`,
              }}
            >
              {getObstacleEmoji(
                obstacle.type
              )}
            </div>
          )
        )}

        {/* =================================================
            GROUND
        ================================================== */}

        <div className="game-ground">

          <div className="ground-line"></div>

          <div
            className={`ground-pattern ${
              isDead
                ? "ground-stopped"
                : ""
            }`}
          >
            . . . . . . . . . . . . . . . . . . .
          </div>

          <div
            className={`ground-details ${
              isDead
                ? "ground-stopped"
                : ""
            }`}
          >
            ── · ─── · ── · ─── · ── · ─── · ──
          </div>

        </div>

        {/* =================================================
            INSTRUCTION
        ================================================== */}

        {!isDead &&
          score < 5 && (
            <div className="game-instruction">

              <span>
                SPACE
              </span>

              <p>
                Press SPACE or TAP to jump
              </p>

            </div>
          )}

        {/* =================================================
            GAME OVER
        ================================================== */}

        {isDead && (
          <div className="game-over-overlay">

            <div className="game-over-card">

              <div className="dead-dino">
                💀🦖
              </div>

              <p className="game-over-label">
                GAME OVER
              </p>

              <h1>
                Dino Down!
              </h1>

              <div className="final-score">

                <span>
                  FINAL SCORE
                </span>

                <strong>
                  {score}
                </strong>

              </div>

              <div className="game-over-buttons">

                <button
                  className="restart-button"
                  onClick={(
                    event
                  ) => {
                    event.stopPropagation();

                    restartGame();
                  }}
                >
                  🔄 PLAY AGAIN
                </button>

                <button
                  className="exit-button"
                  onClick={(
                    event
                  ) => {
                    event.stopPropagation();

                    exitGame();
                  }}
                >
                  ← EXIT
                </button>

              </div>

            </div>

          </div>
        )}

      </div>

      {/* =====================================================
          MOBILE JUMP
      ====================================================== */}

      {!isDead && (
        <button
          className="mobile-jump-button"
          onClick={(
            event
          ) => {
            event.stopPropagation();

            jump();
          }}
        >
          ↑

          <span>
            JUMP
          </span>

        </button>
      )}

    </div>
  );
}

export default Game;