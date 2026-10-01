import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PhoneFrame } from "@/components/PhoneFrame";
import { StatusChip, type RentStatus } from "@/components/StatusChip";
import { AED } from "@/lib/format";
import { ArrowRight, Plus, Eye } from "lucide-react";
import ziinaLogo from "@/assets/ziina_logo.png.asset.json";

export const Route = createFileRoute("/")({
  component: Dashboard,
});

type Row = {
  id: string;
  name: string;
  area: string | null;
  annual_rent_aed: number;
  status: RentStatus;
  tenant: { name: string } | null;
};

function Dashboard() {
  const { data: units = [], isLoading } = useQuery({
    queryKey: ["dashboard-units"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("properties")
        .select("id,name,area,annual_rent_aed,status,tenant:tenants(name)")
        .order("created_at");
      if (error) throw error;
      return (data ?? []) as unknown as Row[];
    },
  });

  const monthlyExpected = 186000;
  const onTrack = units.filter((u) => u.status === "on_track" || u.status === "paid").length;
  const dueSoon = units.filter((u) => u.status === "due_soon").length;
  const atRisk = units.filter((u) => u.status === "at_risk").length;

  return (
    <PhoneFrame>
      <div className="px-5 pt-8">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <img
                src={ziinaLogo.url}
                alt="Ziina"
                className="h-7 w-auto"
              />
              <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                Rent Shield
              </span>
            </div>
            <h1 className="mt-2 font-display text-3xl leading-tight text-foreground">
              Good morning, Sara
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Here's how your July rent is tracking.
            </p>
          </div>
          <Link
            to="/tenant-preview"
            className="mt-1 flex items-center gap-1.5 rounded-[0.125rem] rounded-xl border border-border bg-card px-3 py-2 text-xs font-medium text-foreground shadow-[var(--shadow-soft)] transition hover:border-accent"
          >
            <Eye className="h-3.5 w-3.5 text-muted-foreground" />
            Preview
          </Link>
        </div>

        <div
          className="mt-6 rounded-3xl p-5 text-primary-foreground shadow-[var(--shadow-card)]"
          style={{ background: "var(--gradient-hero)" }}
        >
          <p className="text-xs uppercase tracking-widest text-primary-foreground/70">
            Expected this month
          </p>
          <p className="mt-1 font-display text-4xl">{AED(monthlyExpected)}</p>
          <p className="mt-2 text-sm text-primary-foreground/80">
            Across {units.length || 12} units
          </p>
          <div className="mt-5 grid grid-cols-3 gap-2 border-t border-white/10 pt-4">
            <Stat label="On track" value={onTrack || 9} tone="text-emerald-300" />
            <Stat label="Due soon" value={dueSoon || 2} tone="text-amber-300" />
            <Stat label="At risk" value={atRisk || 1} tone="text-rose-300" />
          </div>
        </div>

        <Link
          to="/add-schedule"
          className="mt-4 flex items-center justify-between rounded-2xl border border-border bg-card px-4 py-3 text-sm font-medium text-foreground shadow-[var(--shadow-soft)] transition hover:border-accent"
        >
          <span className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-accent text-accent-foreground">
              <Plus className="h-4 w-4" />
            </span>
            Add rent schedule
          </span>
          <ArrowRight className="h-4 w-4 text-muted-foreground" />
        </Link>
      </div>

      <section className="mt-8 px-5">
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="font-display text-xl text-foreground">Units</h2>
          <span className="text-xs text-muted-foreground">{units.length} total</span>
        </div>
        <ul className="space-y-2">
          {isLoading &&
            Array.from({ length: 5 }).map((_, i) => (
              <li key={i} className="h-20 animate-pulse rounded-2xl bg-muted" />
            ))}
          {units.map((u) => (
            <li key={u.id}>
              <Link
                to="/unit/$id"
                params={{ id: u.id }}
                className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3.5 shadow-[var(--shadow-soft)] transition hover:border-accent/50"
              >
                <div className="min-w-0">
                  <p className="truncate font-semibold text-foreground">{u.name}</p>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">
                    {u.tenant?.name ?? "No tenant"} · {u.area}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <StatusChip status={u.status} />
                  <span className="text-xs text-muted-foreground">
                    {AED(u.annual_rent_aed)}/yr
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </PhoneFrame>
  );
}

function Stat({ label, value, tone }: { label: string; value: number; tone: string }) {
  return (
    <div>
      <p className={`font-display text-2xl ${tone}`}>{value}</p>
      <p className="text-xs text-primary-foreground/70">{label}</p>
    </div>
  );
}