import { useSetAtom } from "jotai";
import { useEffect } from "react";
import { io, Socket } from "socket.io-client";
import useSound from "use-sound";

import { toast } from "@/components/ui/use-toast";
import { ClientToServerEvents, ServerToClientEvents } from "@/pages/api/socket";
import { gameAtom } from "@/store/atom";

export const socketClient: Socket<ServerToClientEvents, ClientToServerEvents> =
  io({
    autoConnect: false,
  });

export const useSocket = () => {
  const setGame = useSetAtom(gameAtom);
  const [play] = useSound("/sound/notification.mp3");
  useEffect(() => {
    const socketInitializer = async () => {
      await fetch("/api/socket", { method: "POST" });
      if (socketClient.connected) {
        return;
      }
      // socket.ioサーバに接続
      socketClient.connect();
      // socket.ioのイベント登録する場合はここに
      socketClient.on("connect", () => {
        console.log("connected!");
      });
      socketClient.on("createdRoom", (clientWaitingGame) => {
        setGame(clientWaitingGame);
      });
      socketClient.on("joinedRoom", (clientWaitingGame) => {
        setGame(clientWaitingGame);
      });
      socketClient.on(
        "otherPlayerJoined",
        (clientWaitingGame, joinedUserName) => {
          setGame(clientWaitingGame);
          toast({
            title: `${joinedUserName}さんが参加しました`,
          });
          play();
        }
      );
      socketClient.on("error", (message) => {
        toast({
          title: message,
          variant: "destructive",
        });
      });
    };
    socketInitializer();
    return () => {
      socketClient.off("connect");
      socketClient.off("createdRoom");
      socketClient.off("joinedRoom");
    };
  }, [setGame]);
};
