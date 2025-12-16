"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "@radix-ui/react-dialog";
import { Input } from "./input";
import { Button } from "./button";
import { X } from "lucide-react";

interface Props {
  isDialogOpen: boolean;
  handleDialogChange: (open: boolean) => void;
}

export function CreateCollectionForm({
  isDialogOpen,
  handleDialogChange,
}: Props) {
  return (
    <Dialog open={isDialogOpen} onOpenChange={handleDialogChange}>
      <div className="fixed bottom-6 left-1/2 z-20 w-full max-w-3xl -translate-x-1/2 px-4">
        <div className="flex items-center gap-3 rounded-full border bg-background/90 px-5 py-3 shadow-lg backdrop-blur">
          <Input
            placeholder="Name your collection"
            className="flex-1"
            //   {...register("title", {
            //     required: "A collection title is required",
            //   })}
          />
          <DialogTrigger asChild>
            <Button type="button" size="lg" className="rounded-full px-6">
              Open page form
            </Button>
          </DialogTrigger>
        </div>
      </div>
      <DialogPortal>
        <DialogOverlay
          className={
            "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
          }
        />
        <DialogContent className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-2xl translate-x-[-50%] translate-y-[-50%] gap-6 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]">
          <DialogTitle>Title</DialogTitle>
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
