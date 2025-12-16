/// <reference types="@testing-library/jest-dom" />

import { render, screen } from "@testing-library/react";

import { CollectionSkeleton } from "../collection-skeleton";

describe("CollectionSkeleton", () => {
  it("renders placeholder blocks", () => {
    render(<CollectionSkeleton />);

    const skeleton = screen.getByTestId("collection-skeleton");
    expect(skeleton.getElementsByClassName("animate-pulse").length).toBe(4);
  });

  it("supports custom class names", () => {
    render(<CollectionSkeleton className="bg-gray-700" />);

    expect(screen.getByTestId("collection-skeleton")).toHaveClass(
      "bg-gray-700"
    );
  });
});
