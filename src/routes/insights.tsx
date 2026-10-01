import { createFileRoute, Link } from "@tanstack/react-router";
import { PhoneFrame, ScreenHeader } from "@/components/PhoneFrame";
import { ArrowRight, CalendarIcon, Clock, ShieldCheck, TrendingUp } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format, differenceInCalendarDays } from "date-fns";
import { useState } from "react";
import type { DateRange } from "react-day-picker";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/insights")({
  validateSearch: zodValidator(
    z.object({
      range: fallback(z.enum(["30", "60", "90", "custom"]), "90").default("90"),
    }),
  ),
  component: Insights,
});

const RANGE_OPTIONS = [
  { value: "30", label: "Last 30 days" },
  { value: "60", label: "Last 60 days" },
  { value: "90", label: "Last 90 days" },
  { value: "custom", label: "Custom range" },
] as const;

type RangeValue = (typeof RANGE_OPTIONS)[number]["value"];

const RANGE_DATA: Record<
  RangeValue,
  {
    onTimePct: number;
    onTimeDelta: number;
    paymentsCleared: string;
    recoveredAed: string;
    recoveredCount: number;
    hoursSaved: number;
    mix: { auto: number; ziina: number; manual: number };
    manualUnitsLeft: number;
    hoursSavedPerQuarter: number;
    headline: string;
  }
> = {
  "30": {
    onTimePct: 89,
    onTimeDelta: 3,
    paymentsCleared: "11 of 12",
    recoveredAed: "AED 24k",
    recoveredCount: 1,
    hoursSaved: 5,
    mix: { auto: 66, ziina: 26, manual: 8 },
    manualUnitsLeft: 4,
    hoursSavedPerQuarter: 2,
    headline: "Fastest 30-day recovery streak this quarter.",
  },
  "60": {
    onTimePct: 91,
    onTimeDelta: 5,
    paymentsCleared: "22 of 24",
    recoveredAed: "AED 52k",
    recoveredCount: 2,
    hoursSaved: 9,
    mix: { auto: 69, ziina: 24, manual: 7 },
    manualUnitsLeft: 3,
    hoursSavedPerQuarter: 3,
    headline: "Two payments recovered before hitting at-risk.",
  },
  "90": {
    onTimePct: 94,
    onTimeDelta: 8,
    paymentsCleared: "34 of 36",
    recoveredAed: "AED 78k",
    recoveredCount: 3,
    hoursSaved: 14,
    mix: { auto: 72, ziina: 22, manual: 6 },
    manualUnitsLeft: 3,
    hoursSavedPerQuarter: 4,
    headline: "34 of 36 payments cleared on or before due date.",
  },
  custom: {
    onTimePct: 96,
    onTimeDelta: 11,
    paymentsCleared: "58 of 61",
    recoveredAed: "AED 132k",
    recoveredCount: 5,
    hoursSaved: 22,
    mix: { auto: 78, ziina: 18, manual: 4 },
    manualUnitsLeft: 2,
    hoursSavedPerQuarter: 6,
    headline: "Year-to-date view — your strongest recovery window.",
  },
};

function Insights() {

  return _Insights();
}

function scaleForCustom(from: Date, to: Date) {
  const days = Math.max(1, differenceInCalendarDays(to, from) + 1);
  const base = RANGE_DATA["90"];
  const factor = days / 90;
  const paymentsTotal = Math.max(1, Math.round(36 * factor));
  const paymentsOnTime = Math.max(0, paymentsTotal - Math.round(2 * factor));
  const onTimePct = Math.min(99, Math.round((paymentsOnTime / paymentsTotal) * 100));
  const recoveredCount = Math.max(1, Math.round(3 * factor));
  const recoveredK = Math.round(78 * factor);
  return {
    onTimePct,
    onTimeDelta: Math.max(2, Math.round(8 * Math.min(1.5, factor))),
    paymentsCleared: `${paymentsOnTime} of ${paymentsTotal}`,
    recoveredAed: `AED ${recoveredK}k`,
    recoveredCount,
    hoursSaved: Math.max(1, Math.round(14 * factor)),
    mix: base.mix,
    manualUnitsLeft: base.manualUnitsLeft,
    hoursSavedPerQuarter: base.hoursSavedPerQuarter,
    headline: `${days}-day view — ${paymentsOnTime} of ${paymentsTotal} on time.`,
  };
}

