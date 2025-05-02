"use client";

import { useControllableState } from "@radix-ui/react-use-controllable-state";
import type { ClassList } from "@zenncore/types";
import { cn } from "@zenncore/utils";
import { format } from "date-fns";
import type {
  CalendarProps,
  DateRangeCalendarProps,
  SingleDateCalendarProps,
} from "./calendar";
import { Calendar } from "./calendar";
import { inputRootVariants } from "./input";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

type DatePickerClassListKey = { input: "decorator" };
export type DatePickerProps = {
  disabled?: boolean;
  classList?: ClassList<DatePickerClassListKey>;
} & CalendarProps;
// todo: add disabled prop
export const DatePicker = (props: DatePickerProps) => {
  return (
    <Popover>
      {props.type === "date-range" ? (
        <DateRangePicker {...props} />
      ) : (
        <SingleDatePicker {...props} />
      )}
    </Popover>
  );
};

const SingleDatePicker = ({
  classList,
  className,
  dateFormat = "dd/MM/yyyy",
  ...props
}: SingleDateCalendarProps & GeneralDatePickerProps) => {
  const [value, setValue] = useControllableState({
    prop: props.value,
    defaultProp: props.defaultValue,
    onChange: props.onChange,
  });
  const formattedSelectedDate = value ? format(value, dateFormat) : undefined;

  return (
    <>
      <PopoverTrigger
        className={cn(
          inputRootVariants({ disabled: props.disabled }),
          "w-fit min-w-64",
          classList?.input?.DEFAULT,
          className,
        )}
        disabled={props.disabled}
      >
        {value ? (
          formattedSelectedDate
        ) : (
          <span className="text-foreground-dimmed/40">{props.placeholder}</span>
        )}
      </PopoverTrigger>
      <PopoverContent className={"z-[100]"}>
        <Calendar {...props} type={"date"} onChange={setValue} value={value} />
      </PopoverContent>
    </>
  );
};

type GeneralDatePickerProps = { classList?: ClassList<DatePickerClassListKey> };

const DateRangePicker = ({
  dateFormat = "dd/MM/yyyy",
  className,
  classList,
  ...props
}: DateRangeCalendarProps & GeneralDatePickerProps) => {
  const [value, setValue] = useControllableState({
    prop: props.value,
    defaultProp: props.defaultValue,
    onChange: props.onChange,
  });

  const formattedSelectedDateRange = `${value?.start ? format(value.start, dateFormat) : ""} ${value?.end || value?.start ? " - " : ""} ${value?.end ? format(value.end, dateFormat) : ""}`;

  return (
    <>
      <PopoverTrigger
        className={cn(
          inputRootVariants({ disabled: props.disabled }),
          "min-w-64",
          className,
          classList?.input?.DEFAULT,
        )}
        disabled={props.disabled}
      >
        {value ? (
          formattedSelectedDateRange
        ) : (
          <span className={cn("text-foreground-dimmed/40")}>
            {props.placeholder}
          </span>
        )}
      </PopoverTrigger>
      <PopoverContent>
        <Calendar
          {...props}
          type={"date-range"}
          onChange={setValue}
          value={value}
          defaultValue={value}
        />
      </PopoverContent>
    </>
  );
};
