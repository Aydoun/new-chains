import { fireEvent, render, screen } from "@testing-library/react";
import { UserAvatar, fallbackColorFor, initialsOf } from "../user-avatar";

describe("UserAvatar", () => {
  it("shows the user's picture when there is one", () => {
    render(<UserAvatar name="Sofie Jansen" src="https://img.test/a.png" seed={2} />);

    const img = screen.getByRole("img", { name: "Sofie Jansen" });
    expect(img.tagName).toBe("IMG");
    expect(img).toHaveAttribute("src", "https://img.test/a.png");
  });

  it("falls back to initials when the picture fails to load", () => {
    render(<UserAvatar name="Sofie Jansen" src="https://img.test/broken.png" seed={2} />);

    fireEvent.error(screen.getByRole("img"));

    expect(screen.getByTestId("avatar-initials")).toHaveTextContent("SJ");
  });

  it("shows initials when there is no picture", () => {
    render(<UserAvatar name="jan" seed={3} />);
    expect(screen.getByTestId("avatar-initials")).toHaveTextContent("J");
  });

  it("shows a generic icon when there is no picture and no name", () => {
    render(<UserAvatar name="  " seed={4} />);
    expect(screen.getByTestId("avatar-icon")).toBeInTheDocument();
    expect(screen.queryByTestId("avatar-initials")).not.toBeInTheDocument();
  });
});

describe("initialsOf", () => {
  it("takes the first letter of the first two words", () => {
    expect(initialsOf("Mohamed Amine Aydoun")).toBe("MA");
    expect(initialsOf("  élodie  ")).toBe("É");
    expect(initialsOf("王 小明")).toBe("王小");
    expect(initialsOf(null)).toBe("");
  });
});

describe("fallbackColorFor", () => {
  it("gives the same user the same colour", () => {
    expect(fallbackColorFor(42)).toBe(fallbackColorFor(42));
    expect(fallbackColorFor(42)).toBe(fallbackColorFor("42"));
  });
});
