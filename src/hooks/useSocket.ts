import { useSetAtom } from "jotai";
import { useEffect } from "react";
import { io, Socket } from "socket.io-client";

import { ClientToServerEvents, ServerToClientEvents } from "@/pages/api/socket";
import { gameAtom } from "@/store/atom";

export const socketClient: Socket<ServerToClientEvents, ClientToServerEvents> =
  io({
    autoConnect: false,
  });

export const useSocket = () => {
  const setGame = useSetAtom(gameAtom);
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
    };
    socketInitializer();
    return () => {
      socketClient.off("connect");
      socketClient.off("createdRoom");
      socketClient.off("joinedRoom");
    };
  }, [setGame]);
};