/**
 * Community notes board (homepage)
 * Swap MOCK_NOTES for a Google Sheet fetch later.
 * Expected columns: quote | author | tag | color
 * color values: yellow | green | blue | purple | pink | coral | mint
 * Hex map:
 *   yellow #FFE299 | green #B3EFBD | blue #A8DAFF | purple #D3BDFF
 *   pink #FFA8DB | coral #FFAFA3 | mint #B3F4EF
 */
const NOTE_COLORS = [
  "yellow",
  "green",
  "blue",
  "purple",
  "pink",
  "coral",
  "mint",
];

const MOCK_NOTES = [
  {
    quote: "The energy in that room was unreal. Best watch party ever.",
    author: "Sooraj Nair",
    tag: "CONFIG '23",
    color: "yellow",
  },
  {
    quote: "Got three portfolio reviews and one job referral. One evening.",
    author: "Rohit Iyer",
    tag: "PORTFOLIO NIGHT",
    color: "blue",
  },
  {
    quote: "Finally understood variables. Genuinely life-changing workshop.",
    author: "Karan Mehta",
    tag: "VARIABLES 101",
    color: "green",
  },
  {
    quote: "Mumbai's design scene is alive again because of this crew.",
    author: "Farah Khan",
    tag: "COMMUNITY",
    color: "pink",
  },
  {
    quote: "Walked in knowing nobody. Left with a whole design family.",
    author: "Ananya Desai",
    tag: "COMMUNITY",
    color: "purple",
  },
  {
    quote: "Config highlights hit different when you're watching with 200 designers.",
    author: "Dev Patel",
    tag: "CONFIG '23",
    color: "coral",
  },
  {
    quote: "My Figma game leveled up in two hours flat. No exaggeration.",
    author: "Meera Joshi",
    tag: "VARIABLES 101",
    color: "mint",
  },
  {
    quote: "Honest feedback, zero ego. That's rare and that's FOF.",
    author: "Arjun Shah",
    tag: "PORTFOLIO NIGHT",
    color: "green",
  },
  {
    quote: "The WhatsApp group alone is worth joining. Pure gold.",
    author: "Nisha Reddy",
    tag: "COMMUNITY",
    color: "yellow",
  },
  {
    quote: "From intern to hiring manager — this community grew with me.",
    author: "Vikram Rao",
    tag: "COMMUNITY",
    color: "purple",
  },
  {
    quote: "Prototype tips I still use every single week at work.",
    author: "Priya Nambiar",
    tag: "VARIABLES 101",
    color: "blue",
  },
  {
    quote: "Best decision I made as a junior designer in Mumbai.",
    author: "Ayaan Kapoor",
    tag: "PORTFOLIO NIGHT",
    color: "coral",
  },
];

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function resolveColor(color, index) {
  if (NOTE_COLORS.includes(color)) return color;
  return NOTE_COLORS[index % NOTE_COLORS.length];
}

function renderNotes(notes) {
  const boardEl = document.getElementById("community-notes-board");
  if (!boardEl) return;

  boardEl.innerHTML = notes
    .map((note, index) => {
      const color = resolveColor(note.color, index);
      return `
      <article class="note note--${escapeHtml(color)} is-entering" style="animation-delay: ${
        index * 30
      }ms">
        <p class="note__quote">${escapeHtml(note.quote)}</p>
        <div class="note__meta">
          <span class="note__author">${escapeHtml(note.author)}</span>
          <span class="note__tag">${escapeHtml(note.tag)}</span>
        </div>
      </article>`;
    })
    .join("");
}

function initCommunityNotes(notes = MOCK_NOTES) {
  renderNotes(notes);
}

document.addEventListener("DOMContentLoaded", () => {
  // Later: fetch Google Sheet → map rows → initCommunityNotes(rows)
  initCommunityNotes(MOCK_NOTES);
});
