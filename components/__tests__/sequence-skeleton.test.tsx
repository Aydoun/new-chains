/// <reference types="@testing-library/jest-dom" />

import { render, screen } from "@testing-library/react";

import { SequenceSkeleton } from "../sequence-skeleton";

describe("SequenceSkeleton", () => {
  it("renders placeholder blocks", () => {
    render(<SequenceSkeleton />);

    const skeleton = screen.getByTestId("sequence-skeleton");
    expect(skeleton.children.length).toBe(4);
  });

  it("supports custom class names", () => {
    render(<SequenceSkeleton className="bg-gray-700" />);

    expect(screen.getByTestId("sequence-skeleton")).toHaveClass(
      "bg-gray-700"
    );
  });
});
