"use client";

import { useDataTableContext } from "@zenncore/components/data-table";
import type { PropsWithClassName } from "@zenncore/types/components";
import { cn } from "@zenncore/utils";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
} from "@zennui/icons";
import { AnimatePresence, motion } from "motion/react";
import { textBlurAnimationConfig } from "../_animations";
import { Button } from "../button";

export const DataTablePagination = ({ className }: PropsWithClassName) => {
  const { pagination } = useDataTableContext();

  return (
    <div className={cn("flex w-fit items-center gap-4", className)}>
      <div className="flex items-center gap-1">
        <AnimatePresence mode="wait">
          <motion.h3
            key={pagination.pageIndex}
            {...textBlurAnimationConfig}
            transition={{
              duration: 0.3,
              delay: 0,
            }}
            className="tabular-nums"
          >
            {pagination.pageIndex}
          </motion.h3>
        </AnimatePresence>
        <h3>/</h3>
        <h3 key="page-count" className="tabular-nums">
          {pagination.pageCount}
        </h3>
      </div>
      <div className="flex items-center gap-2">
        <Button
          size="icon"
          variant="soft"
          onClick={pagination.goToFirstPage}
          disabled={!pagination.canGoPreviousPage}
        >
          <ChevronsLeftIcon />
        </Button>
        <Button
          size="icon"
          variant="soft"
          onClick={pagination.goToPreviousPage}
          disabled={!pagination.canGoPreviousPage}
        >
          <ChevronLeftIcon />
        </Button>
        <Button
          size="icon"
          variant="soft"
          onClick={pagination.goToNextPage}
          disabled={!pagination.canGoNextPage}
        >
          <ChevronRightIcon />
        </Button>
        <Button
          size="icon"
          variant="soft"
          onClick={pagination.goToLastPage}
          disabled={!pagination.canGoNextPage}
        >
          <ChevronsRightIcon />
        </Button>
      </div>
    </div>
  );
};
