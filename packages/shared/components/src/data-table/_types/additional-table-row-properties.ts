import type { UniqueIdentifier } from "@zenncore/types";
import type { TableRow } from "./table-row";

export type AdditionalTableRowProperties = {
  id: UniqueIdentifier;
  subRows?: TableRow[];
  href?: string;
};
