import { useAtomValue } from "jotai";

import { Game } from "@/feature/Game";
import { Title } from "@/feature/Title";
import { screenAtom } from "@/store/atom";

export default function Home() {
  const screen = useAtomValue(screenAtom);
  return <main>{screen === "title" ? <Title /> : <Game />}</main>;
}
