import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Modal } from "@/components/ui/modal";

const meta: Meta = {
  title: "UI/Modal",
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(true);

    return (
      <div className="min-h-screen bg-slate-50 p-8">
        <button
          type="button"
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
          onClick={() => setOpen(true)}
        >
          Open modal
        </button>
        <Modal open={open} onOpenChange={setOpen}>
          <Modal.Content className="rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Share sequence
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Invite teammates to collaborate on this draft.
                </p>
              </div>
              <Modal.Close onClick={() => setOpen(false)}>
                <span aria-hidden="true" className="text-lg">
                  ×
                </span>
              </Modal.Close>
            </div>
            <div className="mt-6 flex gap-2">
              <input
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                placeholder="name@company.com"
                type="email"
              />
              <button
                type="button"
                className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
              >
                Invite
              </button>
            </div>
          </Modal.Content>
        </Modal>
      </div>
    );
  },
};
