import type { Result } from "@zenncore/types/utilities";

export type UnwrapResult<T extends Result<unknown>> = Extract<
  T,
  { success: true }
>["data"];

// Async overload
export function unwrapResult<T extends Promise<Result<unknown>>>(
  result: T,
): Promise<UnwrapResult<Awaited<T>>>;

// Sync overload
export function unwrapResult<T extends Result<unknown>>(
  result: T,
): UnwrapResult<T>;

// Implementation
export function unwrapResult<
  T extends Result<unknown> | Promise<Result<unknown>>,
>(result: T): Promise<UnwrapResult<Awaited<T>>> | UnwrapResult<Awaited<T>> {
  if (!(result instanceof Promise)) {
    if (!result.success) throw result.error;
    return ("data" in result ? result.data : undefined) as UnwrapResult<
      Awaited<T>
    >;
  }

  const handler = async () => {
    const data = await result;
    if (!data.success) throw new Error(data.error);
    return ("data" in data ? data.data : undefined) as UnwrapResult<Awaited<T>>;
  };
  return handler();
}
