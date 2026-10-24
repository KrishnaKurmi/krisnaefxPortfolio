"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import styles from "./ShaderRipple.module.css";

export function ShaderRipple() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    camera.position.z = 5;

    // Shader ripple effect
    const geometry = new THREE.PlaneGeometry(2, 2);

    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      uniform float uTime;
      varying vec2 vUv;

      vec3 palette(float t) {
        vec3 a = vec3(0.5, 0.5, 0.5);
        vec3 b = vec3(0.5, 0.5, 0.5);
        vec3 c = vec3(1.0, 1.0, 1.0);
        vec3 d = vec3(0.263, 0.416, 0.557);

        return a + b * cos(6.28318 * (c * t + d));
      }

      void main() {
        vec2 uv = vUv * 2.0 - 1.0;
        float d = length(uv);

        // Ripple effect
        float ripple = sin(d * 8.0 - uTime * 4.0) * 0.5 + 0.5;
        ripple *= smoothstep(1.5, 0.0, d);

        // Color gradient
        vec3 col = palette(d + uTime * 0.3);
        col *= ripple;

        gl_FragColor = vec4(col, ripple);
      }
    `;

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
      },
      vertexShader,
      fragmentShader,
      transparent: true,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Handle window resize
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);

    // Animation loop
    let animationId: number;
    let startTime = Date.now();
    const duration = 2000; // 2 seconds

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      material.uniforms.uTime.value = progress * 2;

      // Fade out after animation completes
      if (progress < 1) {
        renderer.render(scene, camera);
        animationId = requestAnimationFrame(animate);
      } else {
        // Keep final frame visible briefly
        renderer.render(scene, camera);
        setTimeout(() => {
          if (containerRef.current && renderer.domElement.parentNode) {
            containerRef.current.removeChild(renderer.domElement);
          }
        }, 300);
      }
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (
        containerRef.current &&
        renderer.domElement &&
        renderer.domElement.parentNode === containerRef.current
      ) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} className={styles.shaderRipple} />;
}
