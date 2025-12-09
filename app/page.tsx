"use client";

import { useMemo } from "react";
import { Carousel, CarouselFrame } from "@/components/ui/carousel";

export default function Home() {
  const frames = useMemo(
    () => [
      <CarouselFrame key="frame-1">First brew</CarouselFrame>,
      <CarouselFrame key="frame-2">Second sip</CarouselFrame>,
      <CarouselFrame key="frame-3">Third roast</CarouselFrame>,
      <CarouselFrame key="frame-4">Fourth crema</CarouselFrame>,
      <CarouselFrame key="frame-5">Fifth aroma</CarouselFrame>,
    ],
    []
  );

  return (
    <div className="px-8 flex flex-col gap-8 row-start-2 items-center sm:items-start">
      <Carousel frames={frames} />
    </div>
  );
}
