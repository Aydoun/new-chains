import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Carousel, CarouselFrame } from "../carousel";

describe("Carousel", () => {
  const frames = [
    <CarouselFrame key="frame-1">First frame</CarouselFrame>,
    <CarouselFrame key="frame-2">Second frame</CarouselFrame>,
    <CarouselFrame key="frame-3">Third frame</CarouselFrame>,
  ];

  it("renders the initial frame and counter", () => {
    render(<Carousel frames={frames} />);

    expect(screen.getByText("First frame")).toBeInTheDocument();
    expect(screen.getByText(/Frame 1 of 3/)).toBeInTheDocument();
  });

  it("shows the next frame when Next is clicked", async () => {
    const user = userEvent.setup();
    render(<Carousel frames={frames} />);

    await user.click(screen.getByRole("button", { name: /next/i }));

    expect(screen.getByText("Second frame")).toBeInTheDocument();
    expect(screen.getByText(/Frame 2 of 3/)).toBeInTheDocument();
  });

  it("wraps around to the last frame when Previous is clicked from the start", async () => {
    const user = userEvent.setup();
    render(<Carousel frames={frames} initialIndex={0} />);

    await user.click(screen.getByRole("button", { name: /previous/i }));

    expect(screen.getByText("Third frame")).toBeInTheDocument();
    expect(screen.getByText(/Frame 3 of 3/)).toBeInTheDocument();
  });
});
