import { flatten } from "ramda";

import {
  Card,
  CardNumber,
  Color,
  DrawFourCard,
  DrawTwoCard,
  ForceWildCard,
  NumberCard,
  ReverseCard,
  SkipCard,
  WildCard,
} from "..";

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
