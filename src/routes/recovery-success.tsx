import { createFileRoute, Link } from "@tanstack/react-router";
import { PhoneFrame, ScreenHeader } from "@/components/PhoneFrame";
import { StatusChip } from "@/components/StatusChip";
import { AED, formatDate } from "@/lib/format";
import { Check } from "lucide-react";

export const Route = createFileRoute("/recovery-success")({
  component: RecoverySuccess,
});

const TIMELINE = [
  { label: "Reminder sent", time: "1 July, 10:14" },
  { label: "Link opened", time: "1 July, 10:22" },
  { label: "Payment completed", time: "2 July, 08:47" },
  { label: "Settlement pending", time: "ETA 1–2 business days" },
];

function RecoverySuccess() {
  return (
    <PhoneFrame>
      <ScreenHeader
        title="Recovered"
        subtitle="Marina Studio 1208"
        back={{ to: "/", label: "Dashboard" }}
      />

      <div className="px-5 pt-5">
        <div
          className="rounded-3xl p-6 text-primary-foreground shadow-[var(--shadow-card)]"
          style={{ background: "var(--gradient-hero)" }}
        >
          <div className="grid h-12 w-12 place-items-center rounded-full bg-success text-success-foreground">
            <Check className="h-6 w-6" />
          </div>
          <p className="mt-4 text-xs uppercase tracking-widest text-primary-foreground/70">
            Recovered via Ziina payment link
          </p>
          <p className="mt-1 font-display text-4xl">{AED(30000)}</p>
          <p className="mt-2 text-sm text-primary-foreground/80">
            Received {formatDate("2026-07-02")} · from Omar Haddad
          </p>
          <div className="mt-4 inline-block">
            <StatusChip status="settlement_pending" />
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
          <h3 className="font-display text-lg text-foreground">Recovery timeline</h3>
          <ol className="mt-4 space-y-4">
            {TIMELINE.map((t, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-accent text-accent-foreground">
                  <Check className="h-3.5 w-3.5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground">{t.label}</p>
                  <p className="text-xs text-muted-foreground">{t.time}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-4 rounded-2xl border border-accent/20 bg-accent/5 p-4 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Nice work.</span> You
          recovered rent 3 days before due date. Consider inviting Omar to connect
          his bank so next quarter is automatic.
        </div>

        <Link
          to="/"
          className="mt-5 block rounded-2xl bg-primary py-4 text-center font-semibold text-primary-foreground shadow-[var(--shadow-card)]"
        >
          Back to dashboard
        </Link>
      </div>
    </PhoneFrame>
  );
}