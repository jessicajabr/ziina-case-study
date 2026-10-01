import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { PhoneFrame, ScreenHeader } from "@/components/PhoneFrame";
import { AED } from "@/lib/format";
import { AlertTriangle, MessageCircle, LinkIcon, Phone, Check } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/at-risk")({
  component: AtRisk,
});

function AtRisk() {
  const navigate = useNavigate();
  return (
    <PhoneFrame>
      <ScreenHeader
        title="Payment at risk"
        subtitle="Marina Studio 1208 · Omar Haddad"
        back={{ to: "/", label: "Dashboard" }}
      />

      <div className="space-y-4 px-5 pt-5">
        <div className="rounded-2xl border border-danger/30 bg-danger/5 p-5">
          <div className="flex items-center gap-2 text-danger">
            <AlertTriangle className="h-5 w-5" />
            <span className="text-xs font-semibold uppercase tracking-widest">
              Action needed
            </span>
          </div>
          <p className="mt-2 font-display text-2xl text-foreground">{AED(30000)}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Tenant has not completed bank authorization. Rent is due in{" "}
            <span className="font-medium text-foreground">3 days</span>.
          </p>
        </div>

        <div className="rounded-2xl border border-accent/30 bg-accent/5 p-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-accent">
            Recommended
          </p>
          <p className="mt-2 font-semibold text-foreground">
            Send a Ziina payment link now
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Omar can pay in one tap from WhatsApp. Settles in 1–2 days.
          </p>
          <button
            onClick={() => {
              toast.success("Payment link sent to Omar");
              setTimeout(() => navigate({ to: "/recovery-success" }), 700);
            }}
            className="mt-4 w-full rounded-xl bg-accent py-3 text-sm font-semibold text-accent-foreground"
          >
            Send Ziina payment link
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <ActionBtn
            icon={<MessageCircle className="h-4 w-4" />}
            label="WhatsApp reminder"
            onClick={() => toast("Reminder sent on WhatsApp")}
          />
          <ActionBtn
            icon={<LinkIcon className="h-4 w-4" />}
            label="Copy payment link"
            onClick={() => toast("Link copied")}
          />
          <ActionBtn
            icon={<Phone className="h-4 w-4" />}
            label="Call tenant"
            onClick={() => toast("Calling Omar…")}
          />
          <ActionBtn
            icon={<Check className="h-4 w-4" />}
            label="Mark resolved"
            onClick={() => {
              toast.success("Marked as resolved");
              navigate({ to: "/" });
            }}
          />
        </div>

        <Link
          to="/unit/$id"
          params={{ id: "33333333-3333-3333-3333-333333333301" }}
          className="block rounded-2xl border border-border bg-card px-4 py-3 text-center text-sm text-muted-foreground"
        >
          View unit details
        </Link>
      </div>
    </PhoneFrame>
  );
}

function ActionBtn({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center gap-2 rounded-2xl border border-border bg-card px-3 py-3 text-sm font-medium text-foreground transition hover:border-accent"
    >
      {icon}
      {label}
    </button>
  );
}