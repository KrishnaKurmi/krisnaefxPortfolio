"use client";

import { useRef, useEffect, useState, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Navigation, Footer } from "@/components/common";
import { Container } from "@/components/layout";
import { projects, Project } from "@/data/projects";
import { silenceAllMedia } from "@/utils/mediaCoordinator";
import styles from "./gallery.module.css";

// 3D Interactive Card Component
function Card3D({
  position,
  rotation,
  project,
  onClick,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  project: Project;
  onClick: () => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load(
      project.videoPoster,
      (loadedTexture) => {
        loadedTexture.colorSpace = THREE.SRGBColorSpace;
        setTexture(loadedTexture);
      },
      undefined,
      () => {
        // Fallback texture if failed
      }
    );
  }, [project.videoPoster]);

  useFrame(() => {
    if (meshRef.current) {
      if (hovered) {
        meshRef.current.scale.lerp(new THREE.Vector3(1.08, 1.08, 1.08), 0.1);
      } else {
        meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
      }
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      rotation={rotation}
      onClick={onClick}
      onPointerOver={() => {
        document.body.style.cursor = "pointer";
        setHovered(true);
      }}
      onPointerOut={() => {
        document.body.style.cursor = "auto";
        setHovered(false);
      }}
    >
      <planeGeometry args={[3.2, 1.8]} />
      {texture ? (
        <meshBasicMaterial map={texture} side={THREE.DoubleSide} />
      ) : (
        <meshStandardMaterial color="#1a1d24" roughness={0.4} />
      )}
    </mesh>
  );
}

// 3D Carousel Scene
function Scene3D({
  projectList,
  onSelectProject,
}: {
  projectList: Project[];
  onSelectProject: (slug: string) => void;
}) {
  return (
    <Canvas className={styles.canvas}>
      <PerspectiveCamera makeDefault position={[0, 0, 14]} fov={55} />
      <OrbitControls
        autoRotate
        autoRotateSpeed={0.8}
        enablePan={false}
        maxPolarAngle={Math.PI / 2 + 0.2}
        minPolarAngle={Math.PI / 2 - 0.2}
        minDistance={8}
        maxDistance={22}
      />

      <ambientLight intensity={1.5} />
      <pointLight position={[0, 10, 10]} intensity={2} />

      {/* Render cards in a 360 circle */}
      {projectList.map((project, i) => {
        const count = projectList.length;
        const angle = (i / count) * Math.PI * 2;
        const radius = 8.5;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;

        return (
          <Card3D
            key={project.id}
            position={[x, 0, z]}
            rotation={[0, -angle + Math.PI / 2, 0]}
            project={project}
            onClick={() => onSelectProject(project.slug)}
          />
        );
      })}
    </Canvas>
  );
}

export default function GalleryPage() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "3d">("grid");
  const [activeHoverId, setActiveHoverId] = useState<string | null>(null);

  const categories = [
    { id: "all", label: "ALL FILMS (14)" },
    { id: "energetic", label: "ENERGETIC" },
    { id: "cinematic", label: "CINEMATIC" },
    { id: "typography", label: "TYPOGRAPHY" },
    { id: "commercial", label: "COMMERCIAL" },
  ];

  const filteredProjects =
    activeCategory === "all"
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  const handleSelect = (slug: string) => {
    silenceAllMedia();
    router.push(`/project/${slug}`);
  };

  return (
    <>
      <Navigation />
      <main className={styles.galleryPage}>
        {/* Header Strip */}
        <section className={styles.galleryHero}>
          <Container>
            <div className={styles.heroContent}>
              <div className={styles.kickerRow}>
                <span className={styles.kicker}>ARCHIVE VAULT</span>
                <span className={styles.countPill}>{filteredProjects.length} TITLES</span>
              </div>
              <h1 className={styles.title}>FILM & MOTION DIRECTORY</h1>
              <p className={styles.subtitle}>
                Complete archive of client commercials, narrative color grades, typography animations,
                and technical VFX sequences.
              </p>

              {/* Controls bar: Filters & View Switcher */}
              <div className={styles.controlsBar}>
                {/* Category filters */}
                <div className={styles.filterGroup}>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setActiveCategory(cat.id)}
                      className={`${styles.filterBtn} ${activeCategory === cat.id ? styles.activeFilter : ""}`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                {/* View Mode Toggle */}
                <div className={styles.viewToggleGroup}>
                  <button
                    type="button"
                    onClick={() => setViewMode("grid")}
                    className={`${styles.toggleBtn} ${viewMode === "grid" ? styles.activeToggle : ""}`}
                    aria-label="Grid view"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="7" height="7" />
                      <rect x="14" y="3" width="7" height="7" />
                      <rect x="3" y="14" width="7" height="7" />
                      <rect x="14" y="14" width="7" height="7" />
                    </svg>
                    <span>GRID</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setViewMode("3d")}
                    className={`${styles.toggleBtn} ${viewMode === "3d" ? styles.activeToggle : ""}`}
                    aria-label="3D spatial view"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                      <path d="M2 12h20" />
                    </svg>
                    <span>3D SPATIAL</span>
                  </button>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* View Container */}
        <section className={styles.viewSection}>
          {viewMode === "3d" ? (
            <div className={styles.canvasWrapper}>
              <div className={styles.canvasHint}>
                <span>DRAG TO ORBIT • SCROLL TO ZOOM • CLICK CARD TO VIEW</span>
              </div>
              <Suspense
                fallback={
                  <div className={styles.canvasLoader}>
                    <div className={styles.spinner} />
                    <span>INITIALIZING 3D SPATIAL CAROUSEL...</span>
                  </div>
                }
              >
                <Scene3D
                  projectList={filteredProjects}
                  onSelectProject={handleSelect}
                />
              </Suspense>
            </div>
          ) : (
            <Container>
              <div className={styles.editorialGrid}>
                {filteredProjects.map((project, idx) => (
                  <Link
                    key={project.id}
                    href={`/project/${project.slug}`}
                    className={styles.projectCard}
                    onClick={() => silenceAllMedia()}
                    onMouseEnter={() => setActiveHoverId(project.id)}
                    onMouseLeave={() => setActiveHoverId(null)}
                  >
                    <div className={styles.cardMedia}>
                      <img
                        src={project.videoPoster}
                        alt={project.title}
                        className={styles.cardImg}
                        loading="lazy"
                      />
                      <video
                        src={project.videoPath}
                        className={`${styles.cardHoverVideo} ${activeHoverId === project.id ? styles.showVideo : ""}`}
                        muted
                        loop
                        playsInline
                        autoPlay={activeHoverId === project.id}
                      />
                      <div className={styles.cardGradient} />

                      {/* Top Badges */}
                      <div className={styles.cardTopBadge}>
                        <span className={styles.indexTag}>#{String(idx + 1).padStart(2, "0")}</span>
                        <span className={styles.categoryTag}>{project.category.toUpperCase()}</span>
                      </div>

                      {/* Play Hover Glyph */}
                      <div className={styles.hoverGlyph}>
                        <span>OPEN FILM</span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>

                    <div className={styles.cardDetails}>
                      <div className={styles.cardMetaLine}>
                        <span className={styles.cardRole}>{project.role}</span>
                        <span className={styles.cardYear}>{project.year}</span>
                      </div>
                      <h3 className={styles.cardTitle}>{project.title}</h3>
                      <p className={styles.cardDesc}>{project.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </Container>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
