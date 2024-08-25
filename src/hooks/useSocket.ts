import { useSetAtom } from "jotai";
import { useEffect } from "react";
import { io, Socket } from "socket.io-client";

import { gameAtom } from "@/store/atom";
import { ClientToServerEvents, ServerToClientEvents } from "@/types/io";

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
      // socket.ioサーバから送られてきたメッセージを出力
      socketClient.on("msg", (msg) => {
        console.log(msg);
      });
      socketClient.on("createdRoom", (game) => {
        console.log(game);
        setGame(game);
      });
    };
    socketInitializer();
    return () => {
      socketClient.off("connect");
      socketClient.off("msg");
      socketClient.off("createdRoom");
    };
  }, [setGame]);
};
