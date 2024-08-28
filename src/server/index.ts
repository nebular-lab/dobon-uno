import { flatten } from "ramda";

export type Color = "Red" | "Yellow" | "Green" | "Blue";

export type CardNumber = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export type NumberCard = {
  kind: "NumberCard";
  color: Color;
  number: CardNumber;
};

export type ForceWildCard = {
  kind: "ForceWildCard";
  color: Color;
};

export type ReverseCard = {
  kind: "ReverseCard";
  color: Color;
};

export type SkipCard = {
  kind: "SkipCard";
  color: Color;
};

export type DrawTwoCard = {
  kind: "DrawTwoCard";
  color: Color;
};

export type WildCard = {
  kind: "WildCard";
};

export type SelectedWildCard = {
  kind: "SelectedWildCard";
  color: Color;
};

export type DrawFourCard = {
  kind: "WildDrawFourCard";
};

export type SelectedDrawFourCard = {
  kind: "SelectedDrawFourCard";
  color: Color;
};

export type Card =
  | NumberCard
  | ForceWildCard
  | ReverseCard
  | SkipCard
  | DrawTwoCard
  | WildCard
  | DrawFourCard;

export type BoardCard = Card | SelectedWildCard | SelectedDrawFourCard;

export type CardActionMeta = {
  canDiscard: boolean;
  canDoubleDiscard: boolean;
};

export type CardWithActionMeta = Card & CardActionMeta;

export type Clockwise = 1;
export type Counterclockwise = -1;

export type SeatId = 1 | 2 | 3 | 4 | 5 | 6;

export type EmptyPlayer = {
  kind: "empty";
};

export type WaitingPlayer = {
  kind: "waiting";
  name: string;
  deposit: number;
};

export type PlayingPlayer = {
  kind: "playing";
  name: string;
  deposit: number;
  cards: CardWithActionMeta[];
  score: number;
  action: string; // TODO union type

  canDraw: boolean;
  canPass: boolean;
  canDobon: boolean;
  canDobonReverse: boolean;
  canDrawStack: boolean;
  canSelectColor: boolean;
};

export type ClientPlayer = {
  kind: "client";
  name: string;
  deposit: number;
  score: number;
};

export type Field = {
  boardCards: BoardCard[];
  currentPlayerId: SeatId;
  direction: Clockwise | Counterclockwise;
  drawStack: number;
};

export type WaitingGame = {
  kind: "waiting";
  roomId: string;
  players: {
    1: WaitingPlayer | EmptyPlayer;
    2: WaitingPlayer | EmptyPlayer;
    3: WaitingPlayer | EmptyPlayer;
    4: WaitingPlayer | EmptyPlayer;
    5: WaitingPlayer | EmptyPlayer;
    6: WaitingPlayer | EmptyPlayer;
  };
};

export type ClientWaitingGame = WaitingGame & {
  seatId: SeatId;
};

export type PlayingGame = {
  kind: "in-game";
  roomId: string;
  players: {
    1: PlayingPlayer | EmptyPlayer;
    2: PlayingPlayer | EmptyPlayer;
    3: PlayingPlayer | EmptyPlayer;
    4: PlayingPlayer | EmptyPlayer;
    5: PlayingPlayer | EmptyPlayer;
    6: PlayingPlayer | EmptyPlayer;
  };
  field: {
    discardedCards: Card[];
    deck: Card[];
    stackCount: number;
    direction: Clockwise | Counterclockwise;
    nowTurn: SeatId;
  };
};

export type ClientInGame = {
  kind: "client-in-game";
  roomId: string;
  players: {
    1: ClientPlayer | EmptyPlayer;
    2: ClientPlayer | EmptyPlayer;
    3: ClientPlayer | EmptyPlayer;
    4: ClientPlayer | EmptyPlayer;
    5: ClientPlayer | EmptyPlayer;
    6: ClientPlayer | EmptyPlayer;
  };
  field: {
    discardedCards: Card[];
    restCardCount: number;
    stackCount: number;
    direction: Clockwise | Counterclockwise;
    nowTurn: SeatId;
  };
};

