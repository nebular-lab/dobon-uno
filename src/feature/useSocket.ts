import { useEffect } from "react";
import { io, Socket } from "socket.io-client";

import { ClientToServerEvents, ServerToClientEvents } from "@/types/io";

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io({
  autoConnect: false,
});

export const useSocket = () => {
  useEffect(() => {
    const socketInitializer = async () => {
      await fetch("/api/socket", { method: "POST" });
      if (socket.connected) {
        return;
      }
      // socket.ioサーバに接続
      socket.connect();
      // socket.ioのイベント登録する場合はここに
      socket.on("connect", () => {
        console.log("connected!");
      });
      // socket.ioサーバから送られてきたメッセージを出力
      socket.on("msg", (msg) => {
        console.log(msg);
      });
    };
    socketInitializer();
    return () => {
      socket.off("connect");
      socket.off("msg");
    };
  }, []);
};
