/**
 * Media & Audio Coordinator
 * Ensures at most one audio stream plays across the entire portfolio,
 * and handles window/tab focus loss to silence playback.
 */

// Mute all other media elements across the DOM
export function requestExclusiveAudio(currentElement: HTMLMediaElement | null) {
  if (typeof document === "undefined") return;

  const allMedia = document.querySelectorAll<HTMLMediaElement>("video, audio");
  allMedia.forEach((media) => {
    if (media !== currentElement) {
      media.muted = true;
      media.dispatchEvent(new CustomEvent("portfolio:forced-mute"));
    }
  });
}

// Stop and mute all media elements in the page
export function silenceAllMedia() {
  if (typeof document === "undefined") return;

  const allMedia = document.querySelectorAll<HTMLMediaElement>("video, audio");
  allMedia.forEach((media) => {
    media.muted = true;
    media.pause();
    media.dispatchEvent(new CustomEvent("portfolio:forced-mute"));
  });
}
