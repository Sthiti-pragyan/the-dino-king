import { useEffect, useState } from "react";
import "../styles/RoomSelection.css";
import socket from "../socket/socket";

function RoomSelection({ player, onBack, onRoomCreated, onRoomJoined }) {
  const [mode, setMode] = useState(null);

  const [roomName, setRoomName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  useEffect(() => {
  const handleRoomCreated = (room) => {
    console.log("ROOM CREATED:", room);

    onRoomCreated(room);
  };

  const handleRoomJoined = (room) => {
    console.log("ROOM JOINED:", room);

    onRoomJoined(room);
  };

  const handleRoomError = (error) => {
    console.error("ROOM ERROR:", error);

    alert(error.message);
  };

  socket.on("room-created", handleRoomCreated);
  socket.on("room-joined", handleRoomJoined);
  socket.on("room-error", handleRoomError);

  return () => {
    socket.off("room-created", handleRoomCreated);
    socket.off("room-joined", handleRoomJoined);
    socket.off("room-error", handleRoomError);
  };
}, [onRoomCreated, onRoomJoined]);

  const handleCreateRoom = () => {
  if (!roomName.trim()) {
    alert("Please enter a room name.");
    return;
  }

  socket.emit("create-room", {
    roomName: roomName.trim(),
    player,
  });
};

 const handleJoinRoom = () => {
  if (!roomCode.trim()) {
    alert("Please enter the room code.");
    return;
  }

  socket.emit("join-room", {
    roomCode: roomCode.trim().toUpperCase(),
    player,
  });
};
  return (
    <div className="room-page">

      <div className="room-container">

        {/* HEADER */}

        <div className="room-header">

          <button
            className="back-button"
            onClick={onBack}
          >
            ← Back
          </button>

          <div>
            <p className="room-small-title">
              MULTIPLAYER
            </p>

            <h1>Play With Others</h1>

            <p className="room-subtitle">
              Create a room or join your friends.
            </p>
          </div>

        </div>

        {/* PLAYER INFO */}

        {player && (
          <div className="current-player">

            <div
              className="player-dino"
              style={{
                borderColor: player.character.color,
              }}
            >
              🦖
            </div>

            <div>
              <span>PLAYING AS</span>

              <h3>{player.name}</h3>

              <p>{player.playerId}</p>
            </div>

          </div>
        )}

        {/* OPTIONS */}

        {!mode && (

          <div className="room-options">

            <button
              className="room-option create-option"
              onClick={() => setMode("create")}
            >

              <div className="option-icon">
                +
              </div>

              <div>
                <h2>Create A Room</h2>

                <p>
                  Create a new multiplayer lobby
                </p>
              </div>

              <span className="option-arrow">
                →
              </span>

            </button>

            <button
              className="room-option join-option"
              onClick={() => setMode("join")}
            >

              <div className="option-icon">
                #
              </div>

              <div>
                <h2>Join With Code</h2>

                <p>
                  Enter a room code to join
                </p>
              </div>

              <span className="option-arrow">
                →
              </span>

            </button>

          </div>

        )}

        {/* CREATE ROOM */}

        {mode === "create" && (

          <div className="room-form">

            <button
              className="form-back"
              onClick={() => setMode(null)}
            >
              ← Choose another option
            </button>

            <div className="form-icon">
              +
            </div>

            <h2>Create A Room</h2>

            <p className="form-description">
              Give your room a name and invite other players.
            </p>

            <label>
              ROOM NAME
            </label>

            <input
              type="text"
              placeholder="Example: Dino Warriors"
              value={roomName}
              maxLength={30}
              onChange={(e) =>
                setRoomName(e.target.value)
              }
            />

            <button
              className="primary-room-button"
              onClick={handleCreateRoom}
            >
              CREATE LOBBY →
            </button>

          </div>

        )}

        {/* JOIN ROOM */}

        {mode === "join" && (

          <div className="room-form">

            <button
              className="form-back"
              onClick={() => setMode(null)}
            >
              ← Choose another option
            </button>

            <div className="form-icon">
              #
            </div>

            <h2>Join With Code</h2>

            <p className="form-description">
              Enter the code shared by the room owner.
            </p>

            <label>
              ROOM CODE
            </label>

            <input
              className="code-input"
              type="text"
              placeholder="ENTER CODE"
              value={roomCode}
              maxLength={8}
              onChange={(e) =>
                setRoomCode(e.target.value.toUpperCase())
              }
            />

            <button
              className="primary-room-button"
              onClick={handleJoinRoom}
            >
              ENTER TO LOBBY →
            </button>

          </div>

        )}

      </div>

    </div>
  );
}

export default RoomSelection;