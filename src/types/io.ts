import { Game } from "@/store/atom";

export type ServerToClientEvents = {
  msg: (a: string) => void;
  basicEmit: (a: number, b: string, callback: (e: number) => void) => void;
  createdRoom: (game: Game) => void;
};

export type ClientToServerEvents = {
  hello: (message: string) => void;
  createRoom: (username: string) => void;
};
