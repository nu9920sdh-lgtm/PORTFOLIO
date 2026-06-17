/* header 인터렉션 js */

const blockChars = [
  "■", "▇", "▆", "▅", "▄", "▃", "▂", "▁",
  "▉", "▊", "▋", "▌", "▍", "▎", "▏"
];

function randomBlockChar() {
  return blockChars[Math.floor(Math.random() * blockChars.length)];
}

function isSkippableChar(char) {
  return char === " " || /[.,!?;:'"()[\]{}\-_/]/.test(char);
}

function buildGlitchText(text, revealCount) {
  return text
    .split("")
    .map((char, index) => {
      if (isSkippableChar(char)) return char;
      if (index < revealCount) return char;
      return randomBlockChar();
    })
    .join("");
}

function createGlitchEffect(target) {
  const originalText = target.textContent;
  let rafId = null;
  let isAnimating = false;

  function lockSize() {
    const rect = target.getBoundingClientRect();
    target.style.width = `${Math.ceil(rect.width)}px`;
    target.style.height = `${Math.ceil(rect.height)}px`;
  }

  function unlockSize() {
    target.style.width = "";
    target.style.height = "";
  }

  function start() {
    if (isAnimating) return;
    isAnimating = true;
    lockSize();

    const textChars = originalText.split("");
    const revealableCount = textChars.filter(c => !isSkippableChar(c)).length;

    const holdSteps = 2;
    const endHoldSteps = 1;
    const totalSteps = holdSteps + revealableCount + endHoldSteps;
    const frameDuration = 200 / 4;

    let step = 0;
    let lastTime = 0;

    function tick(now) {
      if (!isAnimating) return;
      if (!lastTime) lastTime = now;
      const elapsed = now - lastTime;

      if (elapsed >= frameDuration) {
        lastTime = now;
        const revealCount = Math.max(0, step - holdSteps);
        target.textContent = buildGlitchText(originalText, revealCount);
        step++;

        if (step > totalSteps) {
          target.textContent = originalText;
          isAnimating = false;
          return;
        }
      }
      rafId = requestAnimationFrame(tick);
    }

    cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(tick);
  }

  function reset() {
    cancelAnimationFrame(rafId);
    rafId = null;
    target.textContent = originalText;
    isAnimating = false;
    unlockSize();
  }

  return { start, reset };
}

const subtitleSpan = document.querySelector(".hero-subtitle span");
const titleSpan = document.querySelector(".hero-title span");
const heroContent = document.querySelector(".hero-content");

if (subtitleSpan && titleSpan && heroContent) {
  const subtitleEffect = createGlitchEffect(subtitleSpan);
  const titleEffect = createGlitchEffect(titleSpan);

  heroContent.addEventListener("mouseenter", () => {
    subtitleEffect.start();
    titleEffect.start();
  });

  heroContent.addEventListener("mouseleave", () => {
    subtitleEffect.reset();
    titleEffect.reset();
  });
}