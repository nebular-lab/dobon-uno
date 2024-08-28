import { motion } from "framer-motion";
import { useAtomValue } from "jotai";
import { match } from "ts-pattern";

import { EmptyPlayer, SeatId, WaitingPlayer } from "@/server";
import {
  heroSeatIdAtom,
  nowTurnAtom,
  player1Atom,
  player2Atom,
  player3Atom,
  player4Atom,
  player5Atom,
  player6Atom,
  roomIdAtom,
} from "@/store/atom";

const bottom = "absolute inset-x-0 bottom-[-8%] m-auto size-fit";
const leftBottom = "absolute inset-y-0 left-[-8%] top-1/2 m-auto size-fit";
const leftTop = "absolute inset-y-0 -top-1/2 left-[-8%] m-auto size-fit";
const top = "absolute inset-x-0 top-[-8%] m-auto size-fit";
const rightTop = "absolute inset-y-0 -top-1/2 right-[-8%] m-auto size-fit";
const rightBottom = "absolute inset-y-0 right-[-8%] top-1/2 m-auto size-fit";

const classNames = [bottom, leftBottom, leftTop, top, rightTop, rightBottom];

const getSeatClassName = (heroSeatId: SeatId, seatId: SeatId) => {
  const offset = (seatId - heroSeatId + 6) % 6; // 時計回りのオフセットを計算
  return classNames[offset];
};

export const Game = () => {
  const heroSeatId = useAtomValue(heroSeatIdAtom) ?? 1;
  const seatIds: SeatId[] = [1, 2, 3, 4, 5, 6];
  return (
    <div className="flex justify-center pt-20">
      <div className="relative h-[335px] w-[770px] rounded-full border-2">
        <div>
          <RoomID />
        </div>
        <div className="absolute inset-0 -left-1/2 m-auto size-fit">
          <ArrowAnimation isRotate={false} />
        </div>
        <div className="absolute inset-0 -right-1/2 m-auto size-fit">
          <ArrowAnimation isRotate />
        </div>
        {seatIds.map((seatId) => (
          <div key={seatId} className={getSeatClassName(heroSeatId, seatId)}>
            <PlayerArea seatId={seatId} />
          </div>
        ))}
      </div>
    </div>
  );
};

type PlayerAreaProps = {
  seatId: SeatId;
};
const PlayerArea = ({ seatId }: PlayerAreaProps) => {
  const nowTurn = useAtomValue(nowTurnAtom);
  const emptyPlayer: EmptyPlayer = { kind: "empty" };
  const player = useAtomValue(playerAtom(seatId)) ?? emptyPlayer;

  const getName = (player: WaitingPlayer | EmptyPlayer) =>
    player.kind === "waiting" ? player.name : "-----";

  const getNameColor = (player: WaitingPlayer | EmptyPlayer) =>
    player.kind === "waiting" ? "text-foreground" : "text-foreground/50";

  const getScore = (player: WaitingPlayer | EmptyPlayer) => "-";

  const getScoreColor = (
    player: WaitingPlayer | EmptyPlayer,
    score: string | number
  ) => {
    if (score === 1) return "text-primary";
    return player.kind === "waiting" ? "text-foreground" : "text-foreground/50";
  };

  const getBorderColor = (
    player: WaitingPlayer | EmptyPlayer,
    isNowTurn: boolean
  ) => {
    if (isNowTurn) return "border-primary";
    return player.kind === "empty" ? "border-border/60" : "border-border";
  };

  const name = getName(player);
  const nameColor = getNameColor(player);
  const score = getScore(player);
  const scoreColor = getScoreColor(player, score);
  const isNowTurn = seatId === nowTurn;
  const borderColor = getBorderColor(player, isNowTurn);

  return (
    <div className="relative h-[52px] w-[168px]">
      {isNowTurn && (
        <motion.div
          className="absolute inset-0 m-auto  rounded-full bg-primary opacity-50 "
          initial={{ scale: 1, opacity: 0.5 }}
          animate={{ scale: [1, 1.1], opacity: [0.5, 1] }}
          transition={{
            duration: 1,
            repeat: Infinity,
            repeatType: "mirror",
          }}
        />
      )}
      <div
        className={`relative size-full rounded-full border-2 bg-background ${borderColor}`}
      >
        <div
          className={`absolute inset-y-[-2px] left-[-2px] flex aspect-square items-center justify-center rounded-full border-2 ${scoreColor} ${borderColor}`}
        >
          {score}
        </div>
        <div
          className={`flex h-full items-center justify-center pl-[40px] ${nameColor}`}
        >
          {name}
        </div>
      </div>
    </div>
  );
};

const playerAtom = (seatId: SeatId) =>
  match(seatId)
    .with(1, () => player1Atom)
    .with(2, () => player2Atom)
    .with(3, () => player3Atom)
    .with(4, () => player4Atom)
    .with(5, () => player5Atom)
    .with(6, () => player6Atom)
    .exhaustive();

type ArrowAnimationProps = {
  isRotate: boolean;
};
const ArrowAnimation = ({ isRotate }: ArrowAnimationProps) => {
  const rotate = isRotate ? "rotate-180" : "";
  return (
    <motion.svg
      width="200"
      height="200"
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      className={rotate}
    >
      <motion.path
        d="M 50 80 A 30 30 0 0 1 50 20 L 45 25" // 中心方向に少し折れるパス
        className="stroke-border"
        fill="transparent"
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{
          duration: 2,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "loop",
          repeatDelay: 1,
          delay: 0.5,
        }}
      />
    </motion.svg>
  );
};

const RoomID = () => {
  const roomId = useAtomValue(roomIdAtom);
  if (!roomId) return null;
  return (
    <div className="absolute inset-x-0 top-0 m-auto text-2xl text-foreground">
      RoomID:{roomId}
    </div>
  );
};
