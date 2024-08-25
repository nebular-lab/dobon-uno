import { flatten } from "ramda";

type Color = "Red" | "Yellow" | "Green" | "Blue";

type CardNumber = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

type NumberCard = {
  kind: "NumberCard";
  color: Color;
  number: CardNumber;
};

type ForceWildCard = {
  kind: "ForceWildCard";
  color: Color;
};

type ReverseCard = {
  kind: "ReverseCard";
  color: Color;
};

type SkipCard = {
  kind: "SkipCard";
  color: Color;
};

type DrawTwoCard = {
  kind: "DrawTwoCard";
  color: Color;
};

type WildCard = {
  kind: "WildCard";
};

type DrawFourCard = {
  kind: "WildDrawFourCard";
};

export type Card =
  | NumberCard
  | ForceWildCard
  | ReverseCard
  | SkipCard
  | DrawTwoCard
  | WildCard
  | DrawFourCard;

export type CardWithPrivateInfo = Card & {
  canDiscard: boolean; // このカードが今捨てられるか
  canDoubleDiscard: boolean; // 2枚捨て出来るか
};

type Clockwise = 1;
type Counterclockwise = -1;

type SeatId = 0 | 1 | 2 | 3 | 4 | 5;

type MasterPlayer = {
  seatId: SeatId;
  name: string;
  hand: CardWithPrivateInfo[];
  deposit: number;
  handTotalScore: number;

  // ボタンの表示非表示に使う
  canDraw: boolean;
  canPass: boolean;
  canDobon: boolean;
  canDobonReverse: boolean;
  canDrawStack: boolean;
  canSelectColor: boolean;
};

type Villain = {
  name: string;
  hand: Card[];
  deposit: number;
  handTotalScore: number;
};

type Field = {
  boardCards: Card[];
  currentPlayerId: SeatId;
  direction: Clockwise | Counterclockwise;
  drawStack: number;
};

// serverで保持する全てのゲーム情報
export type MasterGameState = {
  players: MasterPlayer[];
  field: Field;
};

// clientに送る情報
type PrivateGameState = {
  hero: MasterPlayer;
  villains: Villain[];

  field: Field;
};

type CreateDeck = () => Card[];

const createDeck: CreateDeck = () => {
  const colors: Color[] = ["Red", "Yellow", "Green", "Blue"];
  const numbers: CardNumber[] = [
    0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9,
  ];

  const numberCards: NumberCard[] = flatten(
    colors.map((color) =>
      numbers.map((number) => ({
        color,
        kind: "NumberCard" as const,
        number,
      }))
    )
  );

  const forceWildCards: ForceWildCard[] = colors.map((color) => ({
    color,
    kind: "ForceWildCard",
  }));

  const skipCards: SkipCard[] = [...colors, ...colors].map((color) => ({
    color,
    kind: "SkipCard",
  }));

  const reverseCards: ReverseCard[] = [...colors, ...colors].map((color) => ({
    color,
    kind: "ReverseCard",
  }));

  const drawTwoCards: DrawTwoCard[] = [...colors, ...colors].map((color) => ({
    color,
    kind: "DrawTwoCard",
  }));

  const wildCards: WildCard[] = [
    { kind: "WildCard" },
    { kind: "WildCard" },
    { kind: "WildCard" },
    { kind: "WildCard" },
  ];

  const wildDrawFourCards: DrawFourCard[] = [
    { kind: "WildDrawFourCard" },
    { kind: "WildDrawFourCard" },
    { kind: "WildDrawFourCard" },
    { kind: "WildDrawFourCard" },
  ];
  return [
    ...numberCards,
    ...forceWildCards,
    ...skipCards,
    ...reverseCards,
    ...drawTwoCards,
    ...wildCards,
    ...wildDrawFourCards,
  ];
};
