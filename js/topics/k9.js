/* =========================================================
   Klasse 9 – Pythagoras, Wurzeln, Parabeln,
   Gleichungssysteme, Kreis, Strahlensätze
   ========================================================= */
(function () {
  const U = MA.U;
  const R = (t) => MA.registerTopic(Object.assign({ grade: 9 }, t));
  const N = (q, answer, o = {}) => Object.assign({ type: 'num', q, answer }, o);
  const RND = ' <span class="note">(auf eine Nachkommastelle runden)</span>';

  /* ---------- 1 Pythagoras-Baustelle ---------- */
  function rightTri(a, b, la, lb, lc) {
    const sc = Math.min(260 / a, 170 / b);
    const C = [50, 200], B = [50 + a * sc, 200], A = [50, 200 - b * sc];
    const cen = [(A[0] + B[0] + C[0]) / 3, (A[1] + B[1] + C[1]) / 3];
    let s = U.poly2([A, B, C]) + U.rightMark(C, A, B, 16);
    s += U.edgeLabel(C, B, la, 18, cen) + U.edgeLabel(A, C, lb, 18, cen) + U.edgeLabel(A, B, lc, 20, cen);
    return U.svg(50 + a * sc + 80, 230, s);
  }
  const TRIPLES = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [9, 12, 15], [7, 24, 25], [12, 16, 20], [20, 21, 29]];
  R({
    id: 'k9-pythagoras', icon: '🏗️', title: 'Pythagoras-Baustelle', tags: ['visuell', 'Text'],
    bp: 'Raum und Form', desc: 'a² + b² = c² – Leitern, Rampen und Diagonalen.',
    gen(l) {
      if (l === 1) {
        const f = U.pick([1, 1, 2, 3]);
        let [a, b, c] = U.pick(TRIPLES.slice(0, 5)).map((v) => v * f);
        if (U.chance(0.5)) [a, b] = [b, a];
        return N('Berechne die Länge der Hypotenuse c.', c, { unit: 'cm', vis: rightTri(a, b, `${a} cm`, `${b} cm`, 'c = ?'), mq: `a = ${a}, b = ${b} → c`, hints: ['c² = a² + b²'], sol: `c = √(${a}² + ${b}²) = √${a * a + b * b} = ${c} cm`, mistakes: [{ v: a + b, msg: 'Man darf die Seiten nicht einfach addieren – erst quadrieren!' }] });
      }
      if (l === 2) {
        const a = U.ri(3, 15), c = U.ri(a + 2, a + 12);
        if (U.chance(0.5)) {
          const b = U.ri(3, 15), cc = Math.sqrt(a * a + b * b);
          return N('Berechne die Hypotenuse c.' + RND, cc, { unit: 'cm', tol: 0.06, vis: rightTri(a, b, `${a} cm`, `${b} cm`, 'c = ?'), mq: '', memOk: false, hints: ['c² = a² + b²'], sol: `c = √(${a * a} + ${b * b}) = √${a * a + b * b} ≈ ${U.fmt(cc, 1)} cm` });
        }
        const b = Math.sqrt(c * c - a * a);
        return N('Berechne die Kathete b.' + RND, b, { unit: 'cm', tol: 0.06, vis: rightTri(a, b, `${a} cm`, 'b = ?', `${c} cm`), mq: '', memOk: false, hints: ['Gesucht ist eine Kathete: b² = c² − a²'], sol: `b = √(${c * c} − ${a * a}) = √${c * c - a * a} ≈ ${U.fmt(b, 1)} cm`, mistakes: [{ v: Math.sqrt(c * c + a * a), msg: 'Bei einer Kathete wird subtrahiert: b² = c² − a²' }] });
      }
      const k = U.ri(0, 2);
      if (k === 0) {
        const L = U.ri(5, 10), d = U.ri(1, 3) + U.pick([0, 0.5]);
        const h = Math.sqrt(L * L - d * d);
        const vis = U.svg(300, 230, U.line(60, 20, 60, 210, 'sv-wall') + U.line(30, 210, 280, 210, 'sv-ground') + U.line(60 + d * 18, 210, 60, 210 - h * 18, 'sv-ladder') + U.rightMark([60, 210], [60, 100], [200, 210], 12) + U.t(60 + d * 9, 228, `${U.fmt(d)} m`, 'sv-t sv-mid') + U.t(60 + d * 9 + 18, 210 - h * 9, `${L} m`, 'sv-t') + U.t(50, 210 - h * 9, 'h', 'sv-t sv-end sv-acc'));
        return N(`Eine ${L} m lange Leiter lehnt an einer Hauswand. Ihr Fuß steht ${U.fmt(d)} m von der Wand entfernt. In welcher Höhe berührt sie die Wand?` + RND, h, { unit: 'm', tol: 0.06, vis, memOk: false, hints: ['Die Leiter ist die Hypotenuse.'], sol: `h = √(${L}² − ${U.fmt(d)}²) ≈ ${U.fmt(h, 1)} m` });
      }
      if (k === 1) {
        const w = U.ri(8, 16) * 10, hh = U.ri(4, 10) * 10;
        const dg = Math.sqrt(w * w + hh * hh);
        const vis = U.svg(300, 200, `<rect x="40" y="30" width="${w * 1.4}" height="${hh * 1.4}" rx="6" class="sv-tv"/>` + U.line(40, 30 + hh * 1.4, 40 + w * 1.4, 30, 'sv-dash2') + U.t(40 + w * 0.7, 30 + hh * 1.4 + 18, `${w} cm`, 'sv-t sv-mid') + U.t(34, 30 + hh * 0.7, `${hh} cm`, 'sv-t sv-end'));
        return N(`Ein Bildschirm ist ${w} cm breit und ${hh} cm hoch. Wie lang ist die Bildschirmdiagonale?` + RND, dg, { unit: 'cm', tol: 0.06, vis, memOk: false, hints: ['Die Diagonale teilt das Rechteck in zwei rechtwinklige Dreiecke.'], sol: `d = √(${w}² + ${hh}²) ≈ ${U.fmt(dg, 1)} cm` });
      }
      const len = U.ri(3, 9), rise = U.pick([0.3, 0.4, 0.5, 0.6, 0.8]);
      const r = Math.sqrt(len * len + rise * rise);
      return N(`Eine Rampe überwindet ${U.fmt(rise)} m Höhe auf ${len} m waagerechter Länge. Wie lang ist die Rampe?` + ' <span class="note">(auf zwei Nachkommastellen runden)</span>', r, { unit: 'm', tol: 0.006, vis: rightTri(len, rise * 4, `${len} m`, `${U.fmt(rise)} m`, '?'), memOk: false, hints: ['Die Rampe ist die Hypotenuse.'], sol: `√(${len}² + ${U.fmt(rise)}²) ≈ ${U.fmt(r, 2)} m` });
    },
  });

  /* ---------- 2 Wurzel-Jagd ---------- */
  R({
    id: 'k9-wurzel', icon: '🌱', title: 'Wurzel-Jagd', tags: ['Rechnen'],
    bp: 'Zahl – Variable – Operation', desc: 'Quadratwurzeln ziehen, abschätzen und vereinfachen.',
    gen(l) {
      if (l === 1) {
        if (U.chance(0.7)) { const n = U.ri(2, 20); return N(U.expr(`√${n * n} = ?`), n, { mq: `√${n * n}`, hints: ['Welche Zahl mal sich selbst ergibt ' + n * n + '?'], sol: `${n} · ${n} = ${n * n}, also √${n * n} = ${n}`, mistakes: [{ v: (n * n) / 2, msg: 'Wurzelziehen ist nicht Halbieren!' }] }); }
        const n = U.ri(1, 9);
        return N(U.expr(`√${U.fmt((n * n) / 100, 2)} = ?`), n / 10, { mq: `√${U.fmt((n * n) / 100, 2)}`, hints: [`√${U.fmt((n * n) / 100, 2)} = √${n * n} : √100`], sol: `${U.fmt(n / 10)} · ${U.fmt(n / 10)} = ${U.fmt((n * n) / 100)}` });
      }
      if (l === 2) {
        if (U.chance(0.5)) {
          const k = U.ri(2, 14); let n; do n = U.ri(k * k + 1, (k + 1) * (k + 1) - 1); while (false);
          const t = { q: `Zwischen welchen ganzen Zahlen liegt <span class="expr inl">√${n}</span>?`, mq: `√${n} liegt zwischen`, hints: ['Suche die Quadratzahlen direkt unter und über ' + n + '.'], sol: `${k}² = ${k * k} < ${n} < ${(k + 1) * (k + 1)} = ${(k + 1)}²` };
          return U.choice(t, `${k} und ${k + 1}`, [`${k - 1} und ${k}`, `${k + 1} und ${k + 2}`, { h: `${Math.floor(n / 2)} und ${Math.floor(n / 2) + 1}`, msg: 'Wurzelziehen ist nicht Halbieren!' }]);
        }
        const a = U.pick([2, 3, 5, 6, 7]), m = U.pick([2, 8, 18, 32, 50]);
        if (U.chance(0.5)) {
          const [p, q] = U.pick([[2, 8], [3, 12], [2, 18], [5, 20], [3, 27], [2, 32], [6, 24], [7, 28]]);
          return N(U.expr(`√${p} · √${q} = ?`), Math.sqrt(p * q), { mq: `√${p} · √${q}`, hints: ['√a · √b = √(a · b)'], sol: `√${p * q} = ${Math.sqrt(p * q)}` });
        }
        return N(U.expr(`(√${a * m})² = ?`), a * m, { mq: `(√${a * m})²`, hints: ['Quadrieren hebt das Wurzelziehen auf.'], sol: `(√${a * m})² = ${a * m}` });
      }
      const k = U.ri(2, 9), m = U.pick([2, 3, 5, 6, 7]);
      if (U.chance(0.6)) {
        const t = { q: `Ziehe teilweise die Wurzel: <span class="expr inl">√${k * k * m}</span>`, mq: `√${k * k * m}`, hints: [`Zerlege ${k * k * m} in eine Quadratzahl mal eine andere Zahl.`], sol: `√${k * k * m} = √(${k * k} · ${m}) = ${k}√${m}` };
        return U.choice(t, `${k}√${m}`, [`${m}√${k}`, { h: `${k * k}√${m}`, msg: 'Aus ' + k * k + ' wird die Wurzel gezogen: √' + k * k + ' = ' + k }, `${k}√${m * k}`, `${2 * k}√${m}`]);
      }
      const p = U.ri(2, 9), q = U.ri(2, 9);
      return N(U.expr(`√${p * p * 2} : √2 + √${q * q} = ?`), p + q, { mq: `√${p * p * 2} : √2 + √${q * q}`, hints: ['√a : √b = √(a : b)'], sol: `√${p * p} + ${q} = ${p} + ${q} = ${p + q}` });
    },
  });

  /* ---------- 3 Parabel-Schütze ---------- */
  R({
    id: 'k9-parabel', icon: '🎯', title: 'Parabel-Schütze', tags: ['visuell'],
    bp: 'Funktionaler Zusammenhang', desc: 'Scheitelpunkte finden und Parabeln ins Ziel schießen.',
    gen(l) {
      const P = U.plane({ xmin: -6, xmax: 6, ymin: -6, ymax: 8 });
      const sform = (a, d, e) => `y = ${a === 1 ? '' : a === -1 ? '−' : U.fmt(a)}(${U.lin(1, -d)})²${e ? (e < 0 ? ' − ' + -e : ' + ' + e) : ''}`.replace('(x)²', 'x²');
      if (l === 1) {
        const d = U.ri(-4, 4), e = U.ri(-5, 5);
        const vis = P.wrap(P.curve((x) => (x - d) ** 2 + e, 'sv-c2 thick') + P.point(d, e, 'S'));
        const t = { q: 'Lies den Scheitelpunkt S der Parabel ab.', vis, memOk: false, hints: ['Der Scheitelpunkt ist der tiefste Punkt der Parabel.'], sol: `S(${U.fmt(d)}|${U.fmt(e)})` };
        return U.choice(t, `S(${U.fmt(d)}|${U.fmt(e)})`, [{ h: `S(${U.fmt(e)}|${U.fmt(d)})`, msg: 'Koordinaten vertauscht: Erst x, dann y!' }, `S(${U.fmt(-d)}|${U.fmt(e)})`, `S(${U.fmt(d)}|${U.fmt(-e)})`, `S(${U.fmt(d + 1)}|${U.fmt(e)})`]);
      }
      if (l === 2) {
        const a = U.pick([1, 1, -1]), d = U.rnz(-4, 4), e = a > 0 ? U.ri(-5, 3) : U.ri(-1, 6);
        const vis = P.wrap(P.curve((x) => a * (x - d) ** 2 + e, 'sv-c2 thick') + P.point(d, e, ''));
        const t = { q: 'Welche Gleichung gehört zur Parabel?', vis, memOk: false, hints: ['Scheitelpunktform: y = a(x − d)² + e mit S(d|e).', 'Achtung: Bei S(2|…) steht in der Klammer x − 2!'], sol: `S(${U.fmt(d)}|${U.fmt(e)}), ${a > 0 ? 'nach oben' : 'nach unten'} geöffnet → ${sform(a, d, e)}` };
        return U.choice(t, sform(a, d, e), [{ h: sform(a, -d, e), msg: 'Vorzeichenfalle! S(d|e) → (x − d). Bei d = 3 steht also (x − 3).' }, sform(a, d, -e), { h: sform(-a, d, e), msg: 'Ist die Parabel nach oben oder unten geöffnet?' }, sform(a, e === 0 ? d + 1 : e, d)]);
      }
      if (U.chance(0.65)) {
        let d, xt, yt, e;
        do { d = U.ri(-3, 3); xt = U.ri(-5, 5); yt = U.ri(-2, 7); e = yt - (xt - d) ** 2; } while (xt === d || e < -6 || e > 7);
        const vis = P.wrap(U.line(P.X(d), P.Y(-6), P.X(d), P.Y(8), 'sv-dash') + `<text x="${P.X(xt)}" y="${P.Y(yt) + 9}" class="sv-target">🎯</text>` + U.t(P.X(xt) + 14, P.Y(yt) - 10, `T(${U.fmt(xt)}|${U.fmt(yt)})`, 'sv-lbl') + U.t(P.X(d) + 4, P.Y(-6) - 6, `x = ${U.fmt(d)}`, 'sv-ax'));
        return N(`Eine nach oben geöffnete Normalparabel hat ihren Scheitel auf der Linie x = ${U.fmt(d)}. Wie groß muss e sein (S(${U.fmt(d)}|e)), damit sie das Ziel T trifft?`, e, { vis, memOk: false, hints: [`Setze T in y = (x − ${U.par(d)})² + e ein.`], sol: `T einsetzen: ${U.fmt(yt)} = (${U.fmt(xt)} − ${U.par(d)})² + e = ${(xt - d) ** 2} + e → e = ${U.fmt(e)}`, mistakes: [{ v: yt + (xt - d) ** 2, msg: 'Fast – du musst (x − d)² abziehen, nicht addieren.' }] });
      }
      const d = U.ri(-2, 2), k = U.ri(1, 4);
      const vis = P.wrap(P.curve((x) => (x - d) ** 2 - k * k, 'sv-c2 thick'));
      return N(`Bestimme die <b>größere Nullstelle</b> von <span class="expr inl">${sform(1, d, -k * k)}</span>.`, d + k, { vis, mq: `${sform(1, d, -k * k)}: größere Nullstelle`, hints: ['Setze y = 0: (x − d)² = ' + k * k], sol: `y = 0: (${U.lin(1, -d)})² = ${k * k} → ${U.lin(1, -d)} = ±${k} → x = ${U.fmt(d - k)} oder x = ${U.fmt(d + k)}`, mistakes: [{ v: d - k, msg: 'Das ist die kleinere Nullstelle.' }] });
    },
  });

  /* ---------- 4 Gleichungssystem-Duo ---------- */
  R({
    id: 'k9-lgs', icon: '✖️', title: 'Gleichungssystem-Duo', tags: ['visuell', 'Text'],
    bp: 'Funktionaler Zusammenhang', desc: 'Zwei Gleichungen, zwei Unbekannte – grafisch und rechnerisch.',
    gen(l) {
      if (l === 1) {
        const x = U.ri(1, 10), y = U.ri(1, 10);
        const t = { q: `Löse das Gleichungssystem:<div class="sys"><span>x + y = ${x + y}</span><span>x − y = ${U.fmt(x - y)}</span></div>`, mq: `x + y = ${x + y}; x − y = ${U.fmt(x - y)}`, hints: ['Addiere beide Gleichungen – dann fällt y weg.'], sol: `2x = ${2 * x} → x = ${x}; y = ${x + y} − ${x} = ${y}` };
        return U.choice(t, `x = ${x}; y = ${y}`, [x !== y ? { h: `x = ${y}; y = ${x}`, msg: 'Setze zur Probe in die zweite Gleichung ein!' } : `x = ${x + 1}; y = ${y - 1}`, `x = ${x}; y = ${U.fmt(-y)}`, `x = ${x + y}; y = ${Math.abs(x - y)}`, `x = ${x - 1}; y = ${y + 1}`]);
      }
      if (l === 2) {
        let x0, y0, m1, m2, b1, b2;
        do { x0 = U.ri(-4, 4); y0 = U.ri(-4, 4); m1 = U.pick([-2, -1, 1, 2, 0.5, -0.5]); m2 = U.pick([-2, -1, 1, 2, 3, 0]); b1 = y0 - m1 * x0; b2 = y0 - m2 * x0; } while (m1 === m2 || !Number.isInteger(b1) || Math.abs(b1) > 6 || Math.abs(b2) > 6);
        const fx = (m, b) => [-5, 5].map((x) => [x, m * x + b]);
        const L1 = fx(m1, b1), L2 = fx(m2, b2);
        return {
          type: 'grid', grid: { xmin: -5, xmax: 5, ymin: -5, ymax: 5 }, answer: [x0, y0],
          gridLines: [{ x1: L1[0][0], y1: L1[0][1], x2: L1[1][0], y2: L1[1][1], c: 1 }, { x1: L2[0][0], y1: L2[0][1], x2: L2[1][0], y2: L2[1][1], c: 2 }],
          q: `Tippe auf den Schnittpunkt der Geraden <span class="c1">y = ${U.lin(m1, b1)}</span> und <span class="c2">y = ${U.lin(m2, b2)}</span> – er ist die Lösung des Gleichungssystems.`,
          hints: ['Der Schnittpunkt liegt auf beiden Geraden.'], sol: `Schnittpunkt (${U.fmt(x0)}|${U.fmt(y0)})`,
        };
      }
      if (U.chance(0.55)) {
        const pa = U.pick([8, 10, 12, 15]), pj = U.pick([4, 5, 6]), e = U.ri(20, 80), j = U.ri(20, 80);
        return N(`Für ein Schulkonzert wurden ${e + j} Karten verkauft. Erwachsene zahlen ${pa} €, Jugendliche ${pj} €. Die Einnahmen betragen ${e * pa + j * pj} €. Wie viele <b>Jugendkarten</b> wurden verkauft?`, j, { hints: ['x: Erwachsene, y: Jugendliche. Gleichung 1: Anzahl, Gleichung 2: Geld.', `x + y = ${e + j} und ${pa}x + ${pj}y = ${e * pa + j * pj}`], sol: `Einsetzen: ${pa}(${e + j} − y) + ${pj}y = ${e * pa + j * pj} → ${pa - pj}y = ${(e + j) * pa - (e * pa + j * pj)} → y = ${j}`, mistakes: [{ v: e, msg: 'Das sind die Erwachsenenkarten.' }] });
      }
      const k = U.ri(10, 30), r = U.ri(3, k - 3), hh = k - r;
      return N(`Auf einem Hof leben Hühner und Kaninchen. Zusammen haben sie ${k} Köpfe und ${2 * hh + 4 * r} Beine. Wie viele <b>Kaninchen</b> sind es?`, r, { hints: ['h + k = Köpfe, 2h + 4k = Beine'], sol: `Wären alle Hühner: ${2 * k} Beine. Es sind ${2 * r} mehr → ${r} Kaninchen.`, mistakes: [{ v: hh, msg: 'Das ist die Anzahl der Hühner.' }] });
    },
  });

  /* ---------- 5 Kreis-Werkstatt ---------- */
  function circle(r, label, diam) {
    let s = `<circle cx="120" cy="120" r="95" class="sv-shape"/><circle cx="120" cy="120" r="4" class="sv-dot2"/>`;
    if (diam) s += U.line(25, 120, 215, 120, 'sv-c2') + U.t(120, 112, label, 'sv-t sv-mid');
    else s += U.line(120, 120, 120 + 95 * Math.cos(-0.5), 120 + 95 * Math.sin(-0.5), 'sv-c2') + U.t(185, 108, label, 'sv-t');
    return U.svg(240, 240, s);
  }
  R({
    id: 'k9-kreis', icon: '⭕', title: 'Kreis-Werkstatt', tags: ['visuell'],
    bp: 'Messen', desc: 'Umfang und Fläche von Kreisen – mit π.',
    gen(l) {
      const r = U.ri(2, 12);
      if (l === 1) {
        const diam = U.chance(0.4);
        const u = 2 * Math.PI * r;
        return N('Berechne den <b>Umfang</b> des Kreises.' + RND, u, { unit: 'cm', tol: 0.06, alts: [2 * 3.14 * r], vis: circle(r, diam ? `d = ${2 * r} cm` : `r = ${r} cm`, diam), memOk: false, hints: ['u = 2 · π · r = π · d'], sol: `u = 2 · π · ${r} ≈ ${U.fmt(u, 1)} cm`, mistakes: [{ v: Math.PI * r * r, msg: 'Das ist die Fläche!' }] });
      }
      if (l === 2) {
        const diam = U.chance(0.4);
        const A = Math.PI * r * r;
        return N('Berechne den <b>Flächeninhalt</b> des Kreises.' + RND, A, { unit: 'cm²', tol: 0.06, alts: [3.14 * r * r], vis: circle(r, diam ? `d = ${2 * r} cm` : `r = ${r} cm`, diam), memOk: false, hints: ['A = π · r²' + (diam ? ' – Achtung: Erst den Radius bestimmen!' : '')], sol: `A = π · ${r}² ≈ ${U.fmt(A, 1)} cm²`, mistakes: [{ v: Math.PI * 4 * r * r, msg: 'Du hast mit dem Durchmesser gerechnet – nimm den Radius!' }, { v: 2 * Math.PI * r, msg: 'Das ist der Umfang!' }] });
      }
      const k = U.ri(0, 2);
      if (k === 0) {
        const u = U.round(2 * Math.PI * r, 2);
        return N(`Ein Kreis hat den Umfang ${U.fmt(u, 2)} cm. Wie groß ist sein Radius?`, r, { unit: 'cm', tol: 0.06, vis: circle(r, 'r = ?'), memOk: false, hints: ['r = u : (2π)'], sol: `r = ${U.fmt(u, 2)} : (2π) ≈ ${r} cm` });
      }
      if (k === 1) {
        const R2 = r + U.ri(1, 5);
        const A = Math.PI * (R2 * R2 - r * r);
        const vis = U.svg(240, 240, `<circle cx="120" cy="120" r="100" class="sv-shape"/><circle cx="120" cy="120" r="${(100 * r) / R2}" class="sv-hole"/>` + U.t(120, 26, `R = ${R2} cm`, 'sv-t sv-mid') + U.t(120, 125, `r = ${r} cm`, 'sv-t sv-mid'));
        return N('Berechne die Fläche des <b>Kreisrings</b>.' + RND, A, { unit: 'cm²', tol: 0.06, alts: [3.14 * (R2 * R2 - r * r)], vis, memOk: false, hints: ['Großer Kreis minus kleiner Kreis.'], sol: `A = π · (${R2}² − ${r}²) ≈ ${U.fmt(A, 1)} cm²` });
      }
      const al = U.pick([30, 45, 60, 90, 120, 135, 150, 270]);
      const A = (al / 360) * Math.PI * r * r;
      const vis = U.svg(240, 240, `<circle cx="120" cy="120" r="95" class="sv-shape2"/><path d="${U.sector(120, 120, 95, 0, al)}" class="sv-shape"/>` + U.t(120 + 30 * Math.sin((al / 2) * Math.PI / 180), 125 - 30 * Math.cos((al / 2) * Math.PI / 180), `${al}°`, 'sv-t sv-mid sv-acc') + U.t(100, 230, `r = ${r} cm`, 'sv-t sv-mid'));
      return N('Berechne die Fläche des <b>Kreisausschnitts</b>.' + RND, A, { unit: 'cm²', tol: 0.06, alts: [(al / 360) * 3.14 * r * r], vis, memOk: false, hints: [`Der Ausschnitt ist ${al}/360 des ganzen Kreises.`], sol: `A = ${al}/360 · π · ${r}² ≈ ${U.fmt(A, 1)} cm²` });
    },
  });

  /* ---------- 6 Schatten-Messer ---------- */
  R({
    id: 'k9-strahlensatz', icon: '🌳', title: 'Schatten-Messer', tags: ['visuell', 'Text'],
    bp: 'Raum und Form', desc: 'Ähnlichkeit und Strahlensätze: Höhen über Schatten messen.',
    gen(l) {
      if (l < 3) {
        const st = l === 1 ? U.pick([1, 2]) : U.pick([1.5, 1.6, 1.2, 0.8]);
        const s1 = l === 1 ? U.pick([1, 2, 3, 4]) : U.pick([2, 2.5, 3, 4]);
        const k = l === 1 ? U.ri(3, 10) : U.ri(4, 12);
        const s2 = U.round(s1 * k, 2), h = U.round(st * k, 3);
        const vis = U.svg(380, 210, `<text x="345" y="40" class="sv-sun">☀️</text>` + U.line(20, 190, 370, 190, 'sv-ground') +
          `<rect x="70" y="${190 - 40}" width="6" height="40" class="sv-stick"/>` + U.line(73, 150, 73 + 40 * (s1 / st), 190, 'sv-ray2') + U.line(73, 190, 73 + 40 * (s1 / st), 190, 'sv-shadow') +
          `<text x="200" y="${190 - Math.min(150, 40 * k) + 32}" class="sv-tree">🌳</text>` + U.t(73, 140, `${U.fmt(st)} m`, 'sv-t sv-mid') + U.t(73 + 20 * (s1 / st), 206, `${U.fmt(s1)} m`, 'sv-t sv-mid') +
          U.t(260, 206, `Baum-Schatten: ${U.fmt(s2)} m`, 'sv-t sv-mid'));
        return N(`Ein ${U.fmt(st)} m langer Stab wirft einen ${U.fmt(s1)} m langen Schatten. Ein Baum wirft zur selben Zeit einen ${U.fmt(s2)} m langen Schatten. Wie hoch ist der Baum?`, h, { unit: 'm', tol: l === 1 ? 0.001 : 0.051, vis, memOk: false, hints: ['Höhe und Schatten stehen beim Stab im gleichen Verhältnis wie beim Baum.', `Der Baumschatten ist ${U.fmt(k)}-mal so lang wie der Stabschatten.`], sol: `${U.fmt(s2)} : ${U.fmt(s1)} = ${U.fmt(k)}; ${U.fmt(st)} m · ${U.fmt(k)} = ${U.fmt(h)} m` });
      }
      const a = U.ri(2, 8), b = U.ri(2, 8), c = U.ri(2, 6);
      const d = (c * (a + b)) / a;
      const Z = [30, 190];
      const ang1 = -0.15, ang2 = -0.55, sc = 20;
      const pA = [Z[0] + a * sc * Math.cos(ang1), Z[1] + a * sc * Math.sin(ang1)], pB = [Z[0] + (a + b) * sc * Math.cos(ang1), Z[1] + (a + b) * sc * Math.sin(ang1)];
      const pC = [Z[0] + a * sc * Math.cos(ang2), Z[1] + a * sc * Math.sin(ang2)], pD = [Z[0] + (a + b) * sc * Math.cos(ang2), Z[1] + (a + b) * sc * Math.sin(ang2)];
      let s = U.line(Z[0], Z[1], pB[0] + 30 * Math.cos(ang1), pB[1] + 30 * Math.sin(ang1), 'sv-ray') + U.line(Z[0], Z[1], pD[0] + 30 * Math.cos(ang2), pD[1] + 30 * Math.sin(ang2), 'sv-ray');
      s += U.line(...pA, ...pC, 'sv-c2') + U.line(...pB, ...pD, 'sv-c2');
      s += U.t(Z[0] - 6, Z[1] + 16, 'Z', 'sv-lbl') + U.edgeLabel(Z, pA, `${a} cm`, 14) + U.edgeLabel(pA, pB, `${b} cm`, 14);
      s += U.t((pA[0] + pC[0]) / 2 - 8, (pA[1] + pC[1]) / 2, `${c} cm`, 'sv-t sv-end') + U.t((pB[0] + pD[0]) / 2 + 8, (pB[1] + pD[1]) / 2, 'x', 'sv-t sv-acc');
      return N('Die farbig markierten Strecken sind parallel. Berechne x.' + RND, d, { unit: 'cm', tol: 0.06, vis: U.svg(400, 220, s), memOk: false, hints: ['2. Strahlensatz: x : ' + c + ' = ZB : ZA', `ZB = ${a} + ${b} = ${a + b} cm`], sol: `x = ${c} · ${a + b} : ${a} ≈ ${U.fmt(d, 1)} cm`, mistakes: [{ v: (c * b) / a, msg: 'Verwende die ganze Strecke ZB = ZA + AB!' }] });
    },
  });
})();
