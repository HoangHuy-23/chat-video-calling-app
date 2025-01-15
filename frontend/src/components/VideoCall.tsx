import React, { useEffect } from "react";
import { MdMic, MdMicOff, MdVideocam, MdVideocamOff } from "react-icons/md";
import { useCallStore } from "../store/useCallStore";
import VideoContainer from "./VideoContainer";

interface VideoCallProps {
  showCall: boolean;
  setShowCall: (value: boolean) => void;
}

function VideoCall({ showCall, setShowCall }: VideoCallProps) {
  const { localStream, peer, ongoingCall, isCallEnded, handleHangup } =
    useCallStore();
  const [isMicOn, setIsMicOn] = React.useState(true);
  const [isCameraOn, setIsCameraOn] = React.useState(true);

  React.useEffect(() => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      setIsCameraOn(videoTrack.enabled);
      const audioTrack = localStream.getAudioTracks()[0];
      setIsMicOn(audioTrack.enabled);
    }
  }, [localStream]);

  const handleMic = React.useCallback(() => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      audioTrack.enabled = !audioTrack.enabled;
      setIsMicOn(audioTrack.enabled);
    }
  }, [localStream]);

  const handleCamera = React.useCallback(() => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      videoTrack.enabled = !videoTrack.enabled;
      setIsCameraOn(videoTrack.enabled);
    }
  }, [localStream]);

  const isOnCall = localStream && peer && ongoingCall ? true : false;

  useEffect(() => {
    if (isCallEnded) {
      // setShowCall(false);
    }
  }, [isCallEnded, setShowCall]);

  if (!localStream && !peer) {
    return null;
  }
  return (
    <div
      className={`${
        showCall ? "" : "hidden"
      } w-full h-full absolute bg-base-content bg-opacity-50`}
    >
      <div className="mt-4 relative max-w-[800px] mx-auto">
        {localStream && (
          <VideoContainer
            stream={localStream}
            isLocalStream={true}
            isOnCall={isOnCall}
          />
        )}
        {peer && peer.stream && (
          <VideoContainer
            stream={peer.stream}
            isLocalStream={false}
            isOnCall={isOnCall}
          />
        )}
      </div>
      <div className="mt-8 flex justify-center items-center gap-4">
        <button onClick={handleMic}>
          {isMicOn ? <MdMicOff size={28} /> : <MdMic size={28} />}
        </button>
        <button
          className="bg-red-500 p-2 rounded-full"
          onClick={() =>
            handleHangup({
              ongoingCall: ongoingCall ? ongoingCall : undefined,
              isEmitHangup: true,
            })
          }
        >
          <span className="text-2xl text-white">End Call</span>
        </button>
        <button onClick={handleCamera}>
          {isCameraOn ? <MdVideocamOff size={28} /> : <MdVideocam size={28} />}
        </button>
      </div>
    </div>
  );
}

export default VideoCall;
