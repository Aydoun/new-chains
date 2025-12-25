import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Theme } from "@radix-ui/themes";
import { vi } from "vitest";
import { SequenceCard } from "../sequence-card";

const fetchSequenceMock = vi.fn();
const deleteSequenceMock = vi.fn(() => ({
  unwrap: () => Promise.resolve({ message: "deleted" }),
}));

type MockSequenceQueryState = {
  data?: {
    frames: Array<{ id?: number; content?: string; description?: string }>;
    FrameOrder?: number[];
  };
  isFetching: boolean;
  isError: boolean;
};

const mockSequenceQueryState: MockSequenceQueryState = {
  data: {
    frames: [{ id: 1, content: "Frame content", description: "Details" }],
    FrameOrder: [1],
  },
  isFetching: false,
  isError: false,
};

vi.mock("@/app/services/sequences", () => ({
  useLazyGetSequenceByIdQuery: () => [
    fetchSequenceMock,
    mockSequenceQueryState,
  ],
  useDeleteSequenceMutation: () => [deleteSequenceMock, { isLoading: false }],
}));

const baseSequence = {
  id: 7,
  title: "Sequence Title",
  description: "A nice description",
  FrameOrder: [],
  userId: 1,
  isDeleted: false,
  visibility: "Public",
  createdAt: "",
  updatedAt: "",
};

const renderCard = (overrides?: Partial<typeof baseSequence>) =>
  render(
    <Theme appearance="dark">
      <SequenceCard sequence={{ ...baseSequence, ...overrides }} />
    </Theme>
  );

describe("SequenceCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSequenceQueryState.data = {
      frames: [{ id: 1, content: "Frame content", description: "Details" }],
      FrameOrder: [1],
    };
    mockSequenceQueryState.isFetching = false;
    mockSequenceQueryState.isError = false;
    deleteSequenceMock.mockReturnValue({
      unwrap: () => Promise.resolve({ message: "deleted" }),
    });
  });

  it("renders default visibility label and sequence metadata", () => {
    renderCard();

    expect(screen.getByText("Sequence Title")).toBeInTheDocument();
    expect(screen.getByText("Public")).toBeInTheDocument();
    expect(screen.getByText("#7")).toBeInTheDocument();
  });

  it("opens the dialog and fetches sequence details when clicked", async () => {
    const user = userEvent.setup();
    renderCard();

    await user.click(screen.getByText("Sequence Title"));

    expect(fetchSequenceMock).toHaveBeenCalledWith(baseSequence.id);
    expect(await screen.findByText("Frame content")).toBeInTheDocument();
  });

  it("calls the delete mutation when the delete button is clicked", async () => {
    const user = userEvent.setup();
    renderCard();

    await user.click(screen.getByLabelText("Delete sequence"));

    expect(deleteSequenceMock).toHaveBeenCalledWith(baseSequence.id);
    expect(fetchSequenceMock).not.toHaveBeenCalled();
  });
});
