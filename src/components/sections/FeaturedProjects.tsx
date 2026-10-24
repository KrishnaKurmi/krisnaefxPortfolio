import { Container, Section } from "../layout";
import { ProjectHero } from "../media/ProjectHero";
import { featuredProjects } from "../../data/projects";
import styles from "./FeaturedProjects.module.css";

export function FeaturedProjects() {
  const marqueeItems = [
    "CINEMATIC EDITING",
    "MOTION DESIGN",
    "VFX COMPOSITING",
    "DAVINCI COLOR GRADING",
    "COMMERCIAL STORYTELLING",
    "SOUND DESIGN & SYNC",
  ];

  return (
    <Section id="work" spacing="2xl" className={styles.sectionWrap}>
      {/* Kinetic Marquee Ribbon */}
      <div className={styles.marqueeContainer}>
        <div className={styles.marqueeTrack}>
          {marqueeItems.concat(marqueeItems).map((text, i) => (
            <span key={i} className={styles.marqueeItem}>
              {text} <span className={styles.marqueeDot}>✦</span>
            </span>
          ))}
        </div>
      </div>

      <Container>
        <div className={styles.header}>
          <div className={styles.kickerWrap}>
            <span className={styles.kicker}>SHOWCASE INDEX</span>
            <span className={styles.countBadge}>01 — 03 / 14</span>
          </div>
          <h2 className={styles.sectionTitle}>FEATURED PROJECTS</h2>
          <p className={styles.subtitle}>
            A curated selection of high-energy commercial edits, atmospheric narrative pieces,
            and brand motion design.
          </p>
        </div>

        <div className={styles.projectsContainer}>
          {featuredProjects.map((project, index) => (
            <div
              key={project.id}
              className={`${styles.projectWrapper} ${index % 2 === 1 ? styles.reverseLayout : ""}`}
            >
              <ProjectHero
                slug={project.slug}
                title={project.title}
                role={project.role}
                year={project.year}
                tools={project.tools}
                description={project.description}
                videoPath={project.videoPath}
                videoPoster={project.videoPoster}
                index={index}
                category={project.category}
              />
            </div>
          ))}
        </div>

        <div className={styles.viewAllCta}>
          <a href="/gallery" className={styles.viewAllLink}>
            <span>EXPLORE FULL ARCHIVE (14 WORKS)</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </Container>
    </Section>
  );
}
