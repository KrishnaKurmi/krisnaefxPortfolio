import styles from "./AtmosphericBackground.module.css";

export function AtmosphericBackground() {
  return (
    <div className={styles.atmosphericWrap} aria-hidden="true">
      <div className={styles.glowTop} />
      <div className={styles.glowRight} />
      <div className={styles.glowLeft} />
      <div className={styles.studioGrid} />
      <div className={styles.filmGrain} />
      <div className={styles.vignette} />
    </div>
  );
}
