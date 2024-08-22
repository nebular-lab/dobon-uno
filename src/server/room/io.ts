import { MasterGameState } from "../game";
import { redisClient } from "../redis";

import { createRoomEvent, Name, Room } from "./domain";

const createRoom = async ({password,name}) => {
  const keys = await redisClient.keys("*");
  const promises = keys.map(async (key) => {
    const value = await redisClient.get(key);
    return { key, value };
  });
  const results = await Promise.all(promises);
  const games = results.map(({ key, value }) => {
    const game: MasterGameState = JSON.parse(value);
    return game;
  });
  const result = createRoomEvent({
    host: { id: "1", name: "test" as Name },
    password: "password",
    rooms:
  });
};
