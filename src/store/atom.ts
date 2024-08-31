import { atom } from "jotai";

import { ClientWaitingGame } from "@/server/waitingRoom";

export const gameAtom = atom<ClientWaitingGame | undefined>(undefined);

export const screenAtom = atom((get) => get(gameAtom)?.kind ?? "title");
export const roomIdAtom = atom((get) => get(gameAtom)?.roomId);
export const player1Atom = atom((get) => get(gameAtom)?.players[1]);
export const player2Atom = atom((get) => get(gameAtom)?.players[2]);
export const player3Atom = atom((get) => get(gameAtom)?.players[3]);
export const player4Atom = atom((get) => get(gameAtom)?.players[4]);
export const player5Atom = atom((get) => get(gameAtom)?.players[5]);
export const player6Atom = atom((get) => get(gameAtom)?.players[6]);
export const heroSeatIdAtom = atom((get) => get(gameAtom)?.seatId);
export const nowTurnAtom = atom(() => 7); // in-gameが実装されたら修正