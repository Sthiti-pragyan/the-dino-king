import { useState } from "react";
import "../styles/CharacterSelection.css";

const dinoCharacters = [
  {
    id: "red",
    name: "Blaze",
    color: "#ef4444",
    emoji: "🦖",
  },
  {
    id: "blue",
    name: "Ocean",
    color: "#3b82f6",
    emoji: "🦖",
  },
  {
    id: "green",
    name: "Forest",
    color: "#22c55e",
    emoji: "🦖",
  },
  {
    id: "yellow",
    name: "Thunder",
    color: "#eab308",
    emoji: "🦖",
  },
  {
    id: "purple",
    name: "Shadow",
    color: "#a855f7",
    emoji: "🦖",
  },
  {
    id: "orange",
    name: "Flame",
    color: "#f97316",
    emoji: "🦖",
  },
];

function generatePlayerId() {
  return (
    "DINO-" +
    Math.random()
      .toString(36)
      .substring(2, 7)
      .toUpperCase()
  );
}

function CharacterSelection({
  onBack,
  onContinue,
  existingPlayer,
}) {
  const [selectedCharacter, setSelectedCharacter] =
    useState(
      existingPlayer?.character ||
        dinoCharacters[0]
    );

  const [playerName, setPlayerName] =
    useState(
      existingPlayer?.name || ""
    );

  const [playerId] = useState(
    existingPlayer?.playerId ||
      generatePlayerId()
  );

  const handleContinue = () => {
    if (!playerName.trim()) {
      alert("Please enter your name.");
      return;
    }

    onContinue({
      name: playerName.trim(),

      // Keep existing Player ID
      playerId,

      // Save newly selected character
      character: selectedCharacter,
    });
  };

  return (
    <div className="character-page">
      <div className="character-container">

        {/* HEADER */}

        <div className="character-header">

          <button
            className="back-button"
            onClick={onBack}
          >
            ← Back
          </button>

          <div>
            <p className="small-title">
              PLAYER SETUP
            </p>

            <h1>
              Choose Your Dino
            </h1>
          </div>

        </div>

        {/* SELECTED DINO */}

        <div className="selected-dino">

          <div
            className="dino-circle"
            style={{
              boxShadow: `0 0 50px ${selectedCharacter.color}55`,
              borderColor:
                selectedCharacter.color,
            }}
          >
            <span>
              {selectedCharacter.emoji}
            </span>
          </div>

          <div className="selected-info">

            <span>
              YOUR CHARACTER
            </span>

            <h2
              style={{
                color:
                  selectedCharacter.color,
              }}
            >
              {selectedCharacter.name}
            </h2>

          </div>

        </div>

        {/* CHARACTER SELECTION */}

        <div className="character-section">

          <h3>
            SELECT COLOR
          </h3>

          <div className="character-grid">

            {dinoCharacters.map(
              (character) => (

                <button
                  key={character.id}
                  className={`character-card ${
                    selectedCharacter.id ===
                    character.id
                      ? "selected"
                      : ""
                  }`}
                  onClick={() =>
                    setSelectedCharacter(
                      character
                    )
                  }
                  style={{
                    "--character-color":
                      character.color,
                  }}
                >

                  <div className="mini-dino">
                    {character.emoji}
                  </div>

                  <span>
                    {character.name}
                  </span>

                </button>

              )
            )}

          </div>

        </div>

        {/* PLAYER DETAILS */}

        <div className="player-details">

          <div className="input-group">

            <label>
              PLAYER NAME
            </label>

            <input
              type="text"
              placeholder="Enter your name"
              value={playerName}
              maxLength={20}
              onChange={(e) =>
                setPlayerName(
                  e.target.value
                )
              }
            />

          </div>

          <div className="input-group">

            <label>
              PLAYER ID
            </label>

            <div className="player-id">
              {playerId}
            </div>

          </div>

        </div>

        {/* CONTINUE */}

        <button
          className="continue-button"
          onClick={handleContinue}
        >
          {existingPlayer
            ? "SAVE CHARACTER →"
            : "CONTINUE →"}
        </button>

      </div>
    </div>
  );
}

export default CharacterSelection;