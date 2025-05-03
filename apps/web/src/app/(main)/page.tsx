import { AverageVendorRating } from "@/components/average-vendor-rating";
import { DashboardLineChart } from "@/components/dashboard-line-chart";
import { TenderCard } from "@/components/tender-card";
import {
  CalendarIcon,
  FileCheck,
  FileClockIcon,
  LaptopChart,
  LineChartIcon,
  UsersIcon,
} from "@zennui/icons";

const chartData = [
  { month: "January", data: 186 },
  { month: "February", data: 305 },
  { month: "March", data: 237 },
  { month: "April", data: 73 },
  { month: "May", data: 209 },
  { month: "June", data: 214 },
];

const activeTendersChartConfig = {
  data: {
    label: "Active Tenders",
    color: "red",
  },
};

const completedTendersChartConfig = {
  data: {
    label: "Completed Tenders",
    color: "blue",
  },
};

const TENDERS = [
  {
    id: "fijweifwejfopwejio",
    Icon: LaptopChart,
    title: "Tender Title",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    deadline: new Date().toISOString(),
    vendorCount: 5,
  },
  {
    id: "cuevieruviwjviw9u",
    Icon: LaptopChart,
    title: "Tender Title",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    deadline: new Date().toISOString(),
    vendorCount: 5,
  },
  {
    id: "fweifjewifejw1",
    Icon: LaptopChart,
    title: "Tender Title",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    deadline: new Date().toISOString(),
    vendorCount: 5,
  },
];

export default () => {
  return (
    <div className="flex flex-col gap-10">
      <h1 className="font-bold text-4xl">Dashboard</h1>
      <section className="flex">
        <div className="flex-1 gap-4 flex-wrap self-stretch flex">
          <div className="border justify-between flex min-w-[calc(50%-theme(spacing.4))] flex-col border-border w-fit rounded-xl">
            <div className="p-4 flex gap-4 items-center text-foreground-dimmed text-lg">
              <div className="bg-red-500/10 w-fit rounded-full p-2">
                <FileClockIcon className="fill-red-500 size-6" />
              </div>
              <p>Active Tenders</p>
            </div>
            <p className="text-4xl pb-4 font-bold px-5">17</p>
            <DashboardLineChart
              chartConfig={activeTendersChartConfig}
              chartData={chartData}
            />
          </div>
          <div className="border justify-between flex min-w-[calc(50%-theme(spacing.4))] flex-col border-border w-fit rounded-xl">
            <div className="p-4 flex gap-4 items-center text-foreground-dimmed text-lg">
              <div className="bg-blue-500/10 w-fit rounded-full p-2">
                <FileCheck className="fill-blue-500 size-6" />
              </div>
              <p>Completed Tenders</p>
            </div>
            <p className="text-4xl pb-4 font-bold px-5">8</p>
            <DashboardLineChart
              chartConfig={completedTendersChartConfig}
              chartData={chartData}
            />
          </div>
          <div className="border justify-between flex min-w-[calc(50%-theme(spacing.4))] flex-col border-border w-fit rounded-xl">
            <div className="p-4 flex gap-4 items-center text-foreground-dimmed text-lg">
              <div className="bg-primary/10 w-fit rounded-full p-2">
                <LineChartIcon className="fill-primary size-6" />
              </div>
              <p>Average Submissions</p>
            </div>
            <p className="text-4xl pb-4 font-bold px-5">7</p>
            <DashboardLineChart
              chartConfig={activeTendersChartConfig}
              chartData={chartData}
            />
          </div>
          <div className="border justify-between flex min-w-[calc(50%-theme(spacing.4))] flex-col border-border w-fit rounded-xl">
            <div className="p-4 flex gap-4 items-center text-foreground-dimmed text-lg">
              <div className="bg-purple-950/10 w-fit rounded-full p-2">
                <UsersIcon className="fill-purple-950 size-6" />
              </div>
              <p>Registered Vendors</p>
            </div>
            <p className="text-4xl pb-4 font-bold px-5">8</p>
            <DashboardLineChart
              chartConfig={activeTendersChartConfig}
              chartData={chartData}
            />
          </div>
        </div>
        <div className="flex-1 border border-border min-h-fit flex flex-col rounded-xl gap-6 p-4">
          <div className="flex gap-4 items-center">
            <CalendarIcon />
            Average Vendor Rating
          </div>
          <AverageVendorRating />
        </div>
      </section>
      <section className="gap-6 flex flex-col">
        <h2 className="font-medium text-2xl">Recent Tenders (2)</h2>
        <div className="flex">
          <div className="w-3/5 flex flex-wrap gap-4">
            {TENDERS.map((tender) => (
              <TenderCard
                key={tender.id}
                {...tender}
                className="min-w-[calc(50%-theme(spacing.4))]"
              />
            ))}
          </div>
          <div className="flex-1 h-fit border border-border rounded-xl">
            <div className="flex flex-row items-center p-4 gap-2 border-b border-border">
              <div className="bg-primary/10 w-fit rounded-full p-2">
                <CalendarIcon className="fill-primary" />
              </div>
              <p>Tender Deadlines</p>
            </div>
            <div className="p-4 border-b border-border space-y-4 border-b border-border">
              <p className="text-foreground-dimmed">May 2025</p>
              <div>
                <div className="flex gap-4 items-center border-b border-border pb-4">
                  <p className="text-primary bg-primary/10 font-bold text-2xl size-13 text-center justify-center items-center flex rounded-full aspect-square">
                    4
                  </p>
                  <div className="flex-1">
                    <p>IT Infrastructure Upgrade</p>
                    <p>Decision Deadline</p>
                  </div>
                  <p className="text-foreground-dimmed">15:00</p>
                </div>
              </div>
              <div>
                <div className="flex gap-4 items-center">
                  <p className="text-primary bg-primary/10  font-bold text-2xl text-center size-13 justify-center items-center flex rounded-full aspect-square">
                    5
                  </p>
                  <div className="flex-1">
                    <p>IT Infrastructure Upgrade</p>
                    <p>Decision Deadline</p>
                  </div>
                  <p className="text-foreground-dimmed">15:00</p>
                </div>
              </div>
            </div>
            <div className="p-4 space-y-4 ">
              <p className="text-foreground-dimmed">June 2025</p>
              <div>
                <div className="flex gap-4 items-center border-b border-border pb-4">
                  <p className="text-primary items-center flex bg-primary/10 font-bold text-2xl size-13 justify-center items-center flex rounded-full aspect-square">
                    17
                  </p>
                  <div className="flex-1">
                    <p>IT Infrastructure Upgrade</p>
                    <p>Decision Deadline</p>
                  </div>
                  <p className="text-foreground-dimmed">15:00</p>
                </div>
              </div>
              <div>
                <div className="flex gap-4 items-center">
                  <p className="text-primary items-center bg-primary/10 font-bold text-2xl size-13 justify-center items-center flex rounded-full aspect-square">
                    22
                  </p>
                  <div className="flex-1">
                    <p>IT Infrastructure Upgrade</p>
                    <p>Decision Deadline</p>
                  </div>
                  <p className="text-foreground-dimmed">15:00</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
