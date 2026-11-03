/* =========================================================
   Klasse 6 – Brüche, Dezimalzahlen, Winkel, Daten
   ========================================================= */
(function () {
  const U = MA.U;
  const R = (t) => MA.registerTopic(Object.assign({ grade: 6 }, t));
  const N = (q, answer, o = {}) => Object.assign({ type: 'num', q, answer }, o);
  const FR = (q, f, o = {}) => Object.assign({ type: 'frac', q, answer: U.frac(f.n, f.d) }, o);
  const F = U.F;

  /* ---------- 1 Bruch-Pizzeria ---------- */
  R({
    id: 'k6-pizza', icon: '🍕', title: 'Bruch-Pizzeria', tags: ['visuell'],
    bp: 'Zahl – Variable – Operation', desc: 'Brüche sehen, schätzen und berechnen – mit Pizza!',
    gen(l) {
      if (l === 1) {
        const d = U.pick([2, 3, 4, 5, 6, 8]), k = U.ri(1, d - 1);
        return FR('Welcher Bruchteil der Pizza ist mit Salami belegt?', { n: k, d }, {
          vis: U.pizza(d, k), mq: '', hints: ['Nenner = Anzahl aller Stücke, Zähler = Anzahl der belegten Stücke.'],
          sol: `${k} von ${d} Stücken ${k === 1 ? 'ist' : 'sind'} belegt: ${F(k, d)}${U.gcd(k, d) > 1 ? ' = ' + U.Ff(U.frac(k, d)) : ''}`,
          mistakes: [{ v: (d - k) / d, msg: 'Das ist der Teil OHNE Salami.' }, ...(d - k !== k ? [{ v: k / (d - k), msg: 'Unten steht die Anzahl ALLER Stücke.' }] : [])],
        });
      }
      if (l === 2) {
        if (U.chance(0.5)) {
          const d = U.pick([6, 8, 10, 12]);
          let k; do k = U.ri(1, d - 1); while (U.gcd(d - k, d) === 1);
          const f = U.frac(d - k, d);
          return FR('Welcher Bruchteil der Pizza ist <b>nicht</b> belegt? Gib vollständig gekürzt an.', f, { simplify: true, vis: U.pizza(d, k), mq: '', hints: ['Zähle die freien Stücke.', `Kürze ${d - k}/${d} durch ${U.gcd(d - k, d)}.`], sol: `${d - k}/${d} = ${U.Ff(f)}` });
        }
        const d = U.pick([4, 6, 8]), k1 = U.ri(1, d - 1), k2 = U.ri(1, d - 1);
        const vis = `<div class="row">${U.pizza(d, k1, 'sm')}${U.pizza(d, k2, 'sm')}</div>`;
        return FR('Zwei gleich große Pizzen: Wie viele Pizzen sind <b>insgesamt</b> belegt? (als Bruch)', { n: k1 + k2, d }, { vis, mq: '', hints: ['Gleiche Stückgröße: Die belegten Stücke einfach zusammenzählen.'], sol: `${F(k1, d)} + ${F(k2, d)} = ${F(k1 + k2, d)}`, mistakes: [{ v: (k1 + k2) / (2 * d), msg: 'Die Nenner werden nicht addiert – die Stückgröße bleibt gleich!' }] });
      }
      const parts = [[2, 3], [3, 4], [2, 4], [4, 6], [3, 6], [6, 4], [4, 3], [6, 3]];
      const [b, e] = U.pick(parts);
      const tom = { n: 1, d: b }, ana = { n: 1, d: e };
      const rest = U.fsub(U.fsub({ n: 1, d: 1 }, tom), ana);
      const n1 = U.name(); let n2; do n2 = U.name(); while (n2 === n1);
      return FR(`Eine Pizza hat 12 Stücke. ${n1} isst ${F(1, b)}, ${n2} isst ${F(1, e)} der Pizza. Welcher Bruchteil bleibt übrig?`, rest, {
        vis: U.pizza(12, 12), mq: `1 − ${F(1, b)} − ${F(1, e)}`, hints: ['Rechne in Zwölfteln: Wie viele Stücke isst jede Person?'],
        sol: `${F(1, b)} = ${F(12 / b, 12)}, ${F(1, e)} = ${F(12 / e, 12)}. Rest: ${F(12 - 12 / b - 12 / e, 12)} = ${U.Ff(rest)}`,
      });
    },
  });

  /* ---------- 2 Bruch-Labor ---------- */
  R({
    id: 'k6-bruchlabor', icon: '⚗️', title: 'Bruch-Labor', tags: ['Rechnen'],
    bp: 'Zahl – Variable – Operation', desc: 'Kürzen, erweitern, addieren, multiplizieren.',
    gen(l) {
      if (l === 1) {
        const k = U.ri(0, 2);
        if (k === 0) {
          const d = U.ri(3, 12), a = U.ri(1, d - 1), b = U.ri(1, d - 1), plus = U.chance(0.5) || a <= b;
          const e = plus ? `${F(a, d)} + ${F(b, d)}` : `${F(a, d)} − ${F(b, d)}`;
          const r = { n: plus ? a + b : a - b, d };
          return FR(U.expr(e + ' = ?'), r, { mq: e, hints: ['Gleiche Nenner: nur die Zähler rechnen, der Nenner bleibt.'], sol: `${e} = ${F(r.n, d)}`, mistakes: [{ v: r.n / (2 * d), msg: 'Nenner nicht addieren! Der Nenner bleibt gleich.' }] });
        }
        if (k === 1) {
          let n, d; do { d = U.ri(2, 9); n = U.ri(1, d - 1); } while (U.gcd(n, d) !== 1);
          const m = U.ri(2, 6);
          return FR(U.expr(`Kürze vollständig: ${F(n * m, d * m)}`), { n, d }, { simplify: true, mq: `${F(n * m, d * m)} gekürzt`, hints: ['Suche den größten Teiler, der in Zähler UND Nenner steckt.'], sol: `${F(n * m, d * m)} = ${F(n, d)} (gekürzt mit ${m})` });
        }
        const d = U.ri(2, 9), n = U.ri(1, d - 1), m = U.ri(2, 6);
        return N(U.expr(`${F(n, d)} = ${F('?', d * m)}`), n * m, { mq: `${F(n, d)} = ${F('?', d * m)}`, hints: [`Mit welcher Zahl wurde der Nenner ${d} multipliziert?`], sol: `Erweitern mit ${m}: ${F(n, d)} = ${F(n * m, d * m)}` });
      }
      if (l === 2) {
        let a = U.frac(U.ri(1, 5), U.ri(2, 8)), b = U.frac(U.ri(1, 5), U.ri(2, 8));
        while (a.d === b.d || a.n >= a.d || b.n >= b.d) { a = U.frac(U.ri(1, 5), U.ri(2, 8)); b = U.frac(U.ri(1, 5), U.ri(2, 8)); }
        const op = U.pick(['+', '−', '·']);
        if (op === '−' && U.fval(a) < U.fval(b)) [a, b] = [b, a];
        const e = `${U.Ff(a)} ${op} ${U.Ff(b)}`;
        const r = op === '+' ? U.fadd(a, b) : op === '−' ? U.fsub(a, b) : U.fmul(a, b);
        const mist = op !== '·' ? [{ v: (op === '+' ? a.n + b.n : a.n - b.n) / (a.d + b.d), msg: 'Nie Nenner addieren! Bringe beide Brüche erst auf einen gemeinsamen Nenner.' }] : [];
        const L = U.lcm(a.d, b.d);
        const hint = op === '·' ? 'Zähler mal Zähler, Nenner mal Nenner.' : `Gemeinsamer Nenner: ${L}`;
        const sol = op === '·'
          ? `${F(a.n + ' · ' + b.n, a.d + ' · ' + b.d)} = ${F(a.n * b.n, a.d * b.d)}${U.gcd(a.n * b.n, a.d * b.d) > 1 ? ' = ' + U.Ff(r) + ' (gekürzt)' : ''}`
          : `Auf den Nenner ${L} erweitern: ${F(a.n * (L / a.d), L)} ${op} ${F(b.n * (L / b.d), L)} = ${F(op === '+' ? a.n * (L / a.d) + b.n * (L / b.d) : a.n * (L / a.d) - b.n * (L / b.d), L)}${r.d !== L ? ' = ' + U.Ff(r) + ' (gekürzt)' : ''}`;
        return FR(U.expr(e + ' = ?'), r, { mq: e, hints: [hint], sol, mistakes: mist });
      }
      const k = U.ri(0, 2);
      if (k === 0) {
        const a = U.frac(U.ri(1, 7), U.ri(2, 9)), b = U.frac(U.ri(1, 7), U.ri(2, 9));
        const e = `${U.Ff(a)} : ${U.Ff(b)}`, r = U.fdiv(a, b);
        return FR(U.expr(e + ' = ?'), r, { mq: e, hints: ['Durch einen Bruch teilen = mit dem Kehrbruch malnehmen.'], sol: `${U.Ff(a)} · ${F(b.d, b.n)} = ${U.Ff(r)}`, mistakes: [{ v: U.fval(U.fmul(a, b)), msg: 'Du hast multipliziert – beim Dividieren mit dem Kehrbruch malnehmen!' }] });
      }
      if (k === 1) {
        const a = U.frac(U.ri(3, 11), U.pick([2, 3, 4])), b = U.frac(U.ri(5, 13), U.pick([3, 4, 6]));
        const e = `${U.mixed(a)} + ${U.mixed(b)}`, r = U.fadd(a, b);
        return FR(U.expr(e + ' = ?'), r, { mq: e, hints: ['Wandle die gemischten Zahlen in unechte Brüche um.'], sol: `${U.Ff(a)} + ${U.Ff(b)} = ${U.Ff(r)} = ${U.mixed(r)}` });
      }
      const a = U.frac(U.ri(1, 4), U.ri(2, 5)), c = U.ri(2, 6), b = U.frac(1, U.ri(2, 6));
      const e = `${U.Ff(a)} · ${c} − ${U.Ff(b)}`, r = U.fsub(U.fmul(a, { n: c, d: 1 }), b);
      return FR(U.expr(e + ' = ?'), r, { mq: e, hints: ['Punkt vor Strich – auch bei Brüchen!'], sol: `${U.Ff(a)} · ${c} = ${U.Ff(U.fmul(a, { n: c, d: 1 }))}; minus ${U.Ff(b)} = ${U.Ff(r)}` });
    },
  });

  /* ---------- 3 Dezimal-Waage ---------- */
  const balance = (L, Rr) => U.svg(320, 170,
    `<polygon points="160,60 145,150 175,150" class="sv-stand"/><rect x="120" y="148" width="80" height="10" rx="3" class="sv-stand"/>` +
    U.line(40, 60, 280, 60, 'sv-beam') + `<circle cx="160" cy="60" r="7" class="sv-dot2"/>` +
    U.line(60, 60, 40, 100, 'sv-thin') + U.line(60, 60, 80, 100, 'sv-thin') + U.line(260, 60, 240, 100, 'sv-thin') + U.line(260, 60, 280, 100, 'sv-thin') +
    `<path d="M25 100 Q60 125 95 100 Z" class="sv-pan"/><path d="M225 100 Q260 125 295 100 Z" class="sv-pan"/>` +
    U.t(60, 92, L, 'sv-t sv-mid sv-big') + U.t(260, 92, Rr, 'sv-t sv-mid sv-big'));
  R({
    id: 'k6-dezimal', icon: '⚖️', title: 'Dezimal-Waage', tags: ['visuell', 'Rechnen'],
    bp: 'Zahl – Variable – Operation', desc: 'Dezimalzahlen vergleichen, umwandeln und rechnen.',
    gen(l) {
      if (l === 1) {
        if (U.chance(0.55)) {
          const w = U.ri(0, 9);
          let a, b;
          const k = U.ri(0, 2);
          if (k === 0) { a = w + U.ri(1, 9) / 10; b = w + U.ri(11, 99) / 100; }
          else if (k === 1) { a = w + U.ri(1, 99) / 100; b = w + U.ri(1, 9) / 10; }
          else { a = w + U.ri(1, 9) / 10; b = a; }
          a = U.round(a, 2); b = U.round(b, 2);
          const sa = k === 2 && U.chance(0.5) ? U.fix(a, 2) : U.fmt(a, 2);
          const rel = a > b ? '>' : a < b ? '<' : '=';
          const t = { q: `Welches Zeichen gehört in die Lücke? <span class="expr inl">${sa} ☐ ${U.fmt(b, 2)}</span>`, vis: balance(sa, U.fmt(b, 2)), hints: ['Vergleiche Stelle für Stelle: erst Zehntel, dann Hundertstel. Hänge ggf. eine 0 an.'], sol: `${sa} ${rel} ${U.fmt(b, 2)}`, memOk: false };
          U.choice(t, rel, ['<', '>', '='].filter((x) => x !== rel).map((x) => ({ h: x, msg: 'Längere Zahl heißt nicht größer! Vergleiche Zehntel mit Zehnteln.' })));
          t.options = ['<', '=', '>']; t.answer = t.options.indexOf(rel);
          t.mistakes = [];
          return t;
        }
        const [n, d] = U.pick([[1, 2], [1, 4], [3, 4], [1, 5], [2, 5], [3, 5], [1, 10], [3, 10], [7, 10], [7, 100], [1, 20], [1, 8]]);
        return N(U.expr(`${F(n, d)} = ? (als Dezimalzahl)`), n / d, { mq: `${F(n, d)} als Dezimalzahl`, hints: ['Erweitere auf 10, 100 oder 1000 im Nenner.'], sol: `${F(n, d)} = ${U.fmt(n / d, 3)}` });
      }
      if (l === 2) {
        const k = U.ri(0, 2);
        if (k === 0) {
          const a = U.ri(105, 999) / 100, b = U.ri(15, 899) / 100, plus = U.chance(0.5) || a < b;
          const e = `${U.fmt(a)} ${plus ? '+' : '−'} ${U.fmt(b)}`; const r = U.round(plus ? a + b : a - b, 2);
          return N(U.expr(e + ' = ?'), r, { mq: e, hints: ['Komma unter Komma schreiben!'], sol: `${e} = ${U.fmt(r)}` });
        }
        const a = U.ri(11, 9999) / 100, p = U.pick([10, 100, 1000]), mul = U.chance(0.5);
        const e = `${U.fmt(a)} ${mul ? '·' : ':'} ${p}`, r = U.round(mul ? a * p : a / p, 6);
        return N(U.expr(e + ' = ?'), r, { mq: e, hints: [`Das Komma wandert um ${String(p).length - 1} Stelle(n) nach ${mul ? 'rechts' : 'links'}.`], sol: `${e} = ${U.fmt(r, 6)}` });
      }
      if (U.chance(0.5)) {
        const a = U.ri(2, 9) / 10, b = U.ri(2, 9) / (U.chance(0.5) ? 10 : 100);
        const e = `${U.fmt(a)} · ${U.fmt(b)}`, r = U.round(a * b, 4);
        return N(U.expr(e + ' = ?'), r, { mq: e, hints: ['Rechne ohne Komma und zähle dann die Nachkommastellen beider Faktoren zusammen.'], sol: `${e} = ${U.fmt(r, 4)}`, mistakes: [{ v: U.round(r * 10, 4), msg: 'Zähle die Nachkommastellen beider Faktoren zusammen!' }] });
      }
      const q = U.ri(2, 9), b = U.ri(2, 9) / 10, a = U.round(q * b, 2);
      const e = `${U.fmt(a)} : ${U.fmt(b)}`;
      return N(U.expr(e + ' = ?'), q, { mq: e, hints: ['Verschiebe bei beiden Zahlen das Komma gleich weit, bis der Teiler keine Kommazahl mehr ist.'], sol: `${U.fmt(a * 10)} : ${U.fmt(b * 10, 0)} = ${q}` });
    },
  });

  /* ---------- 4 Winkel-Werfer ---------- */
  function angleSVG(alpha, rot, label = 'α') {
    const cx = 170, cy = 140, r = 120;
    const P = (deg) => [cx + r * Math.cos((deg * Math.PI) / 180), cy - r * Math.sin((deg * Math.PI) / 180)];
    const p1 = P(rot), p2 = P(rot + alpha);
    let s = U.line(cx, cy, p1[0], p1[1], 'sv-ray') + U.line(cx, cy, p2[0], p2[1], 'sv-ray');
    const ra = 38, a0 = rot, a1 = rot + alpha;
    const q0 = [cx + ra * Math.cos((a0 * Math.PI) / 180), cy - ra * Math.sin((a0 * Math.PI) / 180)];
    const q1 = [cx + ra * Math.cos((a1 * Math.PI) / 180), cy - ra * Math.sin((a1 * Math.PI) / 180)];
    if (alpha === 90) s += U.rightMark([cx, cy], p1, p2, 20);
    else s += `<path d="M${q0[0].toFixed(1)} ${q0[1].toFixed(1)} A${ra} ${ra} 0 ${alpha > 180 ? 1 : 0} 0 ${q1[0].toFixed(1)} ${q1[1].toFixed(1)}" class="sv-arc" fill="none"/>`;
    const mid = ((rot + alpha / 2) * Math.PI) / 180;
    s += U.t(cx + 60 * Math.cos(mid), cy - 60 * Math.sin(mid) + 6, label, 'sv-t sv-mid sv-acc');
    s += `<circle cx="${cx}" cy="${cy}" r="5" class="sv-dot2"/>`;
    return U.svg(340, 280, s);
  }
  function crossSVG(alpha, rot) {
    const cx = 170, cy = 120, r = 140;
    const P = (deg, rr = r) => [cx + rr * Math.cos((deg * Math.PI) / 180), cy - rr * Math.sin((deg * Math.PI) / 180)];
    let s = U.line(...P(rot), ...P(rot + 180), 'sv-ray') + U.line(...P(rot + alpha), ...P(rot + alpha + 180), 'sv-ray');
    const lab = (a0, a1, t, cls) => { const m = (a0 + a1) / 2; const p = P(m, 50); return U.t(p[0], p[1] + 6, t, 'sv-t sv-mid ' + cls); };
    return { s, lab, P, cx, cy };
  }
  R({
    id: 'k6-winkel', icon: '📐', title: 'Winkel-Werfer', tags: ['visuell'],
    bp: 'Raum und Form', desc: 'Winkelarten erkennen, Winkel schätzen und berechnen.',
    gen(l) {
      const rot = U.ri(0, 359);
      if (l === 1) {
        const types = [['spitzer Winkel', () => U.ri(15, 80)], ['rechter Winkel', () => 90], ['stumpfer Winkel', () => U.ri(100, 170)], ['gestreckter Winkel', () => 180], ['überstumpfer Winkel', () => U.ri(195, 340)]];
        const [name, f] = U.pick(types); const a = f();
        const t = { q: 'Welche Winkelart ist das?', vis: angleSVG(a, rot), hints: ['Vergleiche mit einem rechten Winkel (90°) und einem gestreckten Winkel (180°).'], sol: `α ist ein ${name}.`, memOk: false };
        U.choice(t, name, U.shuffle(types.map((x) => x[0]).filter((x) => x !== name)));
        return t;
      }
      if (l === 2 || U.chance(0.4)) {
        const a = U.ri(2, 34) * 5 + (l === 3 ? U.ri(0, 1) * 180 : 0);
        const tol = l === 2 ? 10 : 6;
        return N(`Schätze die Größe von α (Abweichung bis ±${tol}° ist ok).`, a, { unit: '°', tol, vis: angleSVG(a, rot), memOk: false, hints: ['Ein rechter Winkel hat 90°, ein gestreckter 180°. Liegt α dazwischen?'], sol: `α ≈ ${a}°` });
      }
      const a = U.ri(4, 15) * 10 + U.pick([0, 5]);
      const c = crossSVG(a, rot % 180);
      const neben = U.chance(0.5);
      let s = c.s + c.lab(rot % 180, (rot % 180) + a, `${a}°`, 'sv-acc') + c.lab((rot % 180) + a, (rot % 180) + 180, neben ? '?' : '', 'sv-q') + c.lab((rot % 180) + 180, (rot % 180) + 180 + a, neben ? '' : '?', 'sv-q');
      const ans = neben ? 180 - a : a;
      return N(`Zwei Geraden schneiden sich. Wie groß ist der mit ? markierte Winkel?`, ans, { unit: '°', vis: U.svg(340, 240, s + `<circle cx="${c.cx}" cy="${c.cy}" r="5" class="sv-dot2"/>`), memOk: false, hints: [neben ? 'Nebenwinkel ergänzen sich zu 180°.' : 'Scheitelwinkel liegen sich gegenüber und sind gleich groß.'], sol: neben ? `Nebenwinkel: 180° − ${a}° = ${180 - a}°` : `Scheitelwinkel: ${a}°`, mistakes: [{ v: neben ? a : 180 - a, msg: neben ? 'Das wäre der Scheitelwinkel. Benachbarte Winkel ergänzen sich zu 180°.' : 'Gegenüberliegende Winkel (Scheitelwinkel) sind gleich groß!' }] });
    },
  });

  /* ---------- 5 Diagramm-Detektiv ---------- */
  const SETS = [
    { t: 'Lieblingssport der 6a', c: ['Fußball', 'Schwimmen', 'Turnen', 'Tennis', 'Reiten'], u: 'Kinder' },
    { t: 'Verkaufte Brezeln am Kiosk', c: ['Mo', 'Di', 'Mi', 'Do', 'Fr'], u: 'Brezeln' },
    { t: 'Haustiere in der Klasse', c: ['Hund', 'Katze', 'Hamster', 'Fisch', 'Vogel'], u: 'Tiere' },
    { t: 'Tore pro Spiel', c: ['Spiel 1', 'Spiel 2', 'Spiel 3', 'Spiel 4', 'Spiel 5'], u: 'Tore' },
  ];
  function barChart(set, vals, step, labStep) {
    const W = 360, H = 250, l = 44, b = 40, top = 30;
    const max = Math.ceil(Math.max(...vals) / labStep) * labStep + labStep;
    const sy = (H - b - top) / max;
    let s = U.t(W / 2, 18, set.t, 'sv-t sv-mid sv-title');
    for (let v = 0; v <= max; v += step) {
      const y = H - b - v * sy;
      s += U.line(l, y, W - 10, y, v % labStep === 0 ? 'sv-grid2' : 'sv-grid');
      if (v % labStep === 0) s += U.t(l - 6, y + 4, v, 'sv-ax sv-end');
    }
    const bw = (W - l - 20) / vals.length;
    vals.forEach((v, i) => {
      const x = l + 10 + i * bw;
      s += `<rect x="${(x + 6).toFixed(1)}" y="${(H - b - v * sy).toFixed(1)}" width="${(bw - 12).toFixed(1)}" height="${(v * sy).toFixed(1)}" class="sv-bar b${i % 5}"/>`;
      s += U.t(x + bw / 2, H - b + 16, set.c[i], 'sv-ax sv-mid');
    });
    s += U.line(l, top - 6, l, H - b, 'sv-axis') + U.line(l, H - b, W - 10, H - b, 'sv-axis');
    return U.svg(W, H, s);
  }
  R({
    id: 'k6-diagramm', icon: '📊', title: 'Diagramm-Detektiv', tags: ['visuell', 'Daten'],
    bp: 'Daten und Zufall', desc: 'Säulendiagramme lesen, vergleichen, Mittelwert berechnen.',
    gen(l) {
      const set = U.pick(SETS);
      if (l === 1) {
        const vals = Array.from({ length: 5 }, () => U.ri(1, 12));
        const vis = barChart(set, vals, 1, 2);
        if (U.chance(0.5)) {
          const i = U.ri(0, 4);
          return N(`Lies ab: Wie viele ${set.u} bei <b>${set.c[i]}</b>?`, vals[i], { vis, memOk: false, hints: ['Gehe von der Säulenspitze waagerecht zur Achse.'], sol: `${set.c[i]}: ${vals[i]}` });
        }
        const mx = Math.max(...vals); if (vals.filter((v) => v === mx).length > 1) vals[vals.indexOf(mx)] += 1;
        const best = vals.indexOf(Math.max(...vals));
        const t = { q: 'Welche Säule ist am höchsten?', vis: barChart(set, vals, 1, 2), memOk: false, hints: ['Suche die längste Säule.'], sol: `${set.c[best]} mit ${vals[best]}` };
        return U.choice(t, set.c[best], set.c.filter((_, i) => i !== best));
      }
      if (l === 2) {
        const vals = Array.from({ length: 5 }, () => U.ri(1, 12) * 5);
        const vis = barChart(set, vals, 5, 10);
        if (U.chance(0.5)) {
          let i, j; do { i = U.ri(0, 4); j = U.ri(0, 4); } while (vals[i] <= vals[j]);
          return N(`Wie viele ${set.u} mehr bei <b>${set.c[i]}</b> als bei <b>${set.c[j]}</b>?`, vals[i] - vals[j], { vis, memOk: false, hints: ['Lies beide Werte ab und bilde die Differenz.'], sol: `${vals[i]} − ${vals[j]} = ${vals[i] - vals[j]}` });
        }
        const sum = vals.reduce((a, b) => a + b, 0);
        return N(`Wie viele ${set.u} sind es <b>insgesamt</b>?`, sum, { vis, memOk: false, hints: ['Lies alle fünf Werte ab und addiere sie.'], sol: vals.join(' + ') + ' = ' + sum });
      }
      const vals = Array.from({ length: 5 }, () => U.ri(1, 12) * (U.chance(0.5) ? 1 : 2));
      const sum = vals.reduce((a, b) => a + b, 0);
      const vis = barChart(set, vals, 1, 2);
      const m = U.round(sum / 5, 1);
      return N('Berechne den <b>Mittelwert</b> (Durchschnitt) aller Säulen.', sum / 5, { vis, tol: 0.051, memOk: false, hints: ['Mittelwert = Summe aller Werte : Anzahl der Werte'], sol: `(${vals.join(' + ')}) : 5 = ${sum} : 5 = ${U.fmt(m, 1)}`, mistakes: [{ v: sum, msg: 'Das ist die Summe – jetzt noch durch die Anzahl teilen!' }] });
    },
  });

  /* ---------- 6 Bruch-Textaufgaben ---------- */
  R({
    id: 'k6-bruchtext', icon: '📖', title: 'Bruch-Geschichten', tags: ['Text'],
    bp: 'Zahl – Variable – Operation', desc: 'Sachaufgaben mit Bruchteilen – auch rückwärts!',
    gen(l) {
      const n = U.name();
      const [p, q] = U.pick([[1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [2, 5], [3, 5], [3, 8], [5, 8], [1, 6], [5, 6]]);
      if (l === 1) {
        const G = q * U.ri(2, 12);
        return N(`${n} hat ${G} € gespart und gibt ${F(p, q)} davon für ein Buch aus. Wie viel kostet das Buch?`, (G * p) / q, { unit: '€', mq: `${F(p, q)} von ${G} €`, hints: [`Erst ${G} : ${q}, dann · ${p}.`], sol: `${G} : ${q} = ${G / q}; ${G / q} · ${p} = ${(G * p) / q} €` });
      }
      if (l === 2) {
        const G = q * U.ri(3, 6);
        const bus = (G * p) / q;
        return N(`In der Klasse sind ${G} Kinder. ${F(p, q)} davon fahren mit dem Bus, der Rest kommt zu Fuß. Wie viele kommen zu Fuß?`, G - bus, { unit: 'Kinder', mq: `Rest, wenn ${F(p, q)} von ${G} fehlen`, hints: [`Berechne zuerst ${F(p, q)} von ${G}.`], sol: `${F(p, q)} von ${G} = ${bus}; ${G} − ${bus} = ${G - bus}`, mistakes: [{ v: bus, msg: 'Das sind die Buskinder – gefragt ist der Rest!' }] });
      }
      if (U.chance(0.5)) {
        const whole = q * U.ri(2, 9), part = (whole * p) / q;
        return N(`${F(p, q)} einer Wanderstrecke sind ${part} km. Wie lang ist die ganze Strecke?`, whole, { unit: 'km', mq: `${F(p, q)} sind ${part} km. Ganzes?`, hints: [`Wenn ${p} Teile ${part} km sind, wie lang ist dann 1 Teil?`], sol: `${part} : ${p} = ${part / p} km pro ${q}-tel; · ${q} = ${whole} km`, mistakes: [{ v: (part * p) / q, msg: 'Rückwärts denken: Der Teil ist bekannt, das Ganze ist gesucht.' }] });
      }
      const a = U.pick([2, 3, 4]), b = U.pick([2, 3, 4, 5]);
      const G = a * b * U.ri(2, 8);
      const rest = (G * (a - 1) * (b - 1)) / (a * b);
      return N(`${n} gibt zuerst ${F(1, a)} des Taschengelds aus, danach ${F(1, b)} vom <b>Rest</b>. Übrig sind ${U.fmt(rest)} €. Wie viel Geld hatte ${n} am Anfang?`, G, { unit: '€', hints: ['Rechne rückwärts – oder probiere mit einer Startzahl aus.', `Nach dem ersten Ausgeben bleiben ${F(a - 1, a)}, danach davon ${F(b - 1, b)}.`], sol: `Übrig: ${F(a - 1, a)} · ${F(b - 1, b)} = ${U.Ff(U.frac((a - 1) * (b - 1), a * b))} vom Anfang. ${U.fmt(rest)} € : ${U.Ff(U.frac((a - 1) * (b - 1), a * b))} = ${G} €` });
    },
  });
})();
