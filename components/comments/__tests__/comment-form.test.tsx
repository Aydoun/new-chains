import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Theme } from "@radix-ui/themes";
import { CommentForm } from "../comment-form";
import { translate as t } from "@/lib/i18n";
import { COMMENT_MAX_LENGTH } from "@/lib/constants";

const create = vi.hoisted(() => vi.fn());

vi.mock("@/app/services/comments", () => ({
  useCreateCommentMutation: () => [create, { isLoading: false }],
}));

const renderForm = () =>
  render(
    <Theme>
      <CommentForm sequenceId={5} viewer={{ id: "1", name: "Me" }} />
    </Theme>,
  );

const textbox = () => screen.getByRole("textbox", { name: t("comments.label") });
const postButton = () => screen.getByRole("button", { name: t("comments.post") });

beforeEach(() => {
  vi.clearAllMocks();
  create.mockReturnValue({ unwrap: () => Promise.resolve({ id: 1 }) });
});

describe("CommentForm", () => {
  it("can't post an empty comment", () => {
    renderForm();
    expect(postButton()).toBeDisabled();
  });

  it("counts characters, an emoji as one", async () => {
    renderForm();
    await userEvent.type(textbox(), "Hi 👍");
    expect(screen.getByTestId("comment-counter")).toHaveTextContent(`4 / ${COMMENT_MAX_LENGTH}`);
  });

  it("can't post over the limit", () => {
    renderForm();
    fireEvent.change(textbox(), { target: { value: "a".repeat(COMMENT_MAX_LENGTH + 1) } });
    expect(postButton()).toBeDisabled();
  });

  it("posts the trimmed comment and clears the box", async () => {
    renderForm();
    await userEvent.type(textbox(), "  Nice one  ");
    await userEvent.click(postButton());

    expect(create).toHaveBeenCalledWith({ sequenceId: 5, content: "Nice one" });
    expect(textbox()).toHaveValue("");
  });

  it("posts with Ctrl+Enter", async () => {
    renderForm();
    await userEvent.type(textbox(), "Quick one");
    await userEvent.keyboard("{Control>}{Enter}{/Control}");

    expect(create).toHaveBeenCalledWith({ sequenceId: 5, content: "Quick one" });
  });

  it("keeps the text and shows an error when posting fails", async () => {
    create.mockReturnValue({ unwrap: () => Promise.reject(new Error("500")) });
    renderForm();
    await userEvent.type(textbox(), "Will fail");
    await userEvent.click(postButton());

    expect(await screen.findByRole("alert")).toHaveTextContent(t("comments.postError"));
    expect(textbox()).toHaveValue("Will fail");
  });
});
