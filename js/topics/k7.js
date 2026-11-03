/* =========================================================
   Klasse 7 – Rationale Zahlen, Terme, Gleichungen,
   Prozente, Zuordnungen, Dreiecke
   ========================================================= */
(function () {
  const U = MA.U;
  const R = (t) => MA.registerTopic(Object.assign({ grade: 7 }, t));
  const N = (q, answer, o = {}) => Object.assign({ type: 'num', q, answer }, o);
  const P = U.par;

  /* ---------- 1 Plus-Minus-Arena ---------- */
  R({
    id: 'k7-ganz', icon: '➕', title: 'Plus-Minus-Arena', tags: ['Rechnen'],
    bp: 'Zahl – Variable – Operation', desc: 'Rechnen mit negativen Zahlen – Vorzeichen-Profi werden!',
    gen(l) {
      let e, ans, hint;
      if (l === 1) {
        const a = U.rnz(-20, 20), b = U.rnz(-20, 20), plus = U.chance(0.5);
        e = `${U.fmt(a)} ${plus ? '+' : '−'} ${P(b)}`; ans = plus ? a + b : a - b;
        hint = plus ? 'Plus eine negative Zahl = minus.' : 'Minus eine negative Zahl = plus!';
      } else if (l === 2) {
        const k = U.ri(0, 2);
        if (k < 2) {
          const a = U.rnz(-12, 12), b = U.rnz(-12, 12);
          if (k === 0) { e = `${U.fmt(a)} · ${P(b)}`; ans = a * b; }
          else { e = `${U.fmt(a * b)} : ${P(b)}`; ans = a; }
          hint = 'Gleiche Vorzeichen → Ergebnis positiv. Verschiedene Vorzeichen → negativ.';
        } else {
          const a = U.rnz(-50, 50), b = U.rnz(-50, 50), c = U.rnz(-50, 50);
          e = `${U.fmt(a)} − ${P(b)} + ${P(c)}`; ans = a - b + c;
          hint = 'Löse erst die Klammern auf: −(−) wird +, +(−) wird −.';
        }
      } else {
        const k = U.ri(0, 2);
        if (k === 0) {
          const a = U.rnz(-50, 50) / 10, b = U.rnz(-50, 50) / 10, op = U.pick(['+', '−', '·']);
          e = `${U.fmt(a)} ${op} ${P(b)}`; ans = U.round(op === '+' ? a + b : op === '−' ? a - b : a * b, 4);
          hint = 'Rechne zuerst mit den Beträgen, dann überlege das Vorzeichen.';
        } else if (k === 1) {
          const a = U.rnz(-9, 9), b = U.rnz(-9, 9), c = U.rnz(-9, 9), d = U.rnz(-9, 9);
          e = `(${U.fmt(a)} + ${P(b)}) · ${P(c)} − ${P(d)}`; ans = (a + b) * c - d;
          hint = 'Klammer zuerst, dann Punkt vor Strich.';
        } else {
          const a = U.rnz(-6, 6), b = U.rnz(-6, 6), c = U.rnz(-20, 20);
          e = `${P(a)} · ${P(b)} − ${P(c)} · (−1)`; ans = a * b - c * -1;
          hint = 'Punkt vor Strich. Minus mal minus ergibt plus.';
        }
      }
      return N(U.expr(e + ' = ?'), ans, { mq: e, hints: [hint], sol: `${e} = ${U.fmt(ans, 4)}`, mistakes: ans !== 0 ? [{ v: -ans, msg: 'Fast! Achte auf das Vorzeichen.' }] : [] });
    },
  });

  /* ---------- 2 Gleichungs-Waage ---------- */
  function scale(left, right) {
    // left/right: {x: Anzahl Kisten, w: Gewicht}
    const drawSide = (side, cx) => {
      let s = '';
      const items = [];
      for (let i = 0; i < side.x; i++) items.push('x');
      if (side.w) items.push('w');
      const bw = 30, gap = 4, total = items.length * (bw + gap) - gap + (side.w ? 14 : 0);
      let x = cx - total / 2;
      items.forEach((it) => {
        if (it === 'x') { s += `<rect x="${x.toFixed(1)}" y="68" width="${bw}" height="${bw}" rx="4" class="sv-box"/>` + U.t(x + bw / 2, 89, 'x', 'sv-t sv-mid sv-boxt'); x += bw + gap; }
        else { s += `<path d="M${(x + 6).toFixed(1)} 98 L${(x + 12).toFixed(1)} 66 L${(x + 32).toFixed(1)} 66 L${(x + 38).toFixed(1)} 98 Z" class="sv-weight"/>` + U.t(x + 22, 90, side.w, 'sv-t sv-mid sv-wt'); x += 44; }
      });
      return s;
    };
    return U.svg(400, 180,
      `<polygon points="200,110 185,168 215,168" class="sv-stand"/><rect x="160" y="166" width="80" height="10" rx="3" class="sv-stand"/>` +
      U.line(20, 110, 380, 110, 'sv-beam') + `<circle cx="200" cy="110" r="7" class="sv-dot2"/>` +
      `<rect x="20" y="98" width="160" height="10" rx="3" class="sv-pan"/><rect x="220" y="98" width="160" height="10" rx="3" class="sv-pan"/>` +
      drawSide(left, 100) + drawSide(right, 300));
  }
  R({
    id: 'k7-waage', icon: '🏋️', title: 'Gleichungs-Waage', tags: ['visuell'],
    bp: 'Zahl – Variable – Operation', desc: 'Die Waage ist im Gleichgewicht – wie schwer ist eine Kiste x?',
    gen(l) {
      let a, b, c, d, x;
      if (l === 1) {
        x = U.ri(1, 12);
        if (U.chance(0.5)) { a = 1; b = U.ri(1, 15); c = 0; d = x + b; }
        else { a = U.ri(2, 5); b = 0; c = 0; d = a * x; }
      } else if (l === 2) { x = U.ri(1, 12); a = U.ri(2, 5); b = U.ri(1, 20); c = 0; d = a * x + b; }
      else { x = U.ri(1, 10); c = U.ri(1, 3); a = c + U.ri(1, 3); b = U.ri(1, 12); d = (a - c) * x + b; }
      const eq = `${U.lin(a, b)} = ${U.lin(c, d)}`;
      const sol = l === 3
        ? `${eq} | − ${c}x → ${U.lin(a - c, b)} = ${d} | − ${b} → ${U.lin(a - c, 0)} = ${d - b} | : ${a - c} → x = ${x}`
        : b && a > 1 ? `${eq} | − ${b} → ${a}x = ${d - b} | : ${a} → x = ${x}` : b ? `${eq} | − ${b} → x = ${x}` : `${eq} | : ${a} → x = ${x}`;
      const mist = [];
      if (b && a > 1 && (d + b) % a === 0) mist.push({ v: (d + b) / a, msg: 'Auf beiden Seiten das Gleiche ABziehen, nicht addieren!' });
      return N(`Die Waage ist im Gleichgewicht. Wie schwer ist eine Kiste? <span class="expr inl">${eq}</span>`, x, { vis: scale({ x: a, w: b }, { x: c, w: d }), mq: eq, hints: ['Nimm auf beiden Seiten das Gleiche weg – dann bleibt die Waage im Gleichgewicht.', l === 3 ? 'Nimm zuerst auf beiden Seiten gleich viele Kisten weg.' : 'Am Ende muss eine Kiste allein auf einer Seite stehen.'], sol, mistakes: mist });
    },
  });

  /* ---------- 3 Prozent-Shop ---------- */
  const ITEMS = [['👟', 'Turnschuhe', [40, 60, 80, 120]], ['🎧', 'Kopfhörer', [20, 40, 50, 80]], ['🎮', 'Spielkonsole', [200, 250, 300, 400]], ['🛹', 'Skateboard', [60, 80, 100, 140]], ['🎒', 'Rucksack', [30, 40, 50, 60]], ['⌚', 'Smartwatch', [80, 120, 160, 200]], ['🚲', 'Fahrrad', [300, 400, 500, 600]]];
  const tag = (emo, name, price, badge, old) => `<div class="shop"><div class="shop-emo">${emo}</div><div class="shop-name">${name}</div>${old ? `<div class="shop-old">${old}</div>` : ''}<div class="shop-price">${price}</div>${badge ? `<div class="shop-badge">${badge}</div>` : ''}</div>`;
  R({
    id: 'k7-prozent', icon: '🛍️', title: 'Prozent-Shop', tags: ['Text', 'visuell'],
    bp: 'Zahl – Variable – Operation', desc: 'Rabatte, Preise und Prozentsätze im Mathe-Laden.',
    gen(l) {
      const [emo, name, prices] = U.pick(ITEMS);
      const Pp = U.pick(prices);
      if (l === 1) {
        const p = U.pick([10, 20, 25, 50]);
        const s = (Pp * p) / 100;
        return N(`${name} für ${U.euro(Pp)} gibt es mit <b>${p} % Rabatt</b>. Wie viel Euro sparst du?`, s, { unit: '€', tol: 0.001, vis: tag(emo, name, U.euro(Pp), `−${p} %`), mq: `${p} % von ${U.euro(Pp)}`, hints: [p === 50 ? '50 % ist die Hälfte.' : p === 25 ? '25 % ist ein Viertel.' : '10 % ist ein Zehntel.'], sol: `${p} % von ${U.euro(Pp)} = ${U.euro(s)}` });
      }
      if (l === 2) {
        if (U.chance(0.55)) {
          const p = U.ri(1, 8) * 5, neu = U.round(Pp * (1 - p / 100), 2);
          return N(`${name} kostet ${U.euro(Pp)}. Heute gibt es <b>${p} % Rabatt</b>. Wie viel kostet es jetzt?`, neu, { unit: '€', tol: 0.001, vis: tag(emo, name, U.euro(Pp), `−${p} %`), mq: `${U.euro(Pp)} − ${p} %`, hints: ['Berechne den Rabatt in Euro und ziehe ihn ab – oder rechne mit ' + (100 - p) + ' %.'], sol: `${U.euro(Pp)} · ${U.fmt(1 - p / 100)} = ${U.euro(neu)}`, mistakes: [{ v: U.round((Pp * p) / 100, 2), msg: 'Das ist die Ersparnis – zieh sie noch vom alten Preis ab!' }] });
        }
        const p = U.ri(1, 8) * 5, neu = U.round(Pp * (1 - p / 100), 2);
        return N(`Der Preis sinkt von ${U.euro(Pp)} auf ${U.euro(neu)}. Um wie viel Prozent wurde der Preis gesenkt?`, p, { unit: '%', vis: tag(emo, name, U.euro(neu), '', U.euro(Pp)), mq: `${U.euro(Pp)} → ${U.euro(neu)}: Rabatt?`, hints: ['Prozentsatz = Prozentwert : Grundwert · 100'], sol: `Ersparnis ${U.euro(Pp - neu)}; ${U.euro(Pp - neu)} : ${U.euro(Pp)} = ${U.fmt(p / 100)} = ${p} %` });
      }
      if (U.chance(0.5)) {
        const p = U.pick([10, 20, 25, 40, 50]), neu = U.round(Pp * (1 - p / 100), 2);
        return N(`Nach <b>${p} % Rabatt</b> kostet ${name} nur noch ${U.euro(neu)}. Wie teuer war es vorher?`, Pp, { unit: '€', tol: 0.001, vis: tag(emo, name, U.euro(neu), `−${p} %`, '?? €'), mq: `nach −${p} %: ${U.euro(neu)}`, hints: [`${U.euro(neu)} sind ${100 - p} % des alten Preises.`], sol: `${U.euro(neu)} : ${U.fmt(1 - p / 100)} = ${U.euro(Pp)}`, mistakes: [{ v: U.round(neu * (1 + p / 100), 2), msg: 'Nicht einfach p % aufschlagen: Der Rabatt bezog sich auf den ALTEN Preis!' }] });
      }
      const p = U.pick([10, 20, 25, 50]);
      const end = U.round(Pp * (1 + p / 100) * (1 - p / 100), 2);
      return N(`Ein Händler erhöht den Preis von ${name} (${U.euro(Pp)}) um ${p} % und senkt ihn eine Woche später um ${p} %. Wie viel kostet es dann?`, end, { unit: '€', tol: 0.001, vis: tag(emo, name, U.euro(Pp), `+${p} % → −${p} %`), hints: ['Die Senkung bezieht sich auf den NEUEN, erhöhten Preis.'], sol: `${U.euro(Pp)} · ${U.fmt(1 + p / 100)} · ${U.fmt(1 - p / 100)} = ${U.euro(end)}`, mistakes: [{ v: Pp, msg: 'Überraschung: Es kommt nicht der alte Preis heraus! Die Senkung bezieht sich auf den höheren Preis.' }] });
    },
  });

  /* ---------- 4 Zuordnungs-Detektiv ---------- */
  const CTX = [['Äpfel (kg)', 'Preis (€)'], ['Zeit (h)', 'Strecke (km)'], ['Anzahl Hefte', 'Preis (€)'], ['Benzin (l)', 'Preis (€)']];
  R({
    id: 'k7-zuordnung', icon: '🔗', title: 'Zuordnungs-Detektiv', tags: ['Text'],
    bp: 'Funktionaler Zusammenhang', desc: 'Proportional, antiproportional oder keins von beidem?',
    gen(l) {
      if (l === 1) {
        const k = U.ri(2, 9), xs = U.sample([1, 2, 3, 4, 5, 6, 8, 10, 12], 4).sort((a, b) => a - b), m = U.ri(1, 3);
        const [hx, hy] = U.pick(CTX);
        const ys = xs.map((x, i) => (i === m ? '?' : U.fmt(k * x)));
        return N('Proportionale Zuordnung: Ergänze den fehlenden Wert.', k * xs[m], { vis: U.htable([hx, hy], [xs.map(String), ys]), mq: '', memOk: false, hints: ['Proportional: doppelt so viel → doppelt so teuer. Berechne den Wert für 1.'], sol: `Für 1: ${k}. Also ${xs[m]} · ${k} = ${k * xs[m]}` });
      }
      if (l === 2) {
        const type = U.ri(0, 2);
        const xs = U.sample([1, 2, 3, 4, 5, 6, 8, 10, 12], 4).sort((a, b) => a - b);
        let ys;
        if (type === 0) { const k = U.ri(2, 9); ys = xs.map((x) => k * x); }
        else if (type === 1) { const c = 120; ys = xs.map((x) => U.round(c / x, 2)); }
        else { const k = U.ri(2, 5), b = U.ri(2, 10); ys = xs.map((x) => k * x + b); }
        const names = ['proportional', 'antiproportional', 'weder noch'];
        const t = { q: 'Welche Art von Zuordnung liegt vor?', vis: U.htable(['x', 'y'], [xs.map(String), ys.map((y) => U.fmt(y))]), memOk: false, hints: ['Proportional: Quotient y : x ist immer gleich. Antiproportional: Produkt x · y ist immer gleich.'], sol: type === 0 ? 'Quotientengleich → proportional' : type === 1 ? 'Produktgleich (x · y = 120) → antiproportional' : 'Weder quotienten- noch produktgleich' };
        U.choice(t, names[type], names.filter((_, i) => i !== type));
        t.options = names.slice(); t.answer = type; t.mistakes = [];
        return t;
      }
      if (U.chance(0.55)) {
        const pairs = [[4, 12, 6], [3, 8, 4], [6, 10, 4], [2, 15, 5], [5, 12, 6], [8, 9, 6], [4, 15, 6]];
        const [n1, t1, n2] = U.pick(pairs);
        const thing = U.pick([['Bagger', 'Tage'], ['Pumpen', 'Stunden'], ['Maler', 'Tage']]);
        return N(`${n1} ${thing[0]} brauchen ${t1} ${thing[1]}. Wie lange brauchen ${n2} ${thing[0]} (gleich schnell)?`, (n1 * t1) / n2, { unit: thing[1], mq: `${n1} ${thing[0]}: ${t1} ${thing[1]} → ${n2}?`, hints: ['Mehr Arbeitende → weniger Zeit: antiproportional!', 'Wie lange bräuchte einer allein?'], sol: `${n1} · ${t1} = ${n1 * t1}; ${n1 * t1} : ${n2} = ${U.fmt((n1 * t1) / n2)} ${thing[1]}`, mistakes: [{ v: (t1 * n2) / n1, msg: 'Antiproportional! Mehr Bagger/Pumpen/Maler brauchen WENIGER Zeit.' }] });
      }
      const kg = U.ri(2, 5), price = U.pick([1.5, 2.5, 1.8, 2.2, 3.2]) * kg, kg2 = U.ri(2, 9);
      const ans = U.round((price / kg) * kg2, 2);
      return N(`${kg} kg Äpfel kosten ${U.euro(price)}. Wie viel kosten ${kg2} kg?`, ans, { unit: '€', tol: 0.001, mq: `${kg} kg: ${U.euro(price)} → ${kg2} kg?`, hints: ['Dreisatz: erst den Preis für 1 kg berechnen.'], sol: `${U.euro(price)} : ${kg} = ${U.euro(price / kg)} pro kg; · ${kg2} = ${U.euro(ans)}` });
    },
  });

  /* ---------- 5 Term-Baukasten ---------- */
  R({
    id: 'k7-terme', icon: '🧩', title: 'Term-Baukasten', tags: ['Rechnen'],
    bp: 'Zahl – Variable – Operation', desc: 'Terme berechnen, zusammenfassen, Klammern auflösen.',
    gen(l) {
      if (l === 1) {
        const a = U.ri(2, 9), b = U.rnz(-10, 12), x = U.ri(-5, 6);
        const T = U.lin(a, b);
        return N(`Berechne den Term <span class="expr inl">${T}</span> für <b>x = ${U.fmt(x)}</b>.`, a * x + b, { mq: `${T} für x = ${U.fmt(x)}`, hints: [`Setze für x die Zahl ${U.fmt(x)} ein: ${a} · ${P(x)} ${b < 0 ? '−' : '+'} ${Math.abs(b)}`], sol: `${a} · ${P(x)} ${b < 0 ? '−' : '+'} ${Math.abs(b)} = ${a * x + b}` });
      }
      if (l === 2) {
        const a = U.ri(2, 9), b = U.ri(1, 12), c = U.rnz(-6, 9), d = U.ri(1, 12);
        const T = `${a}x + ${b} ${c < 0 ? '−' : '+'} ${Math.abs(c) === 1 ? '' : Math.abs(c)}x − ${d}`;
        const t = { q: `Fasse zusammen: <span class="expr inl">${T}</span>`, mq: T, hints: ['Fasse x-Glieder mit x-Gliedern und Zahlen mit Zahlen zusammen.'], sol: `${a}x ${c < 0 ? '−' : '+'} ${Math.abs(c)}x = ${U.lin(a + c, 0)}; ${b} − ${d} = ${b - d} → ${U.lin(a + c, b - d)}` };
        return U.choice(t, U.lin(a + c, b - d), [{ h: U.lin(a + c, b + d), msg: 'Achte auf das Minus vor der Zahl!' }, { h: U.lin(a + c + b - d, 0), msg: 'x-Glieder und Zahlen darf man nicht zusammenfassen!' }, { h: U.lin(a - c, b - d), msg: 'Achte auf das Vorzeichen vor dem zweiten x-Glied.' }, U.lin(a + c + 1, b - d)]);
      }
      const k = U.ri(2, 5), m = U.ri(2, 6), n = U.ri(1, 9), p = U.ri(1, 9);
      const T = `−${k}(${m}x − ${n}) + ${p}x`;
      const t = { q: `Löse die Klammer auf und fasse zusammen: <span class="expr inl">${T}</span>`, mq: T, hints: ['Das −' + k + ' wird mit JEDEM Glied in der Klammer multipliziert.', `−${k} · (−${n}) = +${k * n}`], sol: `−${k} · ${m}x = −${k * m}x; −${k} · (−${n}) = +${k * n}; dann + ${p}x → ${U.lin(p - k * m, k * n)}` };
      return U.choice(t, U.lin(p - k * m, k * n), [{ h: U.lin(p - k * m, -k * n), msg: 'Minus mal minus ergibt plus!' }, { h: U.lin(p - k * m, -n), msg: 'Auch die Zahl in der Klammer muss multipliziert werden.' }, { h: U.lin(p + k * m, k * n), msg: 'Das Vorzeichen vor der Klammer gilt auch für das x-Glied.' }, U.lin(p - m, n)]);
    },
  });

  /* ---------- 6 Winkel im Dreieck ---------- */
  function triangle(al, be, labels) {
    const A = [0, 0], B = [1, 0];
    const ga = 180 - al - be;
    const rad = Math.PI / 180;
    const t = Math.sin(be * rad) / Math.sin(ga * rad);
    const C = [t * Math.cos(al * rad), t * Math.sin(al * rad)];
    const xs = [A[0], B[0], C[0]], ys = [A[1], B[1], C[1]];
    const minx = Math.min(...xs), maxx = Math.max(...xs), maxy = Math.max(...ys);
    const sc = Math.min(300 / (maxx - minx), 170 / maxy);
    const T = (p) => [30 + (p[0] - minx) * sc, 200 - p[1] * sc];
    const a = T(A), b = T(B), c = T(C);
    let s = U.poly2([a, b, c]);
    s += U.angleArc(a, b, c, 26, labels[0]) + U.angleArc(b, c, a, 26, labels[1]) + U.angleArc(c, a, b, 26, labels[2]);
    s += U.t(a[0] - 14, a[1] + 16, 'A', 'sv-lbl') + U.t(b[0] + 6, b[1] + 16, 'B', 'sv-lbl') + U.t(c[0], c[1] - 10, 'C', 'sv-lbl sv-mid');
    return U.svg(360, 230, s);
  }
  R({
    id: 'k7-dreieck', icon: '🔺', title: 'Dreiecks-Winkel', tags: ['visuell'],
    bp: 'Raum und Form', desc: 'Die Winkelsumme im Dreieck ist immer 180°.',
    gen(l) {
      if (l === 1) {
        let a, b; do { a = U.ri(3, 12) * 5 + U.ri(0, 4); b = U.ri(3, 14) * 5; } while (a + b > 160);
        const g = 180 - a - b;
        return N('Wie groß ist der Winkel γ?', g, { unit: '°', vis: triangle(a, b, [`${a}°`, `${b}°`, 'γ = ?']), mq: `α = ${a}°, β = ${b}° → γ`, hints: ['α + β + γ = 180°'], sol: `γ = 180° − ${a}° − ${b}° = ${g}°` });
      }
      if (l === 2) {
        if (U.chance(0.5)) {
          const g = U.ri(10, 70) * 2, a = (180 - g) / 2;
          return N(`Gleichschenkliges Dreieck mit Spitze C. Wie groß ist der Basiswinkel α?`, a, { unit: '°', vis: triangle(a, a, ['α = ?', 'β', `${g}°`]), mq: `gleichschenklig, γ = ${g}° → α`, hints: ['Die beiden Basiswinkel α und β sind gleich groß.'], sol: `(180° − ${g}°) : 2 = ${a}°`, mistakes: [{ v: 180 - g, msg: 'Fast: Das ist die Summe beider Basiswinkel – noch durch 2 teilen.' }] });
        }
        const a = U.ri(25, 80);
        return N(`Gleichschenkliges Dreieck mit Spitze C. Wie groß ist der Winkel γ an der Spitze?`, 180 - 2 * a, { unit: '°', vis: triangle(a, a, [`${a}°`, 'β', 'γ = ?']), mq: `gleichschenklig, α = ${a}° → γ`, hints: ['Basiswinkel sind gleich groß: β = α'], sol: `γ = 180° − 2 · ${a}° = ${180 - 2 * a}°` });
      }
      let p, q, r, x;
      do { p = U.ri(1, 4); q = U.ri(1, 5); r = U.ri(1, 6); } while (180 % (p + q + r) !== 0 || 180 / (p + q + r) * Math.min(p, q, r) < 15 || p === q && q === r);
      x = 180 / (p + q + r);
      const lb = (k) => (k === 1 ? 'x' : k + 'x');
      return N(`Die Winkel sind α = ${lb(p)}, β = ${lb(q)}, γ = ${lb(r)}. Wie groß ist x?`, x, { unit: '°', vis: triangle(p * x, q * x, [lb(p), lb(q), lb(r)]), mq: `${lb(p)} + ${lb(q)} + ${lb(r)} = 180°`, hints: ['Stelle die Gleichung für die Winkelsumme auf.'], sol: `${lb(p)} + ${lb(q)} + ${lb(r)} = ${p + q + r}x = 180° → x = ${x}°` });
    },
  });
})();
