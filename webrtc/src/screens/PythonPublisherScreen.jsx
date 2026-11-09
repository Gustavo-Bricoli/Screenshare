import React from "react";

export default function PythonPublisherScreen() {
  return (
    <main className="join-page">
      <section className="join-panel">
        <p className="eyebrow">WebRTC / Publisher</p>
        <h1>Python sender</h1>
        <p className="muted">
          Keep this page open and start the existing publisher in a terminal.
        </p>
        <pre className="command">cd webrtc{"\n"}python publisher.py</pre>
      </section>
    </main>
  );
}
