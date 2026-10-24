import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Navigation, Footer } from "@/components/common";
import { Container } from "@/components/layout";
import { projects } from "@/data/projects";
import { VideoTheater } from "@/components/media/VideoTheater";
import styles from "./project.module.css";

interface ProjectDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({ params }: ProjectDetailPageProps) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    return {
      title: "Film Not Found",
    };
  }

  return {
    title: `${project.title} — Cinematic Post-Production | Krishna Kushwaha`,
    description: project.description,
    openGraph: {
      title: `${project.title} | Krishna Kushwaha`,
      description: project.description,
      images: [project.videoPoster],
    },
  };
}

async function ProjectDetailContent({ params }: ProjectDetailPageProps) {
  const { slug } = await params;
  const currentIndex = projects.findIndex((p) => p.slug === slug);

  if (currentIndex === -1) {
    notFound();
  }

  const project = projects[currentIndex];
  const nextProject = projects[(currentIndex + 1) % projects.length];
  const prevProject = projects[(currentIndex - 1 + projects.length) % projects.length];

  // Related projects
  const relatedProjects = projects
    .filter((p) => p.category === project.category && p.id !== project.id)
    .slice(0, 3);

  return (
    <>
      <Navigation />
      <main className={styles.projectDetail}>
        {/* Header HUD */}
        <div className={styles.headerHud}>
          <Container>
            <div className={styles.hudFlex}>
              <Link href="/gallery" className={styles.backLink}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                <span>BACK TO ARCHIVE</span>
              </Link>
              <div className={styles.hudMeta}>
                <span className={styles.hudIndex}>INDEX #{String(currentIndex + 1).padStart(2, "0")} / 14</span>
                <span className={styles.hudCategory}>{project.category.toUpperCase()}</span>
              </div>
            </div>
          </Container>
        </div>

        {/* Cinematic Full-Bleed Video Theater with Focus & Sound Management */}
        <section className={styles.videoSection}>
          <Container>
            <VideoTheater
              videoPath={project.videoPath}
              videoPoster={project.videoPoster}
              title={project.title}
            />
          </Container>
        </section>

        {/* Project Metadata & Brief Section */}
        <section className={styles.infoSection}>
          <Container>
            <div className={styles.infoGrid}>
              {/* Left Column: Title & Brief */}
              <div className={styles.infoMain}>
                <div className={styles.titleRow}>
                  <h1 className={styles.projectTitle}>{project.title}</h1>
                  <span className={styles.yearTag}>{project.year}</span>
                </div>

                <div className={styles.briefBlock}>
                  <span className={styles.blockKicker}>PROJECT BRIEF & APPROACH</span>
                  <p className={styles.briefText}>{project.description}</p>
                </div>

                {project.tools.length > 0 && (
                  <div className={styles.toolsBlock}>
                    <span className={styles.blockKicker}>SOFTWARE & POST PIPELINE</span>
                    <div className={styles.tagsRow}>
                      {project.tools.map((tool) => (
                        <span key={tool} className={styles.toolTag}>
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Specification Card */}
              <aside className={styles.infoSidebar}>
                <div className={styles.specCard}>
                  <h3 className={styles.specCardTitle}>PRODUCTION SPECS</h3>

                  <div className={styles.specRow}>
                    <span className={styles.specLabel}>ROLE</span>
                    <span className={styles.specVal}>{project.role}</span>
                  </div>

                  <div className={styles.specRow}>
                    <span className={styles.specLabel}>CATEGORY</span>
                    <span className={styles.specVal}>{project.category.toUpperCase()}</span>
                  </div>

                  <div className={styles.specRow}>
                    <span className={styles.specLabel}>COLOR WORK</span>
                    <span className={styles.specVal}>DaVinci Resolve / Custom LUT</span>
                  </div>

                  <div className={styles.specRow}>
                    <span className={styles.specLabel}>DELIVERY</span>
                    <span className={styles.specVal}>Master 4K ProRes 422 HQ</span>
                  </div>

                  <div className={styles.specAction}>
                    <Link href="/#contact" className={styles.inquireBtn}>
                      INQUIRE SIMILAR PROJECT
                    </Link>
                  </div>
                </div>
              </aside>
            </div>
          </Container>
        </section>

        {/* Prev / Next Film Navigator */}
        <section className={styles.navSection}>
          <Container>
            <div className={styles.navRow}>
              <Link href={`/project/${prevProject.slug}`} className={styles.navCard}>
                <span className={styles.navSub}>← PREVIOUS FILM</span>
                <span className={styles.navTitle}>{prevProject.title}</span>
              </Link>

              <Link href={`/project/${nextProject.slug}`} className={`${styles.navCard} ${styles.navCardRight}`}>
                <span className={styles.navSub}>NEXT FILM →</span>
                <span className={styles.navTitle}>{nextProject.title}</span>
              </Link>
            </div>
          </Container>
        </section>

        {/* Related Projects Section */}
        {relatedProjects.length > 0 && (
          <section className={styles.relatedSection}>
            <Container>
              <div className={styles.relatedHeader}>
                <span className={styles.blockKicker}>MORE WORKS IN {project.category.toUpperCase()}</span>
                <h3 className={styles.relatedTitle}>SIMILAR AESTHETICS</h3>
              </div>

              <div className={styles.relatedGrid}>
                {relatedProjects.map((rel) => (
                  <Link key={rel.id} href={`/project/${rel.slug}`} className={styles.relatedCard}>
                    <div className={styles.relatedMedia}>
                      <img src={rel.videoPoster} alt={rel.title} className={styles.relatedImg} />
                      <div className={styles.relatedOverlay} />
                    </div>
                    <div className={styles.relatedMeta}>
                      <span className={styles.relatedRole}>{rel.role}</span>
                      <h4 className={styles.relatedProjectTitle}>{rel.title}</h4>
                    </div>
                  </Link>
                ))}
              </div>
            </Container>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}

export default function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  return (
    <Suspense
      fallback={
        <div style={{ minHeight: "100vh", backgroundColor: "#08090b", display: "flex", alignItems: "center", justifyContent: "center", color: "#f5f5f0", fontFamily: "monospace" }}>
          <span>LOADING FILM ARCHIVE...</span>
        </div>
      }
    >
      <ProjectDetailContent params={params} />
    </Suspense>
  );
}
