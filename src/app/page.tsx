import { Navigation, Footer } from "@/components/common";
import { Hero } from "@/components/sections/Hero";
import { FeaturedProjects } from "@/components/sections/FeaturedProjects";
import { Section, Container } from "@/components/layout";
import styles from "./page.module.css";

export default function Home() {
  const specializations = [
    { title: "High-Energy Commercials", desc: "Pacing dialed to music beats with snappy cuts and kinetic flow." },
    { title: "VFX & Compositing", desc: "Seamless screen replacements, 2D/3D tracking, and atmospheric cleanups." },
    { title: "Kinetic Typography", desc: "Custom brand titles, motion graphics, and animated subtitles." },
    { title: "DaVinci Color Grading", desc: "Moody film-emulation color palettes crafted for emotional depth." },
  ];

  return (
    <>
      <Navigation />
      <main className={styles.main}>
        <Hero />
        <FeaturedProjects />

        {/* About Section */}
        <Section id="about" spacing="2xl" className={styles.aboutSection}>
          <Container>
            <div className={styles.aboutGrid}>
              {/* Left Column: Big Statement */}
              <div className={styles.aboutLeft}>
                <span className={styles.kicker}>THE PHILOSOPHY</span>
                <h2 className={styles.manifesto}>
                  &ldquo;EVERY FRAME IS A DELIBERATE CHOICE. NO ACCIDENTS. NO TEMPLATES.&rdquo;
                </h2>

                <div className={styles.statsGrid}>
                  <div className={styles.statItem}>
                    <span className={styles.statNum}>14+</span>
                    <span className={styles.statLabel}>Completed Works</span>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statNum}>4K</span>
                    <span className={styles.statLabel}>Master Delivery</span>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statNum}>100%</span>
                    <span className={styles.statLabel}>Custom Crafted</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Bio & Specializations */}
              <div className={styles.aboutRight}>
                <p className={styles.bioLead}>
                  I&apos;m a filmmaker and motion designer focused on cinematic editing, VFX,
                  and precision color grading. I build work that feels intentional, moody,
                  and technically polished for creators, brands, and production studios.
                </p>

                <div className={styles.specsList}>
                  {specializations.map((spec, i) => (
                    <div key={i} className={styles.specCard}>
                      <span className={styles.specIndex}>0{i + 1}</span>
                      <div>
                        <h4 className={styles.specTitle}>{spec.title}</h4>
                        <p className={styles.specDesc}>{spec.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Container>
        </Section>

        {/* Contact CTA Section */}
        <Section id="contact" spacing="2xl" className={styles.contactSection}>
          <Container>
            <div className={styles.contactCard}>
              <div className={styles.contactGlow} />
              <div className={styles.contactContent}>
                <span className={styles.contactKicker}>START A COLLABORATION</span>
                <h2 className={styles.contactTitle}>
                  LET&apos;S CREATE SOMETHING UNFORGETTABLE.
                </h2>
                <p className={styles.contactSub}>
                  Whether you need a dynamic commercial edit, kinetic typography, or full-scale
                  cinematic post-production, let&apos;s talk timeline and vision.
                </p>

                <div className={styles.contactActions}>
                  <a href="mailto:contact@krishnakushwaha.com" className={styles.primaryContactBtn}>
                    <span>GET IN TOUCH DIRECTLY</span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M7 17L17 7M17 7H7M17 7V17" />
                    </svg>
                  </a>
                  <a href="https://instagram.com/krisnaefx" target="_blank" rel="noopener noreferrer" className={styles.secondaryContactBtn}>
                    <span>DM ON INSTAGRAM</span>
                  </a>
                </div>

                <div className={styles.availabilityNotice}>
                  <span className={styles.statusDot} />
                  <span>Currently booking projects for upcoming quarters</span>
                </div>
              </div>
            </div>
          </Container>
        </Section>
      </main>
      <Footer />
    </>
  );
}
