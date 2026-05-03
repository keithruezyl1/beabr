import { useLocation } from "react-router-dom";
import { Card } from "./Card.jsx";
import { Skeleton } from "./Skeleton.jsx";

function ShimmerCard({ className = "", children }) {
  return (
    <Card className={`overflow-hidden ${className}`}>
      {children}
    </Card>
  );
}

/** Auth gate: pick a layout that matches the destination route. */
export function AuthRouteSkeleton() {
  const { pathname } = useLocation();

  if (pathname === "/login") return <LoginScreenSkeleton />;
  if (pathname === "/registries/new") return <CreateRegistryScreenSkeleton />;
  if (pathname.startsWith("/registry/join")) return <JoinRegistryScreenSkeleton />;
  if (/\/registry\/[^/]+\/reveal$/.test(pathname)) return <RevealScreenSkeleton />;
  if (pathname.startsWith("/registry/")) return <RegistryScreenSkeleton />;
  if (pathname === "/notifications") return <NotificationsScreenSkeleton />;
  if (pathname === "/settings") return <SettingsScreenSkeleton />;
  return <DashboardScreenSkeleton />;
}

export function LoginScreenSkeleton() {
  return (
    <div className="flex min-h-[60vh] w-full items-center justify-center p-5">
      <div className="w-full max-w-md space-y-4 text-center">
        <Skeleton className="mx-auto h-8 w-64 max-w-full rounded-[14px]" />
        <ShimmerCard className="p-5">
          <div className="space-y-3 text-left">
            <div>
              <Skeleton className="h-3 w-12 rounded-md" delayMs={0} />
              <Skeleton className="mt-1 h-11 w-full rounded-[14px]" delayMs={40} />
            </div>
            <Skeleton className="h-11 w-full rounded-[999px]" delayMs={80} />
            <div className="flex items-center gap-3 py-1">
              <Skeleton className="h-px flex-1 rounded-none" delayMs={100} />
              <Skeleton className="h-3 w-8 rounded-md" delayMs={120} />
              <Skeleton className="h-px flex-1 rounded-none" delayMs={100} />
            </div>
            <Skeleton className="h-11 w-full rounded-[999px]" delayMs={140} />
          </div>
        </ShimmerCard>
      </div>
    </div>
  );
}

export function DashboardScreenSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-3 md:flex-row md:items-center">
        <div className="space-y-2">
          <Skeleton className="h-4 w-20 rounded-md" />
          <Skeleton className="h-8 w-56 max-w-full rounded-[14px]" delayMs={40} />
        </div>
        <div className="flex w-full gap-2 md:w-auto">
          <Skeleton className="h-11 flex-1 rounded-[999px] md:w-40 md:flex-none" delayMs={60} />
          <Skeleton className="h-11 flex-1 rounded-[999px] md:w-40 md:flex-none" delayMs={90} />
        </div>
      </div>
      <DashboardRegistriesSkeleton />
    </div>
  );
}

