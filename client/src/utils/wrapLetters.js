// src/utils/wrapLetters.js

// src/utils/wrapLetters.js

/**
 * Wrap each letter in a span for per-letter animation
 * @param {string} text - input text
 * @param {string} effectClass - effect class to apply
 * @param {number} delayStep - delay increment in seconds per letter
 * @param {string} bgColor - optional background color for visibility
 * @returns {string} HTML string
 */
export function wrapLetters(text, effectClass = '', delayStep = 0.05, bgColor = 'rgba(0,0,0,0.5)') {
  if (!text) return '';

  const letters = text.split('').map((char, i) => {
    if (char === ' ') return ' ';
    return `<span style="
      display:inline-block;
      animation-delay:${(i * delayStep).toFixed(2)}s;
      background:${bgColor};
      padding:0 2px;
      border-radius:2px;
    " class="${effectClass}">${char}</span>`;
  });

  return letters.join('');
}


/**
 * Wrap multi-line text into lines with background and per-letter animation
 * @param {string} text - input text
 * @param {string} effectClass - effect class to apply to each letter
 * @param {number} delayStep - stagger delay per letter in seconds
 * @param {string} bgColor - background color for visibility
 * @param {string} lineSpacing - spacing between lines (CSS unit)
 * @returns {string} HTML string with spans and line divs
 */
export function wrapLettersMultiLine(text, effectClass, delayStep = 0.05, bgColor = 'transparent') {
  if (!text) return '';

  const lines = text.split('\n');
  const wrapped = lines.map((line, li) => {
    const letters = [...line].map((char, i) =>
      `<span style="display:inline-block;animation-delay:${(i * delayStep).toFixed(2)}s">${char}</span>`
    ).join('');

    // 🧠 Add padding + visual-safe line box
    return `
      <div class="text-line"
        style="
          display:inline-block;
          position:relative;
          padding:0.5em 0.8em;
          margin:0.2em 0;
          background:${bgColor};
          overflow:visible;
          filter: drop-shadow(0 0 6px rgba(0,0,0,0.5));
        ">
        <span class="${effectClass}" style="display:inline-block;overflow:visible;">${letters}</span>
      </div>`;
  }).join('');

  return wrapped;
}


