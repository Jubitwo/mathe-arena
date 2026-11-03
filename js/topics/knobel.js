/* =========================================================
   Knobel-Ecke – für alle Klassen (prozessbezogene Kompetenz
   „Probleme lösen“). Schwierigkeit über die Sterne.
   ========================================================= */
(function () {
  const U = MA.U;
  const R = (t) => MA.registerTopic(Object.assign({ grade: 'K' }, t));
  const N = (q, answer, o = {}) => Object.assign({ type: 'num', q, answer }, o);

  /* ---------- 1 Magische Quadrate ---------- */
  const LINES = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
  function magic() {
    let m = [2, 7, 6, 9, 5, 1, 4, 3, 8];
    const rot = (a) => [a[6], a[3], a[0], a[7], a[4], a[1], a[8], a[5], a[2]];
    for (let i = U.ri(0, 3); i > 0; i--) m = rot(m);
    if (U.chance(0.5)) m = [m[2], m[1], m[0], m[5], m[4], m[3], m[8], m[7], m[6]];
    return m;
  }
  R({
    id: 'kn-magisch', icon: '🔮', title: 'Magische Quadrate', tags: ['Knobeln', 'visuell'],
    bp: 'Probleme lösen', desc: 'Jede Zeile, Spalte und Diagonale hat dieselbe Summe.',
    gen(l) {
      const k = l === 1 ? 1 : l === 2 ? U.ri(1, 3) : U.ri(2, 5);
      const s = l === 3 ? U.ri(-8, 8) : U.ri(0, 10);
      const m = magic().map((v) => v * k + s);
      const S = 15 * k + 3 * s;
      const hideN = l === 1 ? 1 : l === 2 ? 3 : 4;
      let q, hidden, line, full;
      for (let tries = 0; tries < 400; tries++) {
        q = U.ri(0, 8);
        hidden = new Set([q]);
        while (hidden.size < hideN) hidden.add(U.ri(0, 8));
        line = LINES.find((L) => L.includes(q) && L.every((i) => i === q || !hidden.has(i)));
        full = LINES.find((L) => L.every((i) => !hidden.has(i)));
        if (line && (l === 1 || full)) break;
        line = null;
      }
      if (!line) return this.gen(l);
      const cells = m.map((v, i) => (i === q ? '<div class="mc q">?</div>' : hidden.has(i) ? '<div class="mc e"></div>' : `<div class="mc">${U.fmt(v)}</div>`)).join('');
      const vis = `<div class="magic">${cells}</div>` + (l === 1 ? `<div class="magic-sum">Magische Summe: <b>${U.fmt(S)}</b></div>` : '');
      const others = line.filter((i) => i !== q).map((i) => m[i]);
      return N('Welche Zahl gehört in das Feld mit dem <b class="hl">?</b>', m[q], { vis, mq: '', memOk: false, hints: [l === 1 ? 'Die Summe jeder Zeile, Spalte und Diagonale ist ' + U.fmt(S) + '.' : 'Finde zuerst eine vollständige Zeile, Spalte oder Diagonale – sie verrät die magische Summe.', 'Suche dann eine Linie durch das ?, in der nur das ? fehlt.'], sol: `Magische Summe ${U.fmt(S)}. ${U.fmt(S)} − ${U.par(others[0])} − ${U.par(others[1])} = ${U.fmt(m[q])}` });
    },
  });

  /* ---------- 2 Zahlenfolgen ---------- */
  R({
    id: 'kn-folgen', icon: '🧬', title: 'Zahlenfolgen', tags: ['Knobeln'],
    bp: 'Probleme lösen', desc: 'Erkenne das Muster und finde die nächste Zahl.',
    gen(l) {
      let seq, nxt, rule;
      if (l === 1) {
        const a = U.ri(1, 20), d = U.pick([2, 3, 4, 5, 6, 7, 8, 9, 10, 11, -2, -3, -5]);
        seq = [0, 1, 2, 3, 4].map((i) => a + (d < 0 ? 40 : 0) + i * d); nxt = seq[4] + d; rule = `Immer ${d > 0 ? '+' : '−'} ${Math.abs(d)}`;
      } else if (l === 2) {
        const k = U.ri(0, 2);
        if (k === 0) { const a = U.ri(1, 5), q = U.pick([2, 3]); seq = [0, 1, 2, 3, 4].map((i) => a * q ** i); nxt = seq[4] * q; rule = `Immer · ${q}`; }
        else if (k === 1) { const a = U.ri(1, 20), p = U.ri(4, 9), m = U.ri(1, p - 1); seq = [a]; for (let i = 1; i < 6; i++) seq.push(seq[i - 1] + (i % 2 ? p : -m)); nxt = seq[5]; seq = seq.slice(0, 5); rule = `Abwechselnd + ${p} und − ${m}`; }
        else { const a = U.ri(2, 9); seq = [0, 1, 2, 3, 4].map((i) => a + (i * (i + 1)) / 2); nxt = a + 15; rule = 'Die Abstände werden immer um 1 größer: +1, +2, +3, …'; }
      } else {
        const k = U.ri(0, 3);
        if (k === 0) { const c = U.ri(-3, 5); seq = [1, 2, 3, 4, 5].map((n) => n * n + c); nxt = 36 + c; rule = `Quadratzahlen ${c >= 0 ? '+' : '−'} ${Math.abs(c)}`; }
        else if (k === 1) { const a = U.ri(1, 4), b = U.ri(2, 6); seq = [a, b]; while (seq.length < 6) seq.push(seq[seq.length - 1] + seq[seq.length - 2]); nxt = seq[5]; seq = seq.slice(0, 5); rule = 'Jede Zahl ist die Summe der beiden vorherigen.'; }
        else if (k === 2) { const a = U.ri(1, 5); seq = [a]; while (seq.length < 6) seq.push(seq[seq.length - 1] * 2 + 1); nxt = seq[5]; seq = seq.slice(0, 5); rule = 'Immer · 2 + 1'; }
        else { const a = U.ri(1, 4); seq = [1, 2, 3, 4, 5].map((n) => n * n * n * a); nxt = 216 * a; rule = `Kubikzahlen${a > 1 ? ' · ' + a : ''}`; }
      }
      const vis = `<div class="seq">${seq.map((v) => `<span>${U.fmt(v)}</span>`).join('')}<span class="q">?</span></div>`;
      return N('Wie geht die Zahlenfolge weiter?', nxt, { vis, mq: seq.map((v) => U.fmt(v)).join(', ') + ', ?', hints: ['Schau dir die Abstände zwischen den Zahlen an.', l === 3 ? 'Manchmal hilft es, die Abstände der Abstände anzuschauen – oder an Quadratzahlen zu denken.' : 'Wird addiert oder multipliziert?'], sol: `${rule} → ${U.fmt(nxt)}` });
    },
  });

  /* ---------- 3 Zahlenmaschine ---------- */
  R({
    id: 'kn-maschine', icon: '⚙️', title: 'Zahlenmaschine', tags: ['Knobeln', 'visuell'],
    bp: 'Probleme lösen', desc: 'Welche Zahl wurde in die Maschine gesteckt? Rückwärts denken!',
    gen(l) {
      const nOps = l;
      let x = U.ri(2, 20), v = x;
      const ops = [];
      for (let i = 0; i < nOps; i++) {
        const k = U.ri(0, 3);
        if (k === 0) { const a = U.ri(2, 15); ops.push(['+', a]); v += a; }
        else if (k === 1 && v > 5) { const a = U.ri(1, Math.min(15, v - 1)); ops.push(['−', a]); v -= a; }
        else if (k === 2 || v > 60) { if (v % 2 === 0 && l === 3) { ops.push([':', 2]); v /= 2; } else { const a = U.ri(2, 5); ops.push(['·', a]); v *= a; } }
        else { const a = U.ri(2, 4); ops.push(['·', a]); v *= a; }
      }
      const inv = { '+': '−', '−': '+', '·': ':', ':': '·' };
      const vis = `<div class="machine"><span class="m-in">?</span>${ops.map((o) => `<span class="m-arrow">→</span><span class="m-op">${o[0]} ${o[1]}</span>`).join('')}<span class="m-arrow">→</span><span class="m-out">${U.fmt(v)}</span></div>`;
      const back = ops.slice().reverse().map((o) => `${inv[o[0]]} ${o[1]}`).join(', ');
      const text = 'Ich denke mir eine Zahl und schicke sie durch die Maschine. Heraus kommt ' + U.fmt(v) + '. Welche Zahl war es?';
      return N(text, x, { vis, mq: ops.map((o) => `${o[0]}${o[1]}`).join(' → ') + ` = ${U.fmt(v)}`, hints: ['Rechne rückwärts – mit der Umkehroperation!', 'Rückwärts: ' + back], sol: `Rückwärts von ${U.fmt(v)}: ${back} → ${x}` });
    },
  });

  /* ---------- 4 Logik-Rätsel ---------- */
  R({
    id: 'kn-logik', icon: '🧠', title: 'Logik-Rätsel', tags: ['Knobeln', 'Text'],
    bp: 'Probleme lösen', desc: 'Zaunpfähle, Seerosen und Handschläge – Denkfallen inklusive!',
    gen(l) {
      if (l === 1) {
        const k = U.ri(0, 2);
        if (k === 0) { const a = U.pick([2, 3, 4, 5]), n = U.ri(4, 12), L = a * n; return N(`Ein Zaun ist ${L} m lang. Alle ${a} m steht ein Pfosten – auch ganz am Anfang und ganz am Ende. Wie viele Pfosten sind es?`, n + 1, { hints: ['Zeichne einen kurzen Zaun auf und zähle!'], sol: `${L} : ${a} = ${n} Abstände → ${n + 1} Pfosten`, mistakes: [{ v: n, msg: 'Denkfalle! Das ist die Anzahl der Abstände – es gibt einen Pfosten mehr.' }] }); }
        if (k === 1) { const c = U.ri(2, 5); const cols = ['rote und blaue', 'rote, blaue und grüne', 'rote, blaue, grüne und gelbe', 'rote, blaue, grüne, gelbe und weiße'][c - 2]; return N(`In einer Schublade liegen ${cols} Socken durcheinander. Wie viele Socken musst du im Dunkeln <b>mindestens</b> ziehen, um <b>sicher</b> zwei gleichfarbige zu haben?`, c + 1, { hints: ['Was ist der ungünstigste Fall?'], sol: `Im schlimmsten Fall ziehst du erst ${c} verschiedene Farben. Die nächste Socke passt sicher: ${c + 1}.` }); }
        const n = U.ri(3, 9), s = U.ri(10, 20);
        return N(`Ein Baumstamm wird in ${n} gleich lange Stücke gesägt. Jeder Schnitt dauert ${s} Sekunden. Wie lange dauert das Sägen insgesamt (in Sekunden)?`, (n - 1) * s, { unit: 's', hints: ['Wie viele Schnitte brauchst du für 2 Stücke? Für 3?'], sol: `${n} Stücke brauchen ${n - 1} Schnitte: ${n - 1} · ${s} = ${(n - 1) * s} s`, mistakes: [{ v: n * s, msg: 'Denkfalle! Für ' + n + ' Stücke braucht man nur ' + (n - 1) + ' Schnitte.' }] });
      }
      if (l === 2) {
        const k = U.ri(0, 2);
        if (k === 0) { const n = U.ri(4, 15); return N(`${n} Personen treffen sich. Jede gibt jeder anderen genau einmal die Hand. Wie viele Handschläge sind das?`, (n * (n - 1)) / 2, { hints: ['Jede Person gibt ' + (n - 1) + ' Personen die Hand – aber jeder Handschlag wird dabei doppelt gezählt.'], sol: `${n} · ${n - 1} : 2 = ${(n * (n - 1)) / 2}`, mistakes: [{ v: n * (n - 1), msg: 'Jeder Handschlag wurde doppelt gezählt!' }] }); }
        if (k === 1) { const kk = U.ri(8, 25), r = U.ri(2, kk - 2), h = kk - r; return N(`Auf einem Hof gibt es Hühner und Ziegen. Zusammen haben sie ${kk} Köpfe und ${2 * h + 4 * r} Beine. Wie viele <b>Ziegen</b> sind es?`, r, { hints: ['Stell dir vor, alle wären Hühner. Wie viele Beine wären es dann?'], sol: `Alle Hühner: ${2 * kk} Beine. Es fehlen ${2 * r} Beine – jede Ziege hat 2 mehr → ${r} Ziegen.`, mistakes: [{ v: h, msg: 'Das sind die Hühner!' }] }); }
        const a = U.ri(1, 4), p = U.pick([2, 3]);
        return N(`Ein Ziegelstein wiegt ${a} kg plus ${p === 2 ? 'einen halben' : 'ein Drittel'} Ziegelstein. Wie viel wiegt der Ziegelstein?`, (a * p) / (p - 1), { unit: 'kg', tol: 0.001, hints: ['Lege den Stein gedanklich auf eine Waage: Ganzer Stein = ' + a + ' kg + Teil-Stein.', 'Stelle eine Gleichung auf: x = ' + a + ' + x/' + p], sol: `x = ${a} + x/${p} → ${p - 1}x/${p} = ${a} → x = ${U.fmt((a * p) / (p - 1))} kg`, mistakes: [{ v: a + a / p, msg: 'Denkfalle! Es ist ein halber/drittel STEIN, nicht ein halbes ' + a + ' kg.' }] });
      }
      const k = U.ri(0, 2);
      if (k === 0) { const n = U.ri(10, 60); return N(`Eine Seerose verdoppelt jeden Tag ihre Fläche. Nach ${n} Tagen ist der Teich vollständig bedeckt. Nach wie vielen Tagen war er zur <b>Hälfte</b> bedeckt?`, n - 1, { unit: 'Tage', hints: ['Was passiert vom vorletzten zum letzten Tag?'], sol: `Am Tag ${n - 1} war es die Hälfte – einen Tag später doppelt so viel, also alles.`, mistakes: [{ v: n / 2, msg: 'Klassische Denkfalle! Die Fläche verdoppelt sich jeden Tag – rechne rückwärts.' }] }); }
      if (k === 1) {
        const s = U.ri(5, 15), d = U.ri(20, 35);
        return N(`Ein Vater ist ${d} Jahre älter als seine Tochter. Zusammen sind sie ${2 * s + d} Jahre alt. Wie alt ist die Tochter?`, s, { unit: 'Jahre', hints: ['Tochter: x, Vater: x + ' + d], sol: `x + x + ${d} = ${2 * s + d} → 2x = ${2 * s} → x = ${s}`, mistakes: [{ v: s + d, msg: 'Das ist das Alter des Vaters.' }] });
      }
      const b = U.pick([1.1, 1.2, 1.5, 2.1]), diff = 1;
      const ball = U.round((b - diff) / 2, 2);
      return N(`Ein Schläger und ein Ball kosten zusammen ${U.euro(b)}. Der Schläger kostet 1 € mehr als der Ball. Wie viel kostet der Ball (in €)?`, ball, { unit: '€', tol: 0.001, hints: ['Ball: x, Schläger: x + 1'], sol: `x + x + 1 = ${U.fmt(b)} → 2x = ${U.fmt(b - 1)} → x = ${U.fmt(ball)} €`, mistakes: [{ v: U.round(b - 1, 2), msg: 'Berühmte Denkfalle! Dann würde der Schläger ' + U.euro(b) + ' kosten – zusammen wäre das zu viel.' }] });
    },
  });

  /* ---------- 5 Zahlenmauer ---------- */
  function wall(rows, qPos) {
    // rows: von oben nach unten, Werte oder null
    return `<div class="wall">${rows.map((r, i) => `<div class="wrow">${r.map((v, j) => `<div class="brick ${qPos && qPos[0] === i && qPos[1] === j ? 'q' : v === null ? 'e' : ''}">${qPos && qPos[0] === i && qPos[1] === j ? '?' : v === null ? '' : U.fmt(v)}</div>`).join('')}</div>`).join('')}</div>`;
  }
  const build = (base) => { const rows = [base]; while (rows[0].length > 1) { const r = rows[0]; rows.unshift(r.slice(1).map((v, i) => r[i] + v)); } return rows; };
  R({
    id: 'kn-mauer', icon: '🧱', title: 'Zahlenmauer', tags: ['Knobeln', 'visuell'],
    bp: 'Probleme lösen', desc: 'Jeder Stein ist die Summe der beiden darunter.',
    gen(l) {
      if (l === 1) {
        const base = [U.ri(1, 15), U.ri(1, 15), U.ri(1, 15)];
        const rows = build(base);
        const show = rows.map((r, i) => r.map((v) => (i === 2 ? v : null)));
        return N('Welche Zahl steht im obersten Stein?', rows[0][0], { vis: wall(show, [0, 0]), mq: '', memOk: false, hints: ['Addiere immer zwei nebeneinanderliegende Steine.'], sol: `Mitte: ${rows[1].join(' und ')} → Spitze: ${rows[0][0]}` });
      }
      if (l === 2) {
        const base = [U.ri(1, 12), U.ri(1, 12), U.ri(1, 12), U.ri(1, 12)];
        const rows = build(base);
        const qi = U.ri(0, 3);
        const show = rows.map((r, i) => r.map((v, j) => (i === 3 ? (j === qi ? null : v) : i === 2 ? v : i === 0 ? v : null)));
        const nb = qi === 0 ? [rows[2][0], base[1], '−'] : [rows[2][qi - 1], base[qi - 1], '−'];
        return N('Welche Zahl fehlt in der untersten Reihe?', base[qi], { vis: wall(show, [3, qi]), mq: '', memOk: false, hints: ['Der Stein darüber ist die Summe – also rückwärts subtrahieren.'], sol: `${nb[0]} − ${nb[1]} = ${base[qi]}` });
      }
      const a = U.ri(1, 12), x = U.ri(1, 15), c = U.ri(1, 12);
      const rows = build([a, x, c]);
      const show = [[rows[0][0]], [null, null], [a, null, c]];
      return N('Nur die Spitze und zwei Steine sind bekannt. Welche Zahl gehört in die Mitte unten?', x, { vis: wall(show, [2, 1]), mq: '', memOk: false, hints: ['Nenne den mittleren Stein x. Was steht dann in der zweiten Reihe?', `Spitze = (${a} + x) + (x + ${c}) = ${a + c} + 2x`], sol: `${rows[0][0]} = ${a + c} + 2x → 2x = ${rows[0][0] - a - c} → x = ${x}` });
    },
  });
})();
