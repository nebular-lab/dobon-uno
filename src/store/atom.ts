import { atom } from "jotai";

import { Card, CardWithPrivateInfo } from "@/server/game";

// export const screenAtom = atom<"title" | "in-game">("title");

type EmptyPlayer = {
  kind: "empty";
};
type SeatedPlayer = {
  kind: "seated";
  name: string;
  score: number;
  deposit: number;
  action: string; // TODO union type
};

export type Player = EmptyPlayer | SeatedPlayer;

export type SeatId = 1 | 2 | 3 | 4 | 5 | 6;
export const playerAtom = atom<Player>();

export type Game = {
  kind: "in-game" | "title";
  players: {
    1: Player;
    2: Player;
    3: Player;
    4: Player;
    5: Player;
    6: Player;
  };
  field: {
    discardedCards: Card[];
    restCardCount: number;
    stackCount: number;
  };
  hero: {
    cards: CardWithPrivateInfo[];
    seatId: SeatId;
  };
  direction: 1 | -1;
  nowTurn: SeatId | "no";
  buttons: {
    canDraw: boolean;
    canPass: boolean;
    canDobon: boolean;
    canDobonReverse: boolean;
    canDrawStack: boolean;
    canSelectColor: boolean;
  };
};
export const initialGame: Game = {
  kind: "title",
  players: {
    1: { kind: "empty" },
    2: { kind: "empty" },
    3: { kind: "empty" },
    4: { kind: "empty" },
    5: { kind: "empty" },
    6: { kind: "empty" },
  },
  field: {
    discardedCards: [],
    restCardCount: 108,
    stackCount: 0,
  },
  hero: {
    cards: [],
    seatId: 1,
  },
  direction: 1,
  nowTurn: 1,
  buttons: {
    canDraw: false,
    canPass: false,
    canDobon: false,
    canDobonReverse: false,
    canDrawStack: false,
    canSelectColor: false,
  },
};

export const gameAtom = atom<Game>(initialGame);

export const screenAtom = atom((get) => get(gameAtom).kind);

export const player1Atom = atom((get) => get(gameAtom).players[1]);
export const player2Atom = atom((get) => get(gameAtom).players[2]);
export const player3Atom = atom((get) => get(gameAtom).players[3]);
export const player4Atom = atom((get) => get(gameAtom).players[4]);
export const player5Atom = atom((get) => get(gameAtom).players[5]);
export const player6Atom = atom((get) => get(gameAtom).players[6]);

export const nowTurnAtom = atom((get) => get(gameAtom).nowTurn);

export const directionAtom = atom((get) => get(gameAtom).direction);

export const heroSeatIdAtom = atom((get) => get(gameAtom).hero.seatId);