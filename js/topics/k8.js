/* =========================================================
   Klasse 8 – Wahrscheinlichkeit, lineare Funktionen,
   Binome, Gleichungen, Zinsen, Prismen
   ========================================================= */
(function () {
  const U = MA.U;
  const R = (t) => MA.registerTopic(Object.assign({ grade: 8 }, t));
  const N = (q, answer, o = {}) => Object.assign({ type: 'num', q, answer }, o);
  const FR = (q, f, o = {}) => Object.assign({ type: 'frac', q, answer: U.frac(f.n, f.d) }, o);
  const F = U.F;

  /* ---------- 1 Glücksrad-Labor ---------- */
  const COLORS = [['rot', 'wr'], ['blau', 'wb'], ['gelb', 'wy'], ['grün', 'wg']];
  function wheel(assign) {
    const n = assign.length, cx = 120, cy = 125, r = 100;
    let s = '';
    assign.forEach((c, i) => { s += `<path d="${U.sector(cx, cy, r, (360 / n) * i, (360 / n) * (i + 1))}" class="${COLORS[c][1]}"/>`; });
    s += `<circle cx="${cx}" cy="${cy}" r="12" class="sv-hub"/><polygon points="${cx},${cy - r + 14} ${cx - 10},${cy - r - 12} ${cx + 10},${cy - r - 12}" class="sv-pointer"/>`;
    return U.svg(240, 240, s, 'wheel');
  }
  R({
    id: 'k8-gluecksrad', icon: '🎡', title: 'Glücksrad-Labor', tags: ['visuell', 'Daten'],
    bp: 'Daten und Zufall', desc: 'Wahrscheinlichkeiten am Glücksrad berechnen.',
    gen(l) {
      const n = U.pick([4, 5, 6, 8, 10, 12]);
      const k = n <= 5 ? 3 : 4;
      const counts = Array(k).fill(1);
      for (let i = k; i < n; i++) counts[U.ri(0, k - 1)]++;
      const assign = U.shuffle(counts.flatMap((c, i) => Array(c).fill(i)));
      const vis = wheel(assign);
      const ci = U.ri(0, k - 1), cn = COLORS[ci][0], r = counts[ci];
      if (l === 1) return FR(`Das Rad wird einmal gedreht. Wie groß ist die Wahrscheinlichkeit für <b>${cn}</b>?`, { n: r, d: n }, { vis, mq: '', hints: ['P = Anzahl günstiger Felder : Anzahl aller Felder'], sol: `${r} von ${n} Feldern sind ${cn}: P = ${F(r, n)}`, mistakes: r !== n - r ? [{ v: r / (n - r), msg: 'Teile durch die Anzahl ALLER Felder.' }] : [] });
      if (l === 2) {
        if (U.chance(0.5)) {
          let cj; do cj = U.ri(0, k - 1); while (cj === ci);
          return FR(`Wie groß ist die Wahrscheinlichkeit für <b>${cn} oder ${COLORS[cj][0]}</b>?`, { n: r + counts[cj], d: n }, { vis, mq: '', hints: ['Zähle alle Felder, die eine der beiden Farben haben.'], sol: `(${r} + ${counts[cj]}) von ${n}: P = ${U.Ff(U.frac(r + counts[cj], n))}` });
        }
        return FR(`Wie groß ist die Wahrscheinlichkeit, dass <b>nicht ${cn}</b> kommt?`, { n: n - r, d: n }, { vis, mq: '', hints: ['Gegenwahrscheinlichkeit: P(nicht A) = 1 − P(A)'], sol: `1 − ${F(r, n)} = ${U.Ff(U.frac(n - r, n))}`, mistakes: [{ v: r / n, msg: 'Das ist P(' + cn + ') – gesucht ist das Gegenteil!' }] });
      }
      const m = U.ri(0, 2);
      if (m === 0) return FR(`Das Rad wird <b>zweimal</b> gedreht. Wie groß ist die Wahrscheinlichkeit für <b>zweimal ${cn}</b>?`, { n: r * r, d: n * n }, { vis, mq: '', hints: ['Pfadregel: Wahrscheinlichkeiten entlang eines Pfades multiplizieren.'], sol: `${F(r, n)} · ${F(r, n)} = ${U.Ff(U.frac(r * r, n * n))}`, mistakes: [{ v: (2 * r) / n, msg: 'Entlang eines Pfades wird multipliziert, nicht addiert!' }] });
      if (m === 1) return FR(`Das Rad wird <b>zweimal</b> gedreht. Wie groß ist die Wahrscheinlichkeit für <b>mindestens einmal ${cn}</b>?`, { n: n * n - (n - r) * (n - r), d: n * n }, { vis, mq: '', hints: ['Gegenereignis: „kein einziges Mal ' + cn + '“.'], sol: `1 − ${F(n - r, n)} · ${F(n - r, n)} = ${U.Ff(U.frac(n * n - (n - r) * (n - r), n * n))}` });
      const N0 = n * U.pick([10, 20, 25, 50]);
      return N(`Das Rad wird <b>${N0}-mal</b> gedreht. Wie oft erwartest du ungefähr ${cn}?`, (N0 * r) / n, { vis, mq: '', hints: ['Erwartete Anzahl = Anzahl der Versuche · Wahrscheinlichkeit'], sol: `${N0} · ${F(r, n)} = ${(N0 * r) / n}` });
    },
  });

  /* ---------- 2 Graph-Detektiv ---------- */
  R({
    id: 'k8-graph', icon: '📈', title: 'Graph-Detektiv', tags: ['visuell'],
    bp: 'Funktionaler Zusammenhang', desc: 'Lineare Funktionen: Steigung und y-Achsenabschnitt ablesen.',
    gen(l) {
      const P = U.plane({ xmin: -6, xmax: 6, ymin: -6, ymax: 6 });
      let m, b;
      if (l === 1) { m = { n: U.pick([-2, -1, 1, 2, 3]), d: 1 }; b = U.ri(-4, 4); }
      else if (l === 2) { m = U.pick([{ n: -2, d: 1 }, { n: -1, d: 1 }, { n: 1, d: 1 }, { n: 2, d: 1 }, { n: 3, d: 1 }, { n: 1, d: 2 }, { n: -1, d: 2 }]); b = U.rnz(-4, 4); }
      else { m = U.pick([{ n: 1, d: 2 }, { n: -1, d: 2 }, { n: 1, d: 3 }, { n: -1, d: 3 }, { n: 2, d: 3 }, { n: -2, d: 3 }, { n: 3, d: 2 }, { n: -3, d: 2 }]); b = U.ri(-3, 3); }
      const f = (x) => (m.n / m.d) * x + b;
      let tri = '';
      if (l === 1) { // Steigungsdreieck
        tri = `<polyline points="${P.X(0)},${P.Y(b)} ${P.X(1)},${P.Y(b)} ${P.X(1)},${P.Y(b + m.n)}" class="sv-tri" fill="none"/>`;
      }
      const vis = P.wrap(P.curve(f, 'sv-c1 thick') + tri + P.point(0, b, ''));
      const eq = `y = ${U.linF(m, b)}`;
      if (l === 1) {
        if (U.chance(0.5)) return N('Wo schneidet die Gerade die y-Achse? Gib den y-Achsenabschnitt b an.', b, { vis, mq: '', memOk: false, hints: ['Schau, wo die Gerade die senkrechte Achse kreuzt.'], sol: `Schnittpunkt (0|${U.fmt(b)}), also b = ${U.fmt(b)}` });
        return N('Wie groß ist die Steigung m? (Das Steigungsdreieck hilft!)', m.n, { vis, mq: '', memOk: false, hints: ['Gehe 1 nach rechts. Wie viel geht es nach oben (+) oder unten (−)?'], sol: `1 nach rechts, ${Math.abs(m.n)} nach ${m.n > 0 ? 'oben' : 'unten'}: m = ${m.n}`, mistakes: [{ v: -m.n, msg: 'Fällt die Gerade, ist die Steigung negativ.' }] });
      }
      if (l === 2) {
        const t = { q: 'Welche Funktionsgleichung gehört zum Graphen?', vis, memOk: false, hints: ['Lies zuerst b am y-Achsenabschnitt ab, dann die Steigung m.'], sol: `b = ${U.fmt(b)}, m = ${U.ft(m)} → ${eq}` };
        return U.choice(t, eq, [{ h: `y = ${U.linF({ n: -m.n, d: m.d }, b)}`, msg: 'Prüfe, ob die Gerade steigt oder fällt.' }, { h: `y = ${U.linF(m, -b)}`, msg: 'Schau nochmal genau, wo die y-Achse geschnitten wird.' }, { h: `y = ${U.lin(b || 1, m.n / m.d)}`, msg: 'm und b vertauscht!' }, `y = ${U.linF({ n: m.n * 2, d: m.d }, b)}`]);
      }
      if (U.chance(0.5) || b === 0) return FR('Bestimme die Steigung m der Geraden (als Bruch).', m, { vis, mq: '', memOk: false, hints: ['Suche zwei Gitterpunkte auf der Geraden. m = Höhenunterschied : Breitenunterschied.'], sol: `m = ${U.Ff(m)}`, mistakes: [{ v: -m.n / m.d, msg: 'Vorzeichen! Steigt oder fällt die Gerade?' }, { v: m.d / m.n, msg: 'Kehrwert erwischt: m = senkrecht : waagerecht.' }] });
      const x0 = U.frac(-b * m.d, m.n);
      return FR(`Die Gerade hat die Gleichung <span class="expr inl">${eq}</span>. Wo liegt ihre <b>Nullstelle</b>?`, x0, { vis, mq: eq + ': Nullstelle', memOk: false, hints: ['Nullstelle: y = 0 setzen und nach x auflösen.'], sol: `0 = ${U.linF(m, b)} → x = ${U.Ff(x0)}` });
    },
  });

  /* ---------- 3 Binomi-Blaster ---------- */
  R({
    id: 'k8-binom', icon: '💥', title: 'Binomi-Blaster', tags: ['Rechnen'],
    bp: 'Zahl – Variable – Operation', desc: 'Ausmultiplizieren, binomische Formeln, faktorisieren.',
    gen(l) {
      if (l === 1) {
        const k = U.rnz(-6, 7), a = U.ri(1, 5), b = U.rnz(-9, 9);
        const T = `${k === -1 ? '−' : k === 1 ? '' : U.fmt(k)}(${U.lin(a, b)})`;
        const t = { q: `Multipliziere aus: <span class="expr inl">${T}</span>`, mq: T, hints: ['Der Faktor vor der Klammer wird mit JEDEM Glied multipliziert.'], sol: `${T} = ${U.lin(k * a, k * b)}` };
        return U.choice(t, U.lin(k * a, k * b), [{ h: U.lin(k * a, b), msg: 'Auch das zweite Glied muss multipliziert werden!' }, { h: U.lin(k * a, -k * b), msg: 'Vorzeichenfehler beim zweiten Glied.' }, U.lin(k + a, k * b), U.lin(a, k * b)]);
      }
      if (l === 2) {
        const a = U.rnz(-7, 7), b = U.rnz(-7, 7);
        const T = `(${U.lin(1, a)})(${U.lin(1, b)})`;
        const c = U.poly([1, a + b, a * b]);
        const t = { q: `Multipliziere aus: <span class="expr inl">${T}</span>`, mq: T, hints: ['Jedes Glied der ersten Klammer mit jedem Glied der zweiten multiplizieren.'], sol: `x² + ${U.par(a)}x + ${U.par(b)}x + ${U.par(a)} · ${U.par(b)} = ${c}` };
        return U.choice(t, c, [{ h: U.poly([1, 0, a * b]), msg: 'Die gemischten Glieder fehlen!' }, { h: U.poly([1, a * b, a + b]), msg: 'Glieder vertauscht.' }, { h: U.poly([1, a + b, -(a * b)]), msg: 'Vorzeichenfehler beim Produkt der Zahlen.' }, U.poly([1, a - b, a * b])]);
      }
      const k = U.ri(0, 2);
      const p = U.ri(1, 3), q = U.ri(1, 9), v = p === 1 ? 'x' : p + 'x';
      if (k === 0) {
        const plus = U.chance(0.5);
        const T = `(${v} ${plus ? '+' : '−'} ${q})²`;
        const c = U.poly([p * p, (plus ? 2 : -2) * p * q, q * q]);
        const t = { q: `Binomische Formel: <span class="expr inl">${T}</span>`, mq: T, hints: [plus ? '(a + b)² = a² + 2ab + b²' : '(a − b)² = a² − 2ab + b²'], sol: `${T} = ${c}` };
        return U.choice(t, c, [{ h: U.poly([p * p, 0, plus ? q * q : -q * q]), msg: 'Das gemischte Glied 2ab fehlt!' }, { h: U.poly([p * p, (plus ? 1 : -1) * p * q, q * q]), msg: 'Das gemischte Glied heißt 2ab – nicht ab.' }, { h: U.poly([p * p, (plus ? 2 : -2) * p * q, -q * q]), msg: 'b² ist immer positiv.' }, U.poly([p, (plus ? 2 : -2) * p * q, q])]);
      }
      if (k === 1) {
        const T = `(${v} + ${q})(${v} − ${q})`;
        const c = U.poly([p * p, 0, -q * q]);
        const t = { q: `Binomische Formel: <span class="expr inl">${T}</span>`, mq: T, hints: ['(a + b)(a − b) = a² − b²'], sol: `${T} = ${c}` };
        return U.choice(t, c, [{ h: U.poly([p * p, 0, q * q]), msg: 'Bei der 3. binomischen Formel steht ein Minus!' }, { h: U.poly([p * p, 2 * p * q, -q * q]), msg: 'Die gemischten Glieder heben sich gegenseitig auf.' }, U.poly([p * p, -2 * p * q, q * q])]);
      }
      const plus = U.chance(0.5);
      const P2 = U.poly([p * p, (plus ? 2 : -2) * p * q, q * q]);
      const c = `(${v} ${plus ? '+' : '−'} ${q})²`;
      const t = { q: `Faktorisiere: <span class="expr inl">${P2}</span>`, mq: P2, hints: ['Suche a² und b² – passt das gemischte Glied 2ab?'], sol: `${P2} = ${c}` };
      return U.choice(t, c, [{ h: `(${v} ${plus ? '−' : '+'} ${q})²`, msg: 'Das Vorzeichen des gemischten Glieds zeigt, ob + oder −.' }, `(${v} + ${q})(${v} − ${q})`, `(${v} ${plus ? '+' : '−'} ${q * q})²`]);
    },
  });

  /* ---------- 4 Gleichungs-Knacker ---------- */
  R({
    id: 'k8-gleichung', icon: '🔓', title: 'Gleichungs-Knacker', tags: ['Rechnen', 'Text'],
    bp: 'Zahl – Variable – Operation', desc: 'Gleichungen mit Klammern und Zahlenrätsel lösen.',
    gen(l) {
      if (l === 1) {
        let a, c; do { a = U.ri(2, 9); c = U.ri(1, 8); } while (a === c);
        const x = U.rnz(-10, 10), b = U.rnz(-15, 15), d = (a - c) * x + b;
        const eq = `${U.lin(a, b)} = ${U.lin(c, d)}`;
        return N(`Löse die Gleichung: <span class="expr inl">${eq}</span>`, x, { mq: eq, hints: ['Bringe alle x auf eine Seite, alle Zahlen auf die andere.'], sol: `${U.lin(a - c, 0)} = ${d - b} → x = ${x}` });
      }
      if (l === 2) {
        let k, c; do { k = U.ri(2, 5); c = U.ri(1, 6); } while (k === c);
        const m = U.rnz(-6, 6), x = U.rnz(-8, 8), d = k * (x - m) - c * x;
        const eq = `${k}(${U.lin(1, -m)}) = ${U.lin(c, d)}`;
        return N(`Löse die Gleichung: <span class="expr inl">${eq}</span>`, x, { mq: eq, hints: ['Löse zuerst die Klammer auf.'], sol: `${U.lin(k, -k * m)} = ${U.lin(c, d)} → ${U.lin(k - c, 0)} = ${d + k * m} → x = ${x}`, mistakes: [{ v: (d + m) / (k - c), msg: 'Beim Ausmultiplizieren muss auch die Zahl in der Klammer mit ' + k + ' malgenommen werden.' }] });
      }
      const kk = U.ri(0, 2);
      if (kk === 0) {
        let a, c; do { a = U.ri(3, 7); c = U.ri(2, 5); } while (a <= c);
        const x = U.ri(2, 15), b = U.ri(2, 12), d = (a - c) * x - b;
        if (d <= 0) return this.gen(l);
        const W = ['', '', 'Doppelte', 'Dreifache', 'Vierfache', 'Fünffache', 'Sechsfache', 'Siebenfache'];
        return N(`Zahlenrätsel: Das ${W[a]} einer Zahl, vermindert um ${b}, ist genauso groß wie das ${W[c]} der Zahl, vermehrt um ${d}. Wie heißt die Zahl?`, x, { hints: ['Nenne die Zahl x und stelle eine Gleichung auf.', `${a}x − ${b} = ${c}x + ${d}`], sol: `${a}x − ${b} = ${c}x + ${d} → ${a - c}x = ${d + b} → x = ${x}` });
      }
      if (kk === 1) {
        const [k, j] = U.pick([[3, 2], [4, 2], [5, 3], [4, 3]]);
        const nn = U.ri(2, 8) * (k - j);
        const x = (nn * (j - 1)) / (k - j);
        return N(`Eine Mutter ist heute ${k}-mal so alt wie ihr Sohn. In ${nn} Jahren ist sie nur noch ${j}-mal so alt wie er. Wie alt ist der Sohn heute?`, x, { unit: 'Jahre', hints: ['Sohn heute: x, Mutter heute: ' + k + 'x. Beide werden ' + nn + ' Jahre älter.', `${k}x + ${nn} = ${j}(x + ${nn})`], sol: `${k}x + ${nn} = ${j}x + ${j * nn} → ${k - j}x = ${(j - 1) * nn} → x = ${x}` });
      }
      const bb = U.ri(2, 12), dd = U.ri(2, 8), Uu = 2 * (bb + bb + dd);
      return N(`Ein Rechteck ist ${dd} cm länger als breit. Sein Umfang beträgt ${Uu} cm. Wie breit ist es?`, bb, { unit: 'cm', hints: ['Breite: x, Länge: x + ' + dd, `2 · (x + x + ${dd}) = ${Uu}`], sol: `4x + ${2 * dd} = ${Uu} → x = ${bb} cm` });
    },
  });

  /* ---------- 5 Zins-Bank ---------- */
  R({
    id: 'k8-zinsen', icon: '🏦', title: 'Zins-Bank', tags: ['Text'],
    bp: 'Zahl – Variable – Operation', desc: 'Zinsen, Zinssatz, Kapital – und der Zinseszins.',
    gen(l) {
      const K = U.ri(2, 50) * 100, p = U.pick([1, 1.5, 2, 2.5, 3, 4, 5]);
      const Z = U.round((K * p) / 100, 2);
      if (l === 1) return N(`${U.euro(K)} werden ein Jahr lang zu <b>${U.fmt(p)} %</b> angelegt. Wie viel Zinsen gibt es?`, Z, { unit: '€', tol: 0.001, mq: `Zinsen: ${U.euro(K)} zu ${U.fmt(p)} %`, hints: ['Z = K · p : 100'], sol: `${U.euro(K)} · ${U.fmt(p)} : 100 = ${U.euro(Z)}` });
      if (l === 2) {
        if (U.chance(0.5)) return N(`Für ${U.euro(K)} gibt es nach einem Jahr ${U.euro(Z)} Zinsen. Wie hoch ist der Zinssatz?`, p, { unit: '%', mq: `${U.euro(K)} → ${U.euro(Z)} Zinsen: p?`, hints: ['p = Z : K · 100'], sol: `${U.euro(Z)} : ${U.euro(K)} · 100 = ${U.fmt(p)} %` });
        return N(`Bei ${U.fmt(p)} % Zinssatz bekommt jemand nach einem Jahr ${U.euro(Z)} Zinsen. Wie viel Geld wurde angelegt?`, K, { unit: '€', tol: 0.001, mq: `${U.fmt(p)} % ergeben ${U.euro(Z)}: K?`, hints: ['K = Z : p · 100'], sol: `${U.euro(Z)} : ${U.fmt(p)} · 100 = ${U.euro(K)}` });
      }
      if (U.chance(0.5)) {
        const m = U.pick([3, 4, 6, 8, 9]);
        const z = U.round((K * p * m) / 1200, 2);
        return N(`${U.euro(K)} liegen ${m} Monate zu ${U.fmt(p)} % auf dem Konto. Wie viel Zinsen gibt es?`, z, { unit: '€', tol: 0.011, hints: ['Jahreszinsen berechnen und dann mit ' + m + '/12 malnehmen.'], sol: `${U.euro(Z)} · ${m}/12 = ${U.euro(z)}`, mistakes: [{ v: Z, msg: 'Das sind die Zinsen für ein ganzes Jahr!' }] });
      }
      const n = U.pick([2, 3]);
      const end = U.round(K * Math.pow(1 + p / 100, n), 2);
      return N(`${U.euro(K)} werden ${n} Jahre zu ${U.fmt(p)} % mit <b>Zinseszins</b> angelegt. Wie hoch ist das Guthaben danach? (auf Cent runden)`, end, { unit: '€', tol: 0.011, hints: ['Jedes Jahr wird das Guthaben mit dem Zinsfaktor ' + U.fmt(1 + p / 100, 3) + ' multipliziert.'], sol: `${U.euro(K)} · ${U.fmt(1 + p / 100, 3)}${n === 2 ? '²' : '³'} = ${U.euro(end)}`, mistakes: [{ v: U.round(K * (1 + (n * p) / 100), 2), msg: 'Beim Zinseszins werden auch die Zinsen mitverzinst!' }] });
    },
  });

  /* ---------- 6 Quader & Prisma ---------- */
  function cuboid(a, b, c, la, lb, lc) {
    const sc = Math.min(180 / a, 120 / c, 70 / b);
    const w = a * sc, h = c * sc, dx = b * sc * 0.7, dy = b * sc * 0.5;
    const x0 = 40, y0 = 30 + dy;
    let s = `<polygon points="${x0},${y0} ${x0 + dx},${y0 - dy} ${x0 + dx + w},${y0 - dy} ${x0 + w},${y0}" class="sv-face2"/>`;
    s += `<polygon points="${x0 + w},${y0} ${x0 + w + dx},${y0 - dy} ${x0 + w + dx},${y0 - dy + h} ${x0 + w},${y0 + h}" class="sv-face3"/>`;
    s += `<rect x="${x0}" y="${y0}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" class="sv-shape"/>`;
    s += U.t(x0 + w / 2, y0 + h + 20, la, 'sv-t sv-mid') + U.t(x0 + w + dx / 2 + 12, y0 + h - dy / 2 + 6, lb, 'sv-t') + U.t(x0 - 8, y0 + h / 2 + 5, lc, 'sv-t sv-end');
    return U.svg(x0 + w + dx + 60, y0 + h + 34, s);
  }
  function prism(g, hh, len) {
    const sc = 12, x0 = 40, y0 = 150;
    const A = [x0, y0], B = [x0 + g * sc, y0], C = [x0, y0 - hh * sc];
    const d = [len * 7, -len * 4];
    const A2 = [A[0] + d[0], A[1] + d[1]], B2 = [B[0] + d[0], B[1] + d[1]], C2 = [C[0] + d[0], C[1] + d[1]];
    let s = U.poly2([B, B2, C2, C], 'sv-face3') + U.poly2([A, C, C2, A2], 'sv-face2') + U.poly2([A, B, C]);
    s += U.line(A[0], A[1], A2[0], A2[1], 'sv-dash') + U.line(A2[0], A2[1], B2[0], B2[1], 'sv-dash') + U.rightMark(A, B, C, 10);
    s += U.t((A[0] + B[0]) / 2, y0 + 20, `${g} cm`, 'sv-t sv-mid') + U.t(x0 - 8, y0 - hh * sc / 2, `${hh} cm`, 'sv-t sv-end') + U.t((B[0] + B2[0]) / 2 + 16, (B[1] + B2[1]) / 2 + 8, `${len} cm`, 'sv-t');
    return U.svg(Math.max(B2[0], C2[0]) + 70, y0 + 30, s);
  }
  R({
    id: 'k8-prisma', icon: '📦', title: 'Quader & Prisma', tags: ['visuell'],
    bp: 'Messen', desc: 'Volumen und Oberfläche von Quadern und Prismen.',
    gen(l) {
      const a = U.ri(2, 12), b = U.ri(2, 10), c = U.ri(2, 10);
      if (l === 1) return N('Berechne das <b>Volumen</b> des Quaders.', a * b * c, { unit: 'cm³', vis: cuboid(a, b, c, `${a} cm`, `${b} cm`, `${c} cm`), mq: `V Quader ${a} × ${b} × ${c} cm`, hints: ['V = a · b · c'], sol: `${a} · ${b} · ${c} = ${a * b * c} cm³` });
      if (l === 2) {
        if (U.chance(0.5)) return N('Berechne die <b>Oberfläche</b> des Quaders.', 2 * (a * b + a * c + b * c), { unit: 'cm²', vis: cuboid(a, b, c, `${a} cm`, `${b} cm`, `${c} cm`), mq: `O Quader ${a} × ${b} × ${c} cm`, hints: ['Ein Quader hat 6 Flächen – je zwei sind gleich groß.', 'O = 2 · (ab + ac + bc)'], sol: `2 · (${a * b} + ${a * c} + ${b * c}) = ${2 * (a * b + a * c + b * c)} cm²`, mistakes: [{ v: a * b * c, msg: 'Das ist das Volumen!' }, { v: a * b + a * c + b * c, msg: 'Jede Fläche kommt zweimal vor!' }] });
        const V = a * b * c;
        return N(`Ein Quader hat das Volumen ${V} cm³. Die Grundfläche ist ${a} cm × ${b} cm. Wie hoch ist er?`, c, { unit: 'cm', vis: cuboid(a, b, c, `${a} cm`, `${b} cm`, 'h = ?'), mq: `V = ${V} cm³, G = ${a} · ${b} cm² → h`, hints: ['V = G · h, also h = V : G'], sol: `${V} : ${a * b} = ${c} cm` });
      }
      let g = U.ri(2, 8) * 2, hh = U.ri(2, 9), len = U.ri(3, 12);
      if (U.chance(0.6)) return N('Berechne das <b>Volumen</b> des dreiseitigen Prismas.', (g * hh * len) / 2, { unit: 'cm³', vis: prism(g, hh, len), mq: `V Prisma: Dreieck ${g}/${hh} cm, Länge ${len} cm`, hints: ['V = Grundfläche · Höhe des Prismas', `Grundfläche = Dreieck: ${g} · ${hh} : 2`], sol: `G = ${g} · ${hh} : 2 = ${(g * hh) / 2} cm²; V = ${(g * hh) / 2} · ${len} = ${(g * hh * len) / 2} cm³`, mistakes: [{ v: g * hh * len, msg: 'Die Dreiecksfläche ist nur die Hälfte von g · h!' }] });
      const V = a * b * c * 1000;
      return N(`Ein Aquarium ist ${a * 10} cm lang, ${b * 10} cm breit und ${c * 10} cm hoch. Wie viele <b>Liter</b> passen hinein?`, V / 1000, { unit: 'l', vis: cuboid(a, b, c, `${a * 10} cm`, `${b * 10} cm`, `${c * 10} cm`), hints: ['1 Liter = 1 dm³ = 1000 cm³. Rechne gleich in dm!'], sol: `${a} dm · ${b} dm · ${c} dm = ${a * b * c} dm³ = ${a * b * c} l`, mistakes: [{ v: V, msg: 'Das sind cm³ – rechne noch in Liter um (: 1000).' }] });
    },
  });
})();
