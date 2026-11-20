// Trial: split-flap departures board in the schedule section (Option 6 in
// .agenda-options). Each character becomes a flap cell; whenever the board
// scrolls into view, every cell flips through a few random characters
// before landing on its own, left to right, row by row.
// No JS: the lines stay plain text. Reduced motion: cells show their final
// characters and never flip.
(function () {
	var board = document.querySelector('.ao-flap');
	if (!board) return;

	var CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789:&+-';
	// Timings keep the whole board settled in about 1.5s: the last cell
	// starts at ~0.9s, plus up to 7 flips of 80ms.
	var FLIP_MS = 80; // one full flip (top leaf down, then bottom leaf down)
	var COL_DELAY = 16; // stagger between columns
	var ROW_DELAY = 60; // stagger between rows

	var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	var canAnimate = !reduce && typeof Element.prototype.animate === 'function' &&
		'IntersectionObserver' in window;

	var cells = [];

	function half(className, ch) {
		var h = document.createElement('span');
		h.className = 'flap__half ' + className;
		var c = document.createElement('span');
		c.className = 'flap__char';
		c.textContent = ch;
		h.appendChild(c);
		return h;
	}

	function makeCell(ch, row, col) {
		var start = canAnimate ? ' ' : ch;
		var el = document.createElement('span');
		el.className = 'flap';
		var top = half('flap__top', start);
		var bottom = half('flap__bottom', start);
		var leafTop = half('flap__top flap__leaf-top', start);
		var leafBottom = half('flap__bottom flap__leaf-bottom', start);
		el.appendChild(top);
		el.appendChild(bottom);
		el.appendChild(leafTop);
		el.appendChild(leafBottom);
		return {
			el: el,
			target: ch,
			current: start,
			row: row,
			col: col,
			top: top.firstChild,
			bottom: bottom.firstChild,
			leafTop: leafTop,
			leafBottom: leafBottom,
			leafTopChar: leafTop.firstChild,
			leafBottomChar: leafBottom.firstChild
		};
	}

	// Build the cells from each line's text, one group per word so lines
	// wrap between words on narrow screens.
	board.querySelectorAll('.ao-flap__row:not(.ao-flap__head)').forEach(function (rowEl, row) {
		rowEl.querySelectorAll('.ao-flap__line').forEach(function (line, lineIndex) {
			var text = line.textContent.trim().toUpperCase();
			line.textContent = '';
			// the event column starts after the time column's 19 characters
			var col = lineIndex * 20;
			text.split(/\s+/).forEach(function (word) {
				var group = document.createElement('span');
				group.className = 'ao-flap__word';
				for (var i = 0; i < word.length; i++) {
					var cell = makeCell(word[i], row, col);
					cells.push(cell);
					group.appendChild(cell.el);
					col++;
				}
				col++; // the space
				line.appendChild(group);
			});
		});
	});

	if (!canAnimate) return;

	function setChar(c, ch) {
		c.top.textContent = ch;
		c.bottom.textContent = ch;
		c.leafTopChar.textContent = ch;
		c.leafBottomChar.textContent = ch;
		c.current = ch;
	}

	function wait(ms) {
		return new Promise(function (resolve) { setTimeout(resolve, ms); });
	}

	// One flip: the top leaf (old character) folds down over the hinge,
	// revealing the new top half; then the bottom leaf (new character)
	// folds down over the old bottom half.
	function flipTo(c, next) {
		c.top.textContent = next;
		c.leafTopChar.textContent = c.current;
		c.leafBottomChar.textContent = next;
		c.bottom.textContent = c.current;
		var a = c.leafTop.animate(
			[{ transform: 'rotateX(0deg)' }, { transform: 'rotateX(-90deg)' }],
			{ duration: FLIP_MS / 2, easing: 'ease-in', fill: 'forwards' }
		);
		var b;
		return a.finished.then(function () {
			b = c.leafBottom.animate(
				[{ transform: 'rotateX(90deg)' }, { transform: 'rotateX(0deg)' }],
				{ duration: FLIP_MS / 2, easing: 'ease-out', fill: 'forwards' }
			);
			return b.finished;
		}).then(function () {
			setChar(c, next);
			a.cancel();
			b.cancel();
		});
	}

	function randomChar() {
		return CHARS[Math.floor(Math.random() * CHARS.length)];
	}

	function runCell(c) {
		var flips = 3 + Math.floor(Math.random() * 4); // 3-6 random, then the real one
		var p = wait(c.col * COL_DELAY + c.row * ROW_DELAY);
		for (var i = 0; i < flips; i++) {
			p = p.then(function () { return flipTo(c, randomChar()); });
		}
		return p.then(function () { return flipTo(c, c.target); });
	}

	var running = false;
	var played = false;

	function play() {
		running = true;
		if (played) {
			cells.forEach(function (c) { setChar(c, ' '); });
		}
		played = true;
		Promise.all(cells.map(runCell)).then(function () { running = false; });
	}

	// replays each time the board comes back into view
	new IntersectionObserver(function (entries) {
		if (entries[0].isIntersecting && !running) play();
	}, { threshold: 0.4 }).observe(board);
})();
