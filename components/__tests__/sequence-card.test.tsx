import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Theme } from "@radix-ui/themes";
import { vi } from "vitest";
import { SequenceCard } from "../sequence-card";
import { translate } from "@/lib/i18n";

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

  it("shows the comment count", () => {
    renderCard({ sequenceOverrides: { commentCount: 12 } as Partial<typeof baseSequence> });

    const count = screen.getByTestId("comment-count");
    expect(count).toHaveTextContent("12");
    expect(count).toHaveAccessibleName(translate("comments.count", { count: 12 }));
  });

  it("shows zero comments when the count is missing", () => {
    renderCard();
    expect(screen.getByTestId("comment-count")).toHaveTextContent("0");
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

    await user.click(screen.getByLabelText(translate("sequence.actions.delete")));

    expect(handleDelete).toHaveBeenCalledWith(baseSequence.id);
  });

  it("shows the picture of an IMAGE first frame, cropped to the card", () => {
    renderCard({
      sequenceOverrides: {
        FrameOrder: [1, 2] as never,
        firstFrame: {
          id: 1,
          type: "IMAGE",
          content: "At the beach",
          asset: { url: "/api/asset/file/assets/1/a.png", width: 1080, height: 1350 },
          createdAt: "2024-04-01T12:00:00Z",
          updatedAt: "2024-04-01T12:00:00Z",
        } as never,
      },
    });

    const preview = screen.getByTestId("card-image-frame");
    expect(within(preview).getByRole("img", { name: "At the beach" })).toHaveAttribute(
      "src",
      "/api/asset/file/assets/1/a.png",
    );
    expect(within(preview).getByText("At the beach")).toBeInTheDocument();
    expect(within(preview).getByText(translate("sequence.countLabel", { count: 2 }))).toBeInTheDocument();
  });

  it("keeps the text preview for a text first frame", () => {
    renderCard({
      sequenceOverrides: {
        firstFrame: {
          id: 1,
          type: "PHRASE",
          content: "Just words",
          createdAt: "2024-04-01T12:00:00Z",
          updatedAt: "2024-04-01T12:00:00Z",
        } as never,
      },
    });

    expect(screen.getByText("Just words")).toBeInTheDocument();
    expect(screen.queryByTestId("card-image-frame")).not.toBeInTheDocument();
  });
});
