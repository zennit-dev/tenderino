"use client";

import { useControllableState } from "@radix-ui/react-use-controllable-state";
import { ChevronLeftIcon, ChevronRightIcon } from "@zennui/icons";
import { cva } from "class-variance-authority";
import {
  addMonths,
  addYears,
  eachDayOfInterval,
  getMonth,
  getYear,
  isBefore,
  isSameDay,
  isSameMonth,
  isSameYear,
  subMonths,
} from "date-fns";
import { useState } from "react";
import { Button } from "../button";
import {
  CalendarBody,
  CalendarHeader,
  Calendar as CalendarPrimitive,
} from "./calendar-primitive";

type DateDateRange = { start?: Date; end?: Date };
type DateStringRange = {
  start?: string;
  end?: string;
};

export type DateRange = DateDateRange | DateStringRange;

type GeneralCalendarProps = {
  startYear?: number;
  endYear?: number;
  placeholder?: string;
  className?: string;
  mode?: "start" | "end";
  disabled?: boolean;
  returnType?: "date" | "string";
  dateFormat?: string;
};
export type SingleDateCalendarProps = GeneralCalendarProps & {
  value?: Date | string;
  defaultValue?: Date | string;
  onChange?: (value: Date | string) => void;
};

export type DateRangeCalendarProps = GeneralCalendarProps & {
  value?: DateRange;
  defaultValue?: DateRange;
  onChange?: (value: DateRange) => void;
  multiplePages?: boolean;
};

export type CalendarProps =
  | ({
      type?: "date";
    } & SingleDateCalendarProps)
  | ({ type: "date-range" } & DateRangeCalendarProps);

export const Calendar = (props: CalendarProps) => {
  if (props.type === "date-range") return <DateRangeCalendar {...props} />;
  return <SingleDateCalendar {...props} />;
};

const cellVariants = cva(
  "mx-0 box-border w-[calc(100%/7)] rounded-none shadow-none",
  {
    variants: {
      variant: {
        "active-monday": "rounded-l-lg ",
        "active-sunday": "rounded-r-lg",
        "start-date": "rounded-l-lg",
        "end-date": "rounded-r-lg",
        "single-date": "rounded-lg",
      },
    },
  },
);

const normalizeCalendarValuePrimitive = (
  date: Date | DateRange | string,
): Date | DateDateRange => {
  if (date instanceof Date) return date;
  if (typeof date === "object") {
    return {
      start: typeof date.start === "string" ? new Date(date.start) : date.start,
      end: typeof date.end === "string" ? new Date(date.end) : date.end,
    };
  }
  return new Date(date);
};

function normalizeCalendarValue(value: Date | string): Date;
function normalizeCalendarValue(value: DateRange): DateDateRange;
function normalizeCalendarValue(
  value: Date | string | undefined,
  fallback?: Date | string,
): Date | undefined;
function normalizeCalendarValue(
  value: DateRange | undefined,
  fallback?: DateRange,
): DateDateRange | undefined;
function normalizeCalendarValue(
  value: Date | string | undefined,
  fallback: Date | string,
): Date;
function normalizeCalendarValue(
  value: DateRange | undefined,
  fallback: DateRange,
): DateDateRange;
function normalizeCalendarValue(
  value: Date | string,
  fallback: Date | string,
): Date;
function normalizeCalendarValue(
  value: DateRange,
  fallback: DateRange,
): DateDateRange;

function normalizeCalendarValue(
  value?: Date | DateRange | string,
  fallback?: Date | DateRange | string,
) {
  if (value === undefined) {
    return fallback ? normalizeCalendarValuePrimitive(fallback) : undefined;
  }
  return normalizeCalendarValuePrimitive(value);
}

