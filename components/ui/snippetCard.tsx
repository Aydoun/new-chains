import { Snippet } from "@/app/types";
import clsx from "clsx";

type Props = {
  snippet: Snippet;
  isDisabled?: boolean;
};

export function SnippetCard({ snippet, isDisabled = false }: Props) {
  const isMedia = snippet.type === "IMAGE" || snippet.type === "VIDEO";
  const hasDescription = Boolean(snippet.frame.description || snippet.notes);
  const subtitle = snippet.frame.description ?? snippet.notes ?? snippet.type;

  return (
    <div
      className={clsx(
        "frame-card flex items-center bg-card-dark border border-border-dark p-6 rounded shadow-lg group",
        isDisabled && "opacity-40 select-none grayscale"
      )}
    >
      <div className="drag-handle mr-6 text-slate-600 group-hover:text-slate-400 transition-colors">
        <span className="material-symbols-outlined">drag_indicator</span>
      </div>
      {isMedia ? (
        <div className="flex-grow flex items-center space-x-6">
          <div className="relative w-40 h-24 flex-shrink-0 bg-black rounded-lg overflow-hidden border border-border-dark">
            <img
              alt={snippet.frame.content}
              className="w-full h-full object-cover opacity-70"
              src={snippet.frame.content}
            />
            {snippet.type === "VIDEO" && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-primary/90 text-black rounded-full p-2">
                  <span className="material-symbols-outlined text-xl">
                    play_arrow
                  </span>
                </div>
              </div>
            )}
          </div>
          <div className="text-left">
            <h2 className="font-display text-2xl text-slate-100">
              {snippet.frame.content}
            </h2>
            {hasDescription && (
              <p className="text-primary mt-1 text-sm uppercase tracking-wider font-medium">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="flex-grow text-center">
          <h2 className="font-display text-2xl lg:text-3xl text-slate-100">
            {snippet.frame.content}
          </h2>
          {hasDescription && (
            <p className="text-primary mt-2 text-sm uppercase tracking-wider font-medium">
              {subtitle}
            </p>
          )}
        </div>
      )}
      <div className="ml-6 flex items-center">
        <button className="text-slate-400 hover:text-white transition-colors">
          <span className="material-symbols-outlined">more_vert</span>
        </button>
      </div>
    </div>
  );
}
