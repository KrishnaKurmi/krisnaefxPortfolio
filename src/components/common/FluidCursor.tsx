"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

export function FluidCursor() {
  const rootRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const t = rootRef.current;
    const r = bodyRef.current;
    if (!t || !r) return;

    const n = window.matchMedia("(hover: hover) and (pointer: fine)");
    const o = window.matchMedia("(pointer: coarse)");
    const a = window.matchMedia("(prefers-reduced-motion: reduce)");
    const s = window.matchMedia("(min-width: 769px)");

    let l = 0;
    let u = false;
    let c = false;
    let d = window.innerWidth / 2;
    let f = window.innerHeight / 2;
    let p = d;
    let m = f;
    let h = d;
    let g = f;
    let y = 0;
    let v = 0;
    let b = 0;
    let w = false;

    const _ = () => {
      document.documentElement.style.removeProperty("cursor");
      document.body.style.removeProperty("cursor");
    };

    const E = () => {
      const e = d - p;
      const n = f - m;
      const i = Math.hypot(e, n);
      const o = w ? 0.105 : 0.19;
      const a = w ? 0.12 : 0.16;

      p += e * o;
      m += n * o;
      b += (i - b) * 0.14;
      y += (((v - y + 540) % 360) - 180) * a;

      const s = Math.min(b / 900, 0.02);
      const u = Math.min(b / 1100, 0.012);
      const c = t.dataset.interactive === "true" ? 1.07 : 1;

      t.style.transform = `translate3d(${p}px, ${m}px, 0) rotate(${y}deg)`;
      r.style.transform = `translate(-92%, -50%) scale(${(1 + s) * c}, ${(1 - u) * c})`;
      l = window.requestAnimationFrame(E);
    };

    const P = () => {
      w = o.matches || !s.matches;
      u = !a.matches && (w || n.matches);
      if (u) {
        document.documentElement.dataset.customCursor = "true";
        document.documentElement.dataset.cursorInput = w ? "touch" : "pointer";
        if (w) {
          _();
          if (!c) {
            d = window.innerWidth / 2;
            f = window.innerHeight / 2;
            p = d;
            m = f;
            h = d;
            g = f;
            c = true;
          }
          t.dataset.visible = "true";
        } else if (n.matches) {
          t.dataset.visible = "false";
          c = false;
          document.documentElement.style.setProperty("cursor", "none", "important");
          document.body.style.setProperty("cursor", "none", "important");
        }
        if (!l) {
          l = window.requestAnimationFrame(E);
        }
      } else {
        delete document.documentElement.dataset.customCursor;
        delete document.documentElement.dataset.cursorInput;
        _();
        t.dataset.visible = "false";
        c = false;
        if (l) {
          window.cancelAnimationFrame(l);
          l = 0;
        }
      }
    };

    const j = (e: number, r: number, n: EventTarget | null) => {
      if (u) {
        d = e;
        f = r;
        if (c) {
          const dx = d - h;
          const dy = f - g;
          if (Math.hypot(dx, dy) > 0.5) {
            v = (180 * Math.atan2(dy, dx)) / Math.PI;
          }
          h = d;
          g = f;
        } else {
          p = d;
          m = f;
          h = d;
          g = f;
          c = true;
          t.dataset.visible = "true";
        }
        t.dataset.interactive =
          n instanceof Element &&
          Boolean(
            n.closest(
              "a, button, input, textarea, select, [role='button'], [data-cursor-interactive]"
            )
          )
            ? "true"
            : "false";
      }
    };

    const O = (e: PointerEvent) => {
      if (!w && e.pointerType !== "touch") {
        j(e.clientX, e.clientY, e.target);
      }
    };

    const S = (e: PointerEvent) => {
      j(e.clientX, e.clientY, e.target);
      t.dataset.pressed = "true";
    };

    const x = () => {
      t.dataset.pressed = "false";
    };

    const C = () => {
      if (!w) {
        t.dataset.visible = "false";
      }
    };

    const R = () => {
      if (c && u) {
        t.dataset.visible = "true";
      }
    };

    P();
    n.addEventListener("change", P);
    o.addEventListener("change", P);
    a.addEventListener("change", P);
    s.addEventListener("change", P);
    window.addEventListener("pointermove", O, { passive: true });
    window.addEventListener("pointerdown", S, { passive: true });
    window.addEventListener("pointerup", x, { passive: true });
    document.documentElement.addEventListener("pointerleave", C);
    document.documentElement.addEventListener("pointerenter", R);

    return () => {
      delete document.documentElement.dataset.customCursor;
      delete document.documentElement.dataset.cursorInput;
      _();
      n.removeEventListener("change", P);
      o.removeEventListener("change", P);
      a.removeEventListener("change", P);
      s.removeEventListener("change", P);
      window.removeEventListener("pointermove", O);
      window.removeEventListener("pointerdown", S);
      window.removeEventListener("pointerup", x);
      document.documentElement.removeEventListener("pointerleave", C);
      document.documentElement.removeEventListener("pointerenter", R);
      if (l) window.cancelAnimationFrame(l);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className="fluid-cursor"
      data-visible="false"
      data-interactive="false"
      data-pressed="false"
      aria-hidden="true"
    >
      <span ref={bodyRef} className="fluid-cursor__body">
        <Image
          src="/media/brand/nexstudio-cursor.svg"
          alt=""
          width={600}
          height={500}
          loading="eager"
          unoptimized
        />
      </span>
    </div>
  );
}
