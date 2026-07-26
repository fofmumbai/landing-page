/**
 * Community notes board (homepage)
 * Swap MOCK_NOTES for a Google Sheet fetch later.
 * Expected columns: quote | tag | color
 * color values: yellow | green | blue | purple | pink | coral | mint
 * Hex map:
 *   yellow #FFE299 | green #B3EFBD | blue #A8DAFF | purple #D3BDFF
 *   pink #FFA8DB | coral #FFAFA3 | mint #B3F4EF
 *
 * Target: 9 notes in a 3×3 board.
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
    quote:
      "The event was well organized and had a very welcoming vibe. The team really made the whole day very welcoming so the whole vibe felt comfortable and that is difficult to achieve!",
    tag: "CONFIG 2026",
    color: "yellow",
  },
  {
    quote:
      "It was great to see where I stand as a designer and what I can do to improve professionally.",
    tag: "WIREFRAMED 2025",
    color: "mint",
  },
  {
    quote:
      "The curated networking was a really fun experience and such a nice touch to get everyone talking. Really helped the group open up quickly.",
    tag: "CONFIG 2025",
    color: "coral",
  },
  {
    quote:
      "What stood out wasn't just the event, it was the incredibly attentive people, the engaging networking sessions, and thought-provoking debates. Left with a fresh perspective on what design means in the AI era.",
    tag: "CONFIG 2026",
    color: "blue",
  },
  {
    quote:
      "Had a great time connecting with people and realizing how many incredible hobbies and talents they have. Truly inspiring!",
    tag: "MEETJAM 3",
    color: "green",
  },
  {
    quote:
      "For the first time in a long while, I was at an event without constantly reaching for my phone. That meant more conversations, more human interactions, and, unexpectedly, it helped unblock a creative block.",
    tag: "CONFIG 2026",
    color: "purple",
  },
  {
    quote:
      "People were great and welcoming unlike other events where everyone is minding their own business. The speaker sessions were very relatable and insightful.",
    tag: "WIREFRAMED 2025",
    color: "pink",
  },
  {
    quote:
      "The attention to detail! Genuinely. You people are the best. Honestly the whole team keeps raising the bar, everything from the swag, to the food, to the instructions to the curation of the talks.",
    tag: "CONFIG 2025",
    color: "yellow",
  },
  {
    quote:
      "I loved the Community Voices section and Curated Networking. Was able to talk to more people and hear more thoughts through it after mingling with the same people as an introvert.",
    tag: "CONFIG 2026",
    color: "mint",
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
