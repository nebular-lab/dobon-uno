import { Server } from "socket.io";

import { redisClient } from "@/server/redis";
import { ClientToServerEvents, ServerToClientEvents } from "@/types/io";

import type { Server as HttpServer } from "http";
import type { Socket as NetSocket } from "net";
import type { NextApiRequest, NextApiResponse } from "next";
import type { Server as IOServer } from "socket.io";

interface SocketServer extends HttpServer {
  io?: IOServer;
}

interface SocketServerWithIO extends NetSocket {
  server: SocketServer;
}

interface ResponseWithSocket extends NextApiResponse {
  socket: SocketServerWithIO;
}

interface InterServerEvents {
  ping: () => void;
}
interface SocketData {
  name: string;
  age: number;
}

export default function handler(req: NextApiRequest, res: ResponseWithSocket) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }
  if (res.socket.server.io) {
    return res.send("server is already running");
  }
  const io = new Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >(res.socket.server, { addTrailingSlash: false });
  // 各イベントを設定
  io.on("connection", async (socket) => {
    socket.on("disconnect", () => console.log("disconnected"));
    socket.emit("msg", "hello, from server!");
    socket.emit("basicEmit", 2, "3", (a) => console.log(a));
    await redisClient.set("socketId", socket.id);

  });
  res.socket.server.io = io;

  return res.end();
}
