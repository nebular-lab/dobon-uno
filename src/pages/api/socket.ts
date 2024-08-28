import { Server } from "socket.io";

import { ClientWaitingGame } from "@/server";
import { redisClient } from "@/server/redis";
import { createRoomFlow, joinRoomFlow } from "@/server/waitingRoom";

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

export type ServerToClientEvents = {
  createdRoom: (game: ClientWaitingGame) => void;
  joinedRoom: (game: ClientWaitingGame) => void;
  error: (message: string) => void;
};

export type ClientToServerEvents = {
  createRoom: (username: string) => void;
  joinRoom: (username: string, roomId: string) => void;
};

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

  io.on("connection", async (socket) => {
    socket.on("disconnect", () => console.log("disconnected"));
    socket.on("createRoom", (username) => {
      const result = createRoomFlow(username, socket.id);
      if (result.isOk()) {
        const roomId = result.value.clientWaitingGame.roomId;
        socket.join(roomId);
        redisClient.set(roomId, JSON.stringify(result.value.waitingGame));
        io.sockets
          .in(roomId)
          .emit("createdRoom", result.value.clientWaitingGame);
      } else {
        io.to(socket.id).emit("error", result.error.message);
      }
    });
    socket.on("joinRoom", async (username, roomId) => {
      console.log("joinRoom", username, roomId);

      const waitingGame = await redisClient.get(roomId);
      if (!waitingGame) {
        io.to(socket.id).emit("error", "部屋が見つかりませんでした。");
        return;
      }
      const result = joinRoomFlow(username, JSON.parse(waitingGame));
      if (result.isOk()) {
        socket.join(roomId);
        redisClient.set(roomId, JSON.stringify(result.value.waitingGame));
        io.sockets
          .in(roomId)
          .emit("joinedRoom", result.value.clientWaitingGame);
      } else {
        io.to(socket.id).emit("error", result.error.message);
      }
    });
  });
  res.socket.server.io = io;

  return res.end();
}
