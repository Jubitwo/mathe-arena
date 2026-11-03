/* =========================================================
   Mathe-Arena – Aufgaben-Anzeige & Eingabe
   Zahlen-Tastatur, Auswahl-Buttons, Klick ins Koordinaten-
   system, Klick auf den Zahlenstrahl. Prüfung der Antwort.
   ========================================================= */
(function () {
  const U = MA.U;

  /* Tastatur: immer nur ein Widget bekommt die Tastendrücke */
  MA.keyTarget = null;
  document.addEventListener('keydown', (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const tag = (e.target && e.target.tagName) || '';
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
    if (MA.keyTarget) MA.keyTarget(e);
  });

  /* ---------- Antwort als HTML ---------- */
  MA.answerHTML = (t) => {
    switch (t.type) {
      case 'num': {
        const d = t.tol >= 1 ? 0 : t.tol >= 0.05 ? 1 : t.tol >= 0.005 ? 2 : 6;
        return U.fmt(t.answer, d) + (t.unit ? ' ' + t.unit : '');
      }
      case 'frac': return U.Ff(U.frac(t.answer.n, t.answer.d)) + (t.unit ? ' ' + t.unit : '');
      case 'choice': return t.options[t.answer];
      case 'grid': return `(${U.fmt(t.answer[0])}|${U.fmt(t.answer[1])})`;
      case 'line': return U.fmt(t.answer);
    }
    return '';
  };

  /* ---------- Prüfen ---------- */
  MA.check = (t, given) => {
    let ok = false, val = given;
    if (t.type === 'num' || t.type === 'frac' || t.type === 'line') {
      if (typeof given === 'string') val = U.parse(given, t.unit === '%');
      if (given === null || given === undefined || isNaN(val)) return { ok: false, invalid: true };
      const target = t.type === 'frac' ? t.answer.n / t.answer.d : t.answer;
      const tol = t.tol || 1e-6;
      ok = Math.abs(val - target) <= tol;
      if (ok && t.type === 'frac' && t.simplify && typeof given === 'string') {
        const m = given.replace(/\s/g, '').match(/^-?(\d+)\/(\d+)$/);
        if (m && U.gcd(+m[1], +m[2]) > 1) return { ok: false, msg: 'Fast! Der Wert stimmt, aber der Bruch ist noch nicht vollständig gekürzt.', given };
      }
    } else if (t.type === 'choice') ok = given === t.answer;
    else if (t.type === 'grid') ok = !!given && given[0] === t.answer[0] && given[1] === t.answer[1];
    let msg = null;
    if (!ok && t.mistakes) {
      for (const m of t.mistakes) {
        let hit;
        if (t.type === 'grid') hit = given && given[0] === m.v[0] && given[1] === m.v[1];
        else if (t.type === 'choice') hit = m.v === given;
        else hit = Math.abs(val - m.v) <= (t.tol || 1e-6);
        if (hit) { msg = m.msg; break; }
      }
    }
    return { ok, msg, given };
  };

  /* ---------- Bausteine ---------- */
  const keypad = (frac) => {
    const k = ['7', '8', '9', '4', '5', '6', '1', '2', '3', '-', '0', ','];
    const lab = { '-': '±', ',': ',', del: '⌫', ok: 'OK', '/': '⁄' };
    return `<div class="keypad">${k.map((x) => `<button type="button" class="key" data-k="${x}">${lab[x] || x}</button>`).join('')}
      <button type="button" class="key key-del" data-k="del">⌫</button>${frac ? '<button type="button" class="key" data-k="/">/</button>' : ''}<button type="button" class="key key-ok ${frac ? '' : 'wide'}" data-k="ok">OK</button></div>`;
  };

  function gridWidget(t) {
    const g = t.grid;
    const P = U.plane({ xmin: g.xmin, xmax: g.xmax, ymin: g.ymin, ymax: g.ymax, w: 340, h: 340 });
    let extra = '';
    (t.gridLines || []).forEach((L) => { extra += `<line x1="${P.X(L.x1)}" y1="${P.Y(L.y1)}" x2="${P.X(L.x2)}" y2="${P.Y(L.y2)}" class="sv-c${L.c || 1} thick" clip-path=""/>`; });
    (t.points || []).forEach((p) => { extra += P.point(p.x, p.y, p.label); });
    return { P, html: P.wrap(extra + '<g class="pick"></g>', 'clickable') };
  }
  function lineWidget(t) {
    const L = t.line, W = 640, H = 110, pad = 32;
    const X = (v) => pad + ((v - L.min) / (L.max - L.min)) * (W - 2 * pad);
    let s = U.line(pad - 14, 60, W - pad + 18, 60, 'sv-axis') + `<polygon points="${W - pad + 26},60 ${W - pad + 14},54 ${W - pad + 14},66" class="sv-axhead"/>`;
    const n = Math.round((L.max - L.min) / L.step);
    for (let i = 0; i <= n; i++) {
      const v = L.min + i * L.step;
      const big = Math.abs(((v - L.min) / L.lab) - Math.round((v - L.min) / L.lab)) < 1e-9;
      s += U.line(X(v), big ? 46 : 52, X(v), big ? 74 : 68, big ? 'sv-tick2' : 'sv-tick');
      if (big) s += U.t(X(v), 96, U.fmt(v), 'sv-ax sv-mid sv-numl');
    }
    return { X, inv: (px) => L.min + Math.round(((px - pad) / (W - 2 * pad)) * n) * L.step, html: U.svg(W, H, s + '<g class="pick"></g>', 'numline clickable'), n, pad, W };
  }
  function svgPoint(svg, e) {
    const pt = svg.createSVGPoint();
    pt.x = e.clientX; pt.y = e.clientY;
    return pt.matrixTransform(svg.getScreenCTM().inverse());
  }

  /* ---------- Aufgabe darstellen ----------
     o: { onAnswer(result), keyboard, hints, onHint, compact, display } */
  MA.renderTask = (el, t, o = {}) => {
    el.innerHTML = '';
    const root = document.createElement('div');
    root.className = 'task' + (o.compact ? ' compact' : '') + (t.vis || t.type === 'grid' || t.type === 'line' ? ' has-vis' : '') + (t.type === 'line' || (o.display && t.type !== 'choice') ? ' wide' : '');
    let visHTML = t.vis || '';
    let gw, lw;
    if (t.type === 'grid') { gw = gridWidget(t); visHTML = gw.html; }
    if (t.type === 'line') { lw = lineWidget(t); visHTML = lw.html; }
    root.innerHTML = `<div class="task-q">${t.q}</div>${visHTML ? `<div class="task-vis">${visHTML}</div>` : ''}<div class="task-ans"></div><div class="task-hintbox"></div>`;
    el.appendChild(root);
    const ans = root.querySelector('.task-ans');
    let locked = false;
    let keyHandler = null;
    const submit = (given) => {
      if (locked) return;
      const r = MA.check(t, given);
      if (r.invalid) { root.classList.remove('shake'); void root.offsetWidth; root.classList.add('shake'); return; }
      if (o.onAnswer) o.onAnswer(r);
    };

    if (o.display) {
      if (t.type === 'choice') ans.innerHTML = `<div class="choices static n${t.options.length}">${t.options.map((op, i) => `<div class="choice"><span class="ck">${'ABCD'[i]}</span><span class="ct">${op}</span></div>`).join('')}</div>`;
      else ans.remove();
    } else if (t.type === 'num' || t.type === 'frac') {
      let value = '';
      ans.innerHTML = `<div class="ans-display"><span class="ans-val">&nbsp;</span>${t.unit ? `<span class="ans-unit">${t.unit}</span>` : ''}</div>${keypad(t.type === 'frac')}`;
      const disp = ans.querySelector('.ans-val');
      const upd = () => { disp.textContent = value ? value.replace(/-/g, '−') : ' '; disp.classList.toggle('has', !!value); };
      const press = (k) => {
        if (locked) return;
        if (k === 'del') value = value.slice(0, -1);
        else if (k === 'ok') { if (value) submit(value); return; }
        else if (k === '-') value = value.startsWith('-') ? value.slice(1) : '-' + value;
        else if (k === ',' && /,[^/]*$/.test(value)) return;
        else if (value.length < 14) value += k;
        upd();
        MA.Sound.click();
      };
      ans.querySelectorAll('[data-k]').forEach((b) => b.addEventListener('pointerdown', (e) => { e.preventDefault(); press(b.dataset.k); }));
      keyHandler = (e) => {
        const k = e.key;
        if (/^[0-9]$/.test(k)) press(k);
        else if (k === ',' || k === '.') press(',');
        else if (k === '-' || k === '−') press('-');
        else if (k === '/' && t.type === 'frac') press('/');
        else if (k === ' ' && t.type === 'frac') { if (value && !value.endsWith(' ')) { value += ' '; upd(); } }
        else if (k === 'Backspace') press('del');
        else if (k === 'Enter') press('ok');
        else return;
        e.preventDefault();
      };
    } else if (t.type === 'choice') {
      ans.innerHTML = `<div class="choices n${t.options.length}">${t.options.map((op, i) => `<button type="button" class="choice" data-i="${i}"><span class="ck">${i + 1}</span><span class="ct">${op}</span></button>`).join('')}</div>`;
      ans.querySelectorAll('.choice').forEach((b) => b.addEventListener('click', () => { if (locked) return; ans.querySelectorAll('.choice').forEach((x) => x.classList.remove('sel')); b.classList.add('sel'); submit(+b.dataset.i); }));
      keyHandler = (e) => { const i = parseInt(e.key, 10) - 1; if (i >= 0 && i < t.options.length) { e.preventDefault(); ans.querySelectorAll('.choice')[i].click(); } };
    } else {
      let pick = null;
      ans.innerHTML = `<div class="pick-row"><span class="pick-info">${t.type === 'grid' ? 'Tippe auf einen Gitterpunkt.' : 'Tippe auf den Zahlenstrahl.'}</span><button type="button" class="btn btn-ok" disabled>OK ✔</button></div>`;
      const okBtn = ans.querySelector('.btn-ok');
      const svg = root.querySelector('.task-vis svg');
      const g = svg.querySelector('.pick');
      svg.addEventListener('pointerdown', (e) => {
        if (locked) return;
        const p = svgPoint(svg, e);
        if (t.type === 'grid') {
          const gr = t.grid;
          const x = Math.max(gr.xmin, Math.min(gr.xmax, Math.round(gw.P.ix(p.x))));
          const y = Math.max(gr.ymin, Math.min(gr.ymax, Math.round(gw.P.iy(p.y))));
          pick = [x, y];
          g.innerHTML = `<circle cx="${gw.P.X(x)}" cy="${gw.P.Y(y)}" r="14" class="pick-ring"/><text x="${gw.P.X(x)}" y="${gw.P.Y(y) + 7}" class="pick-x">✖</text>`;
          ans.querySelector('.pick-info').innerHTML = `Gewählt: <b>(${U.fmt(x)}|${U.fmt(y)})</b>`;
        } else {
          const L = t.line;
          const v = Math.max(L.min, Math.min(L.max, lw.inv(p.x)));
          pick = U.round(v, 6);
          g.innerHTML = `<polygon points="${lw.X(v)},44 ${lw.X(v) - 10},22 ${lw.X(v) + 10},22" class="pick-tri"/>`;
          ans.querySelector('.pick-info').textContent = 'Markiert – passt das?';
        }
        okBtn.disabled = false;
        MA.Sound.click();
      });
      okBtn.addEventListener('click', () => { if (pick !== null) submit(pick); });
      keyHandler = (e) => { if (e.key === 'Enter' && pick !== null) { e.preventDefault(); submit(pick); } };
    }

    /* Tipps */
    let hintIdx = 0;
    const hb = root.querySelector('.task-hintbox');
    if (o.hints && t.hints && t.hints.length && !o.display) {
      hb.innerHTML = `<button type="button" class="btn-hint">💡 Tipp</button><div class="hints"></div>`;
      const btn = hb.querySelector('.btn-hint');
      btn.addEventListener('click', () => {
        if (hintIdx >= t.hints.length) return;
        hb.querySelector('.hints').insertAdjacentHTML('beforeend', `<div class="hint">💡 ${t.hints[hintIdx]}</div>`);
        hintIdx++;
        if (o.onHint) o.onHint(hintIdx);
        if (hintIdx >= t.hints.length) btn.disabled = true;
        else btn.textContent = '💡 Noch ein Tipp';
      });
    }

    if (o.keyboard !== false && keyHandler) MA.keyTarget = keyHandler;
    return {
      root,
      lock(v = true) { locked = v; root.classList.toggle('locked', v); },
      destroy() { if (MA.keyTarget === keyHandler) MA.keyTarget = null; },
      markChoice(r) {
        if (t.type !== 'choice') return;
        const bs = root.querySelectorAll('.choice');
        bs.forEach((b, i) => { if (i === t.answer) b.classList.add('right'); else if (i === r.given) b.classList.add('wrong'); });
      },
    };
  };

  /* ---------- Rückmeldung ----------
     o: { onNext, auto(ms), points, nextLabel, keyboard } */
  MA.feedback = (el, t, r, o = {}) => {
    const box = document.createElement('div');
    box.className = 'fb ' + (r.ok ? 'fb-ok' : 'fb-bad');
    const praise = U.pick(MA.PRAISE);
    let html = r.ok
      ? `<div class="fb-head">✔ ${praise}${o.points ? ` <span class="fb-pts">+${o.points}</span>` : ''}</div>`
      : `<div class="fb-head">✘ ${r.timeout ? 'Zeit abgelaufen!' : 'Leider nicht richtig.'}</div>${r.msg ? `<div class="fb-msg">⚠️ ${r.msg}</div>` : ''}<div class="fb-ans">Richtig ist: <b>${MA.answerHTML(t)}</b></div>`;
    if (!r.ok || o.showSol) html += t.sol ? `<details class="fb-sol" ${o.solOpen ? 'open' : ''}><summary>Lösungsweg</summary><div>${t.sol}</div></details>` : '';
    if (o.onNext && !o.auto) html += `<button type="button" class="btn btn-next">${o.nextLabel || 'Weiter ▶'}</button>`;
    box.innerHTML = html;
    el.appendChild(box);
    let done = false;
    const go = () => { if (done) return; done = true; if (MA.keyTarget === kh) MA.keyTarget = null; o.onNext && o.onNext(); };
    const kh = (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } };
    if (o.onNext && !o.auto) {
      box.querySelector('.btn-next').addEventListener('click', go);
      if (o.keyboard !== false) setTimeout(() => { if (!done) MA.keyTarget = kh; }, 250);
      box.querySelector('.btn-next').focus({ preventScroll: true });
    }
    if (o.auto) setTimeout(go, o.auto);
    box.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    return box;
  };
})();
