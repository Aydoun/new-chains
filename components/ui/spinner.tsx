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
