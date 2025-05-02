import type { EmptyObject } from "../domain";

export type Result<T = void, E = string> =
  | ({
      success: true;
    } & (T extends void ? EmptyObject : { data: T }))
  | {
      success: false;
      error: E;
    };
