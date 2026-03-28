import { useEffect, useRef } from 'react';

interface Dot {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  twinkleSpeed: number;
  twinklePhase: number;
  color: string;
}

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  twinkleSpeed: number;
  twinklePhase: number;
}

interface Meteor {
  x: number;
  y: number;
  vx: number;
  vy: number;
  length: number;
  opacity: number;
  active: boolean;
  tail: Array<{ x: number; y: number }>;
}

const DOT_COLORS = ['#bc475f', '#015f7e', '#1b3907', '#d4a574', '#e8c9a0', '#ffffff'];

export default function StippleBackground({ height = 340 }: { height?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const frameRef = useRef<number>(0);
  const dotsRef = useRef<Dot[]>([]);
  const starsRef = useRef<Star[]>([]);
  const meteorsRef = useRef<Meteor[]>([]);
  const lastMeteorRef = useRef<number>(Date.now());
  const nextMeteorIntervalRef = useRef<number>(3000 + Math.random() * 5000);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      init();
    };

    const init = () => {
      const W = canvas.width;
      const H = canvas.height;

      // 200 floating dots
      dotsRef.current = Array.from({ length: 200 }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        size: 1 + Math.random() * 2,
        opacity: 0.3 + Math.random() * 0.7,
        twinkleSpeed: 0.01 + Math.random() * 0.03,
        twinklePhase: Math.random() * Math.PI * 2,
        color: DOT_COLORS[Math.floor(Math.random() * DOT_COLORS.length)],
      }));

      // 100 twinkling stars
      starsRef.current = Array.from({ length: 100 }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        size: 0.5 + Math.random() * 1.5,
        opacity: 0.2 + Math.random() * 0.6,
        twinkleSpeed: 0.02 + Math.random() * 0.05,
        twinklePhase: Math.random() * Math.PI * 2,
      }));

      // 3 meteors (dormant)
      meteorsRef.current = Array.from({ length: 3 }, () => makeMeteor(W, H, false));
    };

    const makeMeteor = (W: number, _H: number, active: boolean): Meteor => ({
      x: Math.random() * W,
      y: 0,
      vx: 3 + Math.random() * 4,
      vy: 2 + Math.random() * 3,
      length: 80 + Math.random() * 80,
      opacity: 1,
      active,
      tail: [],
    });

    const launchMeteor = () => {
      const W = canvas.width;
      const H = canvas.height;
      const idx = meteorsRef.current.findIndex(m => !m.active);
      if (idx >= 0) {
        meteorsRef.current[idx] = makeMeteor(W, H, true);
        meteorsRef.current[idx].x = Math.random() * (W * 0.6);
        meteorsRef.current[idx].y = Math.random() * (H * 0.3);
      }
    };

    const draw = () => {
      const W = canvas.width;
      const H = canvas.height;
      const mouse = mouseRef.current;
      const now = Date.now();

      ctx.clearRect(0, 0, W, H);

      // Dark gradient background
      const bg = ctx.createLinearGradient(0, 0, W, H);
      bg.addColorStop(0, '#0a1a06');
      bg.addColorStop(0.4, '#0d2415');
      bg.addColorStop(0.7, '#01202a');
      bg.addColorStop(1, '#0a1520');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      // Draw twinkling stars
      starsRef.current.forEach(star => {
        star.twinklePhase += star.twinkleSpeed;
        const opacity = star.opacity * (0.5 + 0.5 * Math.sin(star.twinklePhase));
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${opacity})`;
        ctx.fill();
      });

      // Meteors
      if (now - lastMeteorRef.current > nextMeteorIntervalRef.current) {
        launchMeteor();
        lastMeteorRef.current = now;
        nextMeteorIntervalRef.current = 3000 + Math.random() * 5000;
      }

      meteorsRef.current.forEach(meteor => {
        if (!meteor.active) return;

        meteor.tail.unshift({ x: meteor.x, y: meteor.y });
        if (meteor.tail.length > 20) meteor.tail.pop();

        meteor.x += meteor.vx;
        meteor.y += meteor.vy;
        meteor.opacity -= 0.012;

        if (meteor.opacity <= 0 || meteor.x > W || meteor.y > H) {
          meteor.active = false;
          return;
        }

        // Draw meteor tail
        for (let i = 0; i < meteor.tail.length - 1; i++) {
          const t0 = meteor.tail[i];
          const t1 = meteor.tail[i + 1];
          const segOpacity = meteor.opacity * (1 - i / meteor.tail.length);
          const gradient = ctx.createLinearGradient(t0.x, t0.y, t1.x, t1.y);
          gradient.addColorStop(0, `rgba(255, 240, 200, ${segOpacity})`);
          gradient.addColorStop(1, `rgba(255, 200, 100, 0)`);
          ctx.beginPath();
          ctx.moveTo(t0.x, t0.y);
          ctx.lineTo(t1.x, t1.y);
          ctx.strokeStyle = gradient;
          ctx.lineWidth = 2 * (1 - i / meteor.tail.length);
          ctx.stroke();
        }

        // Meteor head glow
        const glow = ctx.createRadialGradient(meteor.x, meteor.y, 0, meteor.x, meteor.y, 4);
        glow.addColorStop(0, `rgba(255, 255, 220, ${meteor.opacity})`);
        glow.addColorStop(1, `rgba(255, 200, 100, 0)`);
        ctx.beginPath();
        ctx.arc(meteor.x, meteor.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();
      });

      // Update and draw dots
      dotsRef.current.forEach(dot => {
        // Mouse repel
        const dx = dot.x - mouse.x;
        const dy = dot.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100 && dist > 0) {
          const force = (100 - dist) / 100;
          dot.vx += (dx / dist) * force * 0.4;
          dot.vy += (dy / dist) * force * 0.4;
        }

        // Dampen velocity
        dot.vx *= 0.98;
        dot.vy *= 0.98;

        // Clamp velocity
        const speed = Math.sqrt(dot.vx * dot.vx + dot.vy * dot.vy);
        if (speed > 2) {
          dot.vx = (dot.vx / speed) * 2;
          dot.vy = (dot.vy / speed) * 2;
        }

        // Move
        dot.x += dot.vx;
        dot.y += dot.vy;

        // Wrap edges
        if (dot.x < 0) dot.x = W;
        if (dot.x > W) dot.x = 0;
        if (dot.y < 0) dot.y = H;
        if (dot.y > H) dot.y = 0;

        // Twinkle
        dot.twinklePhase += dot.twinkleSpeed;
        const tOpacity = dot.opacity * (0.6 + 0.4 * Math.sin(dot.twinklePhase));

        // Draw dot glow
        const hex = dot.color;
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);

        const glowGrad = ctx.createRadialGradient(dot.x, dot.y, 0, dot.x, dot.y, dot.size * 3);
        glowGrad.addColorStop(0, `rgba(${r},${g},${b},${tOpacity * 0.8})`);
        glowGrad.addColorStop(1, `rgba(${r},${g},${b},0)`);
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = glowGrad;
        ctx.fill();

        // Draw dot core
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${tOpacity})`;
        ctx.fill();
      });

      // Draw connecting lines between dots within 120px
      const dots = dotsRef.current;
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const dx = dots[i].x - dots[j].x;
          const dy = dots[i].y - dots[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            const lineOpacity = (1 - dist / 120) * 0.25;
            ctx.beginPath();
            ctx.moveTo(dots[i].x, dots[i].y);
            ctx.lineTo(dots[j].x, dots[j].y);
            ctx.strokeStyle = `rgba(255,255,255,${lineOpacity})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      frameRef.current = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener('resize', resize);
    frameRef.current = requestAnimationFrame(draw);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 };
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ height }}
    />
  );
}
