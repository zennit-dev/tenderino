"use client";
import {
  field,
  FormSubmitButton,
  InferredForm,
  type InferredFormFields,
} from "@zennui/web/form";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { z } from "zod";
import Link from "next/link";
import { LogInIcon } from "@zennui/icons";

export default () => {
  const router = useRouter();

  const handleSubmit = (data: InferredFormFields<typeof config>) => {
    console.log(data);
    router.push("/");
  };

  return (
    <main className="size-full flex items-center bg-background">
      <section className="w-3/5 h-full p-2">
        <div className=" bg-accent rounded-lg size-full relative overflow-hidden">
          <Image src="/images/background.png" alt="Sign in image" fill />
        </div>
      </section>
      <section className="w-2/5 h-full p-12  flex flex-col gap-4 justify-center">
        <div className="mb-2">
          <Image
            src="/images/logo-full.png"
            alt="AADF logo"
            width={175}
            height={175}
            className="mb-4"
          />
          <h1 className="text-2xl font-bold">Continue into AADF Smart</h1>
          <hr className="border-border my-1" />
          <p className="text-sm text-foreground-dimmed">
            Use your company provided email and password to sign in. Make sure
            to use the correct email address you were given. If you don&apos;t
            have an account,{" "}
            <Link href="/sign-up" className="underline">
              sign up
            </Link>{" "}
            instead.
          </p>
        </div>
        <InferredForm config={config} onSubmit={handleSubmit}>
          <FormSubmitButton color="primary" className="flex items-center gap-2">
            <LogInIcon />
            Sign in
          </FormSubmitButton>
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
    description: "Enter your company provided email address.",
  }),
  password: field({
    label: "Password",
    placeholder: "Password",
    constraint: z.string().min(8),
    shape: "text",
    type: "password",
    description: "Enter your company provided password.",
  }),
};
