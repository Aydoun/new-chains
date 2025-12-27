export const SequenceFrame: FC<SequenceFrameProps> = ({
  text,
  description,
}) => {
  return (
    <div
      className={cn(
        "relative w-full h-80 md:h-96 rounded-2xl bg-frame-bg-light dark:bg-frame-bg-dark border border-orange-100 dark:border-orange-900/30 shadow-inner flex items-center justify-center p-12 transition-colors duration-300 group overflow-hidden"
      )}
    >
      <blockquote className="relative z-10 max-w-2xl text-center">
        <p className="font-serif text-1xl md:text-2xl leading-tight">{text}</p>
      </blockquote>

      {description && (
        <p className="px-8 text-sm font-medium text-amber-100/80">
          {description}
        </p>
      )}
    </div>
  );
};
