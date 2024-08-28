import { useAtomValue } from "jotai";

import { Game } from "@/components/feature/Game";
import { Title } from "@/components/feature/Title";
import { screenAtom } from "@/store/atom";

export default function Home() {
  const screen = useAtomValue(screenAtom);
  return <main>{screen === "title" ? <Title /> : <Game />}</main>;
}
