import { err, ok, Result } from "neverthrow";
import { any } from "ramda";


const createRoom = ({ host, password }) => {
  const id = "";
  return ok({
    id,
    password: password,
    host: host,
    hostesses: [],
  });
};

const existSamePasswordRoom: ExistSamePasswordRoom = ({
  host,
  password,
  rooms,
}) => {
  const samePasswordRooms = any((room) => room.password === password, rooms);
  if (samePasswordRooms) {
    return ok({ host: host, password: password });
  }
  return err(new Error("not found"));
};

const joinRoom: JoinRoom = ({ hostess, room }) => {
  return {
    ...room,
    hostesses: [...room.hostesses, hostess],
  };
};
type CreateRoomEvent = (args: { host: User; password: string }) => Room | Error;

export const createRoomEvent: CreateRoomEvent = ({ host, password }) => {
  const rooms: Room[] = [];
  return ok({ host: host, password: password, rooms: rooms })
    .andThen(existSamePasswordRoom)
    .andThen(createRoom)
    .match(
      (room) => room,
      (err) => err
    );
};
