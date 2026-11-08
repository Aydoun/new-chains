import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Theme } from "@radix-ui/themes";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { FrameImageField } from "../frame-image-field";
import { translate as t } from "@/lib/i18n";
import { imageErrorParams } from "@/lib/image-validation";
import { readImageMeta } from "@/lib/read-image";

const uploadImage = vi.fn();

vi.mock("@/app/services/assets", () => ({
  useUploadImageMutation: () => [uploadImage, { isLoading: false }],
}));
vi.mock("@/lib/read-image", () => ({ readImageMeta: vi.fn() }));

const file = new File(["x"], "photo.png", { type: "image/png" });
const asset = {
  id: 3,
  url: "/api/asset/file/assets/1/a.png",
  width: 1080,
  height: 1350,
  contentType: "image/png",
};

function renderField(props: Partial<Parameters<typeof FrameImageField>[0]> = {}) {
  const onChange = vi.fn();
  render(
    <Theme>
      <FrameImageField index={1} onChange={onChange} {...props} />
    </Theme>,
  );
  return { onChange, input: screen.getByLabelText(t("images.add")) };
}

describe("FrameImageField", () => {
  beforeEach(() => {
    uploadImage.mockReset();
    vi.mocked(readImageMeta).mockReset();
  });

  it("refuses wrong proportions in the browser, without uploading", async () => {
    vi.mocked(readImageMeta).mockResolvedValue({
      contentType: "image/png",
      size: 1000,
      width: 1200,
      height: 400,
    });
    const { input, onChange } = renderField();

    await userEvent.upload(input, file);

    expect(await screen.findByRole("alert")).toHaveTextContent(
      t("images.errors.ratio", imageErrorParams),
    );
    expect(uploadImage).not.toHaveBeenCalled();
    expect(onChange).not.toHaveBeenCalled();
  });

  it("uploads a valid image and hands back the stored asset", async () => {
    vi.mocked(readImageMeta).mockResolvedValue({
      contentType: "image/png",
      size: 1000,
      width: 1080,
      height: 1350,
    });
    uploadImage.mockReturnValue({ unwrap: () => Promise.resolve(asset) });
    const onUploadingChange = vi.fn();
    const { input, onChange } = renderField({ onUploadingChange });

    await userEvent.upload(input, file);

    await waitFor(() => expect(onChange).toHaveBeenCalledWith(asset));
    expect(uploadImage).toHaveBeenCalledWith(file);
    expect(onUploadingChange.mock.calls).toEqual([[true], [false]]);
  });

  it("shows the server's reason when it rejects the file", async () => {
    vi.mocked(readImageMeta).mockResolvedValue({
      contentType: "image/png",
      size: 1000,
      width: 1080,
      height: 1080,
    });
    uploadImage.mockReturnValue({
      unwrap: () => Promise.reject({ status: 400, data: { code: "type" } }),
    });
    const { input } = renderField();

    await userEvent.upload(input, file);

    expect(await screen.findByRole("alert")).toHaveTextContent(
      t("images.errors.type"),
    );
  });

  it("previews the current image and can remove it", async () => {
    const { onChange } = renderField({ asset });

    expect(
      screen.getByRole("img", { name: t("images.preview", { index: 1 }) }),
    ).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: t("images.remove") }));
    expect(onChange).toHaveBeenCalledWith(null);
  });
});
