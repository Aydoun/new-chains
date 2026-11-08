import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useInfinitePagination } from "../useInfinitePagination";

type Item = { id: number };

const page = (items: Item[]) => ({
  items,
  page: 1,
  pageSize: 20,
  hasMore: false,
  nextPage: null,
});

describe("useInfinitePagination", () => {
  it("refresh reloads the first page and replaces the items", async () => {
    const fetchPage = vi
      .fn()
      .mockResolvedValueOnce(page([{ id: 1 }]))
      .mockResolvedValueOnce(page([{ id: 2 }, { id: 1 }]));
    const initialParams = { limit: 20 };

    const { result } = renderHook(() =>
      useInfinitePagination<Item, typeof initialParams>({
        fetchPage,
        initialParams,
      })
    );
    await waitFor(() => expect(result.current.items).toEqual([{ id: 1 }]));

    await act(() => result.current.refresh());

    expect(fetchPage).toHaveBeenLastCalledWith({ limit: 20, page: 1 });
    expect(result.current.items).toEqual([{ id: 2 }, { id: 1 }]);
  });
});
