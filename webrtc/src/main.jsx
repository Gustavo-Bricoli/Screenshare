import React from "react";
import { createRoot } from "react-dom/client";
import { createLocalScreenTracks } from "livekit-client";
import "@livekit/components-styles";
import "./styles.css";
import BrowserPublisherScreen from "./screens/BrowserPublisherScreen";
import JoinScreen from "./screens/JoinScreen";
import MainScreen from "./screens/MainScreen";
import PythonPublisherScreen from "./screens/PythonPublisherScreen";
import ViewerScreen from "./screens/ViewerScreen";

const routes = {
  main: "/main",
  viewer: "/viewer",
  publisher: "/publisher",
  "python-publisher": "/python-publisher"
};

function routeFromPath(pathname) {
  if (pathname === routes.viewer) return "viewer";
  if (pathname === routes.publisher) return "publisher";
  if (pathname === routes["python-publisher"]) return "python-publisher";
  return "main";
}

function App() {
  const [room, setRoom] = React.useState("screen-share");
  const [identity, setIdentity] = React.useState("mobile-viewer");
  const [session, setSession] = React.useState(null);
  const [error, setError] = React.useState("");
  const [route, setRoute] = React.useState(() => routeFromPath(window.location.pathname));

  const mode = route === "publisher" ? "browser-publisher" : route;

  React.useEffect(() => {
    if (window.location.pathname === "/") {
      window.history.replaceState(null, "", routes.main);
    }

    function handlePopState() {
      setSession(null);
      setError("");
      setRoute(routeFromPath(window.location.pathname));
    }

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  function navigate(nextRoute, clearSession = true) {
    const routeName = nextRoute === "browser-publisher" ? "publisher" : nextRoute;
    const path = routes[routeName];
    window.history.pushState(null, "", path);
    if (clearSession) setSession(null);
    setError("");
    setRoute(nextRoute);
  }

  function selectMode(nextMode) {
    navigate(nextMode);
    setError("");
    if (nextMode === "browser-publisher") setIdentity("browser-sender");
    if (nextMode === "viewer") setIdentity("mobile-viewer");
  }

  async function joinRoom(event) {
    event.preventDefault();
    setError("");
    console.info("[WEBRTC] Requesting viewer token", {
      origin: window.location.origin,
      room,
      identity
    });

    let browserTracks = null;
    try {
      const role = mode === "viewer" ? "viewer" : "publisher";
      if (mode === "browser-publisher") {
        if (!window.isSecureContext || !navigator.mediaDevices?.getDisplayMedia) {
          throw new Error(
            "A captura de tela exige HTTPS (ou localhost) e Chrome/Edge. Abra o site por https:// ou use localhost no computador host."
          );
        }
        browserTracks = await createLocalScreenTracks({
          audio: true,
          resolution: { width: 1920, height: 1080, frameRate: 30 }
        });
      }

      const query = new URLSearchParams({ room, identity, role });
      const response = await fetch(`/api/token?${query}`);
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || "Unable to join");
      console.info("[WEBRTC] Viewer token received", {
        room: body.room,
        identity: body.identity,
        livekitUrl: body.url
      });
      setSession({ ...body, tracks: browserTracks });
      if (mode === "viewer") {
        navigate("viewer", false);
      } else {
        navigate("publisher", false);
      }
    } catch (joinError) {
      browserTracks?.forEach((track) => track.stop());
      console.error("[WEBRTC] Viewer token request failed", joinError);
      setError(joinError.message);
    }
  }

  if (session && mode === "browser-publisher") {
    return (
      <BrowserPublisherScreen
        token={session.token}
        url={session.url}
        tracks={session.tracks}
      />
    );
  }
  if (mode === "python-publisher") {
    return <PythonPublisherScreen />;
  }
  if (route === "main") {
    return <MainScreen onModeChange={selectMode} />;
  }
  if (session) {
    return <ViewerScreen token={session.token} url={session.url} />;
  }
  return (
    <JoinScreen
      room={room}
      identity={identity}
      mode={mode}
      error={error}
      onRoomChange={setRoom}
      onIdentityChange={setIdentity}
      onModeChange={selectMode}
      onSubmit={joinRoom}
    />
  );
}

createRoot(document.getElementById("root")).render(<App />);
