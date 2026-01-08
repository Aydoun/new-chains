"use client";

import {
  useEffect,
  useMemo,
  useState,
  type MouseEvent,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
}

const ModalRoot = ({ open, onOpenChange, children }: ModalProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onOpenChange(false);
      }
    };

    if (open) {
      document.addEventListener("keydown", onKeyDown);
    }

    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onOpenChange]);

  const portalContent = useMemo(() => {
    if (!mounted || !open) return null;

    const themeRoot =
      typeof document !== "undefined"
        ? (document.querySelector("main") as HTMLElement | null)
        : null;

    return createPortal(
      <div className="fixed inset-0 z-50 rounded-4xl">
        <button
          aria-label="Close modal overlay"
          className="absolute inset-0 h-full w-full bg-black/60"
        />
        <div className="relative z-10 flex h-full items-center justify-center overflow-y-auto px-4 py-10">
          {children}
        </div>
      </div>,
      themeRoot ?? document.body
    );
  }, [children, mounted, onOpenChange, open]);

  return portalContent;
};

type ModalContentProps = HTMLAttributes<HTMLDivElement>;

const ModalContent = ({ className, children, ...props }: ModalContentProps) => (
  <div
    role="dialog"
    aria-modal="true"
    className={cn("relative w-full max-w-2xl z-1000", className)}
    onClick={(event) => event.stopPropagation()}
    {...props}
  >
    {children}
  </div>
);

type ModalCloseProps = ButtonHTMLAttributes<HTMLButtonElement>;

const ModalClose = ({
  className,
  children,
  onClick,
  ...props
}: ModalCloseProps) => {
  const onClose = (event: MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
  };

  return (
    <button
      type="button"
      {...props}
      onClick={onClose}
      className={cn(
        "rounded-full bg-red-600 p-2 text-white/80 transition hover:text-white",
        className
      )}
    >
      {children}
    </button>
  );
};

export const Modal = Object.assign(ModalRoot, {
  Content: ModalContent,
  Close: ModalClose,
});

export type { ModalProps, ModalContentProps, ModalCloseProps };
