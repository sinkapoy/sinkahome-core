import { HomeSystem } from "root/src/ecs/HomeSystem";
export { HomeEngine } from "root/src/ecs/HomeEngine";
export * from "root/src/ecs/components/export";
export * from "root/src/ecs/nodes/common";

export const System = HomeSystem as abstract new()=>Omit<HomeSystem, 
    'addToEngine'
    | 'removeFromEngine'
    | 'update'
    | 'processEmitedEvent'
>