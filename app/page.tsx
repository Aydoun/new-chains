"use client";

import { useMemo } from "react";
import { Carousel, CarouselFrame } from "@/components/ui/carousel";
import { carouselItems } from "./fixtures/carousel-items";

export default function Home() {
  const frames = useMemo(
    () =>
      carouselItems.map((item) => (
        <CarouselFrame key={item.id}>
          <div className="flex flex-col gap-2 text-center">
            <p className="text-lg font-semibold">{item.title}</p>
            <p className="text-sm text-muted-foreground">{item.description}</p>
          </div>
        </CarouselFrame>
      )),
    []
  );

  return (
    <div className="flex flex-col gap-8 p-8 px-0 sm:items-start">
      <Carousel frames={frames} />
    </div>
  );
}
