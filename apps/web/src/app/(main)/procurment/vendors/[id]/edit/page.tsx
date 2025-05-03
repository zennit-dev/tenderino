import { VendorForm } from "@/components/vendor/vendor-form";

export default () => {
  return <VendorForm action="edit" defaultValues={data} />;
};

const data = {
  id: "1",
  name: "Vendor 1",
  email: "vendor1@example.com",
  phone: "1234567890",
  address: "123 Main St, Anytown, USA",
};
