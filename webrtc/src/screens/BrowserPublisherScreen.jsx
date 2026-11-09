import React from "react";
import { Room, RoomEvent } from "livekit-client";

export default function BrowserPublisherScreen({ token, url, tracks }) {
  const videoRef = React.useRef(null);
  const roomRef = React.useRef(null);
  const tracksRef = React.useRef(tracks);
  const [status, setStatus] = React.useState("Starting screen capture...");
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    let cancelled = false;

    async function startPublisher() {
      try {
        const room = new Room();
        roomRef.current = room;
        room.on(RoomEvent.ConnectionStateChanged, (state) => {
          console.info("[WEBRTC] Publisher connection state", { state });
        });
        room.on(RoomEvent.Disconnected, (reason) => {
          console.warn("[WEBRTC] Publisher disconnected", { reason });
          if (!cancelled) setStatus("Publisher disconnected");
        });
        console.info("[WEBRTC] Connecting publisher to LiveKit", { url });
        if (cancelled) {
          tracks.forEach((track) => track.stop());
          return;
        }

        tracksRef.current = tracks;
        await room.connect(url, token);
        for (const track of tracks) {
          await room.localParticipant.publishTrack(track, {
            source: track.source,
            name: track.kind === "video" ? "screen" : "system-audio"
          });
        }

        const videoTrack = tracks.find((track) => track.kind === "video");
        if (videoTrack && videoRef.current) videoTrack.attach(videoRef.current);
        setStatus("Browser publisher is live");
      } catch (publisherError) {
        if (!cancelled) {
          console.error("[WEBRTC] Publisher connection failed", publisherError);
          setError(publisherError.message || "Unable to publish screen");
          setStatus("");
        }
      }
    }

    startPublisher();
    return () => {
      cancelled = true;
      if (videoRef.current) {
        tracksRef.current.forEach((track) => track.detach(videoRef.current));
      }
      tracksRef.current.forEach((track) => track.stop());
      roomRef.current?.disconnect();
    };
  }, [token, url, tracks]);

  return (
    <main className="publisher-page">
      <section className="publisher-panel">
        <p className="eyebrow">WebRTC / Publisher</p>
        <h1>Browser sender</h1>
        <p className="muted">{status || error}</p>
        <video ref={videoRef} autoPlay muted playsInline className="publisher-preview" />
      </section>
    </main>
  );
}
