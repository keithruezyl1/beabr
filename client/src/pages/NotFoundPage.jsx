import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button.jsx";
import sweating from "../assets/sweating.png";

export function NotFoundPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-[var(--surface-page)] px-6 py-10">
      <main className="flex w-full max-w-md flex-col items-center text-center">
        <h1 className="text-2xl font-extrabold tracking-tight text-[var(--text-primary)] sm:text-3xl">
          This page wandered off
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)] sm:text-base">
          We couldn’t find what you’re looking for.
        </p>
        <div className="relative isolate mt-8 flex w-full max-w-[280px] justify-center sm:max-w-[320px]">
          <span
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2 select-none whitespace-nowrap font-['Rubik_Mono_One',ui-monospace,monospace] text-[clamp(7.25rem,min(34vw,16rem),21.25rem)] font-normal leading-none tracking-[0.05em] text-[#344516] opacity-[0.65] sm:text-[clamp(8.25rem,min(31vw,17.75rem),24rem)]"
          >
            404
          </span>
          <img
            src={sweating}
            alt="Beabr mascot looking worried because this page can’t be found"
            className="relative z-10 w-full select-none"
            draggable={false}
          />
        </div>
        <Link to="/dashboard" className="mt-8 w-full max-w-xs">
          <Button className="w-full px-8 py-4">Go back to home</Button>
        </Link>
      </main>
    </div>
  );
}
