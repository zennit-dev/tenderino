import type { EmptyObject } from "../domain";

export type BetterIntersect<
  T extends EmptyObject,
  K extends EmptyObject,
  // biome-ignore lint/suspicious/noExplicitAny: type utility
> = T extends any ? T & K : never;
