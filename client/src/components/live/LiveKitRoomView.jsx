import { lazy, Suspense } from "react";
import {
  LiveKitRoom,
  RoomAudioRenderer,
} from "@livekit/components-react";

import "@livekit/components-styles";

const VideoConference = lazy(() => import("./LiveKitConference.jsx"));

const LiveKitRoomView = ({
  token,
  serverUrl,
  video,
  audio,
  onConnected,
  onDisconnected,
  onError,
}) => (
  <LiveKitRoom
    token={token}
    serverUrl={serverUrl}
    connect
    video={video}
    audio={audio}
    data-lk-theme="default"
    style={{ height: "min(76vh, 900px)", minHeight: "480px" }}
    onConnected={onConnected}
    onDisconnected={onDisconnected}
    onError={onError}
  >
    <Suspense fallback={
      <div className="flex min-h-[400px] items-center justify-center text-sm text-gray-300">
        Loading video conference...
      </div>
    }>
      <VideoConference />
    </Suspense>
    <RoomAudioRenderer />
  </LiveKitRoom>
);

export default LiveKitRoomView;