/** Inline: registry lists while /api/registries loads (header/actions stay real). */
export function DashboardRegistriesSkeleton() {
  return (
    <>
      <div className="space-y-3">
        <Skeleton className="h-4 w-36 rounded-md" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {[0, 1, 2].map((i) => (
            <ShimmerCard key={i} className="h-full p-4 sm:p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1 space-y-2">
                  <Skeleton className="h-6 w-[85%] rounded-md" delayMs={i * 50} />
                  <Skeleton className="h-4 w-2/3 rounded-md" delayMs={i * 50 + 20} />
                  <Skeleton className="h-4 w-2/5 rounded-md" delayMs={i * 50 + 35} />
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Skeleton className="h-7 w-20 rounded-full" delayMs={i * 50 + 30} />
                  <Skeleton className="h-5 w-5 rounded-sm" delayMs={i * 50 + 28} />
                </div>
              </div>
              <div className="mt-4 grid grid-cols-1 items-stretch gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(9rem,12.5rem)]">
                <Skeleton className="h-[4.75rem] w-full rounded-[var(--radius-md)]" delayMs={i * 50 + 45} />
                <Skeleton className="h-[4.75rem] w-full rounded-[var(--radius-md)]" delayMs={i * 50 + 55} />
              </div>
            </ShimmerCard>
          ))}
        </div>
      </div>
      <div className="space-y-3">
        <Skeleton className="h-4 w-40 rounded-md" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {[0, 1].map((i) => (
            <ShimmerCard key={i} className="h-full p-4 sm:p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1 space-y-2">
                  <Skeleton className="h-6 w-[80%] rounded-md" delayMs={i * 50 + 80} />
                  <Skeleton className="h-4 w-1/2 rounded-md" delayMs={i * 50 + 100} />
                  <Skeleton className="h-4 w-[45%] rounded-md" delayMs={i * 50 + 115} />
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Skeleton className="h-7 w-[4.5rem] rounded-full" delayMs={i * 50 + 110} />
                  <Skeleton className="h-5 w-5 rounded-sm" delayMs={i * 50 + 108} />
                </div>
              </div>
              <div className="mt-4 grid grid-cols-1 items-stretch gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(9rem,12.5rem)]">
                <Skeleton className="h-[4.75rem] w-full rounded-[var(--radius-md)]" delayMs={i * 50 + 125} />
                <Skeleton className="h-[4.75rem] w-full rounded-[var(--radius-md)]" delayMs={i * 50 + 135} />
              </div>
            </ShimmerCard>
          ))}
        </div>
      </div>
    </>
  );
}

export function CreateRegistryScreenSkeleton() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Skeleton className="h-8 w-56 rounded-[14px]" />
        <Skeleton className="h-4 w-full max-w-md rounded-md" delayMs={40} />
      </div>
      <ShimmerCard className="p-5">
        <div className="space-y-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i}>
              <Skeleton className="h-3 w-24 rounded-md" delayMs={i * 45} />
              <Skeleton className="mt-1 h-11 w-full rounded-[14px]" delayMs={i * 45 + 15} />
            </div>
          ))}
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div>
              <Skeleton className="h-3 w-32 rounded-md" />
              <Skeleton className="mt-1 h-11 w-full rounded-[14px]" delayMs={30} />
            </div>
            <div>
              <Skeleton className="h-3 w-36 rounded-md" />
              <Skeleton className="mt-1 h-11 w-full rounded-[14px]" delayMs={50} />
            </div>
          </div>
          <Skeleton className="h-12 w-full rounded-[999px]" delayMs={180} />
        </div>
      </ShimmerCard>
    </div>
  );
}

export function JoinRegistryScreenSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-48 rounded-[14px]" />
      <ShimmerCard className="p-5">
        <div className="space-y-3">
          <div>
            <Skeleton className="h-3 w-16 rounded-md" />
            <Skeleton className="mt-1 h-11 w-full rounded-[14px]" delayMs={30} />
          </div>
          <Skeleton className="h-12 w-full rounded-[999px]" delayMs={70} />
        </div>
      </ShimmerCard>
    </div>
  );
}