function _Insights() {
  const { range } = Route.useSearch() as { range: RangeValue };
  const navigate = useNavigate({ from: Route.fullPath });
  const [customRange, setCustomRange] = useState<DateRange | undefined>(() => {
    const to = new Date();
    const from = new Date();
    from.setDate(to.getDate() - 45);
    return { from, to };
  });
  const [calendarOpen, setCalendarOpen] = useState(false);

  const baseData = RANGE_DATA[range];
  const data =
    range === "custom" && customRange?.from && customRange?.to
      ? scaleForCustom(customRange.from, customRange.to)
      : baseData;

  const customLabel =
    customRange?.from && customRange?.to
      ? `${format(customRange.from, "MMM d")} – ${format(customRange.to, "MMM d")}`
      : "Pick dates";

  return (
    <PhoneFrame>
      <ScreenHeader
        title="Insights"
        subtitle={undefined}
        right={
          <Select
            value={range}
            onValueChange={(v: string) =>
              navigate({ search: { range: v as RangeValue } })
            }
          >
            <SelectTrigger className="h-8 w-[140px] rounded-full border-accent/20 bg-accent/5 px-3 text-xs font-medium text-accent">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {RANGE_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        }
      />

      <div className="space-y-4 px-5 pt-5">
        {range === "custom" && (
          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start rounded-2xl border-accent/20 bg-accent/5 text-left font-medium text-accent",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {customLabel}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="range"
                selected={customRange}
                onSelect={(r) => {
                  setCustomRange(r);
                  if (r?.from && r?.to) setCalendarOpen(false);
                }}
                numberOfMonths={1}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
        )}

        <div
          className="rounded-3xl p-5 text-primary-foreground shadow-[var(--shadow-card)]"
          style={{ background: "var(--gradient-hero)" }}
        >
          <p className="text-xs uppercase tracking-widest text-primary-foreground/70">
            On-time rent rate
          </p>
          <div className="mt-1 flex items-baseline gap-2">
            <p className="font-display text-5xl">{data.onTimePct}%</p>
            <span className="text-sm text-emerald-300">↑ {data.onTimeDelta} pts</span>
          </div>
          <p className="mt-2 text-sm text-primary-foreground/80">
            {data.headline}
          </p>
          <p className="mt-1 text-xs text-primary-foreground/60">
            {data.paymentsCleared} payments cleared on time.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Metric
            icon={<ShieldCheck className="h-4 w-4" />}
            label="Recovered before due date"
            value={data.recoveredAed}
            hint={`${data.recoveredCount} payment${data.recoveredCount === 1 ? "" : "s"}`}
          />
          <Metric
            icon={<Clock className="h-4 w-4" />}
            label="Time saved chasing rent"
            value={`${data.hoursSaved} hrs`}
            hint="vs. manual cheques"
          />
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
          <h3 className="font-display text-lg text-foreground">Payment mix</h3>
          <ul className="mt-4 space-y-3">
            <Bar label="Auto bank pull" pct={data.mix.auto} tone="bg-accent" />
            <Bar label="Ziina payment link" pct={data.mix.ziina} tone="bg-info" />
            <Bar label="Manual cheque" pct={data.mix.manual} tone="bg-warning" />
          </ul>
        </div>

        <div className="rounded-2xl border border-accent/20 bg-accent/5 p-5">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-accent">
            <TrendingUp className="h-3.5 w-3.5" />
            Suggested next step
          </div>
          <p className="mt-2 font-semibold text-foreground">
            Invite remaining tenants to connect bank once
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {data.manualUnitsLeft} units still on manual link — connecting saves ~{data.hoursSavedPerQuarter} hours/quarter.
          </p>
          <Link
            to="/tenant-preview"
            className="mt-4 flex items-center justify-between rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-accent-foreground"
          >
            Send invites
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </PhoneFrame>
  );
}

function Metric({
  icon,
  label,
  value,
  hint,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-soft)]">
      <div className="grid h-8 w-8 place-items-center rounded-full bg-accent/10 text-accent">
        {icon}
      </div>
      <p className="mt-3 font-display text-2xl text-foreground">{value}</p>
      <p className="text-xs font-medium text-foreground">{label}</p>
      <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>
    </div>
  );
}

function Bar({ label, pct, tone }: { label: string; pct: number; tone: string }) {
  return (
    <li>
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="font-medium text-foreground">{label}</span>
        <span className="text-muted-foreground">{pct}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div className={`h-full rounded-full ${tone}`} style={{ width: `${pct}%` }} />
      </div>
    </li>
  );
}