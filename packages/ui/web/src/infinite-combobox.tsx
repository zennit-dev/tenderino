"use client";

import {
  type QueryFunctionContext,
  type QueryKey,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { useControllableState, useDebounce } from "@zenncore/hooks";
import type { UniqueIdentifier } from "@zenncore/types";
import type { Tuple } from "@zenncore/types/utilities";
import { cn } from "@zenncore/utils";
import {
  CheckIcon,
  ChevronDownIcon,
  LoadingIcon,
  SearchIcon,
} from "@zennui/icons";
import {
  type FormConfig,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  type InferredFormFields,
} from "@zennui/web/form";
import { Input } from "@zennui/web/input";
import { Popover, PopoverContent, PopoverTrigger } from "@zennui/web/popover";
import {
  type ReactNode,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useFormContext } from "react-hook-form";

export type PaginatedResponse<I> = {
  items: I[];
  pagination: {
    page: number;
    totalPagesCount: number;
    totalItemsCount: number;
  };
};

export type ComboboxItem = { id: UniqueIdentifier; name: string };

export type InfiniteComboboxProps<I extends ComboboxItem> = {
  queryKeys: Tuple<string>;
  queryFn: (
    context: QueryFunctionContext<QueryKey, number>,
    queryTerm: string | undefined,
  ) => Promise<PaginatedResponse<I>>;
  onChange?: (value: UniqueIdentifier) => void;
  value?: UniqueIdentifier;
  defaultValue?: UniqueIdentifier;
  getInitialValue?: (id: UniqueIdentifier) => Promise<I>;
  disabled?: boolean;
};

export const InfiniteCombobox = <I extends ComboboxItem>({
  queryKeys,
  queryFn,
  value: inheritedValue,
  defaultValue,
  onChange,
  getInitialValue,
  disabled,
}: InfiniteComboboxProps<I>) => {
  const [queryTerm, setQueryTerm] = useState<string>("");
  const debouncedQueryTerm = useDebounce(queryTerm, 400);
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isFetching,
  } = useInfiniteQuery({
    throwOnError: true,
    queryKey: [debouncedQueryTerm, ...queryKeys],
    queryFn: (context) => queryFn(context, debouncedQueryTerm),
    initialPageParam: 1,
    getNextPageParam: (lastResult) => {
      if (lastResult.pagination.page === lastResult.pagination.totalPagesCount)
        return null;
      return lastResult.pagination.page + 1;
    },
  });

  const [value, setValue] = useControllableState<UniqueIdentifier>({
    prop: inheritedValue,
    defaultProp: defaultValue,
    onChange,
  });

  const [defaultItem, setDefaultItem] = useState<I | undefined>(undefined);

  // biome-ignore lint/correctness/useExhaustiveDependencies: we want this to only run once
  useLayoutEffect(() => {
    (async () => {
      if (!value) return;
      const result = await getInitialValue?.(value);
      if (!result) return;
      setDefaultItem(result);
    })();
  }, []);

  const [isOpen, setIsOpen] = useState(false);

  const items = [
    ...(data?.pages?.flatMap((page) => page.items) ?? []),
    defaultItem,
  ].filter(Boolean) as I[];

  const ref = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(() => {
    if (!ref.current) return;
    const { scrollTop, scrollHeight, clientHeight } = ref.current;
    if (scrollHeight - scrollTop <= clientHeight * 1.5) {
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const handleSelect = (item: I) => {
    setValue(item.id);
    setIsOpen(false);
  };

  return (
    <Popover
      open={disabled ? false : isOpen}
      onOpenChange={setIsOpen}
      modal={true}
    >
      <PopoverTrigger
        disabled={disabled}
        className={cn(
          "flex h-9 min-w-64 items-center justify-between rounded-lg border border-border px-2 bg-accent",
          disabled && "opacity-50",
        )}
      >
        {value ? (
          <span>
            {items.find(({ id }) => id === value)?.name ?? "Loading..."}
          </span>
        ) : (
          <span className={"text-foreground-dimmed opacity-50"}>Select...</span>
        )}
        <ChevronDownIcon className="size-4 shrink-0 opacity-50" />
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] overflow-hidden p-0">
        <div className="flex w-full flex-col">
          <div className="relative h-9 w-full border-border border-b">
            <Input
              className="w-full border-none outline-none ring-offset-0 focus:outline-none focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 active:outline-none bg-transparent"
              StartDecorator={SearchIcon}
              placeholder="Search items..."
              value={queryTerm}
              onChange={(e) => setQueryTerm(e.target.value)}
            />
          </div>
          {items.length > 0 && (
            <div
              ref={ref}
              className="flex max-h-[250px] w-full flex-col divide-y divide-border overflow-y-auto "
              onScroll={handleScroll}
            >
              {items.map((item) => (
                <div
                  key={item.id.toString()}
                  className="flex h-9 min-h-9 w-full cursor-pointer items-center px-2 hover:bg-primary/40"
                  onClick={() => handleSelect(item)}
                  aria-selected={value === item.id}
                >
                  <CheckIcon
                    className={cn(
                      "mr-2 size-4 opacity-0",
                      value === item.id && "opacity-100",
                    )}
                  />
                  <div className="flex w-[calc(100%-20px)] items-center gap-2">
                    <span className="truncate">{item.name}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
          {(isFetchingNextPage || isLoading || isFetching) && (
            <div className="flex w-full justify-center p-2" aria-live="polite">
              <LoadingIcon className="size-4 animate-spin" />
            </div>
          )}
          {!hasNextPage && !isLoading && items.length > 0 && (
            <div
              className="w-full p-2 text-center text-gray-500 text-sm"
              aria-live="polite"
            >
              No more items to load.
            </div>
          )}
          {!isLoading && items.length === 0 && (
            <div
              className="w-full p-2 text-center text-gray-500 text-sm"
              aria-live="polite"
            >
              No items found.
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

type InfiniteScrollComboboxFormFieldProps<
  I extends ComboboxItem,
  C extends FormConfig,
> = {
  queryKeys: Tuple<string>;
  queryFn: (
    context: QueryFunctionContext<QueryKey, number>,
    queryTerm: string | undefined,
  ) => Promise<PaginatedResponse<I>>;
  name: keyof C;
  hideFormField?: (fieldName: keyof C, data: InferredFormFields<C>) => boolean;
  children?: ReactNode;
  errorHidden?: boolean;
  labelHidden?: boolean;
};
export const InfiniteScrollComboboxFormField = <
  I extends ComboboxItem,
  C extends FormConfig,
>({
  name,
  children,
  hideFormField,
  labelHidden,
  errorHidden,
  ...props
}: InfiniteScrollComboboxFormFieldProps<I, C>) => {
  const { watch } = useFormContext();
  const formData = watch() as C;
  const isHiddenField = hideFormField?.(name, formData);

  if (isHiddenField) return null;

  return (
    <FormField
      render={({ field }) => (
        <FormItem>
          {children && !labelHidden && <FormLabel>{children}</FormLabel>}
          <FormControl>
            <InfiniteCombobox<I> {...props} {...field} />
          </FormControl>
          {errorHidden && <FormMessage />}
        </FormItem>
      )}
      name={name as string}
    />
  );
};
