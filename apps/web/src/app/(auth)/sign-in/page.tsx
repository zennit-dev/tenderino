"use client";
import {
  field,
  FormSubmitButton,
  InferredForm,
  type InferredFormFields,
} from "@zennui/web/form";
import { useRouter } from "next/navigation";
import { z } from "zod";

export default () => {
  const router = useRouter();

  const handleSubmit = (data: InferredFormFields<typeof config>) => {
    console.log(data);
    router.push("/");
  };

  return (
    <main className="size-full flex items-center">
      <section className="w-3/5 h-full" />
      <section className="w-2/5 h-full bg-background p-12">
        <InferredForm config={config} onSubmit={handleSubmit}>
          <FormSubmitButton>Sign in</FormSubmitButton>
        </InferredForm>
      </section>
    </main>
  );
};

const config = {
  email: field({
    label: "Email",
    placeholder: "Email",
    constraint: z.string().email(),
    shape: "text",
  }),
  password: field({
    label: "Password",
    placeholder: "Password",
    constraint: z.string().min(8),
    shape: "text",
    type: "password",
  }),
};
