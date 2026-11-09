import { render, screen } from "@testing-library/react";
import { SequenceFrame } from "../sequence-card";
import { ImageFrame } from "../image-frame";
import { translate as t } from "@/lib/i18n";
import { FRAME_LINK_REL } from "@/lib/frame-link";

const asset = { url: "https://blob.test/a.png", width: 1080, height: 1080 };

describe("frame links in the viewer", () => {
  it("makes a text frame open its link in a new tab, safely", () => {
    render(
      <SequenceFrame
        text="Read the guide"
        description="5 min"
        linkUrl="https://www.example.com/guide"
        showIsLiked={false}
      />,
    );

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "https://www.example.com/guide");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", FRAME_LINK_REL);
    expect(link.getAttribute("rel")).toContain("noopener");
    expect(link.getAttribute("rel")).toContain("noreferrer");
    // The text and the new-tab cue name the link; the address isn't shown.
    expect(link).toHaveAccessibleName(
      `Read the guide 5 min ${t("frame.link.opensInNewTab")}`,
    );
    expect(link).not.toHaveTextContent("example.com");
    expect(screen.getByTestId("frame-link-icon")).toBeInTheDocument();
  });

  it("keeps the save button outside the link", () => {
    render(<SequenceFrame text="Read" linkUrl="https://example.com" onLike={vi.fn()} />);

    const save = screen.getByRole("button", { name: t("snippets.saveAction") });
    expect(screen.getByRole("link")).not.toContainElement(save);
  });

  it("shows no link when the frame has none", () => {
    render(<SequenceFrame text="Plain" showIsLiked={false} />);
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(screen.queryByTestId("frame-link-icon")).not.toBeInTheDocument();
  });

  it("never renders an unsafe stored value as a link", () => {
    render(<SequenceFrame text="Bad" linkUrl="javascript:alert(1)" showIsLiked={false} />);

    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(document.querySelector("a")).toBeNull();
    expect(screen.getByText("Bad")).toBeInTheDocument();
  });

  it("links an image frame's picture and caption", () => {
    render(
      <ImageFrame asset={asset} text="Look" linkUrl="https://example.com/x" showIsLiked={false} />,
    );

    const link = screen.getByRole("link");
    expect(link).toContainElement(screen.getByRole("img", { name: "Look" }));
    expect(link).toHaveAttribute("target", "_blank");
    // A figcaption can't sit inside the link, so there's none then.
    expect(document.querySelector("figcaption")).toBeNull();
  });

  it("keeps the figcaption for an image frame without a link", () => {
    render(<ImageFrame asset={asset} text="Look" showIsLiked={false} />);

    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(document.querySelector("figcaption")).toHaveTextContent("Look");
  });
});
