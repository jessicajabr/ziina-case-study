import { Link, useRouterState } from "@tanstack/react-router";
import { Home, PieChart, Plus, Bell } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Home", icon: Home },
  { to: "/insights", label: "Insights", icon: PieChart },
  { to: "/add-schedule", label: "New", icon: Plus },
  { to: "/at-risk", label: "Alerts", icon: Bell },
] as const;

export function PhoneFrame({ children, hideNav = false }: { children: ReactNode; hideNav?: boolean }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="min-h-screen bg-secondary/50">
      <div className="mx-auto flex min-h-screen max-w-md flex-col bg-background shadow-[var(--shadow-card)]">
        <div className={cn("flex-1", !hideNav && "pb-24")}>{children}</div>
        {!hideNav && (
          <nav className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-md border-t border-border bg-background/95 backdrop-blur">
            <ul className="grid grid-cols-4">
              {NAV.map(({ to, label, icon: Icon }) => {
                const active =
                  to === "/" ? pathname === "/" : pathname.startsWith(to);
                return (
                  <li key={to}>
                    <Link
                      to={to}
                      className={cn(
                        "flex flex-col items-center gap-1 py-3 text-[11px] font-medium transition-colors",
                        active ? "text-accent" : "text-muted-foreground",
                      )}
                    >
                      <Icon className="h-5 w-5" strokeWidth={active ? 2.5 : 1.75} />
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        )}
      </div>
    </div>
  );
}

export function ScreenHeader({
  title,
  subtitle,
  right,
  back,
}: {
  title: string;
  subtitle?: string;
  right?: ReactNode;
  back?: { to: string; label?: string };
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/90 px-5 py-4 backdrop-blur">
      {back && (
        <Link
          to={back.to}
          className="mb-1 inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
        >
          ← {back.label ?? "Back"}
        </Link>
      )}
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
        <div className="min-w-0">
          <h1 className="truncate font-display text-2xl leading-tight text-foreground">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-0.5 truncate text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
        {right}
      </div>
    </header>
  );
}