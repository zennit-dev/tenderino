import { retrieveAuthToken } from "@/server/auth";

type ExtractOtherFunctionParams<F> = F extends (
        authorization: string,
        ...args: infer P
    ) => unknown
    ? P
    : never;

type UnwrapPromise<T> = T extends Promise<infer U> ? U : never;

export function withAuthorization<
    F extends (authorization: string, ...args: never[]) => Promise<unknown>,
>(fn: F) {
    return async (...args: ExtractOtherFunctionParams<F>) => {
        const authorization = await retrieveAuthToken();
        if (!authorization.success) {
            return authorization;
        }
        return fn(authorization.data, ...args) as UnwrapPromise<ReturnType<F>>;
    };
}
