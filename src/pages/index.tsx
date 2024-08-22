import { Game } from "@/feature/Game";
import { useSocket } from "@/feature/useSocket";

export default function Home() {
  useSocket();
  const handleClick = () => {
    fetch("/api/test", { method: "POST" });
  };
  const handleClick2 = () => {
    fetch("/api/test2", { method: "POST" });
  };
  return (
    <main>
      <div>
        <Game />
        <button onClick={handleClick}>set</button>
        <button onClick={handleClick2}>get</button>
      </div>
    </main>
  );
}
