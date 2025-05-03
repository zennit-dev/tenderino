"use client";
import type { Vendor } from "@/types/vendor";
import { XIcon } from "@zennui/icons";
import { field, InferredForm } from "@zennui/web/form";
import { useRouter } from "next/navigation";
import { z } from "zod";

type VendorFormProps = {
  action: "create" | "edit";
  defaultValues?: Partial<Vendor>;
};
export const VendorForm = ({ action, defaultValues }: VendorFormProps) => {
  const router = useRouter();

  return (
    <main>
      <div>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">
            {action === "create" ? "Create Vendor" : "Edit Vendor"}
          </h1>
          <XIcon onClick={router.back} />
        </div>
        <p className="text-sm text-muted-foreground">
          {action === "create" ? "Create a new vendor." : "Edit the vendor."}
        </p>
      </div>
      <hr className="my-4 bg-border border-border text-border" />
      <InferredForm config={config} defaultValues={defaultValues} />
    </main>
  );
};

const config = {
  name: field({
    label: "Name",
    shape: "text",
    constraint: z.string(),
  }),
  email: field({
    label: "Email",
    shape: "text",
    constraint: z.string().email(),
  }),
  phone: field({
    label: "Phone",
    shape: "phone",
    constraint: z.string(),
  }),
  address: field({
    label: "Address",
    shape: "text",
    constraint: z.string(),
  }),
};