const DateRangeCalendar = ({
  value,
  startYear = 1960,
  endYear = getYear(addYears(new Date(), 10)),
  multiplePages = true,
  defaultValue,
  returnType = "date",
  onChange,
  ...props
}: DateRangeCalendarProps) => {
  const [selectedDateRange, setSelectedDateRange] = useControllableState({
    prop: normalizeCalendarValue(value),
    onChange: (value) => {
      onChange?.(
        returnType === "date"
          ? value
          : {
              start: value.start?.toISOString(),
              end: value.end?.toISOString(),
            },
      );
    },
    defaultProp: normalizeCalendarValue(defaultValue),
  });

  const handleDateChange = (selectedDate: Date) => {
    setSelectedDateRange((previousDateRange) => {
      if (!previousDateRange) {
        return {
          start: selectedDate,
          end: undefined,
        };
      }

      const selectedDateRangeEdge = Object.entries(previousDateRange).find(
        ([_, edgeDate]) => isSameDay(edgeDate, selectedDate),
      )?.[0] as keyof DateRange | undefined;

      const isFirstSelectedDate = Object.entries(previousDateRange).every(
        ([_, value]) => value === undefined,
      );

      const selectedEdgeType =
        selectedDateRangeEdge ?? (isFirstSelectedDate ? "start" : undefined);

      const dateRangeExtensionType =
        previousDateRange.start &&
        isBefore(selectedDate, previousDateRange.start)
          ? "start"
          : "end";

      const areEdgesSameDate =
        previousDateRange.start &&
        previousDateRange.end &&
        isSameDay(previousDateRange.start, previousDateRange.end);

      if (areEdgesSameDate) {
        // date range is not selected (completed)
        return {
          ...previousDateRange,
          [dateRangeExtensionType]: selectedDate,
        };
      }

      if (selectedEdgeType) {
        const isStartDateSelected =
          selectedEdgeType === "start" && previousDateRange.start !== undefined;

        if (isStartDateSelected) {
          return {
            start: undefined,
            end: undefined,
          } as DateDateRange;
        }

        if (isFirstSelectedDate) return { start: selectedDate, end: undefined };

        //  end date is selected
        return {
          start: previousDateRange.end,
          end: undefined,
        };
      }

      const isStartDateSelectionWithoutEndDate =
        dateRangeExtensionType === "start" && !previousDateRange?.end;

      if (isStartDateSelectionWithoutEndDate)
        return { start: selectedDate, end: previousDateRange.start };

      return {
        ...previousDateRange,
        [dateRangeExtensionType]: selectedDate,
      };
    });
  };

  if (multiplePages) {
    return (
      <MultiPageDateRangeCalendar
        onDateChange={handleDateChange}
        value={selectedDateRange}
        startYear={startYear}
        endYear={endYear}
        {...props}
      />
    );
  }
  return (
    <SinglePageDateRangeCalendar
      onDateChange={handleDateChange}
      value={selectedDateRange}
      startYear={startYear}
      endYear={endYear}
      {...props}
    />
  );
};

type DateRangeImplementationProps = DateRangeCalendarProps & {
  endYear: number;
  startYear: number;
  value?: DateRange;
  onDateChange: (value: Date) => void;
};

