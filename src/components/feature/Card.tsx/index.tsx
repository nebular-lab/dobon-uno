import { match } from "ts-pattern";

import { Card as CardType } from "@/server";

type CardProps = {
  card: CardType;
};
const Card = (props: CardProps) => {
  const { card } = props;
  const color = match(card)
    .with({ color: "Blue" }, () => "bg-unoCard-blue")
    .with({ color: "Green" }, () => "bg-unoCard-green")
    .with({ color: "Red" }, () => "bg-unoCard-red")
    .with({ color: "Yellow" }, () => "bg-unoCard-yellow")
    .with({ kind: "ForceWildCard" }, () => "bg-unoCard-black")
    .with({ kind: "WildCard" }, () => "bg-unoCard-black")
    .with({ kind: "WildDrawFourCard" }, () => "bg-unoCard-black")
    .exhaustive();
};
