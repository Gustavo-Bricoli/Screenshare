import React from "react";
import {
  LiveKitRoom,
  RoomAudioRenderer,
  VideoTrack,
  useRoomContext,
  useTracks
} from "@livekit/components-react";
import { RoomEvent, Track } from "livekit-client";

function ViewerContent() {
  const room = useRoomContext();
  const stageRef = React.useRef(null);
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const tracks = useTracks([
    { source: Track.Source.ScreenShare, withPlaceholder: false }
  ]);
  const screenTrack = tracks[0];

  React.useEffect(() => {
    const onConnected = () => console.info("[WEBRTC] Connected to LiveKit", {
      room: room.name,
      remoteParticipants: room.remoteParticipants.size
    });
    const onDisconnected = (reason) => console.warn("[WEBRTC] Disconnected from LiveKit", { reason });
    const onConnectionStateChanged = (state) => console.info("[WEBRTC] LiveKit connection state", { state });
    const onParticipantConnected = (participant) => console.info("[WEBRTC] Remote participant connected", {
      identity: participant.identity
    });
    const onParticipantDisconnected = (participant) => console.warn("[WEBRTC] Remote participant disconnected", {
      identity: participant.identity
    });
    const onTrackSubscribed = (track, publication, participant) => console.info("[WEBRTC] Remote track subscribed", {
      identity: participant.identity,
      kind: track.kind,
      source: publication.source,
      trackSid: publication.trackSid
    });
    const onTrackPublished = (publication, participant) => console.info("[WEBRTC] Remote track published", {
      identity: participant.identity,
      kind: publication.kind,
      source: publication.source,
      trackSid: publication.trackSid
    });
    const onTrackSubscriptionFailed = (trackSid, participant) => console.error(
      "[WEBRTC] Remote track subscription failed",
      { identity: participant.identity, trackSid }
    );

    room.on(RoomEvent.Connected, onConnected);
    room.on(RoomEvent.Disconnected, onDisconnected);
    room.on(RoomEvent.ConnectionStateChanged, onConnectionStateChanged);
    room.on(RoomEvent.ParticipantConnected, onParticipantConnected);
    room.on(RoomEvent.ParticipantDisconnected, onParticipantDisconnected);
    room.on(RoomEvent.TrackPublished, onTrackPublished);
    room.on(RoomEvent.TrackSubscribed, onTrackSubscribed);
    room.on(RoomEvent.TrackSubscriptionFailed, onTrackSubscriptionFailed);

    return () => {
      room.off(RoomEvent.Connected, onConnected);
      room.off(RoomEvent.Disconnected, onDisconnected);
      room.off(RoomEvent.ConnectionStateChanged, onConnectionStateChanged);
      room.off(RoomEvent.ParticipantConnected, onParticipantConnected);
      room.off(RoomEvent.ParticipantDisconnected, onParticipantDisconnected);
      room.off(RoomEvent.TrackPublished, onTrackPublished);
      room.off(RoomEvent.TrackSubscribed, onTrackSubscribed);
      room.off(RoomEvent.TrackSubscriptionFailed, onTrackSubscriptionFailed);
    };
  }, [room]);

  React.useEffect(() => {
    const updateFullscreen = () => {
      if (document.fullscreenEnabled) {
        setIsFullscreen(document.fullscreenElement === stageRef.current);
      }
    };
    document.addEventListener("fullscreenchange", updateFullscreen);
    return () => document.removeEventListener("fullscreenchange", updateFullscreen);
  }, []);

  async function toggleFullscreen() {
    const stage = stageRef.current;
    if (!stage) return;
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else if (stage.requestFullscreen) {
        await stage.requestFullscreen();
      } else {
        setIsFullscreen((fullscreen) => !fullscreen);
      }
    } catch (fullscreenError) {
      console.warn("[WEBRTC] Fullscreen request failed; using page fullscreen", fullscreenError);
      setIsFullscreen((fullscreen) => !fullscreen);
    }
  }

  return (
    <main className={`room${isFullscreen ? " is-fullscreen" : ""}`}>
      <header className="room-header">
        <span className="live-dot" />
        <span>Live screen</span>
      </header>
      <section className="screen-stage" ref={stageRef}>
        {screenTrack ? (
          <>
            <VideoTrack trackRef={screenTrack} className="screen-video" />
            <button className="fullscreen-button" type="button" onClick={toggleFullscreen}>
              {isFullscreen ? "Sair da tela cheia" : "Tela cheia"}
            </button>
          </>
        ) : (
          <div className="empty-state">Waiting for the sender...</div>
        )}
      </section>
    </main>
  );
}

export default function ViewerScreen({ token, url }) {
  return (
    <LiveKitRoom token={token} serverUrl={url} connect audio={false} video={false} data-lk-theme="default">
      <ViewerContent />
      <RoomAudioRenderer />
    </LiveKitRoom>
  );
}
