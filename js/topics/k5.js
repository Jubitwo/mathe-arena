/* =========================================================
   Klasse 5 – Natürliche Zahlen, Größen, Geometrie-Grundlagen
   (Bildungsplan BW 2016, Sek I, Klassen 5/6)
   ========================================================= */
(function () {
  const U = MA.U;
  const R = (t) => MA.registerTopic(Object.assign({ grade: 5 }, t));
  const N = (q, answer, o = {}) => Object.assign({ type: 'num', q, answer }, o);

  /* ---------- 1 Kopfrechen-Turbo ---------- */
  R({
    id: 'k5-kopf', icon: '🧮', title: 'Kopfrechen-Turbo', tags: ['Rechnen'],
    bp: 'Zahl – Variable – Operation', desc: 'Plus, minus, mal, geteilt – Vollgas im Kopf!',
    gen(l) {
      let a, b, c, d, e, ans, sol, hint, mist = [];
      if (l < 3) {
        const op = U.ri(0, 3);
        const place = l === 1 ? 10 : 100;
        const big = (v) => v - (v % place), small = (v) => v % place;
        if (op === 0) {
          a = l === 1 ? U.ri(12, 58) : U.ri(120, 880); b = l === 1 ? U.ri(5, 39) : U.ri(45, 480);
          e = `${U.fmt(a, 0)} + ${U.fmt(b, 0)}`; ans = a + b; hint = 'Zerlege eine Zahl: erst die Zehner (bzw. Hunderter) dazu, dann den Rest.';
          sol = big(b) && small(b) ? `Zerlegen: ${b} = ${big(b)} + ${small(b)}. ${a} + ${big(b)} = ${a + big(b)}, dann ${a + big(b)} + ${small(b)} = ${ans}` : `${e} = ${ans}`;
        } else if (op === 1) {
          a = l === 1 ? U.ri(30, 99) : U.ri(300, 999); b = l === 1 ? U.ri(6, a - 10) : U.ri(60, a - 50);
          e = `${a} − ${b}`; ans = a - b; hint = 'Ziehe schrittweise ab: erst die Zehner (bzw. Hunderter), dann den Rest.';
          sol = big(b) && small(b) ? `Zerlegen: ${b} = ${big(b)} + ${small(b)}. ${a} − ${big(b)} = ${a - big(b)}, dann ${a - big(b)} − ${small(b)} = ${ans}. Probe: ${ans} + ${b} = ${a} ✔` : `${e} = ${ans}. Probe: ${ans} + ${b} = ${a} ✔`;
        } else if (op === 2) {
          a = l === 1 ? U.ri(2, 10) : U.ri(12, 25); b = l === 1 ? U.ri(2, 10) : U.ri(3, 9);
          e = `${a} · ${b}`; ans = a * b; hint = l === 1 ? 'Denk an das Einmaleins! Du kannst auch von einer bekannten Aufgabe aus weiterrechnen.' : `Zerlege: ${a} · ${b} = ${Math.floor(a / 10) * 10} · ${b} + ${a % 10} · ${b}`;
          sol = l === 1 ? `${e} = ${ans} (Einmaleins: ${b}er-Reihe)` : `${Math.floor(a / 10) * 10} · ${b} = ${Math.floor(a / 10) * 10 * b} und ${a % 10} · ${b} = ${(a % 10) * b}. Zusammen: ${ans}`;
        } else {
          b = l === 1 ? U.ri(2, 10) : U.ri(3, 9); c = l === 1 ? U.ri(2, 10) : U.ri(12, 40); a = b * c;
          e = `${a} : ${b}`; ans = c; hint = `Welche Zahl mal ${b} ergibt ${a}?`;
          sol = `${e} = ${c}, denn ${c} · ${b} = ${a} (Probe mit der Umkehraufgabe).`;
        }
      } else {
        const f = U.ri(0, 3);
        if (f === 0) {
          a = U.ri(5, 30); b = U.ri(2, 9); c = U.ri(3, 12);
          e = `${a} + ${b} · ${c}`; ans = a + b * c; hint = 'Punkt vor Strich!';
          sol = `Erst ${b} · ${c} = ${b * c}, dann ${a} + ${b * c} = ${ans}`;
          mist.push({ v: (a + b) * c, msg: 'Punkt vor Strich! Erst malnehmen, dann addieren.' });
        } else if (f === 1) {
          a = U.ri(3, 15); b = U.ri(2, 10); c = U.ri(2, 9);
          e = `(${a} + ${b}) · ${c}`; ans = (a + b) * c; hint = 'Klammern zuerst!';
          sol = `Erst die Klammer: ${a} + ${b} = ${a + b}, dann · ${c} = ${ans}`;
          mist.push({ v: a + b * c, msg: 'Klammern werden zuerst berechnet!' });
        } else if (f === 2) {
          d = U.ri(2, 9); c = d * U.ri(2, 9); a = U.ri(4, 12); b = U.ri(3, 9);
          if (a * b <= c / d) a += 5;
          e = `${a} · ${b} − ${c} : ${d}`; ans = a * b - c / d; hint = 'Erst beide Punktrechnungen, dann die Strichrechnung.';
          sol = `${a} · ${b} = ${a * b}; ${c} : ${d} = ${c / d}; ${a * b} − ${c / d} = ${ans}`;
        } else {
          a = U.ri(50, 100); b = U.ri(20, 49); c = U.ri(5, b - 1);
          e = `${a} − (${b} − ${c})`; ans = a - b + c; hint = 'Rechne zuerst die Klammer aus.';
          sol = `${b} − ${c} = ${b - c}; ${a} − ${b - c} = ${ans}`;
          mist.push({ v: a - b - c, msg: 'Achtung: Die Klammer wird zuerst ausgerechnet!' });
        }
      }
      return N(U.expr(e + ' = ?'), ans, { mq: e, hints: [hint], sol, mistakes: mist });
    },
  });

  /* ---------- 2 Zahlenstrahl-Sprung ---------- */
  R({
    id: 'k5-zahlenstrahl', icon: '📏', title: 'Zahlenstrahl-Sprung', tags: ['visuell'],
    bp: 'Zahl – Variable – Operation', desc: 'Tippe die Zahl auf dem Zahlenstrahl an.', noMemory: true,
    gen(l) {
      let min, max, step, lab, v;
      if (l === 1) { min = 0; max = 20; step = 1; lab = 5; do v = U.ri(1, 19); while (v % 5 === 0); }
      else if (l === 2) { min = 0; max = 200; step = 10; lab = 50; do v = U.ri(1, 19) * 10; while (v % 50 === 0); }
      else if (U.chance(0.5)) { min = 0; max = 1000; step = 50; lab = 500; do v = U.ri(1, 19) * 50; while (v % 500 === 0); }
      else { min = -10; max = 10; step = 1; lab = 10; do v = U.ri(-9, 9); while (v === 0); }
      return {
        type: 'line', line: { min, max, step, lab }, answer: v,
        q: `Wo liegt die Zahl <b class="hl">${U.fmt(v, 0)}</b>? Tippe auf den Zahlenstrahl.`,
        hints: ['Wie viel ist ein kleiner Strich wert? Zähle von einer beschrifteten Zahl aus.'],
        sol: `Ein Strich bedeutet ${step}. Die ${U.fmt(v, 0)} liegt ${Math.abs(v - min) / step} Striche rechts von ${U.fmt(min, 0)}.`,
      };
    },
  });

  /* ---------- 3 Koordinaten-Schatzsuche ---------- */
  R({
    id: 'k5-koordinaten', icon: '🏴‍☠️', title: 'Koordinaten-Schatzsuche', tags: ['visuell'],
    bp: 'Raum und Form', desc: 'Finde den Schatz im Koordinatensystem!', noMemory: true,
    gen(l) {
      if (l === 1) {
        let x, y;
        do { x = U.ri(0, 6); y = U.ri(0, 6); } while (x === 0 && y === 0);
        return {
          type: 'grid', grid: { xmin: 0, xmax: 6, ymin: 0, ymax: 6 }, answer: [x, y],
          q: `Der Schatz liegt bei <b class="hl">(${x}|${y})</b>. Tippe die Stelle an!`,
          hints: ['Die erste Zahl sagt, wie weit nach rechts. Die zweite, wie weit nach oben.'],
          sol: `Vom Ursprung ${x} nach rechts und ${y} nach oben.`,
          mistakes: x !== y ? [{ v: [y, x], msg: 'x und y vertauscht! Zuerst nach rechts (x), dann nach oben (y).' }] : [],
        };
      }
      if (l === 2) {
        let a, b, dx, dy;
        do { a = U.ri(1, 9); b = U.ri(1, 9); dx = U.rnz(-4, 4); dy = U.rnz(-4, 4); } while (a + dx < 0 || a + dx > 10 || b + dy < 0 || b + dy > 10);
        const tx = a + dx, ty = b + dy;
        return {
          type: 'grid', grid: { xmin: 0, xmax: 10, ymin: 0, ymax: 10 }, answer: [tx, ty],
          points: [{ x: a, y: b, label: 'P' }],
          q: `Starte bei P(${a}|${b}). Gehe <b>${Math.abs(dx)} nach ${dx > 0 ? 'rechts' : 'links'}</b> und <b>${Math.abs(dy)} nach ${dy > 0 ? 'oben' : 'unten'}</b>. Wo liegt der Schatz?`,
          hints: ['Rechts/links ändert die x-Koordinate, oben/unten die y-Koordinate.'],
          sol: `x: ${a} ${dx > 0 ? '+' : '−'} ${Math.abs(dx)} = ${tx}, y: ${b} ${dy > 0 ? '+' : '−'} ${Math.abs(dy)} = ${ty} → (${tx}|${ty})`,
        };
      }
      if (U.chance(0.5)) {
        let x1, x2, y1, y2;
        do { x1 = U.ri(-5, 3); x2 = U.ri(x1 + 2, 5); y1 = U.ri(-5, 3); y2 = U.ri(y1 + 2, 5); } while (false);
        const corners = [[x1, y1], [x2, y1], [x2, y2], [x1, y2]];
        const s = U.ri(0, 3);
        const ord = [0, 1, 2, 3].map((i) => corners[(i + s) % 4]);
        const names = ['A', 'B', 'C'];
        const D = ord[3];
        return {
          type: 'grid', grid: { xmin: -5, xmax: 5, ymin: -5, ymax: 5 }, answer: D,
          points: ord.slice(0, 3).map((p, i) => ({ x: p[0], y: p[1], label: names[i] })),
          q: `A, B, C und D bilden ein Rechteck. Wo liegt der Punkt <b class="hl">D</b>?`,
          hints: ['Gegenüberliegende Seiten eines Rechtecks sind parallel und gleich lang.'],
          sol: `D(${D[0]}|${D[1]}) – er hat die x-Koordinate von einem Nachbarpunkt und die y-Koordinate vom anderen.`,
        };
      }
      let x, y;
      do { x = U.ri(-5, 5); y = U.ri(-5, 5); } while (x === 0 || y === 0);
      return {
        type: 'grid', grid: { xmin: -5, xmax: 5, ymin: -5, ymax: 5 }, answer: [x, y],
        q: `Der Schatz liegt bei <b class="hl">(${U.fmt(x)}|${U.fmt(y)})</b>. Tippe die Stelle an!`,
        hints: ['Negative x-Werte: nach links. Negative y-Werte: nach unten.'],
        sol: `${Math.abs(x)} nach ${x > 0 ? 'rechts' : 'links'}, ${Math.abs(y)} nach ${y > 0 ? 'oben' : 'unten'}.`,
        mistakes: [{ v: [y, x], msg: 'x und y vertauscht!' }, { v: [-x, y], msg: 'Achte auf das Vorzeichen der x-Koordinate!' }, { v: [x, -y], msg: 'Achte auf das Vorzeichen der y-Koordinate!' }],
      };
    },
  });

  /* ---------- 4 Flächen-Baumeister ---------- */
  function gridRect(w, h) {
    const cs = Math.min(30, 300 / (w + 2), 200 / (h + 2));
    const W = (w + 2) * cs, H = (h + 2) * cs;
    let s = '';
    for (let i = 0; i <= w + 2; i++) s += U.line(i * cs, 0, i * cs, H, 'sv-grid');
    for (let j = 0; j <= h + 2; j++) s += U.line(0, j * cs, W, j * cs, 'sv-grid');
    s += `<rect x="${cs}" y="${cs}" width="${w * cs}" height="${h * cs}" class="sv-shape"/>`;
    return U.svg(W, H, s);
  }
  function lShape(W, H, w, h, labels) {
    const sc = Math.min(260 / W, 170 / H);
    const ox = 40, oy = 20;
    const P = (x, y) => [ox + x * sc, oy + y * sc];
    const pts = [P(0, 0), P(W - w, 0), P(W - w, h), P(W, h), P(W, H), P(0, H)];
    const c = P(W / 3, H / 2 + h / 2);
    let s = U.poly2(pts);
    s += U.edgeLabel(pts[5], pts[4], labels.W, 16, c);
    s += U.edgeLabel(pts[0], pts[5], labels.H, 22, c);
    s += U.edgeLabel(pts[2], pts[3], labels.w, 14, c);
    s += U.edgeLabel(pts[1], pts[2], labels.h, 22, c);
    return U.svg(ox + W * sc + 40, oy + H * sc + 40, s);
  }
  R({
    id: 'k5-flaeche', icon: '🧱', title: 'Flächen-Baumeister', tags: ['visuell'],
    bp: 'Messen', desc: 'Umfang und Flächeninhalt von Rechtecken und Figuren.',
    gen(l) {
      if (l === 1) {
        const w = U.ri(2, 8), h = U.ri(2, 6), area = U.chance(0.5);
        const A = w * h, u = 2 * (w + h);
        return N(area ? 'Wie groß ist der <b>Flächeninhalt</b>? (1 Kästchen = 1 cm²)' : 'Wie lang ist der <b>Umfang</b>? (1 Kästchenseite = 1 cm)', area ? A : u, {
          unit: area ? 'cm²' : 'cm', vis: gridRect(w, h), mq: (area ? 'Fläche' : 'Umfang'),
          hints: [area ? 'Zähle die Kästchen in einer Reihe und die Anzahl der Reihen.' : 'Laufe einmal um die Figur herum und zähle die Kästchenseiten.'],
          sol: area ? `${w} · ${h} = ${A} cm²` : `2 · ${w} + 2 · ${h} = ${u} cm`,
          mistakes: [{ v: area ? u : A, msg: area ? 'Das ist der Umfang – gesucht ist die Fläche.' : 'Das ist die Fläche – gesucht ist der Umfang.' }],
          memOk: false,
        });
      }
      if (l === 2) {
        const a = U.ri(3, 15), b = U.ri(2, 12), k = U.ri(0, 2);
        const vis = U.svg(300, 200, `<rect x="40" y="30" width="${a * 14 + 40}" height="${b * 8 + 40}" class="sv-shape"/>` + U.t(60 + a * 7, 22, `a = ${a} cm`, 'sv-t sv-mid') + U.t(40 + a * 14 + 50, 50 + b * 4 + 5, `b = ${k === 2 ? '?' : b + ' cm'}`, 'sv-t'));
        if (k === 0) return N(`Rechteck mit a = ${a} cm und b = ${b} cm. Berechne den <b>Flächeninhalt</b>.`, a * b, { unit: 'cm²', mq: `A = ${a} cm · ${b} cm`, hints: ['A = a · b'], sol: `A = ${a} · ${b} = ${a * b} cm²`, mistakes: [{ v: 2 * (a + b), msg: 'Das ist der Umfang!' }] });
        if (k === 1) return N(`Rechteck mit a = ${a} cm und b = ${b} cm. Berechne den <b>Umfang</b>.`, 2 * (a + b), { unit: 'cm', mq: `u (Rechteck ${a} cm × ${b} cm)`, hints: ['u = 2 · a + 2 · b'], sol: `u = 2 · ${a} + 2 · ${b} = ${2 * (a + b)} cm`, mistakes: [{ v: a + b, msg: 'Jede Seite kommt zweimal vor!' }, { v: a * b, msg: 'Das ist die Fläche!' }] });
        return N(`Ein Rechteck hat den Flächeninhalt <b>${a * b} cm²</b> und die Seite a = ${a} cm. Wie lang ist b?`, b, { unit: 'cm', vis, mq: `${a * b} cm² = ${a} cm · b`, hints: ['A = a · b – also b = A : a'], sol: `b = ${a * b} : ${a} = ${b} cm` });
      }
      const W = U.ri(7, 14), H = U.ri(6, 12), w = U.ri(2, W - 3), h = U.ri(2, H - 3);
      const area = U.chance(0.6);
      const vis = lShape(W, H, w, h, { W: W + ' cm', H: H + ' cm', w: w + ' cm', h: h + ' cm' });
      if (area) return N('Berechne den <b>Flächeninhalt</b> der Figur.', W * H - w * h, { unit: 'cm²', vis, mq: '', hints: ['Rechne das große Rechteck und ziehe das fehlende Stück ab.'], sol: `${W} · ${H} − ${w} · ${h} = ${W * H} − ${w * h} = ${W * H - w * h} cm²`, mistakes: [{ v: W * H, msg: 'Du musst das ausgeschnittene Rechteck noch abziehen!' }], memOk: false });
      return N('Berechne den <b>Umfang</b> der Figur.', 2 * (W + H), { unit: 'cm', vis, hints: ['Tipp: Verschiebe die Stufen-Kanten gedanklich nach außen – was fällt dir auf?'], sol: `Der Umfang ist so groß wie beim großen Rechteck: 2 · ${W} + 2 · ${H} = ${2 * (W + H)} cm`, memOk: false });
    },
  });

  /* ---------- 5 Große Zahlen & Runden ---------- */
  const PLACE = { 10: 'Zehner', 100: 'Hunderter', 1000: 'Tausender', 10000: 'Zehntausender', 100000: 'Hunderttausender', 1000000: 'Millionen' };
  R({
    id: 'k5-runden', icon: '🔢', title: 'Große Zahlen & Runden', tags: ['Rechnen'],
    bp: 'Zahl – Variable – Operation', desc: 'Runden, Stellenwerte und riesige Zahlen.',
    gen(l) {
      if (l === 3 && U.chance(0.5)) {
        const m = U.ri(1, 9), t = U.ri(1, 999), e = U.ri(0, 999);
        const v = m * 1e6 + t * 1e3 + e;
        return N(`Schreibe als Zahl: <b>${m} Millionen ${t} Tausend ${e}</b>`, v, { mq: `${m} Mio. ${t} Tsd. ${e}`, hints: ['Jede Gruppe hat drei Stellen: Millionen | Tausender | Einer. Fehlende Stellen mit 0 auffüllen.'], sol: `${U.fmt(v, 0)}` });
      }
      let n, p;
      if (l === 1) { n = U.ri(1000, 9999); p = U.pick([10, 100]); }
      else if (l === 2) { n = U.ri(100000, 999999); p = U.pick([1000, 10000]); }
      else { n = U.ri(1000000, 9999999); p = U.pick([100000, 1000000]); }
      const ans = Math.round(n / p) * p;
      const mist = [];
      const fl = Math.floor(n / p) * p, ce = Math.ceil(n / p) * p;
      [fl, ce].forEach((v) => { if (v !== ans) mist.push({ v, msg: 'Schau auf die Ziffer rechts von der Rundungsstelle: 0–4 abrunden, 5–9 aufrunden.' }); });
      const dg = Math.floor(n / (p / 10)) % 10;
      return N(`Runde <b>${U.fmt(n, 0)}</b> auf <b>${PLACE[p]}</b>.`, ans, { mq: `${U.fmt(n, 0)} ≈ ? (${PLACE[p]})`, hints: [`Welche Ziffer steht rechts neben der ${PLACE[p]}-Stelle?`, '0–4: abrunden, 5–9: aufrunden.'], sol: `Rechts neben der ${PLACE[p]}-Stelle steht eine <b>${dg}</b> → ${dg >= 5 ? 'aufrunden' : 'abrunden'}: ${U.fmt(n, 0)} ≈ ${U.fmt(ans, 0)}`, mistakes: mist });
    },
  });

  /* ---------- 6 Größen-Detektiv ---------- */
  const CONV = [['m', 'cm', 100], ['km', 'm', 1000], ['kg', 'g', 1000], ['€', 'ct', 100], ['min', 's', 60], ['h', 'min', 60], ['cm', 'mm', 10], ['t', 'kg', 1000]];
  R({
    id: 'k5-groessen', icon: '🕵️', title: 'Größen-Detektiv', tags: ['Text'],
    bp: 'Messen', desc: 'Umrechnen und Sachaufgaben mit Geld, Zeit und Längen.',
    gen(l) {
      if (l === 1) {
        const [big, small, f] = U.pick(CONV);
        if (U.chance(0.5)) {
          const v = U.ri(2, 12);
          return N(U.expr(`${v} ${big} = ? ${small}`), v * f, { unit: small, mq: `${v} ${big} in ${small}`, hints: [`1 ${big} = ${f} ${small}`], sol: `${v} · ${f} = ${v * f} ${small}` });
        }
        const v = U.ri(2, 12) * f;
        return N(U.expr(`${U.fmt(v, 0)} ${small} = ? ${big}`), v / f, { unit: big, mq: `${U.fmt(v, 0)} ${small} in ${big}`, hints: [`1 ${big} = ${f} ${small} – also teilen!`], sol: `${U.fmt(v, 0)} : ${f} = ${v / f} ${big}` });
      }
      const n = U.name();
      if (l === 2) {
        if (U.chance(0.5)) {
          const p = U.pick([0.8, 1.2, 1.5, 2.4, 0.95, 1.35]), k = U.ri(2, 5);
          const s = k * p < 9 ? 10 : 20;
          const ans = U.round(s - k * p, 2);
          return N(`${n} kauft ${k} Hefte zu je ${U.euro(p)} und bezahlt mit einem ${s}-€-Schein. Wie viel Rückgeld gibt es?`, ans, { unit: '€', tol: 0.001, hints: ['Erst den Gesamtpreis berechnen, dann vom Schein abziehen.'], sol: `${k} · ${U.euro(p)} = ${U.euro(k * p)}; ${s} € − ${U.euro(k * p)} = ${U.euro(ans)}`, mistakes: [{ v: U.round(k * p, 2), msg: 'Das ist der Preis – gefragt ist das Rückgeld.' }] });
        }
        const h = U.ri(14, 19), m = U.pick([0, 10, 15, 20, 30, 35, 45, 50]), dur = U.ri(15, 30) * 5;
        const end = h * 60 + m + dur;
        const hh = (x) => String(x).padStart(2, '0');
        return N(`Ein Film beginnt um ${h}:${hh(m)} Uhr und endet um ${Math.floor(end / 60)}:${hh(end % 60)} Uhr. Wie viele Minuten dauert er?`, dur, { unit: 'min', hints: ['Rechne bis zur nächsten vollen Stunde und dann weiter.'], sol: `Von ${h}:${hh(m)} bis ${Math.floor(end / 60)}:${hh(end % 60)} sind es ${dur} Minuten.` });
      }
      if (U.chance(0.5)) {
        const kids = U.ri(20, 28), per = U.ri(8, 20), bus = per * kids, p = U.ri(4, 9) * 10;
        return N(`Die Klasse 5b (${kids} Kinder) fährt ins Schullandheim. Der Bus kostet ${U.fmt(bus, 0)} € für alle zusammen. Dazu kommen pro Kind ${p} € für Unterkunft. Wie viel muss jedes Kind bezahlen?`, per + p, { unit: '€', hints: ['Teile die Buskosten zuerst auf alle Kinder auf.'], sol: `${U.fmt(bus, 0)} € : ${kids} = ${per} €; ${per} € + ${p} € = ${per + p} €`, mistakes: [{ v: bus + p, msg: 'Die Buskosten müssen auf alle Kinder verteilt werden!' }] });
      }
      const m = U.ri(8, 30) * 50, w = U.ri(2, 6);
      const ans = (m * 2 * 5 * w) / 1000;
      return N(`${n} hat einen Schulweg von ${U.fmt(m, 0)} m. Jeden Schultag geht ${n} hin und zurück. Wie viele km sind das in ${w} Wochen (5 Schultage pro Woche)?`, ans, { unit: 'km', tol: 0.001, hints: ['Hin und zurück = doppelte Strecke. 1 km = 1000 m.'], sol: `${U.fmt(m, 0)} m · 2 · 5 · ${w} = ${U.fmt(m * 10 * w, 0)} m = ${U.fmt(ans, 3)} km`, mistakes: [{ v: (m * 5 * w) / 1000, msg: 'Denk an den Rückweg!' }] });
    },
  });

  /* ---------- 7 Teiler-Detektiv ---------- */
  const RULE = { 2: 'Letzte Ziffer gerade.', 3: 'Quersumme durch 3 teilbar.', 4: 'Die letzten zwei Ziffern bilden eine Zahl, die durch 4 teilbar ist.', 5: 'Letzte Ziffer 0 oder 5.', 6: 'Durch 2 UND durch 3 teilbar.', 9: 'Quersumme durch 9 teilbar.', 10: 'Letzte Ziffer 0.', 25: 'Endet auf 00, 25, 50 oder 75.' };
  R({
    id: 'k5-teiler', icon: '🔍', title: 'Teiler-Detektiv', tags: ['Knobeln'],
    bp: 'Zahl – Variable – Operation', desc: 'Teilbarkeitsregeln, ggT und kgV.',
    gen(l) {
      if (l === 3) {
        let g, m, n;
        do { g = U.ri(2, 12); m = U.ri(2, 9); n = U.ri(2, 9); } while (m === n || U.gcd(m, n) !== 1);
        const a = g * m, b = g * n;
        if (U.chance(0.5)) return N(`Bestimme den <b>größten gemeinsamen Teiler</b>: ggT(${a}; ${b})`, g, { mq: `ggT(${a}; ${b})`, hints: ['Schreibe die Teilermengen beider Zahlen auf und suche den größten gemeinsamen.'], sol: `T(${a}) und T(${b}) haben als größten gemeinsamen Teiler ${g}.` });
        return N(`Bestimme das <b>kleinste gemeinsame Vielfache</b>: kgV(${a}; ${b})`, g * m * n, { mq: `kgV(${a}; ${b})`, hints: ['Schreibe die Vielfachen der größeren Zahl auf, bis eines auch durch die kleinere teilbar ist.'], sol: `kgV = ${g * m * n}`, mistakes: a * b !== g * m * n ? [{ v: a * b, msg: 'Das ist ein gemeinsames Vielfaches – aber nicht das kleinste!' }] : [] });
      }
      const d = l === 1 ? U.pick([2, 3, 5, 10]) : U.pick([3, 4, 6, 9, 25]);
      const lo = l === 1 ? 20 : 100, hi = l === 1 ? 200 : 999;
      let c; do c = U.ri(lo, hi); while (c % d !== 0);
      const wr = [];
      while (wr.length < 6) { const x = U.ri(lo, hi); if (x % d !== 0 && !wr.includes(x)) wr.push(x); }
      if (d === 9 || d === 6) { const x = c + 3; if (x % d !== 0) wr.unshift(x); }
      const qs = String(c).split('').map(Number);
      const extra = [3, 6, 9].includes(d) ? ` Quersumme von ${c}: ${qs.join(' + ')} = ${qs.reduce((x, y) => x + y, 0)}.` : '';
      const t = { q: `Welche Zahl ist durch <b class="hl">${d}</b> teilbar?`, hints: [`Regel: ${RULE[d]}`], sol: `${c} : ${d} = ${c / d}. Regel: ${RULE[d]}${extra}`, memOk: false };
      return U.choice(t, String(c), wr.map(String));
    },
  });
})();
