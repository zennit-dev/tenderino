"use client";

import "@livekit/components-styles";
import {
  ControlBar,
  GridLayout,
  LiveKitRoom,
  ParticipantTile,
  RoomAudioRenderer,
  useTracks,
} from "@livekit/components-react";
import { Track } from "livekit-client";

type RoomParams = {
  token: string;
  serverUrl: string;
};
export const Room = ({ token }: RoomParams) => {
  return (
    <LiveKitRoom
      video={true}
      audio={true}
      token={token}
      serverUrl={"wss://zennstream-lbp8xyc3.livekit.cloud"}
      connect={true}
      // Use the default LiveKit theme for nice styles.
      data-lk-theme="default"
      className={"size-full"}
    >
      {/* Your custom component with basic video conferencing functionality. */}
      <RoomTracks />
      {/* The RoomAudioRenderer takes care of room-wide audio for you. */}
      <RoomAudioRenderer />
      {/* Controls for the user to start/stop audio, video, and screen
      share tracks and to leave the room. */}
      <ControlBar saveUserChoices variation={"verbose"} />
    </LiveKitRoom>
  );
};

export const RoomTracks = () => {
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false },
  );
  return (
    <GridLayout
      tracks={tracks}
      style={{ height: "calc(100% - var(--lk-control-bar-height))" }}
    >
      {/* The GridLayout accepts zero or one child. The child is used
      as a template to render all passed in tracks. */}
      <ParticipantTile />
    </GridLayout>
  );
};
