"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

interface ShaderAnimationProps {
  className?: string;
  style?: React.CSSProperties;
}

/**
 * High-performance WebGL Kinetic Wave Shader
 * Featuring a deep cyan (#00F0FF) & electric blue (#0A58FF) palette
 * with volumetric ribbon harmonics, glowing specular cores, and smooth pointer tracking.
 */
export function ShaderAnimation({ className, style }: ShaderAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Vertex Shader: full-screen normalized coordinates
    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `;

    // Fragment Shader: Multi-octave kinetic fluid waves with deep cyan and electric blue palette
    const fragmentShader = `
      precision highp float;
      uniform vec2 resolution;
      uniform float time;
      uniform vec2 mouse;
      varying vec2 vUv;

      // 2D Rotation matrix
      mat2 rotate2D(float angle) {
        float s = sin(angle);
        float c = cos(angle);
        return mat2(c, -s, s, c);
      }

      void main(void) {
        // Normalized device aspect-ratio corrected UVs
        vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
        
        // Dynamic time parameter
        float t = time * 0.35;
        
        // Gentle coordinate warp reacting to subtle pointer influence
        vec2 p = uv;
        vec2 mouseInfluence = (mouse * 2.0 - 1.0) * 0.15;
        p += mouseInfluence * smoothstep(1.5, 0.0, length(uv - mouseInfluence));
        
        // Slow organic rotation
        p = rotate2D(sin(t * 0.12) * 0.35) * p;

        // Base atmospheric field: Deepest midnight obsidian
        float distCenter = length(uv);
        vec3 col = mix(vec3(0.008, 0.018, 0.045), vec3(0.002, 0.005, 0.012), distCenter * 0.7);

        // Wave harmonic layer synthesis
        for (float i = 1.0; i <= 7.0; i++) {
          float freq = i * 1.65;
          float speed = t * (0.28 + i * 0.06);
          
          // Non-linear organic wave displacement
          float wave = sin(p.x * freq + speed + cos(p.y * 2.6 + t * 0.4)) * 0.26;
          wave += cos(p.y * (freq * 0.75) - speed * 0.65 + sin(p.x * 1.8)) * 0.16;
          
          // Distance from the undulating ribbon center line
          float lineY = (i - 4.0) * 0.15;
          float d = abs(p.y - wave * (0.85 / sqrt(i)) - lineY);

          // Volumetric soft glow falloff
          float glow = 0.016 / (d + 0.016);
          glow = pow(glow, 1.25);

          // Color palette interpolation: Deep Royal Cobalt (#083EBD) to Electric Cyan (#00F0FF)
          float colorShift = sin(p.x * 1.8 + t * 0.8 + i * 0.9) * 0.5 + 0.5;
          vec3 deepBlue = vec3(0.02, 0.22, 0.85);    // Deep sapphire electric blue
          vec3 radiantCyan = vec3(0.0, 0.94, 1.0);   // Radiant vibrant cyan
          vec3 waveColor = mix(deepBlue, radiantCyan, colorShift);

          // Concentrated hot specular neon core along the crest
          float core = 0.0022 / (d + 0.0028);
          waveColor += vec3(0.9, 0.98, 1.0) * pow(core, 2.0) * 0.75;

          // Additive blend with natural depth attenuation
          col += waveColor * glow * (1.15 / sqrt(i));
        }

        // Secondary subtle diagonal interference ripples for extra texture
        float ripple = sin((p.x + p.y) * 14.0 + t * 1.5) * 0.5 + 0.5;
        col += vec3(0.0, 0.35, 0.75) * ripple * 0.04 * (1.0 - smoothstep(0.0, 1.2, distCenter));

        // Soft peripheral vignette
        col *= 1.0 - smoothstep(1.3, 2.2, distCenter);

        // Film-grade tone mapping (prevents harsh blowouts while keeping neon brilliance)
        col = col / (1.0 + col * 0.3);
        col = pow(col, vec3(0.92));

        gl_FragColor = vec4(col, 1.0);
      }
    `;

    // Scene & Camera setup
    const camera = new THREE.Camera();
    camera.position.z = 1;

    const scene = new THREE.Scene();
    const geometry = new THREE.PlaneGeometry(2, 2);

    const mousePos = new THREE.Vector2(0.5, 0.5);
    const targetMousePos = new THREE.Vector2(0.5, 0.5);

    const uniforms = {
      time: { value: 0.0 },
      resolution: { value: new THREE.Vector2() },
      mouse: { value: mousePos },
    };

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      depthTest: false,
      depthWrite: false,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });

    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(pixelRatio);
    container.appendChild(renderer.domElement);

    // Responsive sizing
    const onResize = () => {
      const width = container.clientWidth || window.innerWidth;
      const height = container.clientHeight || 450;
      renderer.setSize(width, height);
      uniforms.resolution.value.set(width * pixelRatio, height * pixelRatio);
    };

    onResize();
    window.addEventListener("resize", onResize);

    // Pointer move interaction
    const handlePointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / (rect.width || 1);
      const y = (e.clientY - rect.top) / (rect.height || 1);
      targetMousePos.set(x, 1.0 - y);
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });

    // Animation loop with clock
    const clock = new THREE.Clock();
    let animationId: number;
    let isRunning = true;

    const animate = () => {
      if (!isRunning) return;
      animationId = requestAnimationFrame(animate);

      // Smooth mouse lerping
      mousePos.lerp(targetMousePos, 0.05);

      uniforms.time.value = clock.getElapsedTime();
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      isRunning = false;
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", handlePointerMove);

      if (renderer.domElement && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }

      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        overflow: "hidden",
        ...style,
      }}
    />
  );
}
