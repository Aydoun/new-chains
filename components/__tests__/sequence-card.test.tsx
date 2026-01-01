import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Theme } from "@radix-ui/themes";
import { vi } from "vitest";
import { SequenceCard } from "../sequence-card";

const baseSequence = {
  id: 7,
  title: "Sequence Title",
  description: "A nice description",
  FrameOrder: [],
  userId: 1,
  user: { id: 1, username: "creator", avatarUrl: null },
  firstFrame: null,
  isDeleted: false,
  visibility: "PUBLIC" as const,
  createdAt: "2024-04-01T12:00:00Z",
  updatedAt: "2024-04-01T12:00:00Z",
};

const renderCard = (props?: {
  onClick?: () => void;
  handleDelete?: (sequenceId: string | number) => void;
  sequenceOverrides?: Partial<typeof baseSequence>;
  userId?: string;
}) => {
  const { onClick, handleDelete, sequenceOverrides, userId } = props ?? {};

  return render(
    <Theme appearance="dark">
      <SequenceCard
        userId={userId ?? "1"}
        onClick={onClick ?? vi.fn()}
        handleDelete={handleDelete}
        sequence={{ ...baseSequence, ...sequenceOverrides }}
      />
    </Theme>
  );
};

describe("SequenceCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders sequence metadata and author link", () => {
    renderCard();

    expect(screen.getByText("Sequence Title")).toBeInTheDocument();
    expect(screen.getByText("A nice description")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "creator" })).toHaveAttribute(
      "href",
      "/explore/1"
    );
  });

  it("triggers the click handler when the card content is clicked", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    renderCard({ onClick });

    await user.click(screen.getByText("Sequence Title"));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("stops propagation when clicking the author link", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    renderCard({ onClick });

    await user.click(screen.getByRole("link", { name: "creator" }));

    expect(onClick).not.toHaveBeenCalled();
  });

  it("calls the delete handler when the delete button is clicked", async () => {
    const user = userEvent.setup();
    const handleDelete = vi.fn();
    renderCard({ handleDelete });

    await user.click(screen.getByLabelText("Delete sequence"));

    expect(handleDelete).toHaveBeenCalledWith(baseSequence.id);
  });
});
