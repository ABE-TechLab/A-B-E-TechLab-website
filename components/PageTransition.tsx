"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

const MIN_DISPLAY_MS = 320;
const MAX_DISPLAY_MS = 1800;

export function PageTransition() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const startedAt = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!startedAt.current) return;

    const elapsed = Date.now() - startedAt.current;
    const remaining = Math.max(0, MIN_DISPLAY_MS - elapsed);

    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setVisible(false);
      startedAt.current = 0;
    }, remaining);

    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [pathname]);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const target = event.target as HTMLElement | null;
      const anchor = target?.closest("a[href]") as HTMLAnchorElement | null;
      if (!anchor) return;
      if (anchor.target === "_blank" || anchor.hasAttribute("download")) return;
      if (anchor.getAttribute("aria-disabled") === "true") return;

      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname && url.search === window.location.search && url.hash === window.location.hash) return;

      startedAt.current = Date.now();
      if (timer.current) clearTimeout(timer.current);
      setVisible(true);

      timer.current = setTimeout(() => {
        setVisible(false);
        startedAt.current = 0;
      }, MAX_DISPLAY_MS);
    };

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, []);

  return (
    <div
      className={`page-transition${visible ? " is-visible" : ""}`}
      aria-hidden={!visible}
      aria-live="polite"
      role="status"
    >
      <div className="page-transition-mark" aria-hidden="true">
        <span className="page-transition-ring page-transition-ring-one" />
        <span className="page-transition-ring page-transition-ring-two" />
        <span className="page-transition-logo">
          <img src="/brand/abe-techlab-mark-light.svg" alt="" width="52" height="52" />
        </span>
      </div>
      <div className="page-transition-copy">
        <strong>ABE TechLab</strong>
        <span>Loading the next page…</span>
      </div>
    </div>
  );
}
