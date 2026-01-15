import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Carousel } from "../carousel";

const renderCarousel = (
  currentIndex = 0,
  onNext = vi.fn(),
  onPrevious = vi.fn()
) => {
  const frames = [
    <div key="frame-1">First frame</div>,
    <div key="frame-2">Second frame</div>,
    <div key="frame-3">Third frame</div>,
  ];

  render(
    <Carousel
      frames={frames}
      currentIndex={currentIndex}
      onNext={onNext}
      onPrevious={onPrevious}
    />
  );

  return { onNext, onPrevious };
};

describe("Carousel", () => {
  it("renders the initial frame and counter", () => {
    renderCarousel(0);

    expect(screen.getByText("First frame")).toBeInTheDocument();
    expect(screen.getByText(/Frame 1 of 3/)).toBeInTheDocument();
  });

  it("invokes callbacks when buttons are enabled", async () => {
    const user = userEvent.setup();
    const { onNext, onPrevious } = renderCarousel(1);

    await user.click(screen.getByRole("button", { name: /Next/i }));
    await user.click(screen.getByRole("button", { name: /Previous/i }));

    expect(onNext).toHaveBeenCalledTimes(1);
    expect(onPrevious).toHaveBeenCalledTimes(1);
  });

  it("disables the previous button on the first frame", () => {
    renderCarousel(0);

    expect(screen.getByRole("button", { name: /Previous/i })).toBeDisabled();
  });
});
