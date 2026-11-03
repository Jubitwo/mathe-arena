/* =========================================================
   Mathe-Arena – Bildschirme & Navigation (Hash-Routing)
   #/            Startbildschirm
   #/klassen     Klassenwahl
   #/k/5         Themen einer Klasse
   #/t/<id>      Spiel einrichten (Sterne, Modus, Format)
   #/spiel       laufendes Spiel
   #/info        Infos für Lehrkräfte
   #/erfolge     Abzeichen & XP
   ========================================================= */
(function () {
  const U = MA.U, S = MA.Store;
  const app = document.getElementById('app');
  const GRADES = [5, 6, 7, 8, 9, 10, 'K'];
  const GINFO = {
    5: { c: '#00f0ff', sub: 'Zahlen, Größen & Koordinaten' },
    6: { c: '#39ff88', sub: 'Brüche, Dezimalzahlen & Winkel' },
    7: { c: '#ffe600', sub: 'Negative Zahlen, Terme & Prozente' },
    8: { c: '#ff9f1c', sub: 'Funktionen, Zufall & Binome' },
    9: { c: '#ff2bd6', sub: 'Pythagoras, Parabeln & Kreise' },
    10: { c: '#9d4dff', sub: 'Trigonometrie, Wachstum & Körper' },
    K: { c: '#ff3860', sub: 'Rätsel & Denkfallen für alle' },
  };
  const gName = (g) => (g === 'K' ? 'Knobel-Ecke' : 'Klasse ' + g);
  const MODES = { solo: { icon: '👤', name: 'Solo' }, partner: { icon: '👥', name: 'Partner' }, gruppe: { icon: '👨‍👩‍👧‍👦', name: 'Gruppe' } };

  /* Zufalls-Mix je Klasse */
  GRADES.forEach((g) => {
    const list = MA.topics.filter((t) => t.grade === g);
    MA.topics.push({ id: 'mix-' + g, grade: g, mix: true, icon: '🎰', title: 'Zufalls-Mix', tags: ['Mix'], bp: 'alle Leitideen', desc: `Bunt gemischt aus allen Themen der ${gName(g)}.`, gen(l) { const s = U.pick(list); const t = s.gen(l); t.topicId = s.id; return t; } });
  });
  const topicById = (id) => MA.topics.find((t) => t.id === id);

  let current = null; // laufendes Spiel
  let pending = null; // Spiel-Konfiguration

  /* ---------- Kopfzeile ---------- */
  const syncTop = () => {
    document.documentElement.classList.toggle('beamer', !!S.data.beamer);
    const sb = document.getElementById('btn-sound');
    if (sb) sb.textContent = S.data.sound ? '🔊' : '🔇';
    const xp = document.querySelector('.top-xp');
    if (xp) xp.textContent = `LV ${S.level()}`;
  };
  document.getElementById('btn-sound').addEventListener('click', () => { S.data.sound = !S.data.sound; S.save(); syncTop(); MA.Sound.click(); });
  document.getElementById('btn-beamer').addEventListener('click', () => { S.data.beamer = !S.data.beamer; S.save(); syncTop(); MA.toast(S.data.beamer ? '📺 Beamer-Modus an: große Schrift' : '📺 Beamer-Modus aus', 1500); });
  document.getElementById('btn-full').addEventListener('click', () => {
    const d = document, el = d.documentElement;
    try {
      if (d.fullscreenElement || d.webkitFullscreenElement) (d.exitFullscreen || d.webkitExitFullscreen).call(d);
      else (el.requestFullscreen || el.webkitRequestFullscreen).call(el);
    } catch (e) { MA.toast('Vollbild wird auf diesem Gerät nicht unterstützt.'); }
  });

  /* ---------- Router ---------- */
  const stopGame = () => { if (current) { current.destroy(); current = null; } MA.keyTarget = null; };
  function route() {
    const h = location.hash.replace(/^#\/?/, '');
    const [a, b] = h.split('/');
    if (a !== 'spiel') stopGame();
    document.body.dataset.screen = a || 'start';
    window.scrollTo(0, 0);
    if (!a) return startScreen();
    if (a === 'klassen') return gradeScreen();
    if (a === 'k') return topicScreen(b === 'K' ? 'K' : +b);
    if (a === 't' && topicById(b)) return setupScreen(topicById(b));
    if (a === 'spiel' && pending) return gameScreen();
    if (a === 'info') return infoScreen();
    if (a === 'erfolge') return trophyScreen();
    location.hash = '#/klassen';
  }
  window.addEventListener('hashchange', route);

  /* ---------- Startbildschirm ---------- */
  function startScreen() {
    const sym = ['π', '√', '∑', '+', '−', '×', '÷', '=', '%', '∞', 'x²', '½', '∠', '≈', 'Δ', '7', '3', '9'];
    app.innerHTML = `<section class="screen start">
      <div class="float-syms">${Array.from({ length: 22 }, (_, i) => `<span style="left:${(i * 37) % 100}%;animation-delay:${-(i * 1.7) % 14}s;animation-duration:${10 + (i % 6) * 2}s;font-size:${1.2 + (i % 4) * 0.5}rem">${sym[i % sym.length]}</span>`).join('')}</div>
      <div class="logo"><div class="pixel l1">MATHE</div><div class="pixel l2">ARENA</div></div>
      <div class="tagline pixel">TESTE DICH SELBST!</div>
      <button type="button" class="btn btn-start pixel">▶ PRESS START</button>
      <div class="start-info">Klasse 5–10 · Bildungsplan Baden-Württemberg<br><span class="lv">★ G</span> · <span class="lv">★★ M</span> · <span class="lv">★★★ E</span></div>
      <div class="start-score pixel">HI-SCORE ${String(S.data.xp).padStart(6, '0')} · LV ${S.level()}</div>
    </section>`;
    const go = () => { MA.Sound.coin(); location.hash = '#/klassen'; };
    app.querySelector('.btn-start').addEventListener('click', go);
    MA.keyTarget = (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } };
    syncTop();
  }

  /* ---------- Fortschritt ---------- */
  const gradeProgress = (g) => {
    const ts = MA.topics.filter((t) => t.grade === g && !t.mix);
    let got = 0;
    ts.forEach((t) => [1, 2, 3].forEach((l) => (got += S.stars(t.id, l))));
    return { got, max: ts.length * 9, n: ts.length };
  };

  /* ---------- Klassenwahl ---------- */
  function gradeScreen() {
    MA.keyTarget = null;
    app.innerHTML = `<section class="screen grades">
      <h1 class="pixel h-title">WÄHLE DEINE ARENA</h1>
      ${(() => { const d = MA.daily(); const got = S.data.badges.includes('tages') && S.data.dailyDone === d.key; return `<a class="daily" href="#/t/${d.topic.id}" data-daily="1"><span class="daily-ic">📅</span><span class="daily-tx"><b class="pixel">TAGES-CHALLENGE</b><br>${d.topic.icon} ${d.topic.title} (${gName(d.topic.grade)}) · ${MA.LEVELS[d.level].s} · ⚡ Blitz-Runde – schaffst du 10 Treffer?</span>${got ? '<span class="daily-ok">✔</span>' : '<span class="daily-go pixel">LOS ▶</span>'}</a>`; })()}
      <div class="grade-grid">${GRADES.map((g) => {
        const p = gradeProgress(g);
        return `<a class="gcard ${g === 'K' ? 'knobel' : ''}" href="#/k/${g}" style="--c:${GINFO[g].c}">
          <div class="g-num pixel">${g === 'K' ? '?!' : g}</div>
          <div class="g-name">${gName(g)}</div>
          <div class="g-sub">${GINFO[g].sub}</div>
          <div class="g-meta"><span>${p.n} Spiele + Mix</span><span>★ ${p.got}/${p.max}</span></div>
          <div class="g-bar"><div style="width:${(p.got / p.max) * 100}%"></div></div>
        </a>`;
      }).join('')}</div>
      <div class="hint-line">Tipp: Für den Unterricht oben rechts 📺 Beamer-Modus und ⛶ Vollbild einschalten.</div>
    </section>`;
    const dl = app.querySelector('[data-daily]');
    if (dl) dl.addEventListener('click', () => { const d = MA.daily(); S.data.last = Object.assign({}, S.data.last, { level: d.level, mode: 'solo', format: 'blitz' }); S.save(); });
    syncTop();
  }

  /* ---------- Themen einer Klasse ---------- */
  const tagIcon = { visuell: '👁 visuell', Text: '📝 Text', Rechnen: '🧮 Rechnen', Knobeln: '🧩 Knobeln', Daten: '📊 Daten', Mix: '🎰 Mix' };
  function topicScreen(g) {
    if (!GINFO[g]) { location.hash = '#/klassen'; return; }
    const ts = MA.topics.filter((t) => t.grade === g);
    app.innerHTML = `<section class="screen topics" style="--c:${GINFO[g].c}">
      <div class="crumbs"><a href="#/klassen" class="btn btn-ghost">◀ Klassen</a></div>
      <h1 class="pixel h-title">${gName(g).toUpperCase()}</h1>
      <p class="h-sub">${GINFO[g].sub}</p>
      <div class="topic-grid">${ts.map((t) => `
        <a class="tcard ${t.mix ? 'mix' : ''}" href="#/t/${t.id}">
          <div class="t-icon">${t.icon}</div>
          <div class="t-body"><div class="t-title">${t.title}</div><div class="t-desc">${t.desc}</div>
          <div class="t-tags">${t.tags.map((x) => `<span>${tagIcon[x] || x}</span>`).join('')}</div></div>
          <div class="t-stars">${[1, 2, 3].map((l) => `<span class="ts ${S.stars(t.id, l) ? 'got' : ''}" title="${MA.LEVELS[l].name}">${MA.LEVELS[l].n} ${MA.starStr(S.stars(t.id, l))}</span>`).join('')}</div>
        </a>`).join('')}</div>
    </section>`;
    MA.keyTarget = null;
  }

  /* ---------- Spiel einrichten ---------- */
  function setupScreen(t) {
    MA.keyTarget = null;
    const last = S.data.last || {};
    let level = last.level || 1, mode = last.mode || 'solo', format = last.format;
    const memCache = {};
    const canMemory = (l) => {
      if (t.noMemory) return false;
      if (memCache[l] === undefined) memCache[l] = MA.buildPairs(t, l, 6).length >= 6;
      return memCache[l];
    };
    const formatsFor = () => Object.entries(MA.FORMATS).filter(([id, f]) => f.modes.includes(mode) && (!f.needsMemory || canMemory(level))).map(([id]) => id);
    const opt = Object.assign({ teamN: 4, len: 10, timer: 0, buzzer: false, cpu: 'mid', pairs: 6, target: 5, flip: false, names: ['Spieler 1', 'Spieler 2'], teamNames: MA.TEAMS.map((x) => 'Team ' + x.name) }, last.opts || {});

    app.innerHTML = `<section class="screen setup" style="--c:${GINFO[t.grade].c}">
      <div class="crumbs"><a href="#/k/${t.grade}" class="btn btn-ghost">◀ ${gName(t.grade)}</a></div>
      <div class="setup-head"><div class="t-icon big">${t.icon}</div><div><h1 class="pixel h-title left">${t.title.toUpperCase()}</h1><p class="h-sub left">${t.desc}</p><div class="bp-badge">Leitidee: ${t.bp}</div></div></div>
      ${MA.LEARN && MA.LEARN[t.id] ? `<details class="panel learn-panel" ${[1, 2, 3].some((l) => S.stars(t.id, l)) ? '' : 'open'}><summary><span class="pixel">📖 SO GEHT'S</span> <span class="learn-sub">– erst lesen, dann spielen</span></summary>${MA.learnHTML(t.id)}</details>` : t.mix ? '<div class="panel learn-panel mixinfo">🎰 Im Zufalls-Mix findest du bei jeder Aufgabe über „📖 So geht\'s“ die passende Erklärung.</div>' : ''}
      <div class="setup-grid">
        <div class="panel">
          <h3 class="pixel ph">1 · SCHWIERIGKEIT</h3>
          <div class="levels">${[1, 2, 3].map((l) => `<button type="button" class="lvl" data-l="${l}"><span class="lvl-stars">${MA.LEVELS[l].s}</span><span class="lvl-n">${MA.LEVELS[l].n}-Niveau</span><span class="lvl-name">${MA.LEVELS[l].name}</span><span class="lvl-got">${MA.starStr(S.stars(t.id, l))}</span></button>`).join('')}</div>
          <h3 class="pixel ph">2 · SPIELMODUS</h3>
          <div class="modes">${Object.entries(MODES).map(([k, m]) => `<button type="button" class="mode" data-m="${k}"><span>${m.icon}</span>${m.name}</button>`).join('')}</div>
          <button type="button" class="btn btn-ghost btn-preview">👁 Beispielaufgabe ansehen</button>
        </div>
        <div class="panel">
          <h3 class="pixel ph">3 · SPIEL</h3>
          <div class="formats"></div>
          <div class="opts"></div>
          <button type="button" class="btn btn-big btn-go pixel">▶ START</button>
        </div>
      </div>
      <div class="preview"></div>
    </section>`;

    const $ = (s) => app.querySelector(s);
    const render = () => {
      app.querySelectorAll('.lvl').forEach((b) => b.classList.toggle('on', +b.dataset.l === level));
      app.querySelectorAll('.mode').forEach((b) => b.classList.toggle('on', b.dataset.m === mode));
      const fs = formatsFor();
      if (!fs.includes(format)) format = fs[0];
      $('.formats').innerHTML = fs.map((id) => { const f = MA.FORMATS[id]; return `<button type="button" class="fcard ${id === format ? 'on' : ''}" data-f="${id}"><span class="f-icon">${f.icon}</span><span class="f-name">${f.name}</span><span class="f-desc">${f.desc}</span></button>`; }).join('');
      app.querySelectorAll('.fcard').forEach((b) => b.addEventListener('click', () => { format = b.dataset.f; MA.Sound.click(); render(); }));
      renderOpts();
    };
    const sel = (name, label, options, val) => `<label class="opt"><span>${label}</span><select data-o="${name}">${options.map(([v, l]) => `<option value="${v}" ${String(v) === String(val) ? 'selected' : ''}>${l}</option>`).join('')}</select></label>`;
    const chk = (name, label, val) => `<label class="opt chk"><input type="checkbox" data-o="${name}" ${val ? 'checked' : ''}><span>${label}</span></label>`;
    const renderOpts = () => {
      let h = '';
      const teamInputs = (n) => `<div class="team-names">${Array.from({ length: n }, (_, i) => `<label class="tn" style="--c:${MA.TEAMS[i].color}"><span>●</span><input data-tn="${i}" value="${MA.esc(opt.teamNames[i])}" maxlength="16"></label>`).join('')}</div>`;
      const nameInputs = () => `<div class="team-names">${[0, 1].map((i) => `<label class="tn" style="--c:${MA.TEAMS[i].color}"><span>●</span><input data-pn="${i}" value="${MA.esc(opt.names[i])}" maxlength="16"></label>`).join('')}</div>`;
      if (format === 'rallye') {
        if (mode === 'solo') h += sel('cpu', 'Tempo von Robo 🤖', [['slow', 'Gemütlich'], ['mid', 'Normal'], ['fast', 'Turbo']], opt.cpu);
        if (mode === 'partner') h += nameInputs();
        if (mode === 'gruppe') h += sel('teamN', 'Anzahl Teams', [[2, '2 Teams'], [3, '3 Teams'], [4, '4 Teams'], [5, '5 Teams'], [6, '6 Teams']], opt.teamN) + teamInputs(opt.teamN) + chk('buzzer', 'Lehrkraft vergibt die Felder (Buzzer-Modus: alle rechnen gleichzeitig)', opt.buzzer);
        h += sel('len', 'Streckenlänge', [[8, 'Kurz (8)'], [10, 'Normal (10)'], [15, 'Lang (15)'], [20, 'Marathon (20)']], opt.len);
        if (mode !== 'solo') h += sel('timer', 'Zeit pro Aufgabe', [[0, 'ohne Zeitlimit'], [30, '30 Sekunden'], [60, '60 Sekunden'], [90, '90 Sekunden'], [120, '2 Minuten']], opt.timer);
      }
      if (format === 'duell' && window.innerWidth < 600) h += '<div class="opt-info">📱 Tipp: Auf dem Handy ist es eng. Am Tablet oder Laptop macht das Duell zu zweit am meisten Spaß.</div>';
      if (format === 'duell') h += nameInputs() + sel('target', 'Seil-Züge zum Sieg', [[3, '3 (kurz)'], [5, '5 (normal)'], [7, '7 (lang)']], opt.target) + chk('flip', 'Gegenüber sitzen (Tablet liegt flach zwischen euch)', opt.flip);
      if (format === 'memory') {
        h += sel('pairs', 'Anzahl Paare', [[6, '6 Paare'], [8, '8 Paare'], [10, '10 Paare']], opt.pairs);
        if (mode === 'partner') h += nameInputs();
        if (mode === 'gruppe') h += sel('teamN', 'Anzahl Teams', [[2, '2 Teams'], [3, '3 Teams'], [4, '4 Teams']], Math.min(opt.teamN, 4)) + teamInputs(Math.min(opt.teamN, 4));
      }
      if (format === 'tresor') h += `<div class="opt-info">${mode === 'solo' ? '3' : mode === 'partner' ? '4' : '5'} Leben · 5 Schlösser · Tipps kosten 10 Sekunden Strafzeit.${mode === 'gruppe' ? '<br>Ideal als Stundeneinstieg: Die ganze Klasse knackt gemeinsam den Tresor.' : ''}</div>`;
      if (format === 'training') h += `<div class="opt-info">10 Aufgaben · Tipps & Erklärung · bei einem Fehler gibt es einen 2. Versuch · 9 Punkte = ★★★</div>`;
      if (format === 'blitz') h += `<div class="opt-info">60 Sekunden · je 5 richtige in Folge = +5 Sekunden</div>`;
      $('.opts').innerHTML = h;
      $('.opts').querySelectorAll('[data-o]').forEach((e) => e.addEventListener('change', () => {
        const k = e.dataset.o;
        opt[k] = e.type === 'checkbox' ? e.checked : isNaN(+e.value) ? e.value : +e.value;
        if (k === 'teamN') renderOpts();
      }));
      $('.opts').querySelectorAll('[data-tn]').forEach((e) => e.addEventListener('input', () => { opt.teamNames[+e.dataset.tn] = e.value; }));
      $('.opts').querySelectorAll('[data-pn]').forEach((e) => e.addEventListener('input', () => { opt.names[+e.dataset.pn] = e.value; }));
    };
    app.querySelectorAll('.lvl').forEach((b) => b.addEventListener('click', () => { level = +b.dataset.l; MA.Sound.click(); render(); }));
    app.querySelectorAll('.mode').forEach((b) => b.addEventListener('click', () => { mode = b.dataset.m; MA.Sound.click(); render(); }));
    $('.btn-preview').addEventListener('click', () => {
      const box = $('.preview');
      const show = () => {
        const tk = t.gen(level);
        box.innerHTML = `<div class="panel prev-panel"><div class="prev-head"><h3 class="pixel ph">BEISPIEL ${MA.LEVELS[level].s}</h3><div><button type="button" class="btn btn-ghost prev-new">🔄 Neue</button> <button type="button" class="btn btn-ghost prev-close">✕</button></div></div><div class="prev-task"></div><div class="fb fb-ok"><div class="fb-ans">Lösung: <b>${MA.answerHTML(tk)}</b></div>${tk.sol ? `<div class="fb-sol-inline">${tk.sol}</div>` : ''}</div></div>`;
        MA.renderTask(box.querySelector('.prev-task'), tk, { display: true });
        box.querySelector('.prev-new').addEventListener('click', show);
        box.querySelector('.prev-close').addEventListener('click', () => (box.innerHTML = ''));
        box.scrollIntoView({ behavior: 'smooth', block: 'start' });
      };
      show();
    });
    $('.btn-go').addEventListener('click', () => {
      const tn = Math.min(opt.teamN, format === 'memory' ? 4 : 6);
      const teams = mode === 'partner'
        ? [0, 1].map((i) => ({ name: (opt.names[i] || '').trim() || 'Spieler ' + (i + 1), color: MA.TEAMS[i].color }))
        : Array.from({ length: tn }, (_, i) => ({ name: (opt.teamNames[i] || '').trim() || 'Team ' + MA.TEAMS[i].name, color: MA.TEAMS[i].color }));
      S.data.last = { level, mode, format, opts: opt };
      S.save();
      pending = { topic: t, level, mode, format, opts: Object.assign({}, opt, { teams, names: teams.map((x) => x.name) }) };
      MA.Sound.coin();
      location.hash = '#/spiel';
    });
    render();
  }

  /* ---------- Spielbildschirm ---------- */
  function gameScreen() {
    stopGame();
    const p = pending, f = MA.FORMATS[p.format];
    app.innerHTML = `<section class="screen game" data-format="${p.format}" style="--c:${GINFO[p.topic.grade].c}">
      <div class="game-top">
        <button type="button" class="btn btn-ghost btn-quit" aria-label="Spiel beenden">✕</button>
        ${MA.LEARN && MA.LEARN[p.topic.id] ? '<button type="button" class="btn btn-ghost btn-learn-top" aria-label="Erklärung">📖</button>' : ''}
        <div class="game-title"><span class="gt-icon">${p.topic.icon}</span><span class="gt-name">${p.topic.title}</span><span class="gt-meta">${MA.LEVELS[p.level].s} · ${f.icon} ${f.name}</span></div>
        <div class="hud"></div>
      </div>
      <div class="game-body"></div>
    </section>`;
    const hudEl = app.querySelector('.hud');
    const ctx = {
      topic: p.topic, level: p.level, mode: p.mode, opts: p.opts,
      el: app.querySelector('.game-body'),
      hud: (h) => (hudEl.innerHTML = h),
      retry: () => gameScreen(),
      back: () => (location.hash = '#/t/' + p.topic.id),
    };
    const lt = app.querySelector('.btn-learn-top');
    if (lt) lt.addEventListener('click', () => MA.showLearn(p.topic.id));
    app.querySelector('.btn-quit').addEventListener('click', () => {
      if (!app.querySelector('.result') && !window.confirm('Spiel wirklich beenden?')) return;
      ctx.back();
    });
    current = MA.Games[p.format].start(ctx);
  }

  /* ---------- Lehrkräfte ---------- */
  function infoScreen() {
    MA.keyTarget = null;
    const rows = MA.topics.filter((t) => !t.mix).map((t) => `<tr><td>${t.grade === 'K' ? 'alle' : t.grade}</td><td>${t.icon} ${t.title}</td><td>${t.bp}</td><td>${t.tags.join(', ')}</td></tr>`).join('');
    app.innerHTML = `<section class="screen info">
      <div class="crumbs"><a href="#/klassen" class="btn btn-ghost">◀ Zurück</a></div>
      <h1 class="pixel h-title">FÜR LEHRKRÄFTE</h1>
      <div class="info-grid">
        <div class="panel"><h3 class="pixel ph">SCHNELLSTART</h3><ol>
          <li>Klasse wählen → Thema wählen.</li>
          <li>Niveau mit den Sternen festlegen: <b>★ G</b> grundlegend, <b>★★ M</b> mittel, <b>★★★ E</b> erweitert.</li>
          <li>Modus wählen: Solo, Partner oder Gruppe – passende Spiele erscheinen automatisch.</li>
          <li>Mit 👁 „Beispielaufgabe“ siehst du vorab Aufgabe und Lösung.</li>
          <li>Jedes Thema hat eine Lernkarte <b>📖 So geht's</b> (Merksatz, Schritte, Beispiel, typischer Fehler) – ideal für selbstständiges Arbeiten und zu Hause.</li></ol></div>
        <div class="panel"><h3 class="pixel ph">SPIELFORMATE</h3><ul>
          ${Object.values(MA.FORMATS).map((f) => `<li><b>${f.icon} ${f.name}</b> (${f.modes.map((m) => MODES[m].name).join(', ')}): ${f.desc}</li>`).join('')}</ul></div>
        <div class="panel"><h3 class="pixel ph">IM UNTERRICHT</h3><ul>
          <li><b>Beamer:</b> 📺 vergrößert alles, ⛶ schaltet Vollbild.</li>
          <li><b>Rallye im Buzzer-Modus:</b> Alle Teams rechnen gleichzeitig im Heft, die Lehrkraft vergibt das Feld. Gut für ganze Klassen.</li>
          <li><b>Rallye reihum:</b> Teams tippen nacheinander am Board ein – optional mit Zeitlimit.</li>
          <li><b>Tauzieh-Duell:</b> Zwei Lernende an einem iPad, gleichzeitig. „Gegenüber sitzen“ dreht eine Hälfte.</li>
          <li><b>Escape-Tresor:</b> Kooperativer Stundeneinstieg oder Wiederholung.</li>
          <li><b>Training:</b> Differenzierte Einzelarbeit und Hausaufgabe – Sterne zeigen den Lernstand.</li>
          <li><b>Zufalls-Mix:</b> Vermischte Wiederholung aller Themen einer Klasse.</li></ul></div>
        <div class="panel"><h3 class="pixel ph">DIDAKTIK</h3><ul>
          <li>Aufgaben werden zufällig erzeugt – es gehen nie die Aufgaben aus, Abschreiben lohnt nicht.</li>
          <li>Gestufte Tipps statt sofortiger Lösung. Im Training gibt es nach einem Fehler einen zweiten Versuch mit Tipp, erst danach den ausführlichen Lösungsweg.</li>
          <li>Lernkarten mit Merksatz, Schritt-für-Schritt-Anleitung, Beispiel und typischem Fehler zu allen Themen.</li>
          <li>Typische Fehler werden erkannt und gezielt kommentiert (z. B. „Nenner nicht addieren!“).</li>
          <li>Rechenschwache profitieren von visuellen Darstellungen, Starke von Knobel- und E-Aufgaben.</li></ul></div>
        <div class="panel"><h3 class="pixel ph">DATENSCHUTZ</h3><p>Die Seite läuft komplett im Browser. Es gibt keine Anmeldung, keinen Server, keine Cookies, kein Tracking und keine externen Schriften. Fortschritt (Sterne, XP, Abzeichen) wird nur lokal auf dem Gerät gespeichert.</p>
          <button type="button" class="btn btn-alt btn-reset">🗑 Fortschritt auf diesem Gerät löschen</button></div>
      </div>
      <div class="panel"><h3 class="pixel ph">THEMEN & BILDUNGSPLAN</h3><div class="tbl-wrap"><table class="info-table"><thead><tr><th>Kl.</th><th>Spiel</th><th>Leitidee (BP 2016)</th><th>Art</th></tr></thead><tbody>${rows}</tbody></table></div></div>
    </section>`;
    app.querySelector('.btn-reset').addEventListener('click', () => { if (confirm('Wirklich alle Sterne, XP und Abzeichen auf diesem Gerät löschen?')) { S.reset(); syncTop(); MA.toast('Fortschritt gelöscht.'); } });
  }

  /* ---------- Erfolge ---------- */
  function trophyScreen() {
    MA.keyTarget = null;
    const d = S.data;
    const lvl = S.level(), into = d.xp % 250;
    app.innerHTML = `<section class="screen trophies">
      <div class="crumbs"><a href="#/klassen" class="btn btn-ghost">◀ Zurück</a></div>
      <h1 class="pixel h-title">HALL OF FAME</h1>
      <div class="panel player">
        <label class="opt"><span>Dein Spielername</span><input class="pname" maxlength="16" value="${MA.esc(d.name)}" placeholder="z. B. Mathe-Ninja"></label>
        <div class="xpbox"><div class="pixel lvbig">LEVEL ${lvl}</div><div class="g-bar xp"><div style="width:${(into / 250) * 100}%"></div></div><div>${d.xp} XP · noch ${250 - into} XP bis Level ${lvl + 1}</div></div>
        <div class="stats"><span>🎮 ${d.games} Spiele</span><span>🏅 ${d.badges.length}/${MA.BADGES.length} Abzeichen</span></div>
      </div>
      <div class="badge-grid">${MA.BADGES.map((b) => `<div class="badge ${d.badges.includes(b.id) ? 'got' : ''}"><div class="b-icon">${b.icon}</div><div class="b-name">${b.name}</div><div class="b-desc">${b.desc}</div></div>`).join('')}</div>
    </section>`;
    app.querySelector('.pname').addEventListener('input', (e) => { d.name = e.target.value.trim(); S.save(); });
  }

  syncTop();
  route();
})();
