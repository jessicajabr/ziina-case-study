import { cn } from "@/lib/utils";

export type RentStatus =
  | "on_track"
  | "due_soon"
  | "at_risk"
  | "recovered"
  | "paid"
  | "settlement_pending";

const STYLES: Record<RentStatus, { label: string; className: string; dot: string }> = {
  paid: {
    label: "Paid",
    className: "bg-success/10 text-success border-success/20",
    dot: "bg-success",
  },
  on_track: {
    label: "On track",
    className: "bg-accent/10 text-accent border-accent/20",
    dot: "bg-accent",
  },
  due_soon: {
    label: "Due soon",
    className: "bg-warning/15 text-warning-foreground border-warning/30",
    dot: "bg-warning",
  },
  at_risk: {
    label: "At risk",
    className: "bg-danger/10 text-danger border-danger/20",
    dot: "bg-danger",
  },
  recovered: {
    label: "Recovered",
    className: "bg-success/10 text-success border-success/20",
    dot: "bg-success",
  },
  settlement_pending: {
    label: "Settlement pending",
    className: "bg-info/10 text-info border-info/20",
    dot: "bg-info",
  },
};

export function StatusChip({
  status,
  className,
}: {
  status: RentStatus;
  className?: string;
}) {
  const s = STYLES[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
        s.className,
        className,
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", s.dot)} />
      {s.label}
    </span>
  );
}