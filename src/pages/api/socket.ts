import { Server } from "socket.io";

import { redisClient } from "@/server/redis";
import {
  ClientWaitingGame,
  createRoomFlow,
  joinRoomFlow,
  ServerWaitingGameSchema,
} from "@/server/waitingRoom";

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
  otherPlayerJoined: (game: ClientWaitingGame, joinedUserName: string) => void;
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
      const result = createRoomFlow({
        username,
        socketId: socket.id,
      });
      if (result.isOk()) {
        const roomId = result.value.clientWaitingGame.roomId;
        socket.join(roomId);
        redisClient.set(roomId, JSON.stringify(result.value.serverWaitingGame));
        io.sockets
          .in(roomId)
          .emit("createdRoom", result.value.clientWaitingGame);
      } else {
        io.to(socket.id).emit("error", result.error.message);
      }
    });

    socket.on("joinRoom", async (username, roomId) => {
      const serverWaitingGame = await redisClient.get(roomId);

      if (!serverWaitingGame) {
        io.to(socket.id).emit("error", "ルームが見つかりませんでした");
        return;
      }

      const safeParsedServerWaitingGame = ServerWaitingGameSchema.safeParse(
        JSON.parse(serverWaitingGame)
      );

      if (!safeParsedServerWaitingGame.success) {
        io.to(socket.id).emit("error", "ルームが見つかりませんでした");
        return;
      }

      const result = joinRoomFlow({
        username,
        socketId: socket.id,
        serverWaitingGame: safeParsedServerWaitingGame.data,
      });

      if (result.isOk()) {
        const clientWaitingGames = result.value.clientWaitingGames;
        socket.join(roomId);
        redisClient.set(roomId, JSON.stringify(result.value.serverWaitingGame));
        clientWaitingGames.forEach((game) => {
          const seatId = game.seatId;
          const socketId =
            game.players[seatId].kind === "client-server-waiting-player"
              ? game.players[seatId].socketId
              : undefined;
          if (!socketId) return;
          if (socketId === socket.id) {
            io.to(socketId).emit("joinedRoom", game);
            return;
          }
          io.to(socketId).emit("otherPlayerJoined", game, username);
        });
      } else {
        io.to(socket.id).emit("error", result.error.message);
      }
    });
  });
  res.socket.server.io = io;

  return res.end();
}
