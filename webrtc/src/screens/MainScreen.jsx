import React from "react";

export default function MainScreen({ onModeChange }) {
  return (
    <main className="join-page">
      <section className="join-panel">
        <p className="eyebrow">WebRTC / SFU</p>
        <h1>Screen share</h1>
        <p className="muted">Choose how this computer should connect to the room.</p>
        <div className="mode-grid">
          <button type="button" onClick={() => onModeChange("viewer")}>
            Watch stream
          </button>
          <button type="button" onClick={() => onModeChange("browser-publisher")}>
            Publish from browser
          </button>
          <button type="button" onClick={() => onModeChange("python-publisher")}>
            Use Python publisher
          </button>
        </div>
      </section>
    </main>
  );
}
