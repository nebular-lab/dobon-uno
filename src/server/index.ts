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
  kind: "client-server-empty-player";
};

export type ServerPlayingPlayer = {
  kind: "server-playing-player";
  socketId: string;
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

export type ClientPlayingPlayer = {
  kind: "client-playing-player";
  socketId: string;
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



export type ServerPlayingGame = {
  kind: "server-playing-game";
  roomId: string;
  players: {
    1: ServerPlayingPlayer | EmptyPlayer;
    2: ServerPlayingPlayer | EmptyPlayer;
    3: ServerPlayingPlayer | EmptyPlayer;
    4: ServerPlayingPlayer | EmptyPlayer;
    5: ServerPlayingPlayer | EmptyPlayer;
    6: ServerPlayingPlayer | EmptyPlayer;
  };
  field: {
    discardedCards: Card[];
    deck: Card[];
    stackCount: number;
    direction: Clockwise | Counterclockwise;
    nowTurn: SeatId;
  };
};

export type ClientPlayingGame = {
  kind: "client-playing-game";
  roomId: string;
  players: {
    1: ClientPlayingPlayer | EmptyPlayer;
    2: ClientPlayingPlayer | EmptyPlayer;
    3: ClientPlayingPlayer | EmptyPlayer;
    4: ClientPlayingPlayer | EmptyPlayer;
    5: ClientPlayingPlayer | EmptyPlayer;
    6: ClientPlayingPlayer | EmptyPlayer;
  };
  field: {
    discardedCards: Card[];
    restCardCount: number;
    stackCount: number;
    direction: Clockwise | Counterclockwise;
    nowTurn: SeatId;
  };
};
