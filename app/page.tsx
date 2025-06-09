"use client";

import { useGetUserByIdQuery } from "./services/users";

export default function Home() {
  const { data } = useGetUserByIdQuery();

  console.log({ data });
  return (
    <>
      <div className="px-8 flex flex-col gap-8 row-start-2 items-center sm:items-start">
        main
      </div>
    </>
  );
}
