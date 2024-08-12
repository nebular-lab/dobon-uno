import { AnimationScope, motion, useAnimate } from "framer-motion";

export const Game = () => {
  const [scope, animate] = useAnimate();
  const [scope2, animate2] = useAnimate();
  const [scope3, animate3] = useAnimate();
  const [targetScope] = useAnimate();

  const handleClick = (
    targetScope: AnimationScope<any>,
    cardScope: AnimationScope<any>
  ) => {
    const target = targetScope.current.getBoundingClientRect();
    const scopeElem = cardScope.current.getBoundingClientRect();

    // アニメーションで移動
    animate(cardScope.current, {
      x: target.left - scopeElem.left + (target.width - scopeElem.width) / 2,
      y: target.top - scopeElem.top + (target.height - scopeElem.height) / 2,
    });
  };

  return (
    <div className="relative m-auto aspect-video max-h-screen bg-slate-700">
      <div className="absolute inset-0 -top-1/4 m-auto h-1/2 w-3/5 rounded-full border-4 border-slate-400" />
      <div
        ref={targetScope}
        className="absolute inset-0 -top-1/4 m-auto flex h-1/6 w-1/4 items-center justify-center rounded-md border-2 border-slate-400"
      >
        <div className="flex size-[5vw] select-none items-center justify-center rounded-md border-2 border-slate-400 bg-red-600 text-center text-[3vw] text-slate-200">
          5
        </div>
      </div>
      <div className="absolute inset-0 top-2/3 m-auto flex h-1/4 w-3/5 flex-wrap items-center justify-center gap-1 rounded-md border-2 border-slate-400">
        <motion.div
          ref={scope}
          onClick={() => {
            handleClick(targetScope, scope);
          }}
          className="flex size-[5vw] select-none items-center justify-center rounded-md border-2 border-slate-400 bg-red-600 text-center text-[3vw] text-slate-200 hover:border-orange-400 hover:bg-red-700"
          transition={{ duration: 0.1 }}
          whileHover={{ scale: 1.2 }}
        >
          6
        </motion.div>
        <motion.div
          ref={scope2}
          onClick={() => {
            handleClick(targetScope, scope2);
          }}
          className="flex size-[5vw] select-none items-center justify-center rounded-md border-2 border-slate-400 bg-red-600 text-center text-[3vw] text-slate-200 hover:border-orange-400 hover:bg-red-700"
          transition={{ duration: 0.1 }}
          whileHover={{ scale: 1.2 }}
        >
          7
        </motion.div>
        <motion.div
          ref={scope3}
          onClick={() => {
            handleClick(targetScope, scope3);
          }}
          className="flex size-[5vw] select-none items-center justify-center rounded-md border-2 border-slate-400 bg-red-600 text-center text-[3vw] text-slate-200 hover:border-orange-400 hover:bg-red-700"
          transition={{ duration: 0.1 }}
          whileHover={{ scale: 1.2 }}
        >
          8
        </motion.div>
      </div>
    </div>
  );
};

type PlayerProps = {
  top: "-top-1/2" | "top-1/4" | undefined;
  left: "left-[60%]" | "-left-[60%]" | undefined;
};
const Player = (props: PlayerProps) => {
  const { top, left } = props;

  return (
    <div className="absolute inset-0 top-1/4 m-auto flex h-[10%] w-1/6 items-center rounded-full bg-slate-400 pl-1 pr-2">
      <div className="flex aspect-square  h-[90%] items-center justify-center rounded-full bg-slate-700  text-[2vw] text-slate-200">
        13
      </div>
      <div className="flex size-full flex-col justify-center ">
        <div className="text-center text-[2vw] font-bold text-slate-700">
          nebunebu
        </div>
        <div className=" text-center text-[2vw] font-bold text-slate-700">
          +120
        </div>
      </div>
    </div>
  );
};
