import React from "react";

export default function JoinScreen({
  room,
  identity,
  mode,
  error,
  onRoomChange,
  onIdentityChange,
  onModeChange,
  onSubmit
}) {
  const isPublisher = mode === "browser-publisher";

  return (
    <main className="join-page">
      <section className="join-panel">
        <p className="eyebrow">WebRTC / SFU</p>
        <h1>{isPublisher ? "Publish screen" : "Watch stream"}</h1>
        <p className="muted">
          {isPublisher
            ? "Choose a room and share your screen from this browser."
            : "Choose a room and join as a viewer."}
        </p>
        <form onSubmit={onSubmit}>
          <label>
            Room
            <input value={room} onChange={(event) => onRoomChange(event.target.value)} />
          </label>
          <label>
            Name
            <input value={identity} onChange={(event) => onIdentityChange(event.target.value)} />
          </label>
          <button type="submit">Join room</button>
        </form>
        {error && <p className="error">{error}</p>}
      </section>
    </main>
  );
}
