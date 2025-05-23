"use client";

import type { Override } from "@tanstack/react-query";
import { cn } from "@zenncore/utils";
import { CheckIcon, XIcon } from "@zennui/icons";
import { Command as CommandPrimitive } from "cmdk";
import React, {
  type KeyboardEvent,
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useState,
} from "react";
import { Badge } from "./badge";
import {
  Command,
  CommandEmpty,
  CommandItem,
  CommandList,
  type CommandProps,
} from "./command";

export type MultiSelectProps = Override<
  CommandProps,
  {
    value: string[];
    onValueChange: (value: string[]) => void;
    loop?: boolean;
    disabled?: boolean;
  }
> & {
  renderItems?: (
    value: string[],
    activeIndex: number,
    onValueChange: (value: string) => void,
  ) => React.ReactNode;
};

type MultiSelectContextProps = {
  value: string[];
  onValueChange: (value: string) => void;
  open: boolean;
  setOpen: (value: boolean) => void;
  inputValue: string;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  activeIndex: number;
  setActiveIndex: React.Dispatch<React.SetStateAction<number>>;
  ref: React.RefObject<HTMLInputElement>;
  handleSelect: (e: React.MouseEvent<HTMLInputElement>) => void;
  renderItems: (
    value: string[],
    activeIndex: number,
    onValueChange: (value: string) => void,
  ) => React.ReactNode;
};

const MultiSelectContext = createContext<MultiSelectContextProps | null>(null);

const useMultiSelect = () => {
  const context = useContext(MultiSelectContext);
  if (!context) {
    throw new Error("useMultiSelect must be used within MultiSelectProvider");
  }
  return context;
};

/**
 * MultiSelect Docs: {@link: https://shadcn-extension.vercel.app/docs/multi-select}
 */

// TODO : expose the visibility of the popup

const MultiSelect = ({
  value = [],
  onValueChange,
  loop = false,
  className,
  children,
  renderItems = defaultRenderItems,
  dir,
  ...props
}: MultiSelectProps) => {
  const [inputValue, setInputValue] = useState("");
  const [open, setOpen] = useState<boolean>(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [isValueSelected, setIsValueSelected] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState("");

  const onValueChangeHandler = useCallback(
    (val: string) => {
      if (value.includes(val)) {
        onValueChange?.(value.filter((item) => item !== val));
      } else {
        onValueChange?.([...value, val]);
      }
    },
    [value],
  );

  const handleSelect = React.useCallback(
    (e: React.SyntheticEvent<HTMLInputElement>) => {
      e.preventDefault();
      const target = e.currentTarget;
      const selection = target.value.substring(
        target.selectionStart ?? 0,
        target.selectionEnd ?? 0,
      );

      setSelectedValue(selection);
      setIsValueSelected(selection === inputValue);
    },
    [inputValue],
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      e.stopPropagation();
      const target = inputRef.current;

      if (!target) return;

      const moveNext = () => {
        const nextIndex = activeIndex + 1;
        setActiveIndex(
          nextIndex > value.length - 1 ? (loop ? 0 : -1) : nextIndex,
        );
      };

      const movePrev = () => {
        const prevIndex = activeIndex - 1;
        setActiveIndex(prevIndex < 0 ? value.length - 1 : prevIndex);
      };

      const moveCurrent = () => {
        const newIndex =
          activeIndex - 1 <= 0
            ? value.length - 1 === 0
              ? -1
              : 0
            : activeIndex - 1;
        setActiveIndex(newIndex);
      };

      switch (e.key) {
        case "ArrowLeft":
          if (dir === "rtl") {
            if (value.length > 0 && (activeIndex !== -1 || loop)) {
              moveNext();
            }
          } else {
            if (value.length > 0 && target.selectionStart === 0) {
              movePrev();
            }
          }
          break;

        case "ArrowRight":
          if (dir === "rtl") {
            if (value.length > 0 && target.selectionStart === 0) {
              movePrev();
            }
          } else {
            if (value.length > 0 && (activeIndex !== -1 || loop)) {
              moveNext();
            }
          }
          break;

        case "Backspace":
        case "Delete":
          if (value.length > 0) {
            if (activeIndex !== -1 && activeIndex < value.length) {
              onValueChangeHandler(value[activeIndex]);
              moveCurrent();
            } else {
              if (target.selectionStart === 0) {
                if (selectedValue === inputValue || isValueSelected) {
                  onValueChangeHandler(value[value.length - 1]);
                }
              }
            }
          }
          break;

        case "Enter":
          setOpen(true);
          break;

        case "Escape":
          if (activeIndex !== -1) {
            setActiveIndex(-1);
          } else if (open) {
            setOpen(false);
          }
          break;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [value, inputValue, activeIndex, loop],
  );

  return (
    <MultiSelectContext.Provider
      value={{
        value,
        onValueChange: onValueChangeHandler,
        open,
        setOpen,
        inputValue,
        setInputValue,
        activeIndex,
        setActiveIndex,
        ref: inputRef,
        handleSelect,
        renderItems,
      }}
    >
      <Command
        onKeyDown={handleKeyDown}
        className={cn("overflow-visible bg-transparent shadow-none", className)}
        dir={dir}
        {...props}
      >
        {children}
      </Command>
    </MultiSelectContext.Provider>
  );
};

const defaultRenderItems = (
  value: string[],
  activeIndex: number,
  onValueChange: (value: string) => void,
) => {
  const mousePreventDefault = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return value?.map((item, index) => (
    <Badge
      key={item}
      className={cn(
        "flex items-center gap-1 rounded-xl px-1",
        activeIndex === index && "ring-2 ring-muted-foreground ",
      )}
    >
      <span className="text-xs">{item}</span>
      <button
        aria-label={`Remove ${item} option`}
        aria-roledescription="button to remove option"
        type="button"
        onMouseDown={mousePreventDefault}
        onClick={() => onValueChange(item)}
      >
        <span className="sr-only">Remove {item} option</span>
        <XIcon className="h-4 w-4 hover:stroke-destructive" />
      </button>
    </Badge>
  ));
};

const MultiSelectTrigger = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const { value, onValueChange, activeIndex, renderItems } = useMultiSelect();

  return (
    <div
      ref={ref}
      className={cn(
        "relative z-1 flex flex size-full h-9 min-h-9 items-center gap-1 rounded-lg border border-border bg-accent px-2",
        className,
      )}
      {...props}
    >
      {renderItems(value, activeIndex, onValueChange)}
      {children}
    </div>
  );
});

