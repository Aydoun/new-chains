import { Frame } from "@/app/types";
import { EllipsisVertical, Heart, Info } from "lucide-react";

interface Props {
  frame: Frame;
}

export function SnippetCard({ frame }: Props) {
  return (
    <div className="flex items-center bg-frame-primary border border-slate-200 dark:border-border-dark p-6 rounded shadow-sm group mb-4">
      <div className="mr-4">
        <Info className="text-gray-400" />
      </div>
      <div className="flex-grow text-center">
        <h2 className="font-display text-2xl text-gray-800 lg:text-3xl">
          {frame.content}
        </h2>
        <p className=" mt-2 text-sm text-amber-700 tracking-wider font-medium">
          {frame.description}
        </p>
      </div>
      <div className="ml-4 flex flex-col items-center space-y-4">
        <button>
          <Heart fill="red" className="text-primary-main" />
        </button>
        <button>
          <EllipsisVertical className="text-black" />
        </button>
      </div>
    </div>
  );
}
