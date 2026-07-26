/**
 * Community notes board (homepage)
 * Swap MOCK_NOTES for a Google Sheet fetch later.
 * Expected columns: quote | author | tag | color | link
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

const DEFAULT_AUTHOR_LINK = "https://www.linkedin.com/";

const MOCK_NOTES = [
  {
    quote: "The energy in that room was unreal. Best watch party ever.",
    author: "Sooraj Nair",
    tag: "CONFIG '23",
    color: "yellow",
    link: DEFAULT_AUTHOR_LINK,
  },
  {
    quote: "Got three portfolio reviews and one job referral. One evening.",
    author: "Rohit Iyer",
    tag: "PORTFOLIO NIGHT",
    color: "blue",
    link: DEFAULT_AUTHOR_LINK,
  },
  {
    quote: "Finally understood variables. Genuinely life-changing workshop.",
    author: "Karan Mehta",
    tag: "VARIABLES 101",
    color: "green",
    link: DEFAULT_AUTHOR_LINK,
  },
  {
    quote: "Mumbai's design scene is alive again because of this crew.",
    author: "Farah Khan",
    tag: "COMMUNITY",
    color: "pink",
    link: DEFAULT_AUTHOR_LINK,
  },
  {
    quote: "Walked in knowing nobody. Left with a whole design family.",
    author: "Ananya Desai",
    tag: "COMMUNITY",
    color: "purple",
    link: DEFAULT_AUTHOR_LINK,
  },
  {
    quote: "Config highlights hit different when you're watching with 200 designers.",
    author: "Dev Patel",
    tag: "CONFIG '23",
    color: "coral",
    link: DEFAULT_AUTHOR_LINK,
  },
  {
    quote: "My Figma game leveled up in two hours flat. No exaggeration.",
    author: "Meera Joshi",
    tag: "VARIABLES 101",
    color: "mint",
    link: DEFAULT_AUTHOR_LINK,
  },
  {
    quote: "Honest feedback, zero ego. That's rare and that's FOF.",
    author: "Arjun Shah",
    tag: "PORTFOLIO NIGHT",
    color: "green",
    link: DEFAULT_AUTHOR_LINK,
  },
  {
    quote: "The WhatsApp group alone is worth joining. Pure gold.",
    author: "Nisha Reddy",
    tag: "COMMUNITY",
    color: "yellow",
    link: DEFAULT_AUTHOR_LINK,
  },
  {
    quote: "From intern to hiring manager — this community grew with me.",
    author: "Vikram Rao",
    tag: "COMMUNITY",
    color: "purple",
    link: DEFAULT_AUTHOR_LINK,
  },
  {
    quote: "Prototype tips I still use every single week at work.",
    author: "Priya Nambiar",
    tag: "VARIABLES 101",
    color: "blue",
    link: DEFAULT_AUTHOR_LINK,
  },
  {
    quote: "Best decision I made as a junior designer in Mumbai.",
    author: "Ayaan Kapoor",
    tag: "PORTFOLIO NIGHT",
    color: "coral",
    link: DEFAULT_AUTHOR_LINK,
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

function resolveLink(link) {
  return link && String(link).trim() ? String(link).trim() : DEFAULT_AUTHOR_LINK;
}

function renderNotes(notes) {
  const boardEl = document.getElementById("community-notes-board");
  if (!boardEl) return;

  boardEl.innerHTML = notes
    .map((note, index) => {
      const color = resolveColor(note.color, index);
      const link = resolveLink(note.link);
      return `
      <article class="note note--${escapeHtml(color)} is-entering" style="animation-delay: ${
        index * 30
      }ms">
        <p class="note__quote">${escapeHtml(note.quote)}</p>
        <div class="note__meta">
          <a class="note__author" href="${escapeHtml(link)}" target="_blank" rel="noopener noreferrer">
            <span class="note__author-name">${escapeHtml(note.author)}</span>
            <svg class="note__author-icon" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M7 7h10v10"></path>
              <path d="M7 17 17 7"></path>
            </svg>
          </a>
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
