import type { EmptyObject, UniqueIdentifier } from "@zenncore/types";
import type { BetterOmit, Result } from "@zenncore/types/utilities";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { withAuthorization } from "./auth";
import type { Metadata } from "@/types/metadata";

type DeepOmitMetadata<T> = Omit<
  {
    [K in keyof T]: T[K] extends EmptyObject
      ? DeepOmitMetadata<T[K]>
      : K extends keyof Metadata
      ? never
      : T[K] extends Array<infer U>
      ? Array<DeepOmitMetadata<U>>
      : T[K];
  },
  keyof Metadata
>;

export const resource = <T extends EmptyObject>(resource: string) => {
  return {
    getById: withAuthorization(
      async (authorization, id: UniqueIdentifier): Promise<Result<T>> => {
        "use cache";
        cacheTag(resource, id);
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/${resource}/${id}`,
            {
              method: "GET",
              headers: {
                Authorization: authorization,
                "Content-Type": "application/json",
              },
            }
          );

          if (!response.ok) {
            return {
              success: false,
              error: "Failed to fetch resource",
            };
          }

          const data: T = await response.json();
          return {
            success: true,
            data,
          } as Result<T>;
        } catch (error) {
          return {
            success: false,
            error: "Failed to fetch resource",
          };
        }
      }
    ),
    paginate: withAuthorization(
      async (authorization, page: number): Promise<Result<T[]>> => {
        "use cache";
        cacheTag(resource, page.toString());
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/${resource}?page=${page}`,
            {
              method: "GET",
              headers: {
                Authorization: authorization,
                "Content-Type": "application/json",
              },
            }
          );

          if (!response.ok) {
            return {
              success: false,
              error: "Failed to fetch resource",
            };
          }

          const data = await response.json();

          return {
            success: true,
            data,
          };
        } catch (error) {
          return {
            success: false,
            error: "Failed to fetch resource",
          };
        }
      }
    ),
    create: <O = DeepOmitMetadata<T>>(data: O) =>
      withAuthorization(async (authorization, data: O): Promise<Result> => {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/${resource}`,
            {
              method: "POST",
              headers: {
                Authorization: authorization,
                "Content-Type": "application/json",
              },
              body: JSON.stringify(data),
            }
          );

          if (!response.ok) {
            return {
              success: false,
              error: "Failed to create resource",
            };
          }

          return {
            success: true,
          };
        } catch (error) {
          return {
            success: false,
            error: "Failed to create resource",
          };
        }
      })(data),
    update: <O = DeepOmitMetadata<T>>(id: UniqueIdentifier, data: Partial<O>) =>
      withAuthorization(
        async (
          authorization,
          id: UniqueIdentifier,
          data: Partial<O>
        ): Promise<Result> => {
          try {
            const response = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/${resource}/${id}`,
              {
                method: "PUT",
                headers: {
                  Authorization: authorization,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
              }
            );

            if (!response.ok) {
              return {
                success: false,
                error: "Failed to update resource",
              };
            }

            return {
              success: true,
            };
          } catch (error) {
            return {
              success: false,
              error: "Failed to update resource",
            };
          }
        }
      )(id, data),
    replace: <O = DeepOmitMetadata<T>>(id: UniqueIdentifier, data: O) =>
      withAuthorization(
        async (
          authorization,
          id: UniqueIdentifier,
          data: O
        ): Promise<Result> => {
          try {
            const response = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/${resource}/${id}`,
              {
                method: "PUT",
                headers: {
                  Authorization: authorization,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
              }
            );

            if (!response.ok) {
              return {
                success: false,
                error: "Failed to replace resource",
              };
            }

            return {
              success: true,
            };
          } catch (error) {
            return {
              success: false,
              error: "Failed to replace resource",
            };
          }
        }
      )(id, data),
    destroy: withAuthorization(
      async (authorization, id: UniqueIdentifier): Promise<Result> => {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/${resource}/${id}`,
            {
              method: "DELETE",
              headers: {
                Authorization: authorization,
                "Content-Type": "application/json",
              },
            }
          );

          if (!response.ok) {
            return {
              success: false,
              error: "Failed to delete resource",
            };
          }

          return {
            success: true,
          };
        } catch (error) {
          return {
            success: false,
            error: "Failed to delete resource",
          };
        }
      }
    ),
  };
};
