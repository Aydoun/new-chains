"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Circle, Sparkles, X } from "lucide-react";
import { translate } from "@/lib/i18n";

const STORAGE_KEY = "onboarding-checklist-state";

type ChecklistItemId = "create" | "run" | "share";

type ChecklistItem = {
  id: ChecklistItemId;
  title: string;
  description: string;
  actionLabel: string;
  href?: string;
  onAction?: () => void;
};

type ChecklistState = {
  dismissed: boolean;
  completed: Record<ChecklistItemId, boolean>;
};

const defaultState: ChecklistState = {
  dismissed: false,
  completed: {
    create: false,
    run: false,
    share: false,
  },
};

function loadState(): ChecklistState {
  if (typeof window === "undefined") return defaultState;

  const stored = window.localStorage.getItem(STORAGE_KEY);

  if (!stored) return defaultState;

  try {
    const parsed = JSON.parse(stored) as Partial<ChecklistState>;

    return {
      dismissed: Boolean(parsed.dismissed),
      completed: {
        ...defaultState.completed,
        ...(parsed.completed ?? {}),
      },
    };
  } catch (error) {
    console.error("Unable to parse onboarding checklist state", error);
    return defaultState;
  }
}

function persistState(state: ChecklistState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function OnboardingChecklist({
  onCreate,
}: {
  onCreate?: () => void;
}) {
  const [state, setState] = useState<ChecklistState | null>(null);

  useEffect(() => {
    setState(loadState());
  }, []);

  useEffect(() => {
    if (state) persistState(state);
  }, [state]);

  const checklistItems: ChecklistItem[] = useMemo(
    () => [
      {
        id: "create",
        title: translate("onboarding.items.create.title"),
        description: translate("onboarding.items.create.description"),
        actionLabel: translate("onboarding.items.create.action"),
        onAction: onCreate,
      },
      {
        id: "run",
        title: translate("onboarding.items.run.title"),
        description: translate("onboarding.items.run.description"),
        actionLabel: translate("onboarding.items.run.action"),
        href: "/studio",
      },
      {
        id: "share",
        title: translate("onboarding.items.share.title"),
        description: translate("onboarding.items.share.description"),
        actionLabel: translate("onboarding.items.share.action"),
        href: "/",
      },
    ],
    [onCreate]
  );

  const completedCount = useMemo(() => {
    if (!state) return 0;
    return Object.values(state.completed).filter(Boolean).length;
  }, [state]);

  const totalCount = checklistItems.length;
  const progress = Math.round((completedCount / totalCount) * 100);

  const toggleItem = (itemId: ChecklistItemId) => {
    if (!state) return;

    setState((previous) => {
      const current = previous ?? defaultState;

      return {
        ...current,
        completed: {
          ...current.completed,
          [itemId]: !current.completed[itemId],
        },
      };
    });
  };

  const handleSkip = () => {
    if (!state) return;

    setState((previous) => ({
      ...(previous ?? defaultState),
      dismissed: true,
    }));
  };

  const markAllDone = () => {
    const allCompleted = checklistItems.reduce<Record<ChecklistItemId, boolean>>(
      (acc, item) => ({
        ...acc,
        [item.id]: true,
      }),
      { ...defaultState.completed }
    );

    setState({
      dismissed: true,
      completed: allCompleted,
    });
  };

  if (!state || state.dismissed) return null;

  return (
    <section className="rounded-2xl border border-slate-800 bg-[#0b1320] p-6 shadow-xl">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-primary-main">
            <Sparkles className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase tracking-wide">
              {translate("onboarding.title")}
            </span>
          </div>
          <h2 className="text-xl font-semibold text-white">
            {translate("onboarding.subtitle")}
          </h2>
          <p className="text-sm text-[#9ab6da] max-w-2xl">
            {translate("onboarding.description")}
          </p>
        </div>
        <button
          type="button"
          onClick={handleSkip}
          className="text-[#9ab6da] hover:text-white"
          aria-label={translate("onboarding.actions.skip")}
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <div className="h-2 w-40 rounded-full bg-slate-800">
          <div
            className="h-2 rounded-full bg-primary-main transition-all duration-500"
            style={{ width: `${progress}%` }}
            aria-hidden
          />
        </div>
        <span className="text-xs font-semibold text-[#c7d7ee]">
          {translate("onboarding.progress", {
            completed: completedCount,
            total: totalCount,
          })}
        </span>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        {checklistItems.map((item) => {
          const isDone = state.completed[item.id];

          return (
            <article
              key={item.id}
              className="flex flex-col gap-3 rounded-xl border border-slate-800 bg-[#111a29] p-4 shadow-inner"
            >
              <div className="flex items-start gap-3">
                <button
                  type="button"
                  onClick={() => toggleItem(item.id)}
                  className="mt-0.5 text-primary-main"
                  aria-pressed={isDone}
                  aria-label={translate("onboarding.actions.markItem", {
                    item: item.title,
                  })}
                >
                  {isDone ? (
                    <CheckCircle2 className="h-6 w-6" />
                  ) : (
                    <Circle className="h-6 w-6" />
                  )}
                </button>
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-base font-semibold text-white">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-sm text-[#9ab6da]">
                    {item.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    {item.onAction ? (
                      <button
                        type="button"
                        onClick={() => {
                          item.onAction?.();
                        }}
                        className="inline-flex items-center gap-2 rounded-lg bg-primary-main/10 px-3 py-2 text-sm font-semibold text-primary-main hover:bg-primary-main/20"
                      >
                        {item.actionLabel}
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    ) : item.href ? (
                      <Link
                        href={item.href}
                        className="inline-flex items-center gap-2 rounded-lg bg-primary-main/10 px-3 py-2 text-sm font-semibold text-primary-main hover:bg-primary-main/20"
                      >
                        {item.actionLabel}
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => toggleItem(item.id)}
                      className="text-xs font-semibold uppercase tracking-wide text-[#9ab6da] hover:text-white"
                    >
                      {isDone
                        ? translate("onboarding.actions.undo")
                        : translate("onboarding.actions.markDone")}
                    </button>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <div className="mt-6 flex flex-wrap gap-3 text-sm font-semibold">
        <button
          type="button"
          onClick={handleSkip}
          className="rounded-lg px-4 py-2 text-[#9ab6da] hover:text-white"
        >
          {translate("onboarding.actions.skip")}
        </button>
        <button
          type="button"
          onClick={markAllDone}
          className="inline-flex items-center gap-2 rounded-lg bg-primary-main px-4 py-2 text-white shadow hover:bg-primary-main/90"
        >
          {translate("onboarding.actions.complete")}
          <CheckCircle2 className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}
