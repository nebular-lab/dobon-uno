export type ServerToClientEvents = {
  msg: (a: string) => void;
  basicEmit: (a: number, b: string, callback: (e: number) => void) => void;
};

export type ClientToServerEvents = {
  hello: (message: string) => void;
};
