import { FileContentIcon } from "@zennui/icons";
import { Button } from "@zennui/web/button";

export default () => {
  return (
    <div className="space-y-8">
      <div className="flex justify-between">
        <h1 className="font-bold text-4xl">Business Dashboard</h1>
        <p className="text-foreground-dimmed">
          Today is{" "}
          <span className="text-foreground font-medium">
            {new Date().toLocaleDateString()}
          </span>
        </p>
      </div>

      <div className="flex gap-4">
        <div className="border border-border p-4 rounded-xl flex-1">
          <p className="text-foreground-dimmed">Active Tenders</p>
          <div className="flex items-center justify-between">
            <p className="font-bold text-3xl">2</p>
            <p className="text-success text-sm bg-success/10 border-success/50 border rounded-full px-2">
              Active
            </p>
          </div>
        </div>
        <div className="border border-border p-4 rounded-xl flex-1">
          <p className="text-foreground-dimmed">Available Tenders</p>
          <div className="flex items-center justify-between">
            <p className="font-bold text-3xl">15</p>
            <p className="text-foreground text-sm border-foreground/10 border rounded-full px-2">
              New
            </p>
          </div>
        </div>
        <div className="border border-border p-4 rounded-xl flex-1">
          <p className="text-foreground-dimmed">Documents</p>
          <div className="flex items-center justify-between">
            <p className="font-bold text-3xl">13</p>
            <p className="text-error/70 text-sm bg-warning/10 border-warning/50 border rounded-full px-2">
              2 Need Update
            </p>
          </div>
        </div>
      </div>
      <div className="flex gap-4">
        <div className="border space-y-4 w-[calc(66%+theme(spacing.1))] border-border p-4 rounded-xl">
          <div className="flex justify-between">
            <h3 className="text-2xl font-bold">Active Tenders</h3>
            <Button color="accent">View All</Button>
          </div>
          <div className="border border-border space-y-4 p-4 rounded-xl">
            <div className="flex justify-between items-center">
              <p className="font-medium">IT Infrastructure Upgrade</p>
              <p className="text-success text-sm bg-success/10 border-success/50 border rounded-full px-2">
                Open
              </p>
            </div>
            <div className="flex">
              <div className="flex flex-1 flex-wrap gap-y-3">
                <div className="w-1/2">
                  <p className="text-foreground-dimmed text-sm">Category</p>
                  <p>Construction</p>
                </div>
                <div className="w-1/2">
                  <p className="text-foreground-dimmed text-sm">Budget Range</p>
                  <p>50,000 - 75,000 EUR</p>
                </div>
                <div className="w-1/2">
                  <p className="text-foreground-dimmed text-sm">Deadline</p>
                  <p>{new Date().toLocaleDateString()}</p>
                </div>
              </div>
              <Button color="primary" className="self-end px-4">
                Apply
              </Button>
            </div>
          </div>
          <div className="border border-border space-y-4 p-4 rounded-xl">
            <div className="flex justify-between items-center">
              <p className="font-medium">IT Infrastructure Upgrade</p>
              <p className="text-success text-sm bg-success/10 border-success/50 border rounded-full px-2">
                Open
              </p>
            </div>
            <div className="flex">
              <div className="flex flex-1 flex-wrap gap-y-3">
                <div className="w-1/2">
                  <p className="text-foreground-dimmed text-sm">Category</p>
                  <p>Construction</p>
                </div>
                <div className="w-1/2">
                  <p className="text-foreground-dimmed text-sm">Budget Range</p>
                  <p>50,000 - 75,000 EUR</p>
                </div>
                <div className="w-1/2">
                  <p className="text-foreground-dimmed text-sm">Deadline</p>
                  <p>{new Date().toLocaleDateString()}</p>
                </div>
              </div>
              <Button color="primary" className="self-end px-4">
                Apply
              </Button>
            </div>
          </div>
          <div className="border border-border space-y-4 p-4 rounded-xl">
            <div className="flex justify-between items-center">
              <p className="font-medium">IT Infrastructure Upgrade</p>
              <p className="text-success text-sm bg-success/10 border-success/50 border rounded-full px-2">
                Open
              </p>
            </div>
            <div className="flex">
              <div className="flex flex-1 flex-wrap gap-y-3">
                <div className="w-1/2">
                  <p className="text-foreground-dimmed text-sm">Category</p>
                  <p>Construction</p>
                </div>
                <div className="w-1/2">
                  <p className="text-foreground-dimmed text-sm">Budget Range</p>
                  <p>50,000 - 75,000 EUR</p>
                </div>
                <div className="w-1/2">
                  <p className="text-foreground-dimmed text-sm">Deadline</p>
                  <p>{new Date().toLocaleDateString()}</p>
                </div>
              </div>
              <Button color="primary" className="self-end px-4">
                Apply
              </Button>
            </div>
          </div>
        </div>
        <div className="flex-1 border border-border p-4 space-y-4 rounded-xl">
          <div className="flex justify-between">
            <h3 className="text-2xl font-bold">Recent Applications</h3>
            <Button color="accent">View All</Button>
          </div>
          <div className="p-4 border border-border rounded-xl space-y-2">
            <p className="font-medium text-lg">Website Development Project</p>
            <div className="flex justify-between gap-4 items-center">
              <div className="space-y-.5 flex-1">
                <p className="text-foreground-dimmed">Submitted</p>
                <p>{new Date().toLocaleDateString()}</p>
              </div>
              <div className="space-y-1 flex-1">
                <p className="text-foreground-dimmed">Status</p>
                <p className="text-foreground text-sm w-fit border-foreground/10 border rounded-full px-2">
                  Under Review
                </p>
              </div>
            </div>
          </div>
          <div className="p-4 border border-border rounded-xl space-y-2">
            <p className="font-medium text-lg">Website Development Project</p>
            <div className="flex gap-4 items-center">
              <div className="space-y-.5 flex-1">
                <p className="text-foreground-dimmed">Submitted</p>
                <p>{new Date().toLocaleDateString()}</p>
              </div>
              <div className="space-y-1 flex-1">
                <p className="text-foreground-dimmed">Status</p>
                <p className="text-error/70 text-sm w-fit bg-warning/10 border-warning/50 border rounded-full px-2">
                  Shortlisted
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
