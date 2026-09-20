import "../styles/StartMenu.css";

function StartMenu({ onPlay, onCharacter, onSettings }) {
  return (
    <div className="start-menu">

      <div className="game-background">

        <div className="game-title">
          <span>THE</span>
          <h1>DINO KING</h1>
          <p>INFINITE RUNNER</p>
        </div>

        <div className="dino-display">
          🦖
        </div>

        <div className="menu-buttons">

          <button
            className="menu-button play-button"
            onClick={onPlay}
          >
            ▶ PLAY
          </button>

          <button
            className="menu-button"
            onClick={onCharacter}
          >
            🦖 CHARACTER
          </button>

          <button
            className="menu-button"
            onClick={onSettings}
          >
            ⚙ SETTINGS
          </button>

        </div>

        <div className="version">
          THE DINO KING • v1.0
        </div>

      </div>

    </div>
  );
}

export default StartMenu;