MultiSelectTrigger.displayName = "MultiSelectorTrigger";

const MultiSelectInput = forwardRef<
  React.ElementRef<typeof CommandPrimitive.Input>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => {
  const {
    setOpen,
    inputValue,
    setInputValue,
    activeIndex,
    setActiveIndex,
    handleSelect,
    ref: inputRef,
  } = useMultiSelect();

  return (
    <CommandPrimitive.Input
      {...props}
      tabIndex={0}
      ref={inputRef}
      value={inputValue}
      onValueChange={setInputValue}
      onSelect={handleSelect}
      onBlur={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onClick={() => setActiveIndex(-1)}
      readOnly
      className={cn(
        "absolute ml-2 min-w-full flex-1 bg-transparent caret-transparent outline-none placeholder:text-muted-foreground",
        className,
        activeIndex !== -1 && "caret-transparent",
      )}
    />
  );
});

MultiSelectInput.displayName = "MultiSelectorInput";

const MultiSelectContent = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children }, ref) => {
  const { open } = useMultiSelect();
  return (
    <div ref={ref} className="relative">
      {open && children}
    </div>
  );
});

MultiSelectContent.displayName = "MultiSelectorContent";

const MultiSelectList = forwardRef<
  React.ElementRef<typeof CommandPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, children }, ref) => {
  return (
    <CommandList
      ref={ref}
      className={cn(
        "scrollbar-thin scrollbar-track-transparent scrollbar-thumb-muted-foreground dark:scrollbar-thumb-muted scrollbar-thumb-rounded-lg absolute top-2 z-50 flex w-full flex-col gap-2 rounded-lg rounded-md border border-border bg-accent",
        className,
      )}
    >
      {children}
      <CommandEmpty>
        <span className="text-muted-foreground">No results found</span>
      </CommandEmpty>
    </CommandList>
  );
});

MultiSelectList.displayName = "MultiSelectorList";

const MultiSelectItem = forwardRef<
  React.ElementRef<typeof CommandPrimitive.Item>,
  { value: string } & React.ComponentPropsWithoutRef<
    typeof CommandPrimitive.Item
  >
>(({ className, value, children, ...props }, ref) => {
  const { value: Options, onValueChange, setInputValue } = useMultiSelect();

  const mousePreventDefault = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const isIncluded = Options.includes(value);
  return (
    <CommandItem
      ref={ref}
      {...props}
      onSelect={() => {
        onValueChange(value);
        setInputValue("");
      }}
      className={cn(
        "flex cursor-pointer justify-between capitalize border-border border-b px-2 py-1.5 transition-colors last:border-b-0",
        className,
        isIncluded && "cursor-default opacity-50",
        props.disabled && "cursor-not-allowed opacity-50",
      )}
      onMouseDown={mousePreventDefault}
    >
      {children}
      {isIncluded && <CheckIcon className="h-4 w-4" />}
    </CommandItem>
  );
});

MultiSelectItem.displayName = "MultiSelectorItem";

export {
  MultiSelect,
  MultiSelectTrigger,
  MultiSelectInput,
  MultiSelectContent,
  MultiSelectList,
  MultiSelectItem,
};