export function RegistryScreenSkeleton() {
  return (
    <div className="space-y-6">
      <ShimmerCard className="p-6">
        <div className="flex flex-col items-start justify-between gap-3 md:flex-row md:items-center">
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-8 w-3/4 max-w-md rounded-[14px]" />
            <Skeleton className="h-4 w-40 rounded-md" delayMs={40} />
          </div>
          <div className="flex w-full gap-2 md:w-auto">
            <Skeleton className="h-11 flex-1 rounded-[999px] md:w-28 md:flex-none" delayMs={60} />
            <Skeleton className="h-11 flex-1 rounded-[999px] md:w-28 md:flex-none" delayMs={80} />
            <Skeleton className="h-11 flex-1 rounded-[999px] md:w-28 md:flex-none" delayMs={100} />
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <Skeleton className="h-3 w-full max-w-prose rounded-md" delayMs={50} />
          <Skeleton className="h-3 w-5/6 max-w-prose rounded-md" delayMs={70} />
        </div>
        <Skeleton className="mt-4 h-3 w-52 rounded-md" delayMs={90} />
      </ShimmerCard>

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-[12px]" />
            <Skeleton className="h-4 w-16 rounded-md" delayMs={20} />
          </div>
          <div className="flex w-[min(100%,26rem)] items-center justify-end gap-2">
            <Skeleton className="h-11 w-40 rounded-[14px]" delayMs={40} />
            <Skeleton className="h-11 w-40 rounded-[14px]" delayMs={60} />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {[0, 1, 2, 3].map((i) => (
            <ShimmerCard key={i} className="flex h-full flex-col overflow-hidden p-0">
              <div className="p-4">
                <div className="flex items-stretch gap-3">
                  <Skeleton className="h-[8.5rem] w-[8.5rem] shrink-0 rounded-[var(--radius-md)]" delayMs={i * 35} />
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1 space-y-1.5">
                        <Skeleton className="h-4 w-[82%] rounded-md" delayMs={i * 35 + 15} />
                        <Skeleton className="h-3 w-24 rounded-md" delayMs={i * 35 + 25} />
                      </div>
                      <Skeleton className="h-6 w-20 shrink-0 rounded-full" delayMs={i * 35 + 20} />
                    </div>
                    <Skeleton className="h-3 w-[70%] rounded-md" delayMs={i * 35 + 35} />
                    <Skeleton className="h-3 w-[55%] rounded-md" delayMs={i * 35 + 45} />
                    <Skeleton className="mt-2 h-10 w-full rounded-[14px]" delayMs={i * 35 + 55} />
                  </div>
                </div>
              </div>
              <div className="mt-auto border-t border-[var(--border-subtle)] bg-[var(--surface-card-soft)]/90 px-4 py-3">
                <Skeleton className="h-11 w-full rounded-[999px]" delayMs={i * 35 + 70} />
              </div>
            </ShimmerCard>
          ))}
        </div>
      </div>
    </div>
  );
}

export function RevealScreenSkeleton() {
  return (
    <div className="space-y-6">
      {/* PageHeader */}
      <div className="flex flex-col items-start justify-between gap-3 md:flex-row md:items-center">
        <div className="space-y-2">
          <Skeleton className="h-4 w-16 rounded-md" />
          <Skeleton className="h-9 w-48 max-w-full rounded-[14px]" delayMs={30} />
          <Skeleton className="h-4 w-full max-w-[34rem] rounded-md" delayMs={55} />
        </div>
        <Skeleton className="h-11 w-full rounded-[999px] md:w-44" delayMs={70} />
      </div>

      {/* Registry title card */}
      <div className="rounded-[var(--radius-xl)] border border-[var(--border-subtle)] bg-[var(--surface-card)] px-5 py-4 shadow-[var(--shadow-xs)] sm:px-6">
        <Skeleton className="h-3 w-20 rounded-md" />
        <Skeleton className="mt-2 h-6 w-3/4 max-w-xl rounded-[14px]" delayMs={40} />
      </div>

      {/* Pre-reveal card */}
      <ShimmerCard className="overflow-hidden p-0 shadow-[var(--shadow-md)] ring-1 ring-[var(--border-subtle)]">
        <div className="border-b border-[var(--border-subtle)] px-5 py-5 sm:px-6">
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-6 rounded-[10px]" />
            <Skeleton className="h-4 w-28 rounded-md" delayMs={20} />
          </div>
          <Skeleton className="mt-3 h-4 w-full max-w-[34rem] rounded-md" delayMs={40} />
        </div>
        <div className="space-y-5 p-5 sm:p-6">
          <div className="rounded-[20px] bg-[var(--surface-card-soft)] p-4 ring-1 ring-[var(--border-subtle)]">
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="rounded-2xl bg-[var(--surface-card)] px-2 py-4 text-center ring-1 ring-[var(--border-subtle)]">
                  <Skeleton className="mx-auto h-8 w-14 rounded-[14px]" delayMs={i * 35} />
                  <Skeleton className="mx-auto mt-2 h-3 w-16 rounded-md" delayMs={i * 35 + 15} />
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-3 rounded-[var(--radius-lg)] border border-[rgba(139,94,60,0.22)] bg-[var(--color-beaver-50)] p-4">
            <Skeleton className="h-11 w-11 shrink-0 rounded-[var(--radius-md)]" />
            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className="h-3 w-24 rounded-md" />
              <Skeleton className="h-5 w-56 max-w-full rounded-[14px]" delayMs={30} />
              <Skeleton className="h-4 w-40 rounded-md" delayMs={50} />
            </div>
          </div>
        </div>
      </ShimmerCard>
    </div>
  );
}

