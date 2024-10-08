import { err, ok, Result } from "neverthrow";
import { filter, map, pipe } from "ramda";
import { z } from "zod";

import { EmptyPlayer, EmptyPlayerSchema, SeatId } from "..";

const WaitingPlayerSchema = z.object({
  kind: z.literal("client-server-waiting-player"),
  socketId: z.string(),
  name: z.string(),
  deposit: z.number(),
});

export type WaitingPlayer = z.infer<typeof WaitingPlayerSchema>;

export const ServerWaitingGameSchema = z.object({
  kind: z.literal("server-waiting-game"),
  roomId: z.string(),
  players: z.object({
    1: z.union([WaitingPlayerSchema, EmptyPlayerSchema]),
    2: z.union([WaitingPlayerSchema, EmptyPlayerSchema]),
    3: z.union([WaitingPlayerSchema, EmptyPlayerSchema]),
    4: z.union([WaitingPlayerSchema, EmptyPlayerSchema]),
    5: z.union([WaitingPlayerSchema, EmptyPlayerSchema]),
    6: z.union([WaitingPlayerSchema, EmptyPlayerSchema]),
  }),
});

export type ServerWaitingGame = z.infer<typeof ServerWaitingGameSchema>;

export type ClientWaitingGame = {
  kind: "client-waiting-game";
  roomId: string;
  seatId: SeatId;
  players: {
    1: WaitingPlayer | EmptyPlayer;
    2: WaitingPlayer | EmptyPlayer;
    3: WaitingPlayer | EmptyPlayer;
    4: WaitingPlayer | EmptyPlayer;
    5: WaitingPlayer | EmptyPlayer;
    6: WaitingPlayer | EmptyPlayer;
  };
};

type CreateRoomFlow = (args: { username: string; socketId: string }) => Result<
  {
    serverWaitingGame: ServerWaitingGame;
    clientWaitingGame: ClientWaitingGame;
  },
  Error
>;

type JoinRoomFlow = (args: {
  username: string;
  socketId: string;
  serverWaitingGame: ServerWaitingGame;
}) => Result<
  {
    serverWaitingGame: ServerWaitingGame;
    clientWaitingGames: ClientWaitingGame[];
  },
  Error
>;

export const createRoomFlow: CreateRoomFlow = ({ username, socketId }) => {
  const initializedWaitingGame = initializeWaitingGame(socketId);

  const findEmptySeatResult = findEmptySeat(initializedWaitingGame);
  if (findEmptySeatResult.isErr()) {
    return err(findEmptySeatResult.error);
  }
  const emptySeatId = findEmptySeatResult.value.emptySeatId;

  const joinPlayerResult = joinPlayer({
    emptySeatId,
    game: initializedWaitingGame,
    username,
    joinPlayerSocketId: socketId,
  });
  if (joinPlayerResult.isErr()) {
    return err(joinPlayerResult.error);
  }
  const joinedServerWaitingGame = joinPlayerResult.value.waitingGame;

  const { clientWaitingGame } = addHeroSeatId(
    joinedServerWaitingGame,
    emptySeatId
  );

  return ok({ serverWaitingGame: joinedServerWaitingGame, clientWaitingGame });
};

export const joinRoomFlow: JoinRoomFlow = ({
  username,
  socketId,
  serverWaitingGame,
}) => {
  const findEmptySeatResult = findEmptySeat(serverWaitingGame);
  if (findEmptySeatResult.isErr()) {
    return err(findEmptySeatResult.error);
  }
  const emptySeatId = findEmptySeatResult.value.emptySeatId;

  const joinPlayerResult = joinPlayer({
    emptySeatId,
    game: serverWaitingGame,
    username,
    joinPlayerSocketId: socketId,
  });
  if (joinPlayerResult.isErr()) {
    return err(joinPlayerResult.error);
  }
  const joinedServerWaitingGame = joinPlayerResult.value.waitingGame;

  const playerSeats: SeatId[] = [1, 2, 3, 4, 5, 6];

  const createClientWaitingGames = pipe(
    map((seatId: SeatId) => {
      const player = joinedServerWaitingGame.players[seatId];
      return player.kind === "client-server-waiting-player"
        ? addHeroSeatId(joinedServerWaitingGame, seatId).clientWaitingGame
        : null;
    }),
    filter((game): game is ClientWaitingGame => game !== null)
  );

  const clientWaitingGames = createClientWaitingGames(playerSeats);

  return ok({ serverWaitingGame: joinedServerWaitingGame, clientWaitingGames });
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

const initializeWaitingGame = (socketId: string): ServerWaitingGame => {
  const roomId = generateRoomId(socketId);
  const serverWaitingGame: ServerWaitingGame = {
    kind: "server-waiting-game",
    roomId,
    players: {
      1: { kind: "client-server-empty-player" },
      2: { kind: "client-server-empty-player" },
      3: { kind: "client-server-empty-player" },
      4: { kind: "client-server-empty-player" },
      5: { kind: "client-server-empty-player" },
      6: { kind: "client-server-empty-player" },
    },
  };
  return serverWaitingGame;
};

const findEmptySeat = (
  game: ServerWaitingGame
): Result<{ emptySeatId: SeatId }, Error> => {
  const seatIds: SeatId[] = [1, 2, 3, 4, 5, 6];
  const emptySeatId = seatIds.find(
    (seatId) => game.players[seatId].kind === "client-server-empty-player"
  );
  if (!emptySeatId) {
    return err(new Error("空席がありませんでした"));
  }
  return ok({ emptySeatId });
};

const joinPlayer = (args: {
  emptySeatId: SeatId;
  game: ServerWaitingGame;
  username: string;
  joinPlayerSocketId: string;
}): Result<{ waitingGame: ServerWaitingGame }, Error> => {
  const { emptySeatId, game, username, joinPlayerSocketId } = args;
  if (game.players[emptySeatId].kind !== "client-server-empty-player") {
    return err(new Error("空席がありませんでした"));
  }
  const players = { ...game.players };
  players[emptySeatId] = {
    kind: "client-server-waiting-player",
    socketId: joinPlayerSocketId,
    name: username,
    deposit: 0,
  };
  return ok({ waitingGame: { ...game, players } });
};

const addHeroSeatId = (
  game: ServerWaitingGame,
  seatId: SeatId
): { clientWaitingGame: ClientWaitingGame } => {
  const clientWaitingGame: ClientWaitingGame = {
    ...game,
    kind: "client-waiting-game",
    seatId,
  };
  return { clientWaitingGame };
};
