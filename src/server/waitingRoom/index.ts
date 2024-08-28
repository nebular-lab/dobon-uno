import { err, ok, Result } from "neverthrow";

import { ClientWaitingGame, SeatId, WaitingGame } from "..";

type CreateRoomFlow = (
  username: string,
  socketId: string
) => Result<
  { waitingGame: WaitingGame; clientWaitingGame: ClientWaitingGame },
  Error
>;

type JoinRoomFlow = (
  username: string,
  waitingGame: WaitingGame
) => Result<
  { waitingGame: WaitingGame; clientWaitingGame: ClientWaitingGame },
  Error
>;

export const createRoomFlow: CreateRoomFlow = (username, socketId) => {
  return initializeWaitingGame(username, socketId)
    .andThen(findEmptySeat)
    .andThen(({ emptySeatId, game }) => joinPlayer(emptySeatId, game, username))
    .andThen(({ waitingGame, seatId }) => addHeroSeatId(waitingGame, seatId));
};

export const joinRoomFlow: JoinRoomFlow = (username, waitingGame) => {
  return findEmptySeat(waitingGame)
    .andThen(({ emptySeatId, game }) => joinPlayer(emptySeatId, game, username))
    .andThen(({ waitingGame, seatId }) => addHeroSeatId(waitingGame, seatId));
};

const generateRoomId = (id: string): string => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    const char = id.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // 32bit符号付き整数に変換
  }

  const uniqueNumber = Math.abs(hash) % 1000000;
  return String(uniqueNumber).padStart(6, "0");
};

const initializeWaitingGame = (
  username: string,
  socketId: string
): Result<WaitingGame, Error> => {
  const roomId = generateRoomId(socketId);
  const waitingGame: WaitingGame = {
    kind: "waiting",
    roomId,
    players: {
      1: { kind: "empty" },
      2: { kind: "empty" },
      3: { kind: "empty" },
      4: { kind: "empty" },
      5: { kind: "empty" },
      6: { kind: "empty" },
    },
  };
  return ok(waitingGame);
};

const findEmptySeat = (
  game: WaitingGame
): Result<{ emptySeatId: SeatId; game: WaitingGame }, Error> => {
  const seatIds: SeatId[] = [1, 2, 3, 4, 5, 6];
  const emptySeatId = seatIds.find(
    (seatId) => game.players[seatId].kind === "empty"
  );
  if (!emptySeatId) {
    return err(new Error("空席がありませんでした"));
  }
  return ok({ emptySeatId, game });
};

const joinPlayer = (
  seatId: SeatId,
  game: WaitingGame,
  username: string
): Result<{ waitingGame: WaitingGame; seatId: SeatId }, Error> => {
  if (game.players[seatId].kind !== "empty") {
    return err(new Error("空席がありませんでした"));
  }

  const players = { ...game.players };
  players[seatId] = { kind: "waiting", name: username, deposit: 0 };
  return ok({ waitingGame: { ...game, players }, seatId });
};

const addHeroSeatId = (
  game: WaitingGame,
  seatId: SeatId
): Result<
  { waitingGame: WaitingGame; clientWaitingGame: ClientWaitingGame },
  Error
> => {
  const clientWaitingGame: ClientWaitingGame = { ...game, seatId };
  return ok({ waitingGame: game, clientWaitingGame });
};