export function NotificationsScreenSkeleton() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Skeleton className="h-8 w-56 rounded-[14px]" />
        <Skeleton className="h-4 w-72 max-w-full rounded-md" delayMs={40} />
      </div>
      <div className="space-y-3">
        <Skeleton className="h-4 w-44 rounded-md" />
        {[0, 1].map((i) => (
          <ShimmerCard key={i} className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1 space-y-2">
                <Skeleton className="h-4 w-2/3 rounded-md" delayMs={i * 50} />
                <Skeleton className="h-3 w-1/2 rounded-md" delayMs={i * 50 + 20} />
              </div>
              <Skeleton className="h-6 w-14 shrink-0 rounded-full" delayMs={i * 50 + 10} />
            </div>
            <Skeleton className="mt-2 h-12 w-full rounded-[14px]" delayMs={i * 50 + 30} />
            <Skeleton className="mt-3 h-10 w-full rounded-[999px]" delayMs={i * 50 + 45} />
          </ShimmerCard>
        ))}
      </div>
      <div className="space-y-3">
        <Skeleton className="h-4 w-20 rounded-md" />
        {[0, 1, 2].map((i) => (
          <ShimmerCard key={i} className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1 space-y-2">
                <Skeleton className="h-4 w-4/5 rounded-md" delayMs={i * 45} />
                <Skeleton className="h-3 w-40 rounded-md" delayMs={i * 45 + 15} />
              </div>
              <Skeleton className="h-6 w-14 shrink-0 rounded-full" delayMs={i * 45 + 10} />
            </div>
            <div className="mt-3 flex gap-2">
              <Skeleton className="h-10 flex-1 rounded-[999px]" delayMs={i * 45 + 30} />
              <Skeleton className="h-10 flex-1 rounded-[999px]" delayMs={i * 45 + 40} />
            </div>
          </ShimmerCard>
        ))}
      </div>
    </div>
  );
}

export function SettingsScreenSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2">
          <Skeleton className="h-8 w-32 rounded-[14px]" />
          <Skeleton className="h-4 w-64 max-w-full rounded-md" delayMs={40} />
        </div>
        <Skeleton className="h-10 w-16 rounded-[999px]" delayMs={50} />
      </div>
      <ShimmerCard className="p-5">
        <div className="flex items-center gap-3">
          <Skeleton className="h-12 w-12 shrink-0 rounded-full" />
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-4 w-40 rounded-md" delayMs={30} />
            <Skeleton className="h-3 w-56 max-w-full rounded-md" delayMs={50} />
          </div>
        </div>
      </ShimmerCard>
    </div>
  );
}

