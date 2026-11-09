import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Theme } from "@radix-ui/themes";
import { useForm } from "react-hook-form";
import { FrameLinkField } from "../frame-link-field";
import { parseFrameLink } from "@/lib/frame-link";
import { translate as t } from "@/lib/i18n";

/** The field wired to a form the way CreateSequenceForm wires it. */
function Harness({ onValue }: { onValue?: (value: string) => void }) {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useForm<{ linkUrl: string }>({ mode: "onChange", defaultValues: { linkUrl: "" } });
  const value = watch("linkUrl");
  onValue?.(value);

  return (
    <FrameLinkField
      index={1}
      value={value}
      error={errors.linkUrl?.message}
      registration={register("linkUrl", {
        validate: (v) => {
          if (!v?.trim()) return true;
          const result = parseFrameLink(v);
          return result.ok || t(`frame.link.errors.${result.error}`);
        },
      })}
      onRemove={() => setValue("linkUrl", "", { shouldValidate: true })}
    />
  );
}

const renderField = (onValue?: (value: string) => void) =>
  render(
    <Theme>
      <Harness onValue={onValue} />
    </Theme>,
  );

const input = () => screen.getByRole("textbox", { name: t("frame.link.label", { index: 1 }) });

describe("FrameLinkField", () => {
  it("starts as an Add link button and opens a URL field", async () => {
    renderField();
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: t("frame.link.add") }));

    expect(input()).toHaveAttribute("inputmode", "url");
    expect(input()).toHaveFocus();
    expect(screen.getByText(t("frame.link.hint"))).toBeInTheDocument();
  });

  it("explains why a dangerous link is refused", async () => {
    renderField();
    await userEvent.click(screen.getByRole("button", { name: t("frame.link.add") }));

    await userEvent.type(input(), "javascript:alert(1)");

    expect(await screen.findByRole("alert")).toHaveTextContent(t("frame.link.errors.protocol"));
    expect(input()).toHaveAttribute("aria-invalid", "true");
  });

  it("accepts a plain domain", async () => {
    renderField();
    await userEvent.click(screen.getByRole("button", { name: t("frame.link.add") }));

    await userEvent.type(input(), "example.com/page");

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("removes the link and collapses back", async () => {
    let latest = "x";
    renderField((value) => (latest = value));
    await userEvent.click(screen.getByRole("button", { name: t("frame.link.add") }));
    await userEvent.type(input(), "example.com");

    await userEvent.click(screen.getByRole("button", { name: t("frame.link.remove") }));

    expect(latest).toBe("");
    expect(screen.getByRole("button", { name: t("frame.link.add") })).toBeInTheDocument();
  });
});
