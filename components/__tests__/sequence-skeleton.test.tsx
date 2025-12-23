/// <reference types="@testing-library/jest-dom" />

import { render, screen } from "@testing-library/react";
import { SequenceSkeleton } from "../sequence-skeleton";

describe("SequenceSkeleton", () => {
  it("renders placeholder blocks", () => {
    render(<SequenceSkeleton />);

    const skeleton = screen.getByTestId("sequence-skeleton");
    expect(
      skeleton.getElementsByClassName("animate-pulse").length
    ).toBeGreaterThanOrEqual(16);
  });
});
