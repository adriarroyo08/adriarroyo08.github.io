import { useEffect, useRef } from "react";
import * as THREE from "three";

const PARTICLE_COUNT = 60;

// Color palette with weights: green 40%, blue 30%, purple 20%, white 10%
const COLORS = [
  { hex: 0x00ff88, weight: 0.4 },
  { hex: 0x00bbff, weight: 0.3 },
  { hex: 0x8b5cf6, weight: 0.2 },
  { hex: 0xffffff, weight: 0.1 },
];

function pickColor(): number {
  const r = Math.random();
  let cumulative = 0;
  for (const c of COLORS) {
    cumulative += c.weight;
    if (r < cumulative) return c.hex;
  }
  return COLORS[0].hex;
}

export default function ParticlesBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Respect prefers-reduced-motion
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // --- Scene setup ---
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();

    const camera = new THREE.OrthographicCamera(
      -window.innerWidth / 2,
      window.innerWidth / 2,
      window.innerHeight / 2,
      -window.innerHeight / 2,
      0.1,
      100
    );
    camera.position.z = 10;

    // --- Particle geometry ---
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const colors = new Float32Array(PARTICLE_COUNT * 3);
    const opacities = new Float32Array(PARTICLE_COUNT);
    const speeds = new Float32Array(PARTICLE_COUNT);      // vertical speed
    const drifts = new Float32Array(PARTICLE_COUNT);      // horizontal drift speed
    const phases = new Float32Array(PARTICLE_COUNT);      // horizontal oscillation phase

    const tempColor = new THREE.Color();

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;

      // Spread randomly across the full viewport, including above/below
      positions[i3]     = (Math.random() - 0.5) * window.innerWidth;
      positions[i3 + 1] = (Math.random() - 0.5) * window.innerHeight;
      positions[i3 + 2] = 0;

      tempColor.set(pickColor());
      colors[i3]     = tempColor.r;
      colors[i3 + 1] = tempColor.g;
      colors[i3 + 2] = tempColor.b;

      opacities[i] = 0.25 + Math.random() * 0.65;
      speeds[i]    = 0.15 + Math.random() * 0.35;   // px/frame upward
      drifts[i]    = (Math.random() - 0.5) * 0.04;  // subtle sideways drift
      phases[i]    = Math.random() * Math.PI * 2;    // oscillation phase
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color",    new THREE.BufferAttribute(colors, 3));

    // Custom shader material for per-particle opacity and round points
    const material = new THREE.PointsMaterial({
      size: 3.5,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      sizeAttenuation: false,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // --- Mouse tracking ---
    const mouse = { x: 0, y: 0 };
    const handleMouseMove = (e: MouseEvent) => {
      // Convert to scene coordinates (center = 0,0)
      mouse.x = e.clientX - window.innerWidth / 2;
      mouse.y = -(e.clientY - window.innerHeight / 2);
    };
    window.addEventListener("mousemove", handleMouseMove);

    // --- Resize handler ---
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      renderer.setSize(w, h);
      camera.left   = -w / 2;
      camera.right  =  w / 2;
      camera.top    =  h / 2;
      camera.bottom = -h / 2;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", handleResize);

    // --- Animation loop ---
    let animId: number;
    let frame = 0;

    const halfW = () => window.innerWidth / 2;
    const halfH = () => window.innerHeight / 2;

    const MOUSE_RADIUS  = 120;   // influence radius in px
    const MOUSE_STRENGTH = 18;   // max push distance in px

    const animate = () => {
      animId = requestAnimationFrame(animate);
      frame++;

      const posAttr = geometry.attributes.position as THREE.BufferAttribute;
      const posArr  = posAttr.array as Float32Array;

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const i3 = i * 3;

        if (!prefersReduced) {
          // Float upward
          posArr[i3 + 1] += speeds[i];
          // Gentle horizontal oscillation
          posArr[i3]     += Math.sin(frame * 0.008 + phases[i]) * 0.12 + drifts[i];

          // Mouse repulsion
          const dx = posArr[i3]     - mouse.x;
          const dy = posArr[i3 + 1] - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MOUSE_RADIUS && dist > 0) {
            const force = (1 - dist / MOUSE_RADIUS) * MOUSE_STRENGTH;
            posArr[i3]     += (dx / dist) * force * 0.05;
            posArr[i3 + 1] += (dy / dist) * force * 0.05;
          }
        }

        // Wrap: if particle floats above top, reset at bottom
        const hh = halfH();
        const hw = halfW();
        if (posArr[i3 + 1] > hh + 10) {
          posArr[i3 + 1] = -hh - 10;
          posArr[i3]     = (Math.random() - 0.5) * window.innerWidth;
        }
        // Wrap horizontally (soft boundary)
        if (posArr[i3] > hw + 20)  posArr[i3] = -hw - 20;
        if (posArr[i3] < -hw - 20) posArr[i3] =  hw + 20;
      }

      posAttr.needsUpdate = true;
      renderer.render(scene, camera);
    };

    animate();

    // --- Cleanup ---
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 pointer-events-none"
      aria-hidden="true"
    />
  );
}
