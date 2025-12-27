"use client";

import {
  createContext,
  useContext,
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

interface ModalContextValue {
  onOpenChange: (open: boolean) => void;
}

const ModalContext = createContext<ModalContextValue | null>(null);

const useModalContext = () => {
  const context = useContext(ModalContext);

  if (!context) {
    throw new Error("Modal components must be used within a <Modal />");
  }

  return context;
};

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

    return createPortal(
      <ModalContext.Provider value={{ onOpenChange }}>
        <div className="fixed inset-0 z-50">
          <button
            aria-label="Close modal overlay"
            className="absolute inset-0 h-full w-full bg-black/60"
            onClick={() => onOpenChange(false)}
          />
          <div className="relative z-10 flex h-full items-center justify-center overflow-y-auto px-4 py-10">
            {children}
          </div>
        </div>
      </ModalContext.Provider>,
      document.body
    );
  }, [children, mounted, onOpenChange, open]);

  return portalContent;
};

interface ModalContentProps extends HTMLAttributes<HTMLDivElement> {}

const ModalContent = ({ className, children, ...props }: ModalContentProps) => (
  <div
    role="dialog"
    aria-modal="true"
    className={cn("relative w-full max-w-2xl", className)}
    onClick={(event) => event.stopPropagation()}
    {...props}
  >
    {children}
  </div>
);

interface ModalCloseProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

const ModalClose = ({ className, children, onClick, ...props }: ModalCloseProps) => {
  const { onOpenChange } = useModalContext();

  const onClose = (event: MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    onOpenChange(false);
  };

  return (
    <button
      type="button"
      {...props}
      onClick={onClose}
      className={cn(
        "rounded-full bg-gray-800 p-2 text-gray-300 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
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
