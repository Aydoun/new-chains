/// <reference types="@testing-library/jest-dom" />

import type { ImgHTMLAttributes } from "react";
import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { CollectionCard } from "../collection-card";

vi.mock("next/image", () => ({
  __esModule: true,
  default: (props: ImgHTMLAttributes<HTMLImageElement>) => <img {...props} />,
}));

describe("CollectionCard", () => {
  const baseProps = {
    title: "Daily Brews",
    description: "A curated list of coffee rituals.",
    imageSrc: "/globe.svg",
  };

  it("renders the collection details", () => {
    render(<CollectionCard {...baseProps} />);

    expect(screen.getByText(baseProps.title)).toBeInTheDocument();
    expect(screen.getByText(baseProps.description)).toBeInTheDocument();
    expect(screen.getByAltText(baseProps.title)).toHaveAttribute(
      "src",
      baseProps.imageSrc
    );
  });

  it("applies custom class names", () => {
    const { container } = render(
      <CollectionCard {...baseProps} className="border-red-500" />
    );

    expect(container.firstChild).toHaveClass("border-red-500");
  });
});
