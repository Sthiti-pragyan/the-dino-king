import { useState } from "react";
import "../styles/Settings.css";

function Settings({
  player,
  onBack,
}) {
  const [soundOn, setSoundOn] =
    useState(true);

  const [showInstructions, setShowInstructions] =
    useState(true);

  return (
    <div className="settings-page">
      <div className="settings-container">

        {/* HEADER */}
        <div className="settings-header">
          <button
            className="settings-back-button"
            onClick={onBack}
          >
            ← BACK
          </button>

          <div>
            <p className="settings-label">
              GAME SETTINGS
            </p>

            <h1>
              Settings
            </h1>

            <p className="settings-subtitle">
              Customize your Dino King experience.
            </p>
          </div>
        </div>

        {/* PLAYER INFORMATION */}
        <div className="settings-card">
          <div className="settings-card-header">
            <div className="settings-card-icon">
              👤
            </div>

            <div>
              <span>
                PLAYER
              </span>

              <h2>
                Player Information
              </h2>
            </div>
          </div>

          <div className="player-settings-box">
            <div className="settings-dino">
              🦖
            </div>

            <div className="player-settings-info">
              <span>
                PLAYER NAME
              </span>

              <strong>
                {player?.name || "Dino"}
              </strong>

              <small>
                {player?.playerId || "DINO-XXXXX"}
              </small>
            </div>

            <div className="player-character-info">
              <span>
                CHARACTER
              </span>

              <strong>
                {player?.character?.name ||
                  "Dino"}
              </strong>
            </div>
          </div>
        </div>

        {/* SOUND */}
        <div className="settings-card">
          <div className="settings-card-header">
            <div className="settings-card-icon">
              🔊
            </div>

            <div>
              <span>
                AUDIO
              </span>

              <h2>
                Sound
              </h2>
            </div>
          </div>

          <div className="settings-row">
            <div>
              <strong>
                Game Sound
              </strong>

              <p>
                Enable or disable game sounds.
              </p>
            </div>

            <button
              className={`toggle-button ${
                soundOn
                  ? "toggle-on"
                  : "toggle-off"
              }`}
              onClick={() =>
                setSoundOn(
                  !soundOn
                )
              }
            >
              <span className="toggle-circle"></span>

              <span>
                {soundOn
                  ? "ON"
                  : "OFF"}
              </span>
            </button>
          </div>
        </div>

        {/* CONTROLS */}
        <div className="settings-card">
          <div className="settings-card-header">
            <div className="settings-card-icon">
              🎮
            </div>

            <div>
              <span>
                CONTROLS
              </span>

              <h2>
                How To Play
              </h2>
            </div>
          </div>

          <div className="controls-list">

            <div className="control-item">
              <div className="control-key">
                SPACE
              </div>

              <div>
                <strong>
                  Jump
                </strong>

                <p>
                  Press Space to make your Dino jump.
                </p>
              </div>
            </div>

            <div className="control-item">
              <div className="control-key">
                TAP
              </div>

              <div>
                <strong>
                  Mobile Jump
                </strong>

                <p>
                  Tap the screen to jump.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* INSTRUCTIONS */}
        <div className="settings-card">
          <div className="settings-row">
            <div>
              <strong>
                Show Jump Instructions
              </strong>

              <p>
                Show the jump instructions when a game starts.
              </p>
            </div>

            <button
              className={`toggle-button ${
                showInstructions
                  ? "toggle-on"
                  : "toggle-off"
              }`}
              onClick={() =>
                setShowInstructions(
                  !showInstructions
                )
              }
            >
              <span className="toggle-circle"></span>

              <span>
                {showInstructions
                  ? "ON"
                  : "OFF"}
              </span>
            </button>
          </div>
        </div>

        {/* FOOTER */}
        <div className="settings-footer">
          <p>
            🦖 THE DINO KING
          </p>

          <span>
            Infinite Runner • Multiplayer
          </span>
        </div>

      </div>
    </div>
  );
}

export default Settings;