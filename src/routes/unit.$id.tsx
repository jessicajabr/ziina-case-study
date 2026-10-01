import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PhoneFrame, ScreenHeader } from "@/components/PhoneFrame";
import { StatusChip, type RentStatus } from "@/components/StatusChip";
import { AED, formatDate, daysUntil } from "@/lib/format";
import { Check, Clock, ArrowRight, Building2 } from "lucide-react";

export const Route = createFileRoute("/unit/$id")({
  component: UnitDetail,
});

function UnitDetail() {
  const { id } = Route.useParams();
  const { data } = useQuery({
    queryKey: ["unit", id],
    queryFn: async () => {
      const { data: prop } = await supabase
        .from("properties")
        .select("id,name,area,annual_rent_aed,status,tenant:tenants(name,phone)")
        .eq("id", id)
        .single();
      const { data: payments } = await supabase
        .from("rent_payments")
        .select("id,due_date,amount_aed,status")
        .eq("property_id", id)
        .order("due_date");
      return { prop, payments: payments ?? [] };
    },
  });

  const prop = data?.prop as unknown as
    | {
        id: string;
        name: string;
        area: string | null;
        annual_rent_aed: number;
        status: RentStatus;
        tenant: { name: string; phone: string | null } | null;
      }
    | undefined;
  const payments = (data?.payments ?? []) as Array<{
    id: string;
    due_date: string;
    amount_aed: number;
    status: RentStatus;
  }>;
  const next = payments.find((p) => p.status !== "paid") ?? payments[0];
  const days = next ? daysUntil(next.due_date) : null;

  const timeline = [
    { label: "Lease created", state: "done" as const },
    { label: "Tenant invited", state: "done" as const },
    {
      label: "Bank authorization",
      state: (prop?.status === "at_risk" ? "pending" : "done") as "done" | "pending",
    },
    { label: "Payment scheduled", state: "done" as const },
  ];

  return (
    <PhoneFrame>
      <ScreenHeader
        title={prop?.name ?? "Unit"}
        subtitle={prop?.area ?? ""}
        back={{ to: "/", label: "Dashboard" }}
        right={prop && <StatusChip status={prop.status} />}
      />

      <div className="space-y-4 px-5 pt-5">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-full bg-secondary text-primary">
              <Building2 className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Tenant</p>
              <p className="truncate font-semibold text-foreground">
                {prop?.tenant?.name ?? "—"}
              </p>
            </div>
          </div>
          <dl className="mt-5 grid grid-cols-2 gap-4 border-t border-border pt-4 text-sm">
            <div>
              <dt className="text-xs text-muted-foreground">Lease</dt>
              <dd className="mt-0.5 font-medium">{AED(prop?.annual_rent_aed ?? 0)}/yr</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Payment plan</dt>
              <dd className="mt-0.5 font-medium">
                {payments.length} × {AED(payments[0]?.amount_aed ?? 0)}
              </dd>
            </div>
          </dl>
        </div>

        {next && (
          <div
            className="rounded-2xl p-5 text-primary-foreground shadow-[var(--shadow-card)]"
            style={{ background: "var(--gradient-hero)" }}
          >
            <p className="text-xs uppercase tracking-widest text-primary-foreground/70">
              Next payment
            </p>
            <p className="mt-1 font-display text-3xl">{AED(next.amount_aed)}</p>
            <p className="mt-1 text-sm text-primary-foreground/80">
              Due {formatDate(next.due_date)}
              {days !== null && ` · in ${days} days`}
            </p>
            {prop?.status === "at_risk" && (
              <Link
                to="/at-risk"
                className="mt-4 flex items-center justify-between rounded-xl bg-white/10 px-4 py-3 text-sm font-medium backdrop-blur"
              >
                Review at-risk payment
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>
        )}

        <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
          <h3 className="font-display text-lg text-foreground">Timeline</h3>
          <ol className="mt-4 space-y-4">
            {timeline.map((t, i) => (
              <li key={i} className="flex items-start gap-3">
                <span
                  className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full ${
                    t.state === "done"
                      ? "bg-accent text-accent-foreground"
                      : "bg-warning/20 text-warning-foreground"
                  }`}
                >
                  {t.state === "done" ? (
                    <Check className="h-3.5 w-3.5" />
                  ) : (
                    <Clock className="h-3.5 w-3.5" />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground">{t.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {t.state === "done" ? "Completed" : "Pending"}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
          <h3 className="font-display text-lg text-foreground">Payment schedule</h3>
          <ul className="mt-3 divide-y divide-border">
            {payments.map((p) => (
              <li key={p.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 py-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium">{formatDate(p.due_date)}</p>
                  <p className="text-xs text-muted-foreground">{AED(p.amount_aed)}</p>
                </div>
                <StatusChip status={p.status} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </PhoneFrame>
  );
}