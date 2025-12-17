/// <reference types="@testing-library/jest-dom" />

import { render, screen } from "@testing-library/react";
import { SequenceCard } from "../sequence-card";

const baseSequence = {
  id: 1,
  title: "Daily Brews",
  description: "A curated list of coffee rituals.",
  url: "/globe.svg",
  userId: 1,
  FrameOrder: [],
  storyId: null,
  story: null,
  isDeleted: false,
  visibility: "PUBLIC" as const,
  createdAt: "2025-01-01T00:00:00.000Z",
  updatedAt: "2025-01-02T00:00:00.000Z",
};

describe("SequenceCard", () => {
  it("renders the sequence details", () => {
    render(<SequenceCard sequence={baseSequence} />);

    expect(screen.getByText(baseSequence.title)).toBeInTheDocument();
    expect(screen.getByText(baseSequence.description)).toBeInTheDocument();
    expect(screen.getByAltText(`${baseSequence.title} avatar`)).toHaveAttribute(
      "src",
      baseSequence.url
    );
    expect(screen.getByText(`#${baseSequence.id}`)).toBeInTheDocument();
  });
});
