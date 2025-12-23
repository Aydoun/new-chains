/// <reference types="@testing-library/jest-dom" />

import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { SequenceCard } from "../sequence-card";
import type { ImgHTMLAttributes } from "react";
import type { Sequence } from "@/app/types";

vi.mock("next/image", () => ({
  __esModule: true,
  default: (props: ImgHTMLAttributes<HTMLImageElement>) => <img {...props} />,
}));

vi.mock("@/app/services/sequences", () => ({
  useLazyGetSequenceByIdQuery: () => [
    vi.fn(),
    { data: { FrameOrder: [], frames: [] }, isFetching: false, isError: false },
  ],
}));

describe("Sequence Card", () => {
  const baseSequence: Sequence = {
    id: 1,
    title: "Daily Brews",
    description: "A curated list of coffee rituals.",
    url: "/globe.svg",
    userId: 1,
    FrameOrder: [],
    isDeleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  it("renders the sequence details", () => {
    render(<SequenceCard sequence={baseSequence} />);

    expect(screen.getByText(baseSequence.title)).toBeInTheDocument();
    expect(screen.getByText(baseSequence.description)).toBeInTheDocument();
    expect(
      screen.getByAltText(`${baseSequence.title} avatar`)
    ).toHaveAttribute("src", baseSequence.url);
  });

  it("applies custom class names", () => {
    const { container } = render(
      <SequenceCard sequence={baseSequence} className="border-red-500" />
    );

    expect(container.firstChild).toHaveClass("border-red-500");
  });
});
