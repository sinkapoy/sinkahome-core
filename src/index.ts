

export { HomeSystem } from "@root/src/ecs/HomeSystem";
import { HomeEngine } from "@root/src/ecs/HomeEngine";
export * from "@root/src/ecs/components/export";
export * from "@root/src/ecs/nodes/common";
export * from "@root/src/utils/ArrayMap";
export * from "@root/src/utils/common";

export const homeEngine = new HomeEngine();
export type HomeEngineT<T> = HomeEngine<T>;