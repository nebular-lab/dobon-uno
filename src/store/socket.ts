import { atom } from "jotai";
import { Socket } from "socket.io-client";

import { ClientToServerEvents, ServerToClientEvents } from "@/types/io";

export const socketAtom = atom<
  Socket<ServerToClientEvents, ClientToServerEvents> | undefined
>(undefined);