const MultiPageDateRangeCalendar = ({
  value,
  startYear,
  endYear,
  onChange,
  onDateChange,
  ...props
}: DateRangeImplementationProps) => {
  const [firstPageDate, setFirstPageDate] = useState(
    normalizeCalendarValue(value?.start ?? new Date()),
  );

  const lastPageDateDefault =
    value?.end && isSameMonth(firstPageDate, value.end)
      ? addMonths(value.end, 1)
      : addMonths(firstPageDate, 1);

  const [lastPageDate, setLastPageDate] = useState(lastPageDateDefault);

  const firstPageMonth = getMonth(firstPageDate);
  const lastPageMonth = getMonth(lastPageDate);
  const firstPageYear = getYear(firstPageDate);
  const lastPageYear = getYear(lastPageDate);
  const arePagesOnSameYear = isSameYear(firstPageDate, lastPageDate);

  const isPreviousYearUnavailable =
    subMonths(firstPageDate, 1).getFullYear() < startYear;
  const isNextYearUnavailable =
    addMonths(lastPageDate, 1).getFullYear() > endYear;

  const handlePagesChange = (type: "forwards" | "backwards") => {
    setFirstPageDate(
      type === "forwards"
        ? addMonths(firstPageDate, 1)
        : subMonths(firstPageDate, 1),
    );
    setLastPageDate(
      type === "forwards"
        ? addMonths(lastPageDate, 1)
        : subMonths(lastPageDate, 1),
    );
  };

  const selectedDates = value?.start
    ? eachDayOfInterval({
        start: value.start,
        end: value?.end ?? value.start,
      })
    : [];

  return (
    <>
      <div className={"mb-2 flex items-center gap-2"}>
        <CalendarHeader
          date={firstPageDate}
          startYear={startYear}
          endYear={lastPageYear}
          endMonth={arePagesOnSameYear ? lastPageMonth : undefined}
          showCalendarPageControls={false}
          onPageChange={setFirstPageDate}
          className={"mb-0"}
        />
        -
        <CalendarHeader
          date={lastPageDate}
          endYear={endYear}
          startYear={firstPageYear}
          startMonth={arePagesOnSameYear ? firstPageMonth + 1 : undefined}
          showCalendarPageControls={false}
          onPageChange={setLastPageDate}
          className={"mb-0 pl-2"}
        />
        <div className={"ml-auto flex items-center gap-2"}>
          <Button
            size={"icon"}
            variant={"soft"}
            className={"ml-auto size-6 disabled:opacity-40"}
            disabled={isPreviousYearUnavailable}
            onClick={() => handlePagesChange("backwards")}
          >
            <ChevronLeftIcon className={"size-4"} />
          </Button>
          <Button
            size={"icon"}
            variant={"soft"}
            className={"size-6 disabled:opacity-40"}
            disabled={isNextYearUnavailable}
            onClick={() => handlePagesChange("forwards")}
          >
            <ChevronRightIcon className={"size-4"} />
          </Button>
        </div>
      </div>

      <div className={"flex divide-x divide-border"}>
        <div className={"w-64 pr-4"}>
          <CalendarBody
            date={normalizeCalendarValue(value?.start, new Date())}
            onDateChange={onDateChange}
            selectedDates={selectedDates}
            pageDate={firstPageDate}
            classList={{
              cell: {
                startDate: cellVariants({ variant: "start-date" }),
                endDate: cellVariants({ variant: "end-date" }),
                singleDate: cellVariants({ variant: "single-date" }),
                active: cellVariants(),
              },
            }}
            {...props}
          />
        </div>
        <div className={"w-64 pl-4"}>
          <CalendarBody
            date={normalizeCalendarValue(value?.end, new Date())}
            onDateChange={onDateChange}
            selectedDates={selectedDates}
            pageDate={lastPageDate}
            classList={{
              cell: {
                startDate: cellVariants({ variant: "start-date" }),
                endDate: cellVariants({ variant: "end-date" }),
                singleDate: cellVariants({ variant: "single-date" }),
                active: cellVariants(),
              },
            }}
            {...props}
          />
        </div>
      </div>
    </>
  );
};

const SinglePageDateRangeCalendar = ({
  value,
  onDateChange,
  ...props
}: DateRangeImplementationProps) => {
  const day = normalizeCalendarValue(value?.start ?? new Date());

  const selectedDates = value?.start
    ? eachDayOfInterval({
        start: value.start,
        end: value?.end ?? value.start,
      })
    : [];

  return (
    <CalendarPrimitive
      {...props}
      value={day}
      classList={{
        cell: {
          startDate: cellVariants({ variant: "start-date" }),
          endDate: cellVariants({ variant: "end-date" }),
          singleDate: cellVariants({ variant: "single-date" }),
          active: cellVariants(),
        },
      }}
      onDatePick={onDateChange}
      selectedDates={selectedDates}
    />
  );
};

const SingleDateCalendar = ({
  defaultValue,
  value,
  onChange,
  returnType = "date",
  ...props
}: SingleDateCalendarProps) => {
  const [selectedDate, setSelectedDate] = useControllableState({
    prop: normalizeCalendarValue(value),
    onChange: (value) =>
      onChange?.(returnType === "date" ? value : value.toISOString()),
    defaultProp: normalizeCalendarValue(defaultValue, new Date()),
  });

  return (
    <CalendarPrimitive
      {...props}
      value={selectedDate}
      selectedDates={selectedDate ? [selectedDate] : []}
      onDatePick={setSelectedDate}
    />
  );
};

export {
  CalendarBody,
  CalendarHeader,
  Calendar as CalendarPrimitive,
} from "./calendar-primitive";
