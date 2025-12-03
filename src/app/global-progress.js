"use client";

import NProgress from "nprogress";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import "nprogress/nprogress.css";

export default function GlobalProgress() {
  const pathname = usePathname();
  const firstLoad = useRef(true);

  useEffect(() => {
    // Ignore first load
    if (firstLoad.current) {
      firstLoad.current = false;
      return;
    }

    NProgress.start();

    const timer = setTimeout(() => {
      NProgress.done();
    }, 300);

    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}
