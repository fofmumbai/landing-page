// Easter egg: cutting chai and vada pav in the partner card (desktop only;
// the markup is hidden on phones).
// Chai: each click sends up three wisps of steam.
// Vada pav: each click takes a bite out of the side you clicked (a scalloped
// circle cut with CSS mask layers). After the last bite it crumbles into
// crumbs, and a fresh one pops back.
(function () {
	var snack = document.querySelector('.snack');
	if (!snack) return;
	var chai = snack.querySelector('.snack__chai');
	var vada = snack.querySelector('.snack__vada');
	var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

	// ---- chai: steam ----
	chai.addEventListener('click', function () {
		chai.classList.remove('is-steaming');
		void chai.offsetWidth; // restart the animation
		chai.classList.add('is-steaming');
	});

	// ---- vada pav: bites ----
	var BITES = 5;        // bites before it crumbles
	var VADA_W = 59.08;   // vada pav width in cqw (of .snack)
	var R = VADA_W * 0.15; // bite radius in cqw
	var TEETH = 7;
	var bites = [];
	var busy = false;

	function cut(r, x, y, dx, dy) {
		return 'radial-gradient(circle ' + r.toFixed(2) + 'cqw at calc(' +
			x.toFixed(1) + '% + ' + dx.toFixed(2) + 'cqw) calc(' +
			y.toFixed(1) + '% + ' + dy.toFixed(2) + 'cqw), #0000 97%, #000 100%)';
	}

	function render() {
		var layers = [];
		bites.forEach(function (b) {
			layers.push(cut(b.r, b.x, b.y, 0, 0));
			// tooth marks: small scallops round the edge of the bite
			for (var i = 0; i < TEETH; i++) {
				var a = b.turn + (i / TEETH) * Math.PI * 2;
				layers.push(cut(b.r * 0.3, b.x, b.y, Math.cos(a) * b.r * 0.95, Math.sin(a) * b.r * 0.95));
			}
		});
		var mask = layers.length ? layers.join(', ') : '';
		vada.style.maskImage = mask;
		vada.style.webkitMaskImage = mask;
	}

	function bite(e) {
		var r = vada.getBoundingClientRect();
		var px = 0.5, py = 0.5;
		if (e.detail > 0) { // a pointer click (keyboard clicks have detail 0)
			px = (e.clientX - r.left) / r.width;
			py = (e.clientY - r.top) / r.height;
		}
		var dx = px - 0.5, dy = py - 0.5;
		var dist = Math.sqrt(dx * dx + dy * dy);
		if (dist < 0.05) {
			var t = Math.random() * Math.PI * 2;
			dx = Math.cos(t); dy = Math.sin(t); dist = 0;
		} else {
			dx /= dist; dy /= dist;
		}
		// bites come in from the edge, a little deeper each time
		var reach = Math.max(dist, 0.42 - bites.length * 0.03);
		bites.push({
			x: (0.5 + dx * reach) * 100,
			y: (0.5 + dy * reach) * 100,
			r: R * (0.9 + Math.random() * 0.25),
			turn: Math.random() * Math.PI
		});
		render();
	}

	var CRUMB_COLOURS = ['#c98a43', '#e3b06a', '#9a6430', '#d9a15a', '#7a8f3a'];

	function crumble() {
		busy = true;
		vada.classList.add('is-gone');
		var box = snack.getBoundingClientRect();
		var crumbs = [];
		for (var i = 0; i < 12; i++) {
			var c = document.createElement('span');
			c.className = 'snack__crumb';
			var size = 0.9 + Math.random() * 1.4; // cqw
			var endX = 52 + Math.random() * 40;    // % of .snack
			var endY = 92 + Math.random() * 6;
			c.style.width = size + 'cqw';
			c.style.height = size * (0.7 + Math.random() * 0.5) + 'cqw';
			c.style.left = endX + '%';
			c.style.top = endY + '%';
			c.style.background = CRUMB_COLOURS[i % CRUMB_COLOURS.length];
			snack.appendChild(c);
			crumbs.push(c);
			if (!reduce.matches && c.animate) {
				// start from the middle of the vada pav, fall to the card's edge
				var fromX = (0.69 - endX / 100) * box.width + (Math.random() - 0.5) * box.width * 0.2;
				var fromY = (0.3 - endY / 100) * box.height;
				c.animate([
					{ transform: 'translate(' + fromX + 'px, ' + fromY + 'px) rotate(0deg)', opacity: 0 },
					{ opacity: 1, offset: 0.15 },
					{ transform: 'translate(0, 0) rotate(' + (Math.random() * 360) + 'deg)', opacity: 1 }
				], { duration: 500 + Math.random() * 300, easing: 'cubic-bezier(0.4, 0, 0.9, 0.6)' });
			}
		}
		setTimeout(function () {
			crumbs.forEach(function (c) {
				if (!reduce.matches && c.animate) {
					c.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 300, fill: 'forwards' })
						.finished.then(function () { c.remove(); });
				} else {
					c.remove();
				}
			});
			// a fresh one
			bites = [];
			render();
			vada.classList.remove('is-gone');
			vada.classList.add('is-back');
			setTimeout(function () { vada.classList.remove('is-back'); busy = false; }, 460);
		}, 1600);
	}

	vada.addEventListener('click', function (e) {
		if (busy) return;
		if (bites.length >= BITES) crumble();
		else bite(e);
	});
})();
