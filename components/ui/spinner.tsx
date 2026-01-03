import { cn } from "@/lib/utils";

export function DataLoader({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "fixed inset-0 grid left-1/2 top-1/2 -translate-x-6 -translate-y-16 md:translate-x-28 md:-translate-y-20",
        className
      )}
    >
      <div
        className="
          relative h-16 w-16 rounded-full
          bg-[conic-gradient(from_0deg,#7c7cff,#a855f7,#ec4899,#7c7cff)]
          animate-spin
          drop-shadow-[0_0_12px_rgba(168,85,247,0.7)]
        "
      >
        <div className="absolute inset-[6px] rounded-full bg-[#0b0b0f]" />
      </div>
    </div>
  );
}

export function SessionLoader() {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[#0b0b0f]">
      <div
        className="
          relative h-16 w-16 rounded-full
          bg-[conic-gradient(from_0deg,#7c7cff,#a855f7,#ec4899,#7c7cff)]
          animate-spin
          drop-shadow-[0_0_12px_rgba(168,85,247,0.7)]
        "
      >
        <div className="absolute inset-[6px] rounded-full bg-[#0b0b0f]" />
      </div>
    </div>
  );
}
