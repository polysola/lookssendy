// Preload the animation data
const logoAnimationPath =
  "https://lottie.host/7895c34f-ed2b-4d14-8a09-cf3c05437238/iOBmnE1W1V.json";

// Initialize logo animation with optimized settings
const logoAnimation = lottie.loadAnimation({
  container: document.getElementById("logo-container"),
  renderer: "svg",
  loop: false,
  autoplay: true,
  path: logoAnimationPath,
  rendererSettings: {
    progressiveLoad: false, // Load everything at once
    hideOnTransparent: false,
    preserveAspectRatio: "xMidYMid meet",
    imagePreserveAspectRatio: "xMidYMid meet",
  },
});

// More detailed error handling
logoAnimation.addEventListener("data_failed", (error) => {
  console.error("Failed to load animation data:", error);
});

logoAnimation.addEventListener("data_ready", () => {
  console.log("Logo data loaded successfully");
});

logoAnimation.addEventListener("DOMLoaded", () => {
  console.log("Logo DOM loaded");
  console.log("Animation details:", {
    totalFrames: logoAnimation.totalFrames,
    frameRate: logoAnimation.frameRate,
    duration: logoAnimation.getDuration(),
  });

  // Preload next animation cycle
  const initialDuration = 1.5;
  const loopStartFrame = Math.floor(initialDuration * logoAnimation.frameRate);
  const totalFrames = logoAnimation.totalFrames;

  // Force immediate play from start
  requestAnimationFrame(() => {
    logoAnimation.goToAndPlay(0, true);
  });

  logoAnimation.addEventListener("enterFrame", () => {
    if (logoAnimation.currentFrame >= loopStartFrame && !logoAnimation.loop) {
      logoAnimation.loop = true;
      logoAnimation.playSegments([loopStartFrame, totalFrames], true);
    }
  });
});

logoAnimation.addEventListener("error", (error) => {
  console.error("Logo animation error:", error);
});

// Initialize cat animation
const catAnimation = lottie.loadAnimation({
  container: document.getElementById("animation-container"),
  renderer: "svg",
  loop: false,
  autoplay: false,
  path: "sendy.json",
});

// Cat animation interactive behavior
catAnimation.addEventListener("DOMLoaded", () => {
  const totalDuration = catAnimation.totalFrames / catAnimation.frameRate;
  const container = document.getElementById("animation-container");
  let currentAngle = 0;
  let previousAngle = 0;
  let rafId = null;
  let lastProgress = 0;

  function updateAnimation(e) {
    const containerRect = container.getBoundingClientRect();
    const centerX = containerRect.left + containerRect.width / 2;
    const centerY = containerRect.top + containerRect.height / 2;

    const deltaX = e.clientX - centerX;
    const deltaY = e.clientY - centerY;

    let newAngle = (Math.atan2(deltaY, deltaX) * (180 / Math.PI) - 180) % 360;
    newAngle = newAngle < 0 ? newAngle + 360 : newAngle;

    let diff = newAngle - previousAngle;
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;

    let progress = lastProgress + (diff / 360) * totalDuration;

    if (progress < 0) progress += totalDuration;
    if (progress > totalDuration) progress -= totalDuration;

    catAnimation.goToAndStop(progress * catAnimation.frameRate, true);

    lastProgress = progress;
    previousAngle = newAngle;
  }

  function handleMouseMove(e) {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
      updateAnimation(e);
      rafId = null;
    });
  }

  document.addEventListener("pointermove", handleMouseMove, {
    passive: true,
    capture: true,
  });
});

// Error handling for both animations
catAnimation.addEventListener("error", (error) => {
  console.error("Cat animation error:", error);
});

// Copy address functionality
const addressContainer = document.querySelector(".address-container");
const contractAddress = "TBA";

addressContainer.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(contractAddress);
    const copiedMessage = document.querySelector(".copied-message");
    copiedMessage.classList.add("show");

    setTimeout(() => {
      copiedMessage.classList.remove("show");
    }, 1500);
  } catch (err) {
    console.error("Failed to copy:", err);
  }
});
