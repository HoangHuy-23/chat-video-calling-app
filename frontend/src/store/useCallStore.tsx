import { OngoingCall, Participants, SocketUser, PeerData } from "../types";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import Peer, { SignalData } from "simple-peer";
import { useAuthStore } from "./useAuthStore";

interface iCallContext {
  ongoingCall: OngoingCall | null;
  localStream: MediaStream | null;
  peer: PeerData | null;
  isCallEnded: boolean;
  handleCall: (user: SocketUser) => void;
  handleJoinCall: (ongoingCall: OngoingCall) => void;
  handleHangup: (data: {
    ongoingCall?: OngoingCall | null;
    isEmitHangup?: boolean;
  }) => void;
}

export const CallContext = createContext<iCallContext | null>(null);

export const CallContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { user, socket } = useAuthStore();
  const [ongoingCall, setOngoingCall] = useState<OngoingCall | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [peer, setPeer] = useState<PeerData | null>(null);
  const [isCallEnded, setIsCallEnded] = useState(false);

  const currentSocketUser = {
    userId: user?._id,
    socketId: socket?.id,
  };

  // get media stream
  const getMediaStream = useCallback(
    async (faceMode?: string) => {
      if (localStream) return localStream;
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(
          (device) => device.kind === "videoinput"
        );

        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: {
            width: { min: 640, ideal: 1280, max: 1920 },
            height: { min: 360, ideal: 720, max: 1080 },
            frameRate: { min: 16, ideal: 30, max: 30 },
            facingMode: videoDevices.length > 0 ? faceMode : undefined,
          },
        });
        console.log("Stream được lấy:", stream);
        setLocalStream(stream);
        return stream;
      } catch (error) {
        console.log("Failed to get user media", error);
        setLocalStream(null);
        return null;
      }
    },
    [localStream]
  );

  // set ongoing calls
  const handleCall = useCallback(
    async (user: SocketUser) => {
      setIsCallEnded(false);
      if (!currentSocketUser || !socket) return;

      const stream = await getMediaStream();

      if (!stream) {
        console.log("No stream in handleCall");
        return;
      }

      if (!currentSocketUser.userId || !currentSocketUser.socketId) {
        console.log("Invalid current socket user");
        return;
      }

      const participants: Participants = {
        caller: {
          userId: currentSocketUser.userId,
          socketId: currentSocketUser.socketId,
        },
        receiver: user,
      };
      setOngoingCall({
        participants,
        isRinging: false,
      });
      socket?.emit("call", participants);
    },
    [socket, currentSocketUser, ongoingCall]
  );

  // incoming call listener
  const onIncomingCall = useCallback(
    (participants: Participants) => {
      setOngoingCall({
        participants,
        isRinging: true,
      });
    },
    [socket, ongoingCall, user]
  );

  // handle hangup
  const handleHangup = useCallback(
    (data: { ongoingCall?: OngoingCall | null; isEmitHangup?: boolean }) => {
      if (socket && user && data?.ongoingCall && data?.isEmitHangup) {
        socket.emit("hangup", {
          ongoingCall: data.ongoingCall,
          userHangupId: user._id,
        });
      }

      setOngoingCall(null);
      setPeer(null);
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
        setLocalStream(null);
      }
      setIsCallEnded(true);
    },
    [socket, user, localStream]
  );

  // create peer connection
  const createPeer = useCallback(
    (stream: MediaStream, initiator: boolean) => {
      const iceServers: RTCIceServer[] = [
        {
          urls: [
            "stun:stun.l.google.com:19302",
            "stun:stun1.l.google.com:19302",
            "stun:stun2.l.google.com:19302",
            "stun:stun3.l.google.com:19302",
          ],
        },
      ];

      const peer = new Peer({
        initiator,
        trickle: true,
        stream,
        config: {
          iceServers,
        },
      });

      peer.on("stream", (stream) => {
        setPeer((prev) => {
          if (prev) {
            return {
              ...prev,
              stream,
            };
          }
          return prev;
        });
      });

      peer.on("error", console.error);
      peer.on("close", () => handleHangup({}));

      const rtcPeerConnection: RTCPeerConnection = (peer as any)._pc;

      rtcPeerConnection.oniceconnectionstatechange = async () => {
        if (
          rtcPeerConnection.iceConnectionState === "failed" ||
          rtcPeerConnection.iceConnectionState === "disconnected"
        ) {
          handleHangup({});
        }
      };

      return peer;
    },
    [ongoingCall, setPeer]
  );

  // complete peer connection
  const completePeerConnection = useCallback(
    async (connectionData: {
      sdp: SignalData;
      ongoingCall: OngoingCall;
      isCaller: boolean;
    }) => {
      //
      let stream = localStream;
      if (!stream) {
        console.log("Missing local stream in completePeerConnection");
        stream = await getMediaStream();
        if (!stream) {
          console.log("Failed to fetch local stream");
          return;
        }
      }
      // if (!localStream) {
      //   console.log("Missing local stream in completePeerConnection");
      //   return;
      // }

      if (peer) {
        peer.peerConnection?.signal(connectionData.sdp);
        return;
      }

      // create peer connection
      //const newPeer = createPeer(localStream, true);
      const newPeer = createPeer(stream, true);

      setPeer({
        peerConnection: newPeer,
        participantUser: connectionData.ongoingCall.participants.receiver,
        stream: undefined,
      });

      newPeer.on("signal", async (data: SignalData) => {
        if (socket) {
          // emit offer signal
          socket.emit("webrtcSignal", {
            sdp: data,
            ongoingCall,
            isCaller: true,
          });
        }
      });
    },
    [localStream, createPeer, peer, ongoingCall]
  );

  // join call
  const handleJoinCall = useCallback(
    async (ongoingCall: OngoingCall) => {
      setIsCallEnded(false);
      setOngoingCall((prev) => {
        if (prev) {
          return {
            ...prev,
            isRinging: false,
          };
        }
        return prev;
      });

      const stream = await getMediaStream();

      if (!stream) {
        console.log("No stream in handleJoinCall");
        handleHangup({
          ongoingCall: ongoingCall ? ongoingCall : undefined,
          isEmitHangup: true,
        });
        return;
      }
      // create peer connection
      // change to false
      const newPeer = createPeer(stream, true);

      setPeer({
        peerConnection: newPeer,
        participantUser: ongoingCall.participants.caller,
        stream: undefined,
      });

      newPeer.on("signal", async (data: SignalData) => {
        if (socket) {
          // emit offer signal
          socket.emit("webrtcSignal", {
            sdp: data,
            ongoingCall,
            isCaller: false,
          });
        }
      });
    },
    [socket, currentSocketUser]
  );

  // calls listener
  useEffect(() => {
    if (!socket) return;
    socket.on("incomingCall", onIncomingCall);
    socket.on("webrtcSignal", completePeerConnection);
    socket.on("hangup", handleHangup);

    return () => {
      socket.off("incomingCall", onIncomingCall);
      socket.off("webrtcSignal", completePeerConnection);
      socket.off("hangup", handleHangup);
    };
  }, [socket, user, onIncomingCall, completePeerConnection, handleHangup]);

  // useEffect(() => {
  //   let timeout: ReturnType<typeof setTimeout>;

  //   if (isCallEnded) {
  //     timeout = setTimeout(() => {
  //       setIsCallEnded(false);
  //     }, 2000);
  //   }

  //   return () => {
  //     clearTimeout(timeout);
  //   };
  // }, [isCallEnded]);

  return (
    <CallContext.Provider
      value={{
        ongoingCall,
        localStream,
        peer,
        isCallEnded,
        handleCall,
        handleJoinCall,
        handleHangup,
      }}
    >
      {children}
    </CallContext.Provider>
  );
};

export const useCallStore = () => {
  const context = useContext(CallContext);
  if (context === null) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};
