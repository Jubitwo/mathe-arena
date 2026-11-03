/* =========================================================
   Klasse 10 – Trigonometrie, Wachstum, Körper,
   Potenzen, quadratische Gleichungen, Baumdiagramme
   ========================================================= */
(function () {
  const U = MA.U;
  const R = (t) => MA.registerTopic(Object.assign({ grade: 10 }, t));
  const N = (q, answer, o = {}) => Object.assign({ type: 'num', q, answer }, o);
  const FR = (q, f, o = {}) => Object.assign({ type: 'frac', q, answer: U.frac(f.n, f.d) }, o);
  const F = U.F;
  const rad = (d) => (d * Math.PI) / 180, deg = (r) => (r * 180) / Math.PI;
  const RND = ' <span class="note">(auf eine Nachkommastelle runden, Taschenrechner erlaubt)</span>';

  /* ---------- 1 Trigo-Leuchtturm ---------- */
  function trigTri(alpha, la, lb, lc, angLabel) {
    // rechter Winkel bei C (unten rechts), α bei A (unten links)
    const b = 260, a = Math.min(180, b * Math.tan(rad(alpha)));
    const bb = a === 180 ? 180 / Math.tan(rad(alpha)) : b;
    const A = [30, 210], C = [30 + bb, 210], B = [30 + bb, 210 - a];
    const cen = [(A[0] + B[0] + C[0]) / 3, (A[1] + B[1] + C[1]) / 3];
    let s = U.poly2([A, B, C]) + U.rightMark(C, A, B, 14) + U.angleArc(A, C, B, 40, angLabel);
    s += U.edgeLabel(B, C, la, 20, cen) + U.edgeLabel(A, C, lb, 18, cen) + U.edgeLabel(A, B, lc, 20, cen);
    s += U.t(A[0] - 14, A[1] + 6, 'A', 'sv-lbl') + U.t(B[0] + 8, B[1], 'B', 'sv-lbl') + U.t(C[0] + 8, C[1] + 14, 'C', 'sv-lbl');
    return U.svg(bb + 110, 240, s);
  }
  R({
    id: 'k10-trigo', icon: '🗼', title: 'Trigo-Leuchtturm', tags: ['visuell', 'Text'],
    bp: 'Raum und Form', desc: 'Sinus, Kosinus, Tangens im rechtwinkligen Dreieck.',
    gen(l) {
      if (l === 1) {
        const fn = U.pick(['sin', 'cos', 'tan']);
        const vis = trigTri(U.ri(25, 50), 'a', 'b', 'c', 'α');
        const map = { sin: F('a', 'c'), cos: F('b', 'c'), tan: F('a', 'b') };
        const t = { q: `Welcher Quotient beschreibt <b>${fn}(α)</b>?`, vis, memOk: false, hints: ['Gegenkathete liegt α gegenüber, Ankathete liegt an α, Hypotenuse gegenüber dem rechten Winkel.', 'SOH-CAH-TOA: Sinus = G/H, Kosinus = A/H, Tangens = G/A'], sol: `${fn}(α) = ${map[fn]}` };
        return U.choice(t, map[fn], U.shuffle([F('a', 'c'), F('b', 'c'), F('a', 'b'), F('b', 'a'), F('c', 'a')]));
      }
      if (l === 2) {
        const al = U.ri(20, 65), k = U.ri(0, 2), len = U.ri(4, 15);
        if (k === 0) { const a = len * Math.sin(rad(al)); return N(`Berechne die Gegenkathete a.` + RND, a, { unit: 'cm', tol: 0.06, vis: trigTri(al, 'a = ?', '', `${len} cm`, `${al}°`), memOk: false, hints: ['sin(α) = a : c'], sol: `a = ${len} · sin(${al}°) ≈ ${U.fmt(a, 1)} cm`, mistakes: [{ v: len * Math.cos(rad(al)), msg: 'Das wäre die Ankathete – nimm den Sinus!' }] }); }
        if (k === 1) { const b = len * Math.cos(rad(al)); return N(`Berechne die Ankathete b.` + RND, b, { unit: 'cm', tol: 0.06, vis: trigTri(al, '', 'b = ?', `${len} cm`, `${al}°`), memOk: false, hints: ['cos(α) = b : c'], sol: `b = ${len} · cos(${al}°) ≈ ${U.fmt(b, 1)} cm`, mistakes: [{ v: len * Math.sin(rad(al)), msg: 'Das wäre die Gegenkathete – nimm den Kosinus!' }] }); }
        const a = len * Math.tan(rad(al));
        return N(`Berechne die Gegenkathete a.` + RND, a, { unit: 'cm', tol: 0.06, vis: trigTri(al, 'a = ?', `${len} cm`, '', `${al}°`), memOk: false, hints: ['tan(α) = a : b'], sol: `a = ${len} · tan(${al}°) ≈ ${U.fmt(a, 1)} cm` });
      }
      const h = U.ri(20, 60), al = U.ri(8, 40);
      const vis = U.svg(380, 220, U.line(10, 190, 370, 190, 'sv-water') + `<rect x="300" y="60" width="22" height="130" class="sv-tower"/><polygon points="296,60 326,60 311,38" class="sv-tower-top"/><circle cx="311" cy="52" r="5" class="sv-lamp"/>` + `<text x="30" y="188" class="sv-boat">⛵</text>` + U.line(60, 182, 311, 50, 'sv-dash2') + U.line(60, 182, 300, 182, 'sv-thin') + U.angleArc([60, 182], [300, 182], [311, 50], 50, 'α') + U.t(336, 125, `${h} m`, 'sv-t') + U.t(180, 205, 'd = ?', 'sv-t sv-mid sv-acc'));
      if (U.chance(0.6)) {
        const d = h / Math.tan(rad(al));
        return N(`Vom Boot aus sieht man die Spitze eines ${h} m hohen Leuchtturms unter dem Höhenwinkel α = ${al}°. Wie weit ist das Boot vom Turm entfernt?` + RND, d, { unit: 'm', tol: 0.06, vis, memOk: false, hints: ['tan(α) = Gegenkathete : Ankathete = Höhe : Entfernung'], sol: `d = ${h} : tan(${al}°) ≈ ${U.fmt(d, 1)} m`, mistakes: [{ v: h * Math.tan(rad(al)), msg: 'Umgekehrt! d = h : tan(α)' }] });
      }
      const d = U.ri(50, 250), a2 = deg(Math.atan(h / d));
      return N(`Ein Boot ist ${d} m vom ${h} m hohen Leuchtturm entfernt. Unter welchem Höhenwinkel α sieht man die Turmspitze?` + RND, a2, { unit: '°', tol: 0.06, vis, memOk: false, hints: ['α = tan⁻¹(Höhe : Entfernung)'], sol: `α = tan⁻¹(${h} : ${d}) ≈ ${U.fmt(a2, 1)}°` });
    },
  });

  /* ---------- 2 Wachstums-Simulator ---------- */
  R({
    id: 'k10-wachstum', icon: '🦠', title: 'Wachstums-Simulator', tags: ['Text'],
    bp: 'Funktionaler Zusammenhang', desc: 'Exponentielles Wachstum und Zerfall – Bakterien, Geld, Halbwertszeit.',
    gen(l) {
      if (l === 1) {
        if (U.chance(0.4)) {
          const lin = U.chance(0.5), a = U.ri(2, 10) * 10, s = U.pick([2, 3]), d = U.ri(5, 30);
          const vals = [0, 1, 2, 3, 4].map((x) => (lin ? a + d * x : a * Math.pow(s, x)));
          const t = { q: 'Welches Wachstum zeigt die Tabelle?', vis: U.htable(['Jahr', 'Wert'], [['0', '1', '2', '3', '4'], vals.map((v) => U.fmt(v))]), memOk: false, hints: ['Linear: immer gleiche Differenz. Exponentiell: immer gleicher Faktor.'], sol: lin ? `Immer + ${d} → linear` : `Immer · ${s} → exponentiell` };
          U.choice(t, lin ? 'lineares Wachstum' : 'exponentielles Wachstum', [lin ? 'exponentielles Wachstum' : 'lineares Wachstum', 'kein Wachstum']);
          t.options = ['lineares Wachstum', 'exponentielles Wachstum', 'kein Wachstum']; t.answer = lin ? 0 : 1; t.mistakes = [];
          return t;
        }
        const N0 = U.pick([10, 25, 50, 100, 200]), t = U.ri(2, 6);
        return N(`Eine Bakterienkultur <b>verdoppelt</b> sich jede Stunde. Am Anfang sind es ${N0} Bakterien. Wie viele sind es nach ${t} Stunden?`, N0 * 2 ** t, { mq: `${N0} · 2^${t}`, hints: [`Jede Stunde · 2: ${N0} → ${N0 * 2} → …`], sol: `${N0} · 2${['', '¹', '²', '³', '⁴', '⁵', '⁶'][t]} = ${U.fmt(N0 * 2 ** t, 0)}`, mistakes: [{ v: N0 * 2 * t, msg: 'Verdoppeln heißt jedes Mal · 2 – nicht · ' + t + '!' }] });
      }
      if (l === 2) {
        if (U.chance(0.5)) {
          const K = U.ri(5, 50) * 100, p = U.ri(2, 8), n = U.ri(3, 10);
          const v = K * Math.pow(1 + p / 100, n);
          return N(`Eine Stadt hat ${U.fmt(K, 0)} Einwohner und wächst jährlich um ${p} %. Wie viele Einwohner hat sie nach ${n} Jahren? (ganze Zahl)`, v, { tol: 1.01, memOk: false, hints: [`Wachstumsfaktor q = 1 + ${p}/100 = ${U.fmt(1 + p / 100, 2)}`], sol: `${U.fmt(K, 0)} · ${U.fmt(1 + p / 100, 2)}^${n} ≈ ${U.fmt(v, 0)}`, mistakes: [{ v: U.round(K * (1 + (p * n) / 100), 0), msg: 'Exponentiell: Jedes Jahr wird mit dem Faktor multipliziert, nicht linear addiert.' }] });
        }
        const W = U.ri(10, 40) * 1000, p = U.pick([10, 12, 15, 20]), n = U.ri(2, 6);
        const v = W * Math.pow(1 - p / 100, n);
        return N(`Ein Auto kostet ${U.euro(W)} und verliert jedes Jahr ${p} % an Wert. Was ist es nach ${n} Jahren noch wert? (auf ganze Euro)`, v, { unit: '€', tol: 1.01, memOk: false, hints: [`Abnahmefaktor q = 1 − ${p}/100 = ${U.fmt(1 - p / 100, 2)}`], sol: `${U.euro(W)} · ${U.fmt(1 - p / 100, 2)}^${n} ≈ ${U.fmt(v, 0)} €` });
      }
      const k = U.ri(0, 2);
      if (k === 0) {
        const p = U.pick([3, 4, 5, 6, 7, 8, 9, 10, 12]);
        let n = 0; while (Math.pow(1 + p / 100, n) < 2) n++;
        return N(`Ein Kapital wird zu ${p} % mit Zinseszins angelegt. Nach wie vielen <b>ganzen Jahren</b> hat es sich erstmals verdoppelt?`, n, { unit: 'Jahre', mq: `Verdopplung bei ${p} %`, hints: [`Gesucht: kleinstes n mit ${U.fmt(1 + p / 100, 2)}ⁿ ≥ 2. Probiere aus oder nutze den Logarithmus.`], sol: `${U.fmt(1 + p / 100, 2)}^${n - 1} ≈ ${U.fmt(Math.pow(1 + p / 100, n - 1), 3)} < 2, ${U.fmt(1 + p / 100, 2)}^${n} ≈ ${U.fmt(Math.pow(1 + p / 100, n), 3)} ≥ 2 → ${n} Jahre`, mistakes: [{ v: Math.round(100 / p), msg: 'Mit Zinseszins geht es schneller als 100 : p!' }] });
      }
      if (k === 1) {
        const T = U.pick([2, 5, 8, 10, 12]), m = U.pick([2, 3, 4]), M0 = U.pick([80, 160, 200, 320, 400, 640]);
        return N(`Ein radioaktiver Stoff hat eine Halbwertszeit von ${T} Tagen. Anfangs sind ${M0} g vorhanden. Wie viel ist nach ${T * m} Tagen noch übrig?`, M0 / 2 ** m, { unit: 'g', mq: `${M0} g, HWZ ${T} d, nach ${T * m} d`, hints: [`${T * m} Tage sind ${m} Halbwertszeiten.`], sol: `${M0} · (½)^${m} = ${U.fmt(M0 / 2 ** m)} g`, mistakes: [{ v: M0 - (M0 / 2) * m, msg: 'Jedes Mal halbiert sich der REST – nicht die Anfangsmenge.' }] });
      }
      const [K, p, n] = U.pick([[500, 10, 2], [1000, 20, 2], [400, 50, 2], [800, 25, 2], [1000, 10, 3]]);
      const E = U.round(K * Math.pow(1 + p / 100, n), 2);
      return N(`Ein Bestand wächst exponentiell von ${U.fmt(K, 0)} auf ${U.fmt(E)} in ${n} Jahren. Wie groß ist die jährliche Wachstumsrate?`, p, { unit: '%', mq: `${K} → ${U.fmt(E)} in ${n} J.`, hints: [`q = ${n === 2 ? '√' : '∛'}(${U.fmt(E)} : ${K})`], sol: `q = ${U.fmt(1 + p / 100, 2)} → ${p} %`, mistakes: [{ v: U.round(((E - K) / K) * 100 / n, 2), msg: 'Nicht einfach teilen – die Wachstumsrate wirkt jedes Jahr auf den neuen Bestand.' }] });
    },
  });

  /* ---------- 3 Körper-Fabrik ---------- */
  const cyl = (lr, lh) => U.svg(290, 240, `<path d="M50 50 L50 190 A70 20 0 0 0 190 190 L190 50" class="sv-shape"/><ellipse cx="120" cy="50" rx="70" ry="20" class="sv-face2"/><path d="M50 190 A70 20 0 0 1 190 190" class="sv-dash" fill="none"/>` + U.line(120, 50, 190, 50, 'sv-c2') + U.t(155, 42, lr, 'sv-t sv-mid') + U.t(202, 125, lh, 'sv-t'));
  const cone = (lr, lh) => U.svg(240, 240, `<path d="M50 190 L120 30 L190 190 A70 20 0 0 1 50 190" class="sv-shape"/><path d="M50 190 A70 20 0 0 1 190 190" class="sv-dash" fill="none"/>` + U.line(120, 30, 120, 190, 'sv-dash2') + U.line(120, 190, 190, 190, 'sv-c2') + U.t(155, 210, lr, 'sv-t sv-mid') + U.t(128, 120, lh, 'sv-t'));
  const sphere = (lr) => U.svg(240, 240, `<circle cx="120" cy="120" r="90" class="sv-shape"/><ellipse cx="120" cy="120" rx="90" ry="22" class="sv-dash" fill="none"/>` + U.line(120, 120, 210, 120, 'sv-c2') + U.t(165, 112, lr, 'sv-t sv-mid'));
  const pyr = (la, lh) => U.svg(260, 240, `<polygon points="40,190 170,190 220,150 90,150" class="sv-face2"/><polygon points="40,190 170,190 130,40" class="sv-shape"/><polygon points="170,190 220,150 130,40" class="sv-face3"/>` + U.line(130, 40, 130, 170, 'sv-dash2') + U.t(105, 210, la, 'sv-t sv-mid') + U.t(136, 110, lh, 'sv-t'));
  const silo = (lr, lh) => U.svg(240, 260, `<path d="M50 90 A70 70 0 0 1 190 90 L190 220 A70 20 0 0 1 50 220 Z" class="sv-shape"/><path d="M50 90 A70 20 0 0 0 190 90" class="sv-dash" fill="none"/>` + U.line(120, 220, 190, 220, 'sv-c2') + U.t(155, 245, lr, 'sv-t sv-mid') + U.t(200, 160, lh, 'sv-t'));
  const tolV = () => 1.01; // ganze Zahlen; Rechnen mit π oder 3,14 wird über alts akzeptiert
  R({
    id: 'k10-koerper', icon: '🏭', title: 'Körper-Fabrik', tags: ['visuell'],
    bp: 'Messen', desc: 'Volumen und Oberfläche von Zylinder, Kegel, Kugel, Pyramide.',
    gen(l) {
      const r = U.ri(2, 10), h = U.ri(3, 20);
      const RG = ' <span class="note">(auf ganze cm³ runden)</span>';
      if (l === 1) { const V = Math.PI * r * r * h; return N('Berechne das <b>Volumen</b> des Zylinders.' + RG, V, { unit: 'cm³', tol: tolV(V), alts: [3.14 * r * r * h], vis: cyl(`r = ${r} cm`, `h = ${h} cm`), memOk: false, hints: ['V = π · r² · h'], sol: `V = π · ${r}² · ${h} ≈ ${U.fmt(V, 0)} cm³`, mistakes: [{ v: Math.PI * 2 * r * h, msg: 'Der Radius muss quadriert werden!' }] }); }
      if (l === 2) {
        const k = U.ri(0, 2);
        if (k === 0) { const V = (Math.PI * r * r * h) / 3; return N('Berechne das <b>Volumen</b> des Kegels.' + RG, V, { unit: 'cm³', tol: tolV(V), alts: [(3.14 * r * r * h) / 3], vis: cone(`r = ${r} cm`, `h = ${h} cm`), memOk: false, hints: ['V = ⅓ · π · r² · h'], sol: `V = ⅓ · π · ${r}² · ${h} ≈ ${U.fmt(V, 0)} cm³`, mistakes: [{ v: Math.PI * r * r * h, msg: 'Das ist ein Zylinder – beim Kegel noch durch 3 teilen!' }] }); }
        if (k === 1) { const V = (4 / 3) * Math.PI * r ** 3; return N('Berechne das <b>Volumen</b> der Kugel.' + RG, V, { unit: 'cm³', tol: tolV(V), alts: [(4 / 3) * 3.14 * r ** 3], vis: sphere(`r = ${r} cm`), memOk: false, hints: ['V = ⁴⁄₃ · π · r³'], sol: `V = ⁴⁄₃ · π · ${r}³ ≈ ${U.fmt(V, 0)} cm³` }); }
        const a = U.ri(3, 12) * 1; const V = (a * a * h) / 3;
        return N('Berechne das <b>Volumen</b> der quadratischen Pyramide.' + RG, V, { unit: 'cm³', tol: tolV(V), vis: pyr(`a = ${a} cm`, `h = ${h} cm`), memOk: false, hints: ['V = ⅓ · a² · h'], sol: `V = ⅓ · ${a}² · ${h} = ${U.fmt(V, 1)} cm³`, mistakes: [{ v: a * a * h, msg: 'Pyramide: noch durch 3 teilen!' }] });
      }
      const k = U.ri(0, 2);
      if (k === 0) { const O = 2 * Math.PI * r * r + 2 * Math.PI * r * h; return N('Berechne die <b>Oberfläche</b> des Zylinders.' + ' <span class="note">(auf ganze cm² runden)</span>', O, { unit: 'cm²', tol: tolV(O), alts: [2 * 3.14 * r * r + 2 * 3.14 * r * h], vis: cyl(`r = ${r} cm`, `h = ${h} cm`), memOk: false, hints: ['O = 2 · Kreisfläche + Mantel', 'Mantel = Umfang · Höhe = 2πr · h'], sol: `O = 2π · ${r}² + 2π · ${r} · ${h} ≈ ${U.fmt(O, 0)} cm²`, mistakes: [{ v: Math.PI * r * r + 2 * Math.PI * r * h, msg: 'Ein Zylinder hat ZWEI Kreisflächen (Deckel und Boden).' }] }); }
      if (k === 1) { const V = Math.PI * r * r * h + (2 / 3) * Math.PI * r ** 3; return N('Ein Silo besteht aus einem Zylinder mit einer Halbkugel als Dach. Berechne das <b>Volumen</b>.' + ' <span class="note">(auf ganze m³ runden)</span>', V, { unit: 'm³', tol: tolV(V), alts: [3.14 * r * r * h + (2 / 3) * 3.14 * r ** 3], vis: silo(`r = ${r} m`, `h = ${h} m`), memOk: false, hints: ['Zylinder + halbe Kugel', 'Halbkugel: V = ⅔ · π · r³'], sol: `π · ${r}² · ${h} + ⅔ · π · ${r}³ ≈ ${U.fmt(V, 0)} m³`, mistakes: [{ v: Math.PI * r * r * h + (4 / 3) * Math.PI * r ** 3, msg: 'Es ist nur eine HALBE Kugel!' }] }); }
      const hh = U.ri(3, 15), V = Math.round((Math.PI * r * r * hh) / 3);
      return N(`Ein Kegel hat den Radius ${r} cm und das Volumen ${U.fmt(V, 0)} cm³. Wie hoch ist er?` + RND, (3 * V) / (Math.PI * r * r), { unit: 'cm', tol: 0.06, vis: cone(`r = ${r} cm`, 'h = ?'), memOk: false, hints: ['Stelle V = ⅓πr²h nach h um.'], sol: `h = 3 · ${U.fmt(V, 0)} : (π · ${r}²) ≈ ${U.fmt((3 * V) / (Math.PI * r * r), 1)} cm` });
    },
  });

  /* ---------- 4 Potenz-Power ---------- */
  const pw = (b, e) => `${b}<sup>${U.fmt(e)}</sup>`;
  R({
    id: 'k10-potenz', icon: '⚡', title: 'Potenz-Power', tags: ['Rechnen'],
    bp: 'Zahl – Variable – Operation', desc: 'Potenzgesetze und wissenschaftliche Schreibweise.',
    gen(l) {
      if (l === 1) {
        const k = U.ri(0, 2);
        if (k === 0) { const [b, e] = U.pick([[2, U.ri(2, 8)], [3, U.ri(2, 4)], [5, U.ri(2, 3)], [4, U.ri(2, 3)], [10, U.ri(2, 6)]]); return N(U.expr(`${pw(b, e)} = ?`), b ** e, { mq: pw(b, e), hints: [`${b} wird ${e}-mal mit sich selbst multipliziert.`], sol: `${Array(e).fill(b).join(' · ')} = ${U.fmt(b ** e, 0)}`, mistakes: [{ v: b * e, msg: 'Potenzieren ist nicht Multiplizieren mit dem Exponenten!' }] }); }
        if (k === 1) { const e = U.ri(1, 4); return N(U.expr(`${pw(10, -e)} = ? (als Dezimalzahl)`), 10 ** -e, { mq: pw(10, -e), hints: [`10<sup>−${e}</sup> = 1 : 10<sup>${e}</sup>`], sol: `${pw(10, -e)} = ${U.fmt(10 ** -e, 6)}` }); }
        const b = U.ri(2, 9); return N(U.expr(`${pw(b, 0)} + ${pw(b, 1)} = ?`), 1 + b, { mq: `${pw(b, 0)} + ${pw(b, 1)}`, hints: ['Jede Zahl (außer 0) hoch 0 ergibt 1.'], sol: `1 + ${b} = ${1 + b}`, mistakes: [{ v: b, msg: `${pw(b, 0)} ist 1, nicht 0!` }] });
      }
      if (l === 2) {
        const m = U.ri(2, 7), n = U.ri(2, 6), v = U.pick(['a', 'x', 'b']);
        const k = U.ri(0, 2);
        if (k === 0) { const t = { q: `Vereinfache: <span class="expr inl">${pw(v, m)} · ${pw(v, n)}</span>`, mq: `${pw(v, m)} · ${pw(v, n)}`, hints: ['Gleiche Basis beim Multiplizieren: Exponenten addieren.'], sol: `${pw(v, m + n)}` }; return U.choice(t, pw(v, m + n), [{ h: pw(v, m * n), msg: 'Exponenten werden addiert, nicht multipliziert!' }, pw('2' + v, m + n), pw(v, Math.abs(m - n) || m + n + 1)]); }
        if (k === 1) { const big = m + n; const t = { q: `Vereinfache: <span class="expr inl">${pw(v, big)} : ${pw(v, n)}</span>`, mq: `${pw(v, big)} : ${pw(v, n)}`, hints: ['Gleiche Basis beim Dividieren: Exponenten subtrahieren.'], sol: pw(v, m) }; return U.choice(t, pw(v, m), [{ h: pw(v, big + n), msg: 'Beim Dividieren werden die Exponenten subtrahiert.' }, pw(v, big * n), pw(v, big)]); }
        const t = { q: `Vereinfache: <span class="expr inl">(${pw(v, m)})<sup>${n}</sup></span>`, mq: `(${pw(v, m)})<sup>${n}</sup>`, hints: ['Potenz einer Potenz: Exponenten multiplizieren.'], sol: pw(v, m * n) };
        return U.choice(t, pw(v, m * n), [{ h: pw(v, m + n), msg: 'Bei einer Potenz von einer Potenz werden die Exponenten multipliziert.' }, pw(v, m ** n), pw(n + v, m)]);
      }
      const k = U.ri(0, 2);
      if (k === 0) {
        const mant = U.ri(11, 99) / 10, e = U.ri(-7, -2);
        const num = U.round(mant * 10 ** e, 10);
        const s = U.fmt(num, 10);
        return N(`Schreibe in wissenschaftlicher Schreibweise: <span class="expr inl">${s} = ${U.fmt(mant, 1)} · 10<sup>?</sup></span>`, e, { mq: `${s} = ${U.fmt(mant, 1)} · 10^?`, hints: ['Um wie viele Stellen muss das Komma nach RECHTS wandern? Das ergibt einen negativen Exponenten.'], sol: `Das Komma wandert ${-e} Stellen nach rechts → negativer Exponent: ${s} = ${U.fmt(mant, 1)} · 10<sup>${U.fmt(e)}</sup>`, mistakes: [{ v: -e, msg: 'Kleine Zahlen haben einen NEGATIVEN Exponenten.' }] });
      }
      if (k === 1) {
        const [a, b] = U.pick([[2, 3], [2, 4], [3, 3], [2, 2], [1.5, 4], [2.5, 2], [1.2, 3], [4, 2]]);
        const e1 = U.ri(3, 8); let e2; do e2 = U.ri(-7, -2); while (e1 + e2 === 0);
        const t = { q: `Berechne: <span class="expr inl">(${U.fmt(a)} · 10<sup>${e1}</sup>) · (${U.fmt(b)} · 10<sup>${U.fmt(e2)}</sup>)</span>`, mq: `(${a} · 10^${e1}) · (${b} · 10^${e2})`, hints: ['Zahlen multiplizieren, Zehnerpotenzen: Exponenten addieren.'], sol: `${U.fmt(a)} · ${U.fmt(b)} = ${U.fmt(a * b)} und 10<sup>${e1}</sup> · 10<sup>${U.fmt(e2)}</sup> = 10<sup>${U.fmt(e1 + e2)}</sup>` };
        const m = U.fmt(a * b);
        return U.choice(t, `${m} · 10<sup>${U.fmt(e1 + e2)}</sup>`, [{ h: `${m} · 10<sup>${U.fmt(e1 * e2)}</sup>`, msg: 'Exponenten werden addiert, nicht multipliziert.' }, `${U.fmt(a + b)} · 10<sup>${U.fmt(e1 + e2)}</sup>`, `${m} · 10<sup>${U.fmt(e1 - e2)}</sup>`]);
      }
      const b = U.pick([2, 3, 4, 5]), e = U.ri(1, 3);
      return FR(U.expr(`${pw(b, -e)} = ? (als Bruch)`), { n: 1, d: b ** e }, { mq: pw(b, -e), hints: ['Negativer Exponent: Kehrwert bilden.'], sol: `${pw(b, -e)} = ${F(1, b ** e)}`, mistakes: [{ v: -(b ** e), msg: 'Ein negativer Exponent macht die Zahl nicht negativ – er bedeutet Kehrwert!' }] });
    },
  });

  /* ---------- 5 Quadratische Gleichungen ---------- */
  const L = (arr) => (arr.length ? `L = { ${arr.map((v) => U.fmt(v)).join('; ')} }` : 'L = { }');
  R({
    id: 'k10-quadgl', icon: '🎲', title: 'Quadratische Gleichungen', tags: ['Rechnen'],
    bp: 'Zahl – Variable – Operation', desc: 'Lösungsmengen finden – von x² = c bis zur pq-Formel.',
    gen(l) {
      if (l === 1) {
        const n = U.ri(2, 12);
        const eq = U.chance(0.5) ? `x² = ${n * n}` : `x² − ${n * n} = 0`;
        const t = { q: `Bestimme die Lösungsmenge: <span class="expr inl">${eq}</span>`, mq: eq, hints: ['Eine Quadratzahl hat zwei Wurzeln: eine positive und eine negative.'], sol: `x = ±${n} → ${L([-n, n])}` };
        return U.choice(t, L([-n, n]), [{ h: L([n]), msg: 'Auch (−' + n + ')² ergibt ' + n * n + '!' }, L([(n * n) / 2]), L([-n * n, n * n])]);
      }
      if (l === 2) {
        if (U.chance(0.5)) {
          const a = U.rnz(-8, 8), b = U.rnz(-8, 8); if (a === -b) return this.gen(l);
          const eq = `(${U.lin(1, -a)})(${U.lin(1, -b)}) = 0`;
          const r = [a, b].sort((x, y) => x - y);
          const t = { q: `Satz vom Nullprodukt: <span class="expr inl">${eq}</span>`, mq: eq, hints: ['Ein Produkt ist null, wenn einer der Faktoren null ist.'], sol: `${U.lin(1, -a)} = 0 → x = ${U.fmt(a)} oder ${U.lin(1, -b)} = 0 → x = ${U.fmt(b)}. Also ${L(r)}` };
          return U.choice(t, L(r), [{ h: L([-a, -b].sort((x, y) => x - y)), msg: 'Vorzeichenfalle: x − 3 = 0 → x = +3.' }, L([a]), L([a * b])]);
        }
        const p = U.rnz(-9, 9);
        const eq = `${U.poly([1, p, 0])} = 0`;
        const r = [0, -p].sort((x, y) => x - y);
        const t = { q: `Löse durch Ausklammern: <span class="expr inl">${eq}</span>`, mq: eq, hints: ['Klammere x aus: x · (x + …) = 0'], sol: `x(${U.lin(1, p)}) = 0 → ${L(r)}` };
        return U.choice(t, L(r), [{ h: L([-p]), msg: 'Die Lösung x = 0 fehlt!' }, L([0, p].sort((x, y) => x - y)), L([p])]);
      }
      if (U.chance(0.85)) {
        let r1, r2; do { r1 = U.ri(-9, 9); r2 = U.ri(-9, 9); } while (r1 === r2 || r1 + r2 === 0);
        const p = -(r1 + r2), q = r1 * r2;
        const eq = `${U.poly([1, p, q])} = 0`;
        const r = [r1, r2].sort((x, y) => x - y);
        const t = { q: `Löse mit der pq-Formel: <span class="expr inl">${eq}</span>`, mq: eq, hints: ['x = −p/2 ± √((p/2)² − q)', `p = ${U.fmt(p)}, q = ${U.fmt(q)}`], sol: `x = ${U.fmt(-p / 2)} ± √(${U.fmt((p / 2) ** 2)} − ${U.par(q)}) = ${U.fmt(-p / 2)} ± ${U.fmt(Math.abs(r1 - r2) / 2)} → ${L(r)}` };
        return U.choice(t, L(r), [{ h: L([-r1, -r2].sort((x, y) => x - y)), msg: 'Achte auf das Minus bei −p/2!' }, L([r1, -r2].sort((x, y) => x - y)), { h: 'L = { }', msg: 'Die Diskriminante ist positiv – es gibt Lösungen.' }]);
      }
      const p = U.rnz(-6, 6) * 2, q = (p / 2) ** 2 + U.ri(1, 9);
      const eq = `${U.poly([1, p, q])} = 0`;
      const t = { q: `Löse mit der pq-Formel: <span class="expr inl">${eq}</span>`, mq: eq, hints: ['Berechne zuerst die Diskriminante D = (p/2)² − q.'], sol: `D = ${U.fmt((p / 2) ** 2)} − ${q} = ${U.fmt((p / 2) ** 2 - q)} < 0 → keine Lösung: L = { }` };
      return U.choice(t, 'L = { }', [{ h: L([-p / 2]), msg: 'D < 0: Unter der Wurzel steht etwas Negatives!' }, L([-p / 2 - 1, -p / 2 + 1]), L([p / 2])]);
    },
  });

  /* ---------- 6 Baumdiagramm-Bahn ---------- */
  function tree(r, b, n, wo, show2) {
    const lab = (k, m) => (show2 ? `${k}/${m}` : '?');
    const W = 360, H = 250;
    const root = [20, 125], s1 = [[150, 60], [150, 190]];
    const leaves = [[300, 25], [300, 95], [300, 155], [300, 225]];
    const p1 = [`${r}/${n}`, `${b}/${n}`];
    const n2 = wo ? n - 1 : n;
    const p2 = wo ? [[lab(r - 1, n2), lab(b, n2)], [lab(r, n2), lab(b - 1, n2)]] : [[`${r}/${n}`, `${b}/${n}`], [`${r}/${n}`, `${b}/${n}`]];
    let s = '';
    s1.forEach((p, i) => { s += U.line(root[0], root[1], p[0] - 14, p[1], 'sv-branch') + U.t((root[0] + p[0]) / 2 - 4, (root[1] + p[1]) / 2 + (i ? 22 : -8), p1[i], 'sv-t sv-mid sv-prob'); });
    s1.forEach((p, i) => [0, 1].forEach((j) => { const L = leaves[i * 2 + j]; s += U.line(p[0] + 14, p[1], L[0] - 14, L[1], 'sv-branch') + U.t((p[0] + L[0]) / 2 + 4, (p[1] + L[1]) / 2 + (j ? 18 : -6), p2[i][j], 'sv-t sv-mid sv-prob'); }));
    const ball = (p, c) => `<circle cx="${p[0]}" cy="${p[1]}" r="12" class="${c ? 'ball-b' : 'ball-r'}"/>`;
    s += `<circle cx="${root[0]}" cy="${root[1]}" r="5" class="sv-dot2"/>` + ball(s1[0], 0) + ball(s1[1], 1);
    leaves.forEach((L, i) => { s += ball(L, i % 2); });
    return U.svg(W, H, s, 'tree');
  }
  const urn = (r, b) => `<div class="urn">${'<span class="ball r"></span>'.repeat(r)}${'<span class="ball b"></span>'.repeat(b)}</div>`;
  R({
    id: 'k10-baum', icon: '🌲', title: 'Baumdiagramm-Bahn', tags: ['visuell', 'Daten'],
    bp: 'Daten und Zufall', desc: 'Mehrstufige Zufallsexperimente mit Pfadregeln.',
    gen(l) {
      const r = U.ri(2, 5), b = U.ri(2, 5), n = r + b;
      if (l === 1) return FR(`In einer Urne liegen ${r} rote und ${b} blaue Kugeln. Es wird zweimal <b>mit Zurücklegen</b> gezogen. Wie groß ist P(rot, rot)?`, { n: r * r, d: n * n }, { vis: urn(r, b) + tree(r, b, n, false, true), mq: '', memOk: false, hints: ['1. Pfadregel: Wahrscheinlichkeiten entlang des Pfades multiplizieren.'], sol: `${F(r, n)} · ${F(r, n)} = ${U.Ff(U.frac(r * r, n * n))}`, mistakes: [{ v: (2 * r) / n, msg: 'Entlang eines Pfades wird multipliziert, nicht addiert!' }] });
      if (l === 2) {
        if (U.chance(0.5)) return FR(`${r} rote, ${b} blaue Kugeln, zweimal <b>mit Zurücklegen</b>. Wie groß ist die Wahrscheinlichkeit für <b>genau eine rote</b> Kugel?`, { n: 2 * r * b, d: n * n }, { vis: urn(r, b) + tree(r, b, n, false, true), mq: '', memOk: false, hints: ['Zwei Pfade passen: (rot, blau) und (blau, rot).', '2. Pfadregel: Die Pfadwahrscheinlichkeiten addieren.'], sol: `${F(r, n)} · ${F(b, n)} + ${F(b, n)} · ${F(r, n)} = ${U.Ff(U.frac(2 * r * b, n * n))}`, mistakes: [{ v: (r * b) / (n * n), msg: 'Es gibt ZWEI passende Pfade!' }] });
        return FR(`${r} rote, ${b} blaue Kugeln, zweimal <b>mit Zurücklegen</b>. Wie groß ist die Wahrscheinlichkeit für <b>zwei gleiche Farben</b>?`, { n: r * r + b * b, d: n * n }, { vis: urn(r, b) + tree(r, b, n, false, true), mq: '', memOk: false, hints: ['Pfade (rot, rot) und (blau, blau) addieren.'], sol: `${F(r * r, n * n)} + ${F(b * b, n * n)} = ${U.Ff(U.frac(r * r + b * b, n * n))}` });
      }
      if (U.chance(0.5)) return FR(`${r} rote, ${b} blaue Kugeln. Es wird zweimal <b>ohne Zurücklegen</b> gezogen. Wie groß ist P(rot, rot)?`, { n: r * (r - 1), d: n * (n - 1) }, { vis: urn(r, b) + tree(r, b, n, true, false), mq: '', memOk: false, hints: ['Nach dem ersten Zug liegen nur noch ' + (n - 1) + ' Kugeln in der Urne – und eine rote weniger.'], sol: `${F(r, n)} · ${F(r - 1, n - 1)} = ${U.Ff(U.frac(r * (r - 1), n * (n - 1)))}`, mistakes: [{ v: (r * r) / (n * n), msg: 'Ohne Zurücklegen ändert sich die Urne nach dem 1. Zug!' }] });
      return FR(`${r} rote, ${b} blaue Kugeln, zweimal <b>ohne Zurücklegen</b>. Wie groß ist die Wahrscheinlichkeit für <b>zwei verschiedene Farben</b>?`, { n: 2 * r * b, d: n * (n - 1) }, { vis: urn(r, b) + tree(r, b, n, true, false), mq: '', memOk: false, hints: ['Pfade (rot, blau) und (blau, rot). Nenner beim 2. Zug: ' + (n - 1)], sol: `${F(r, n)} · ${F(b, n - 1)} + ${F(b, n)} · ${F(r, n - 1)} = ${U.Ff(U.frac(2 * r * b, n * (n - 1)))}` });
    },
  });
})();
