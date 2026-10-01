import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { PhoneFrame, ScreenHeader } from "@/components/PhoneFrame";
import { AED } from "@/lib/format";
import { toast } from "sonner";

export const Route = createFileRoute("/add-schedule")({
  component: AddSchedule,
});

function AddSchedule() {
  const navigate = useNavigate();
  const [property, setProperty] = useState("Marina Studio 1208");
  const [tenant, setTenant] = useState("Omar Haddad");
  const [rent, setRent] = useState(120000);
  const [count, setCount] = useState(4);
  const [firstDue, setFirstDue] = useState("2026-07-05");
  const [askBank, setAskBank] = useState(true);
  const [allowZiina, setAllowZiina] = useState(true);

  const perPayment = Math.round(rent / count);

  return (
    <PhoneFrame>
      <ScreenHeader
        title="New rent schedule"
        subtitle="Set up a unit in under a minute"
        back={{ to: "/", label: "Dashboard" }}
      />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          toast.success("Schedule created", { description: `${count} payments of ${AED(perPayment)}` });
          navigate({ to: "/tenant-preview" });
        }}
        className="space-y-5 px-5 pt-5"
      >
        <Field label="Property name">
          <input
            className="input"
            value={property}
            onChange={(e) => setProperty(e.target.value)}
          />
        </Field>

        <Field label="Tenant name">
          <input
            className="input"
            value={tenant}
            onChange={(e) => setTenant(e.target.value)}
          />
        </Field>

        <Field label="Annual rent (AED)">
          <input
            className="input"
            type="number"
            value={rent}
            onChange={(e) => setRent(Number(e.target.value))}
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Payments">
            <input
              className="input"
              type="number"
              min={1}
              max={12}
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
            />
          </Field>
          <Field label="First due date">
            <input
              className="input"
              type="date"
              value={firstDue}
              onChange={(e) => setFirstDue(e.target.value)}
            />
          </Field>
        </div>

        <div className="rounded-2xl border border-accent/20 bg-accent/5 p-4">
          <p className="text-xs uppercase tracking-widest text-accent">Payment plan</p>
          <p className="mt-1 font-display text-2xl text-foreground">
            {count} × {AED(perPayment)}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Ziina will remind {tenant.split(" ")[0]} before each due date.
          </p>
        </div>

        <Toggle
          label="Ask tenant to connect bank once"
          hint="Auto-collect on due dates. Recommended."
          checked={askBank}
          onChange={setAskBank}
        />
        <Toggle
          label="Allow fallback Ziina payment link"
          hint="If bank auth fails, send a link on the day."
          checked={allowZiina}
          onChange={setAllowZiina}
        />

        <button
          type="submit"
          className="w-full rounded-2xl bg-primary py-4 font-semibold text-primary-foreground shadow-[var(--shadow-card)] transition hover:opacity-90"
        >
          Create schedule
        </button>
      </form>

      <style>{`
        .input {
          width: 100%;
          border-radius: 0.875rem;
          border: 1px solid var(--border);
          background: var(--card);
          padding: 0.75rem 1rem;
          font-size: 0.95rem;
          color: var(--foreground);
          outline: none;
        }
        .input:focus {
          border-color: var(--accent);
          box-shadow: 0 0 0 3px color-mix(in oklab, var(--accent) 15%, transparent);
        }
      `}</style>
    </PhoneFrame>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}

function Toggle({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-2xl border border-border bg-card p-4 text-left"
    >
      <div className="min-w-0">
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>
      </div>
      <span
        className={`relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors ${
          checked ? "bg-accent" : "bg-muted"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
            checked ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
      </span>
    </button>
  );
}