/** Landing hero + preview while session is resolving. */
export function LandingScreenSkeleton() {
  return (
    <div className="fixed inset-0 w-screen overflow-y-auto md:overflow-hidden beabr-texture">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(900px_520px_at_20%_18%,rgba(129,160,63,0.08),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(820px_520px_at_82%_22%,rgba(139,94,60,0.06),transparent_58%)]" />
      </div>
      <div className="relative flex min-h-[100svh] w-full items-start px-5 py-10 md:h-full md:items-stretch md:px-12 md:py-0 xl:px-16">
        <div className="grid w-full grid-cols-1 items-start gap-8 md:grid-cols-12 md:items-center md:gap-12 xl:gap-16">
          <div className="relative md:col-span-5 lg:col-span-5 xl:col-span-5">
            <div className="flex items-center gap-4">
              <Skeleton className="h-14 w-14 shrink-0 rounded-[18px] lg:h-16 lg:w-16" />
              <div className="min-w-0 flex-1 space-y-2">
                <Skeleton className="h-7 w-28 rounded-[14px]" delayMs={40} />
                <Skeleton className="h-6 w-40 rounded-full" delayMs={60} />
              </div>
            </div>
            <div className="mt-7 space-y-3 md:mt-8">
              <Skeleton className="h-12 w-full max-w-[14ch] rounded-[14px]" delayMs={80} />
              <Skeleton className="h-12 w-full max-w-[12ch] rounded-[14px]" delayMs={100} />
              <Skeleton className="h-12 w-full max-w-[16ch] rounded-[14px]" delayMs={120} />
            </div>
            <Skeleton className="mt-4 h-16 w-full max-w-[50ch] rounded-[14px]" delayMs={140} />
            <Skeleton className="mt-9 h-12 w-full max-w-xs rounded-[999px] sm:w-64" delayMs={160} />
            <div className="mt-8 hidden grid-cols-3 gap-3 md:grid">
              {[0, 1, 2].map((i) => (
                <div key={i} className="rounded-[18px] border border-[var(--border-subtle)] bg-white/60 px-4 py-3 backdrop-blur">
                  <Skeleton className="h-3 w-24 rounded-md" delayMs={i * 35} />
                  <Skeleton className="mt-2 h-3 w-20 rounded-md" delayMs={i * 35 + 15} />
                </div>
              ))}
            </div>
          </div>
          <div className="relative md:col-span-7 lg:col-span-7 xl:col-span-7">
            <div className="relative mx-auto w-full max-w-[520px] px-0 py-6 sm:max-w-[640px] sm:px-6 sm:py-8 md:mx-0 md:ml-auto md:max-w-[760px] md:px-10 md:py-10">
              <ShimmerCard className="overflow-hidden p-0">
                <div className="border-b border-[var(--border-subtle)] px-5 py-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1 space-y-2">
                      <Skeleton className="h-4 w-40 rounded-md" />
                      <div className="flex gap-2">
                        <Skeleton className="h-6 w-28 rounded-full" delayMs={30} />
                        <Skeleton className="h-6 w-16 rounded-full" delayMs={50} />
                      </div>
                    </div>
                    <Skeleton className="hidden h-6 w-16 rounded-full sm:block" delayMs={40} />
                  </div>
                  <div className="mt-3 space-y-2">
                    <div className="flex justify-between">
                      <Skeleton className="h-3 w-28 rounded-md" />
                      <Skeleton className="h-3 w-12 rounded-md" delayMs={20} />
                    </div>
                    <Skeleton className="h-2 w-full rounded-full" delayMs={40} />
                  </div>
                </div>
                <div className="space-y-3 px-5 py-5">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between rounded-[18px] bg-[var(--surface-card-soft)] px-4 py-3"
                    >
                      <div className="min-w-0 flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/5 rounded-md" delayMs={i * 45} />
                        <Skeleton className="h-3 w-2/3 rounded-md" delayMs={i * 45 + 15} />
                      </div>
                      <Skeleton className="ml-3 h-6 w-20 shrink-0 rounded-full" delayMs={i * 45 + 25} />
                    </div>
                  ))}
                  <div className="flex items-center justify-between gap-2 rounded-[18px] border border-[var(--border-subtle)] px-4 py-3">
                    <Skeleton className="h-3 flex-1 rounded-md" />
                    <Skeleton className="h-6 w-16 shrink-0 rounded-full" delayMs={30} />
                  </div>
                </div>
              </ShimmerCard>
              <div className="mt-5 grid grid-cols-2 gap-3 md:hidden">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="rounded-[18px] border border-[rgba(185,196,170,0.22)] bg-[rgba(255,255,255,0.86)] px-4 py-3 shadow-[var(--shadow-xs)]"
                  >
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-7 w-7 shrink-0 rounded-full" delayMs={i * 30} />
                      <Skeleton className="h-4 flex-1 rounded-md" delayMs={i * 30 + 10} />
                    </div>
                    <Skeleton className="mt-2 h-3 w-full rounded-md" delayMs={i * 30 + 20} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
