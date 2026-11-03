/* =========================================================
   Mathe-Arena – Speicher, Sound, Effekte, Abzeichen
   Alles bleibt lokal im Browser (localStorage). Kein Server.
   ========================================================= */
(function () {
  const KEY = 'matheArena.v1';

  /* ---------- Speicher ---------- */
  const def = () => ({ name: '', xp: 0, sound: true, beamer: false, best: {}, badges: [], grades: [], knobel: 0, games: 0, last: { level: 1, mode: 'solo' } });
  let data;
  try { data = Object.assign(def(), JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) { data = def(); }
  const S = (MA.Store = {
    get data() { return data; },
    save() { try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) { /* privater Modus o. Ä. */ } },
    reset() { data = def(); S.save(); },
    rec(topic, level) { const k = topic + '|' + level; return (data.best[k] = data.best[k] || { stars: 0, blitz: 0, memory: 0 }); },
    stars(topic, level) { const r = data.best[topic + '|' + level]; return r ? r.stars : 0; },
    setStars(topic, level, st) { const r = S.rec(topic, level); const nw = st > r.stars; if (nw) r.stars = st; S.save(); return nw; },
    setBest(topic, level, field, v, lowerIsBetter) { const r = S.rec(topic, level); const nw = !r[field] || (lowerIsBetter ? v < r[field] : v > r[field]); if (nw) r[field] = v; S.save(); return nw; },
    addXP(n) { data.xp += Math.max(0, Math.round(n)); if (data.xp >= 1000) S.badge('xp1000'); S.save(); },
    level() { return Math.floor(data.xp / 250) + 1; },
    played(grade) {
      data.games++;
      if (grade !== 'K' && !data.grades.includes(grade)) data.grades.push(grade);
      if (grade === 'K') data.knobel++;
      S.badge('first');
      if (data.grades.length >= 6) S.badge('allgrades');
      if (data.knobel >= 5) S.badge('knobel');
      S.save();
    },
    badge(id) {
      if (data.badges.includes(id)) return false;
      data.badges.push(id); S.save();
      const b = MA.BADGES.find((x) => x.id === id);
      if (b) MA.toast(`${b.icon} Abzeichen freigeschaltet: <b>${b.name}</b>`);
      return true;
    },
  });

  MA.BADGES = [
    { id: 'first', icon: '🎮', name: 'Erste Runde', desc: 'Ein Spiel beendet.' },
    { id: 'perfect', icon: '💯', name: 'Fehlerfrei', desc: 'Training ohne einen einzigen Fehler.' },
    { id: 'streak', icon: '🔥', name: 'Heiße Serie', desc: '8 richtige Antworten hintereinander.' },
    { id: 'blitz15', icon: '⚡', name: 'Blitzmerker', desc: 'Mindestens 15 Punkte in einer Blitz-Runde.' },
    { id: 'rallye', icon: '🏁', name: 'Rallye-Champion', desc: 'Eine Mathe-Rallye gewonnen.' },
    { id: 'duell', icon: '⚔️', name: 'Duell-Held', desc: 'Ein Tauzieh-Duell gewonnen.' },
    { id: 'tresor', icon: '💎', name: 'Tresorknacker', desc: 'Einen Escape-Tresor geknackt.' },
    { id: 'memory', icon: '🧠', name: 'Gedächtnis-Ass', desc: 'Memory mit 3 Sternen gelöst.' },
    { id: 'eprofi', icon: '👑', name: 'E-Profi', desc: '3 Sterne im Training auf ★★★-Niveau.' },
    { id: 'knobel', icon: '🧩', name: 'Knobelkönig', desc: '5 Runden in der Knobel-Ecke gespielt.' },
    { id: 'allgrades', icon: '🌍', name: 'Weltenbummler', desc: 'In allen Klassenstufen 5–10 gespielt.' },
    { id: 'xp1000', icon: '🚀', name: '1000 XP', desc: '1000 Erfahrungspunkte gesammelt.' },
  ];

  /* ---------- Sound (Web Audio, kein Download nötig) ---------- */
  let ctx = null;
  const tone = (freq, dur = 0.1, type = 'square', vol = 0.06, delay = 0) => {
    if (!data.sound) return;
    try {
      ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
      if (ctx.state === 'suspended') ctx.resume();
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = type; o.frequency.value = freq;
      const t0 = ctx.currentTime + delay;
      g.gain.setValueAtTime(vol, t0);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      o.connect(g); g.connect(ctx.destination);
      o.start(t0); o.stop(t0 + dur + 0.02);
    } catch (e) { /* kein Audio */ }
  };
  MA.Sound = {
    click: () => tone(660, 0.03, 'square', 0.025),
    ok: () => { tone(660, 0.08); tone(990, 0.12, 'square', 0.06, 0.08); },
    bad: () => { tone(220, 0.15, 'sawtooth', 0.05); tone(160, 0.2, 'sawtooth', 0.05, 0.12); },
    coin: () => { tone(988, 0.07); tone(1319, 0.25, 'square', 0.06, 0.07); },
    win: () => [523, 659, 784, 1047, 784, 1047].forEach((f, i) => tone(f, 0.14, 'square', 0.06, i * 0.12)),
    tick: () => tone(1200, 0.02, 'square', 0.02),
    boost: () => [400, 500, 650, 850].forEach((f, i) => tone(f, 0.06, 'square', 0.05, i * 0.04)),
    alarm: () => [880, 660, 880, 660].forEach((f, i) => tone(f, 0.12, 'sawtooth', 0.05, i * 0.13)),
  };

  /* ---------- Toasts ---------- */
  MA.toast = (html, ms = 3200) => {
    let box = document.getElementById('toasts');
    if (!box) { box = document.createElement('div'); box.id = 'toasts'; document.body.appendChild(box); }
    const el = document.createElement('div');
    el.className = 'toast';
    el.innerHTML = html;
    box.appendChild(el);
    setTimeout(() => el.classList.add('out'), ms);
    setTimeout(() => el.remove(), ms + 500);
  };

  /* ---------- Konfetti ---------- */
  MA.confetti = (ms = 2500) => {
    if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const c = document.createElement('canvas');
    c.className = 'confetti';
    document.body.appendChild(c);
    const g = c.getContext('2d');
    const W = (c.width = innerWidth), H = (c.height = innerHeight);
    const cols = ['#00f0ff', '#ff2bd6', '#ffe600', '#39ff88', '#ff9f1c', '#9d4dff'];
    const P = Array.from({ length: 160 }, () => ({ x: Math.random() * W, y: -20 - Math.random() * H * 0.5, vx: (Math.random() - 0.5) * 4, vy: 2 + Math.random() * 4, s: 6 + Math.random() * 6, c: cols[(Math.random() * cols.length) | 0], r: Math.random() * 6 }));
    const t0 = performance.now();
    (function fr(t) {
      g.clearRect(0, 0, W, H);
      P.forEach((p) => { p.x += p.vx; p.y += p.vy; p.vy += 0.05; p.r += 0.1; g.fillStyle = p.c; g.save(); g.translate(p.x, p.y); g.rotate(p.r); g.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * 0.6); g.restore(); });
      if (t - t0 < ms) requestAnimationFrame(fr); else c.remove();
    })(t0);
  };

  /* ---------- kleine DOM-Helfer ---------- */
  MA.h = (html) => { const d = document.createElement('div'); d.innerHTML = html.trim(); return d.firstElementChild; };
  MA.esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  MA.starStr = (n, max = 3) => '★'.repeat(n) + '☆'.repeat(max - n);
  MA.LEVELS = [null, { s: '★', n: 'G', name: 'Grundlegend' }, { s: '★★', n: 'M', name: 'Mittel' }, { s: '★★★', n: 'E', name: 'Erweitert' }];
  MA.PRAISE = ['Stark!', 'Richtig!', 'Super!', 'Volltreffer!', 'Klasse!', 'Genau!', 'Mathe-Profi!', 'Weiter so!', 'Perfekt!'];
  MA.TEAMS = [
    { name: 'Rot', color: '#ff3860' }, { name: 'Blau', color: '#2f9bff' }, { name: 'Gelb', color: '#ffe600' },
    { name: 'Grün', color: '#39ff88' }, { name: 'Lila', color: '#b26bff' }, { name: 'Orange', color: '#ff9f1c' },
  ];

  /* Aufgabe holen und Wiederholungen vermeiden */
  MA.taskSource = (topic, level) => {
    const recent = [];
    return () => {
      let t;
      for (let i = 0; i < 25; i++) {
        t = topic.gen(level);
        const key = t.q + (t.vis || '') + JSON.stringify(t.answer);
        if (!recent.includes(key)) { recent.push(key); if (recent.length > 8) recent.shift(); break; }
      }
      return t;
    };
  };

  /* Ist eine Aufgabe für Memory geeignet? */
  MA.memoryOk = (t) => t.memOk !== false && ['num', 'frac', 'choice'].includes(t.type) && (t.mq !== undefined ? t.mq !== '' || !!t.vis : U_len(t.q) <= 80);
  const U_len = (h) => String(h).replace(/<[^>]+>/g, '').length;
})();
