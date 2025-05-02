import type { SearchParam, SearchParams } from "@zenncore/types/navigation";
import { parseSearchParams } from "./parse-search-params";
import { removeUndefinedEntries } from "../domain";

type FilterParams<T extends string> = SearchParams<T>;

export const extractFilterParams = <T extends string>(
  params: FilterParams<T>,
) => {
  return removeUndefinedEntries(
    Object.entries(params).reduce<Record<string, string | undefined>>(
      (acc, [key, value]) => {
        if (key === "page" || key === "limit") return acc;

        return {
          // biome-ignore lint/performance/noAccumulatingSpread: <explanation>
          ...acc,
          [key]: parseSearchParams(value as SearchParam, "single"),
        };
      },
      {},
    ),
  ) as Partial<Record<T, string>>;
};
