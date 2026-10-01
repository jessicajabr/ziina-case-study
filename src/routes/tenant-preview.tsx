import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PhoneFrame, ScreenHeader } from "@/components/PhoneFrame";
import { Shield, Landmark, Wallet, Lock, Check, ChevronRight } from "lucide-react";
import ziinaLogo from "@/assets/ziina_logo.png.asset.json";

export const Route = createFileRoute("/tenant-preview")({
  component: TenantPreview,
});

function TenantPreview() {
  const [selected, setSelected] = useState<"bank" | "manual" | null>("bank");
  const [sent, setSent] = useState(false);

  return (
    <PhoneFrame>
      <ScreenHeader
        title="Tenant preview"
        subtitle="What Omar receives on his phone"
        back={{ to: "/", label: "Back" }}
      />

      <div className="px-5 pt-5">
        {sent ? (
          <SentState onReset={() => setSent(false)} />
        ) : (
          <>
            <div className="rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
              <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
                <img src={ziinaLogo.url} alt="Ziina" className="h-3.5 w-auto" />
                Secure invite from Ziina
              </div>
              <h2 className="mt-4 font-display text-2xl leading-snug text-foreground">
                Sara invited you to set up secure rent payments for Marina Studio 1208.
              </h2>
              <p className="mt-3 text-sm text-muted-foreground">
                Choose how you'd like to pay each installment. You can change this
                anytime.
              </p>

              <div className="mt-6 space-y-3">
                <SelectableOption
                  selected={selected === "bank"}
                  onClick={() => setSelected("bank")}
                  icon={<Landmark className="h-5 w-5" />}
                  title="Connect bank once"
                  desc="Auto-pay on each due date. No reminders needed."
                  recommended
                />
                <SelectableOption
                  selected={selected === "manual"}
                  onClick={() => setSelected("manual")}
                  icon={<Wallet className="h-5 w-5" />}
                  title="Pay manually each due date"
                  desc="Ziina sends you a payment link 3 days before."
                />
              </div>

              <div className="mt-6 flex items-start gap-3 rounded-2xl bg-secondary/70 p-4 text-sm text-muted-foreground">
                <Lock className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <p>
                  <span className="font-medium text-foreground">You stay in control.</span>{" "}
                  Ziina reminds you before each payment. Cancel anytime from your
                  wallet.
                </p>
              </div>
            </div>

            <button
              onClick={() => setSent(true)}
              className="mt-5 block w-full rounded-2xl bg-primary py-4 text-center font-semibold text-primary-foreground shadow-[var(--shadow-card)] active:scale-[0.98] transition"
            >
              Send invite to tenant
            </button>
          </>
        )}
      </div>
    </PhoneFrame>
  );
}

function SentState({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex flex-col items-center rounded-3xl border border-border bg-card p-8 text-center shadow-[var(--shadow-card)]">
      <div className="grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-emerald-600">
        <Check className="h-7 w-7" />
      </div>
      <h2 className="mt-5 font-display text-2xl text-foreground">Invite sent</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Omar will receive a secure link to choose his payment preference for
        Marina Studio 1208.
      </p>
      <div className="mt-6 w-full space-y-2">
        <button
          onClick={onReset}
          className="block w-full rounded-2xl border border-border bg-card py-3 text-sm font-medium text-foreground transition hover:border-accent"
        >
          Preview again
        </button>
        <Link
          to="/"
          className="block w-full rounded-2xl bg-primary py-3 text-sm font-semibold text-primary-foreground"
        >
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}

function SelectableOption({
  selected,
  onClick,
  icon,
  title,
  desc,
  recommended,
}: {
  selected: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  desc: string;
  recommended?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-2xl border p-4 text-left transition active:scale-[0.98] ${
        selected
          ? "border-accent bg-accent/5 ring-1 ring-accent"
          : "border-border bg-background hover:border-accent/30"
      }`}
    >
      <div className="grid h-10 w-10 place-items-center rounded-xl bg-accent/10 text-accent">
        {icon}
      </div>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-semibold text-foreground">{title}</p>
          {recommended && (
            <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-accent-foreground">
              Recommended
            </span>
          )}
        </div>
        <p className="mt-0.5 text-xs text-muted-foreground">{desc}</p>
      </div>
      <div
        className={`grid h-6 w-6 place-items-center rounded-full border-2 transition ${
          selected
            ? "border-accent bg-accent text-accent-foreground"
            : "border-muted-foreground/30"
        }`}
      >
        {selected && <Check className="h-3.5 w-3.5" />}
      </div>
    </button>
  );
}