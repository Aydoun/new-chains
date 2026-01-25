"use client";

import { MobileMenu } from "./mobile-menu";

export function HeaderActions() {
  return (
    <div className="absolute sm:hidden right-6 md:right-8 top-8 z-30 flex items-center">
      <MobileMenu />
    </div>
  );
}
