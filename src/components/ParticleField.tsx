import { useEffect, useRef } from "react";

/**
 * Lightweight 2D-canvas "3D" particle field with mouse ripple + fluid distortion.
 * Particles drift on a depth plane; pointer movement sends out a ripple wave that
 * pushes/distorts particles, creating a fluid, water-like feel.
 */
export default function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    type P = { x: number; y: number; z: number; bx: number; by: number; vx: number; vy: number; r: number };
    let particles: P[] = [];

    type Ripple = { x: number; y: number; t: number };
    const ripples: Ripple[] = [];

    const pointer = { x: -9999, y: -9999, active: false };

    const build = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(150, Math.floor((w * h) / 9000));
      particles = Array.from({ length: count }, () => {
        const x = Math.random() * w;
        const y = Math.random() * h;
        return {
          x,
          y,
          bx: x,
          by: y,
          z: Math.random(),
          vx: 0,
          vy: 0,
          r: 0.6 + Math.random() * 2.2,
        };
      });
    };

    const onResize = () => build();

    const move = (cx: number, cy: number) => {
      const last = ripples[ripples.length - 1];
      pointer.x = cx;
      pointer.y = cy;
      pointer.active = true;
      if (!last || Math.hypot(cx - last.x, cy - last.y) > 28) {
        ripples.push({ x: cx, y: cy, t: performance.now() });
        if (ripples.length > 12) ripples.shift();
      }
    };

    const onMouse = (e: MouseEvent) => move(e.clientX, e.clientY);
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) move(t.clientX, t.clientY);
    };
    const onLeave = () => {
      pointer.active = false;
      pointer.x = -9999;
      pointer.y = -9999;
    };

    const render = () => {
      ctx.clearRect(0, 0, w, h);
      const now = performance.now();

      // draw ripple rings (fluid distortion field)
      for (let i = ripples.length - 1; i >= 0; i--) {
        const rp = ripples[i];
        const age = (now - rp.t) / 1000;
        if (age > 1.6) {
          ripples.splice(i, 1);
          continue;
        }
        const radius = age * 260;
        const alpha = (1 - age / 1.6) * 0.18;
        ctx.beginPath();
        ctx.arc(rp.x, rp.y, radius, 0, Math.PI * 2);
        ctx.strokeStyle = `oklch(0.58 0.16 38 / ${alpha})`;
        ctx.lineWidth = 1.4;
        ctx.stroke();
      }

      for (const p of particles) {
        // gentle return to base + drift
        p.bx += Math.sin(now / 3400 + p.z * 6) * 0.06;
        p.by += Math.cos(now / 4200 + p.z * 6) * 0.06;

        // ripple push (distortion)
        let fx = 0;
        let fy = 0;
        for (const rp of ripples) {
          const age = (now - rp.t) / 1000;
          const radius = age * 260;
          const dx = p.x - rp.x;
          const dy = p.y - rp.y;
          const d = Math.hypot(dx, dy) || 1;
          const band = Math.abs(d - radius);
          if (band < 60) {
            const force = (1 - band / 60) * (1 - age / 1.6) * 3.2;
            fx += (dx / d) * force;
            fy += (dy / d) * force;
          }
        }

        // pointer repulsion
        if (pointer.active) {
          const dx = p.x - pointer.x;
          const dy = p.y - pointer.y;
          const d = Math.hypot(dx, dy);
          if (d < 130) {
            const f = (1 - d / 130) * 1.8;
            fx += (dx / (d || 1)) * f;
            fy += (dy / (d || 1)) * f;
          }
        }

        p.vx += fx + (p.bx - p.x) * 0.012;
        p.vy += fy + (p.by - p.y) * 0.012;
        p.vx *= 0.9;
        p.vy *= 0.9;
        p.x += p.vx;
        p.y += p.vy;

        const depth = 0.4 + p.z * 0.6;
        const speed = Math.hypot(p.vx, p.vy);
        const glow = Math.min(1, speed / 4);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * depth, 0, Math.PI * 2);
        ctx.fillStyle = `oklch(${0.55 + glow * 0.15} ${0.14 + glow * 0.05} ${38 + p.z * 100} / ${0.25 + depth * 0.35})`;
        ctx.fill();

        // connecting fluid lines for nearby particles
        for (const q of particles) {
          if (q === p) continue;
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const dd = dx * dx + dy * dy;
          if (dd < 5200) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `oklch(0.6 0.1 60 / ${(1 - dd / 5200) * 0.06})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      raf = requestAnimationFrame(render);
    };

    build();
    render();
    window.addEventListener("resize", onResize);
    window.addEventListener("mousemove", onMouse);
    window.addEventListener("touchmove", onTouch, { passive: true });
    window.addEventListener("mouseleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("touchmove", onTouch);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full" />;
}
