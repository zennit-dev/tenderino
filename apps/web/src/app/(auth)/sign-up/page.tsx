"use client";
import { LogInIcon } from "@zennui/icons";
import {
  FormSubmitButton,
  InferredForm,
  type InferredFormFields,
  field,
} from "@zennui/web/form";
import { Tabs, TabsContent } from "@zennui/web/tabs";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";

export default () => {
  const router = useRouter();
  const [active, setActive] = useState("company");

  const handleCompanySubmit = (data: InferredFormFields<typeof company>) => {
    setActive("contact");
  };

  const handleContactSubmit = (data: InferredFormFields<typeof contact>) => {
    setActive("credentials");
  };

  const handleCredentialsSubmit = (
    data: InferredFormFields<typeof credentials>,
  ) => {
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
      <section className="w-2/5 h-full justify-center ">
        <div className="h-full overflow-y-scroll overflow-x-hidden flex flex-col gap-4 min-h-full p-12">
          <div className="mb-2">
            <Image
              src="/images/logo-full.png"
              alt="AADF logo"
              width={175}
              height={175}
              className="mb-4"
            />
            <h1 className="text-2xl font-bold">Register into AADF Smart</h1>
            <hr className="border-border my-1" />
            <p className="text-sm text-foreground-dimmed">
              Input your genreal company data
            </p>
          </div>
          <Tabs value={active} onValueChange={setActive}>
            <TabsContent value="company">
              <InferredForm config={company} onSubmit={handleCompanySubmit}>
                <FormSubmitButton
                  color="primary"
                  className="flex items-center gap-2 mb-12"
                >
                  <LogInIcon />
                  Continue into Credentials
                </FormSubmitButton>
              </InferredForm>
            </TabsContent>
            <TabsContent value="contact">
              <InferredForm config={contact} onSubmit={handleContactSubmit}>
                <FormSubmitButton
                  color="primary"
                  className="flex items-center gap-2 mb-12"
                >
                  <LogInIcon />
                  Register
                </FormSubmitButton>
              </InferredForm>
            </TabsContent>
            <TabsContent value="credentials">
              <InferredForm
                config={credentials}
                onSubmit={handleCredentialsSubmit}
              >
                <FormSubmitButton
                  color="primary"
                  className="flex items-center gap-2 mb-12"
                >
                  <LogInIcon />
                  Continue into Contact Information
                </FormSubmitButton>
              </InferredForm>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </main>
  );
};

const company = {
  name: field({
    label: "Company Name",
    placeholder: "Company Name",
    constraint: z.string().min(1),
    shape: "text",
    description: "Enter your company name.",
  }),
  nuis: field({
    label: "NUIS",
    placeholder: "NUIS",
    constraint: z.string().min(1),
    shape: "text",
    description: "Enter your company NUIS.",
  }),
  entity: field({
    label: "Entity",
    placeholder: "Entity",
    constraint: z.enum(["LLC", "LTD", "PTE"]),
    shape: "select",
    description: "Enter your company entity.",
  }),
  address: field({
    label: "Address",
    placeholder: "Address",
    constraint: z.string().min(1),
    shape: "text",
    description: "Enter your company address.",
  }),
  industry: field({
    label: "Industry",
    placeholder: "Industry",
    constraint: z.string().min(1),
    shape: "text",
    description: "Enter your company industry.",
  }),
  document: field({
    label: "Supporting Document",
    constraint: z.array(z.instanceof(File)),
    shape: "file",
    accept: { "text/pdf": [] },
    description: "Enter your company documents such as NUIS and QKB history.",
  }),
};

const contact = {
  fullName: field({
    label: "Full Name",
    placeholder: "Full Name",
    constraint: z.string().min(1),
    shape: "text",
    description: "Enter your full name",
  }),
  phone: field({
    label: "Phone",
    placeholder: "Phone",
    constraint: z.string().min(1),
    shape: "text",
    description: "Enter your company phone number.",
  }),
  email: field({
    label: "Email",
    placeholder: "Email",
    constraint: z.string().email(),
    shape: "text",
    description: "Enter your company email address.",
  }),
  position: field({
    label: "Position in Company",
    placeholder: "Position",
    constraint: z.string().min(1),
    shape: "text",
    description: "Enter your company position.",
  }),
};

const credentials = {
  email: field({
    label: "Email",
    placeholder: "Email",
    constraint: z.string().email(),
    shape: "text",
    description: "Enter your company email address.",
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
