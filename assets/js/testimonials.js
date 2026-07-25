/**
 * Testimonials board
 * Swap MOCK_NOTES for a Google Sheet fetch later.
 * Expected columns: quote | author | tag | color
 * color values: yellow | blue | green | pink
 */
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
    color: "green",
  },
  {
    quote: "Config highlights hit different when you're watching with 200 designers.",
    author: "Dev Patel",
    tag: "CONFIG '23",
    color: "yellow",
  },
  {
    quote: "My Figma game leveled up in two hours flat. No exaggeration.",
    author: "Meera Joshi",
    tag: "VARIABLES 101",
    color: "yellow",
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
    color: "pink",
  },
  {
    quote: "From intern to hiring manager — this community grew with me.",
    author: "Vikram Rao",
    tag: "COMMUNITY",
    color: "pink",
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
    color: "pink",
  },
];

const FILTERS = ["ALL", "CONFIG '23", "VARIABLES 101", "COMMUNITY", "PORTFOLIO NIGHT"];

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderFilters(activeFilter) {
  const filtersEl = document.getElementById("testimonials-filters");
  if (!filtersEl) return;

  filtersEl.innerHTML = FILTERS.map((filter) => {
    const isActive = filter === activeFilter;
    return `<button type="button" class="testimonials__filter${
      isActive ? " is-active" : ""
    }" data-filter="${escapeHtml(filter)}" aria-pressed="${isActive}">${escapeHtml(
      filter
    )}</button>`;
  }).join("");
}

function renderNotes(notes, filter) {
  const boardEl = document.getElementById("testimonials-board");
  if (!boardEl) return;

  const visibleNotes =
    filter === "ALL" ? notes : notes.filter((note) => note.tag === filter);

  boardEl.innerHTML = visibleNotes
    .map(
      (note, index) => `
      <article class="note note--${escapeHtml(note.color)} is-entering" style="animation-delay: ${
        index * 30
      }ms" data-tag="${escapeHtml(note.tag)}">
        <p class="note__quote">${escapeHtml(note.quote)}</p>
        <div class="note__meta">
          <span class="note__author">${escapeHtml(note.author)}</span>
          <span class="note__tag">${escapeHtml(note.tag)}</span>
        </div>
      </article>`
    )
    .join("");
}

function initTestimonials(notes = MOCK_NOTES) {
  let activeFilter = "ALL";

  renderFilters(activeFilter);
  renderNotes(notes, activeFilter);

  const filtersEl = document.getElementById("testimonials-filters");
  if (!filtersEl) return;

  filtersEl.addEventListener("click", (event) => {
    const button = event.target.closest(".testimonials__filter");
    if (!button) return;

    activeFilter = button.dataset.filter;
    renderFilters(activeFilter);
    renderNotes(notes, activeFilter);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  // Later: fetch Google Sheet → map rows → initTestimonials(rows)
  initTestimonials(MOCK_NOTES);
});
