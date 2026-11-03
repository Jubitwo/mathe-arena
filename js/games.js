/* =========================================================
   Mathe-Arena – Spielformate
   training · blitz · rallye · duell · memory · tresor
   Jedes Spiel bekommt einen Kontext c:
   { topic, level, mode, opts, el, hud(html), retry(), back() }
   ========================================================= */
(function () {
  const U = MA.U;
  const G = (MA.Games = {});

  MA.FORMATS = {
    training: { icon: '🎯', name: 'Training', desc: '10 Aufgaben mit Tipps, Erklärung und zweitem Versuch. Sammle bis zu 3 Sterne!', modes: ['solo'] },
    blitz: { icon: '⚡', name: 'Blitz-Runde', desc: '60 Sekunden – wie viele Aufgaben schaffst du? Serien geben Zeitbonus.', modes: ['solo'] },
    rallye: { icon: '🏎️', name: 'Mathe-Rallye', desc: 'Jede richtige Antwort bringt dein Auto ein Feld weiter. 3 Treffer in Folge = TURBO!', modes: ['solo', 'partner', 'gruppe'] },
    duell: { icon: '⚔️', name: 'Tauzieh-Duell', desc: 'Zwei gegeneinander auf einem Gerät – gleichzeitig! Wer richtig rechnet, zieht am Seil.', modes: ['partner'] },
    memory: { icon: '🧠', name: 'Mathe-Memory', desc: 'Finde die Paare aus Aufgabe und Ergebnis.', modes: ['solo', 'partner', 'gruppe'], needsMemory: true },
    tresor: { icon: '🔐', name: 'Escape-Tresor', desc: 'Knackt 5 Schlösser, bevor der Alarm losgeht. Gemeinsam gegen die Zeit!', modes: ['solo', 'partner', 'gruppe'] },
  };

  /* ---------- Hilfen ---------- */
  const fmtTime = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
  MA.result = (c, o) => {
    const starHTML = o.stars !== undefined && o.stars !== null ? `<div class="res-stars">${[1, 2, 3].map((i) => `<span class="${i <= o.stars ? 'on' : ''}" style="animation-delay:${i * 0.25}s">★</span>`).join('')}</div>` : '';
    c.el.innerHTML = `<div class="result">
      <div class="res-emoji">${o.emoji || '🏆'}</div>
      <h2 class="pixel res-title">${o.title}</h2>
      ${starHTML}
      ${o.record ? '<div class="res-record">NEUER REKORD!</div>' : ''}
      <div class="res-lines">${(o.lines || []).map((l) => `<div>${l}</div>`).join('')}</div>
      <div class="res-btns"><button type="button" class="btn btn-big btn-retry">🔁 Nochmal</button><button type="button" class="btn btn-big btn-alt btn-back">🎮 Anderes Spiel</button></div>
    </div>`;
    c.el.querySelector('.btn-retry').addEventListener('click', c.retry);
    c.el.querySelector('.btn-back').addEventListener('click', c.back);
    MA.keyTarget = (e) => { if (e.key === 'Enter') { e.preventDefault(); c.retry(); } };
    if (o.stars >= 2 || o.win) { MA.Sound.win(); MA.confetti(); }
    MA.Store.played(c.topic.grade);
    if (o.xp) MA.Store.addXP(o.xp);
  };
  const carSVG = (color) => `<svg viewBox="0 0 70 34" class="car-svg"><path d="M4 24 L8 15 L22 12 L32 5 L50 5 L58 13 L66 16 L66 25 Z" fill="${color}" stroke="#fff" stroke-width="1.5"/><path d="M33 8 L48 8 L54 14 L28 14 Z" fill="#0b0b1e" opacity=".75"/><rect x="60" y="17" width="5" height="3" fill="#fff9b0"/><circle cx="18" cy="26" r="6.5" fill="#111" stroke="#ddd" stroke-width="2"/><circle cx="52" cy="26" r="6.5" fill="#111" stroke="#ddd" stroke-width="2"/><path d="M0 18 h5 M-2 22 h6" stroke="${color}" stroke-width="2" class="car-speed"/></svg>`;

  /* =======================================================
     TRAINING (Solo)
     ======================================================= */
  G.training = {
    start(c) {
      const next = MA.taskSource(c.topic, c.level);
      const N = 10;
      let i = 0, right = 0, firstTry = 0, score = 0, streak = 0, w = null, alive = true;
      const STREAK = { 3: '🔥 3er-Serie! Ab jetzt +5 Bonuspunkte', 5: '⚡ 5er-Serie – du bist on fire!', 7: '🚀 7 in Folge – unaufhaltbar!', 10: '👑 10 von 10 in Folge – Legende!' };
      const hud = () => c.hud(`<span>Aufgabe <b>${Math.min(i, N)}/${N}</b></span><span>Punkte <b>${score}</b></span><span class="streak ${streak >= 3 ? 'hot' : ''}">🔥 ${streak}</span>`);
      const step = () => {
        if (!alive) return;
        if (w) w.destroy();
        if (i >= N) return finish();
        i++; hud();
        c.el.innerHTML = `<div class="progress"><div style="width:${((i - 1) / N) * 100}%"></div></div><div class="stage"></div>`;
        const st = c.el.querySelector('.stage');
        const t = next();
        let hints = 0, attempt = 1, wrongChoice = [];
        const opts = {
          hints: true, onHint: (n) => (hints = n),
          onAnswer(r) {
            w.lock();
            // Erster Fehlversuch: nicht gleich die Lösung zeigen, sondern Tipp + zweiter Versuch
            if (!r.ok && attempt === 1) {
              attempt = 2; streak = 0; MA.Sound.bad(); hud();
              if (t.type === 'choice') wrongChoice.push(r.given);
              w.destroy();
              w = MA.renderTask(st, t, Object.assign({}, opts, { showHints: Math.max(1, hints), disable: wrongChoice }));
              st.insertAdjacentHTML('afterbegin', `<div class="fb fb-try"><div class="fb-head">🤔 Noch nicht ganz – du hast einen zweiten Versuch!</div>${r.msg ? `<div class="fb-msg">⚠️ ${r.msg}</div>` : ''}<div class="fb-hint-line">Lies den Tipp unten${MA.LEARN && MA.LEARN[t.topicId] ? ' oder schau in „📖 So geht\'s“' : ''} und probier es nochmal.</div></div>`);
              return;
            }
            w.markChoice(r);
            let pts = 0;
            if (r.ok) {
              right++; streak++;
              if (attempt === 1) firstTry++; else MA.Store.badge('zweiter');
              pts = attempt === 2 ? 3 : Math.max(4, 10 - hints * 3) + (streak >= 3 ? 5 : 0);
              score += pts; MA.Sound.ok();
              if (STREAK[streak]) MA.toast(STREAK[streak], 1800);
              if (streak >= 8) MA.Store.badge('streak');
            } else { streak = 0; MA.Sound.bad(); }
            hud();
            const tryBox = st.querySelector('.fb-try'); if (tryBox) tryBox.remove();
            MA.feedback(st, t, r, { onNext: step, points: pts, auto: r.ok ? (attempt === 2 ? 2200 : 1100) : 0, showSol: r.ok && attempt === 2 });
          },
        };
        w = MA.renderTask(st, t, opts);
      };
      const finish = () => {
        if (w) w.destroy();
        // Sterne: Treffer im zweiten Versuch zählen halb
        const val = firstTry + (right - firstTry) * 0.5;
        const stars = val >= 9 ? 3 : val >= 7 ? 2 : val >= 5 ? 1 : 0;
        const rec = MA.Store.setStars(c.topic.id, c.level, stars);
        if (firstTry === N) MA.Store.badge('perfect');
        if (c.level === 3 && stars === 3) MA.Store.badge('eprofi');
        MA.result(c, {
          title: stars === 3 ? 'MEGA!' : stars === 2 ? 'STARK!' : stars === 1 ? 'GUT GEMACHT!' : 'WEITER ÜBEN!',
          emoji: ['💪', '🙂', '😎', '🏆'][stars], stars, record: rec && stars > 0,
          lines: [`<b>${right} von ${N}</b> richtig${right > firstTry ? ` (davon ${right - firstTry} im 2. Versuch)` : ''}`, `${score} Punkte`, stars < 3 ? `Für ${stars + 1} Sterne brauchst du ${[5, 7, 9][stars]} Punkte (1. Versuch = 1, 2. Versuch = ½).` : c.level < 3 ? 'Stark! Probier doch mal die nächste Stufe!' : 'Höchststufe gemeistert – Respekt!'],
          xp: score,
        });
      };
      step();
      return { destroy() { alive = false; if (w) w.destroy(); } };
    },
  };

  /* =======================================================
     BLITZ (Solo, 60 s)
     ======================================================= */
  G.blitz = {
    start(c) {
      const next = MA.taskSource(c.topic, c.level);
      const TOTAL = 60;
      let left = TOTAL, score = 0, streak = 0, w = null, alive = true, running = false, iv = null, wrong = 0;
      c.el.innerHTML = `<div class="blitz-bar"><div></div></div><div class="stage"></div>`;
      const bar = c.el.querySelector('.blitz-bar div');
      const st = c.el.querySelector('.stage');
      const hud = () => c.hud(`<span>⏱ <b>${Math.ceil(left)}</b> s</span><span>Treffer <b>${score}</b></span><span class="streak ${streak >= 3 ? 'hot' : ''}">🔥 ${streak}</span>`);
      const countdown = (n) => {
        st.innerHTML = `<div class="countdown pixel">${n || 'LOS!'}</div>`;
        MA.Sound.tick();
        if (n > 0) setTimeout(() => alive && countdown(n - 1), 700);
        else setTimeout(() => { if (!alive) return; running = true; tick(); step(); }, 500);
      };
      const tick = () => {
        let last = performance.now();
        iv = setInterval(() => {
          const now = performance.now();
          if (running) left -= (now - last) / 1000;
          last = now;
          bar.style.width = Math.max(0, (left / TOTAL) * 100) + '%';
          bar.classList.toggle('low', left < 10);
          hud();
          if (left <= 0) { clearInterval(iv); finish(); }
        }, 100);
      };
      const step = () => {
        if (!alive || left <= 0) return;
        if (w) w.destroy();
        const t = next();
        w = MA.renderTask(st, t, {
          onAnswer(r) {
            w.lock(); w.markChoice(r);
            if (r.ok) {
              score++; streak++; MA.Sound.ok();
              if (streak % 5 === 0) { left += 5; MA.toast('⏱ +5 Sekunden Zeitbonus!', 1500); MA.Sound.boost(); }
              st.classList.add('flash-ok'); setTimeout(() => st.classList.remove('flash-ok'), 250);
              setTimeout(step, 250);
            } else {
              streak = 0; wrong++; MA.Sound.bad();
              MA.feedback(st, t, r, { onNext: step, auto: 1600 });
            }
            hud();
          },
        });
      };
      const finish = () => {
        running = false; alive = false;
        if (w) w.destroy();
        const rec = MA.Store.setBest(c.topic.id, c.level, 'blitz', score);
        if (score >= 15) MA.Store.badge('blitz15');
        const dc = MA.daily();
        if (dc.topic.id === c.topic.id && score >= 10) { MA.Store.data.dailyDone = dc.key; MA.Store.save(); MA.Store.badge('tages'); if (MA.Store.data.badges.includes('tages')) MA.toast('📅 Tages-Challenge geschafft!', 2500); }
        const best = MA.Store.rec(c.topic.id, c.level).blitz;
        MA.result(c, { title: 'ZEIT UM!', emoji: '⚡', record: rec && score > 0, win: rec && score > 0, lines: [`<b>${score}</b> Treffer in 60 Sekunden`, `${wrong} Fehler`, `Dein Rekord: <b>${best}</b>`], xp: score * 6 });
      };
      hud();
      countdown(3);
      return { destroy() { alive = false; running = false; clearInterval(iv); if (w) w.destroy(); } };
    },
  };

  /* =======================================================
     RALLYE (Solo gegen Robo / Partner / Gruppe)
     ======================================================= */
  G.rallye = {
    start(c) {
      const next = MA.taskSource(c.topic, c.level);
      const o = c.opts;
      const cpu = c.mode === 'solo';
      const teams = cpu
        ? [{ name: MA.Store.data.name || 'Du', color: '#00f0ff' }, { name: 'Robo 🤖', color: '#ff2bd6', cpu: true }]
        : o.teams;
      const LEN = o.len || 10;
      const pos = teams.map(() => 0), strk = teams.map(() => 0);
      let turn = 0, w = null, alive = true, over = false, paused = false, timerIv = null, cpuIv = null;
      c.el.innerHTML = `<div class="rallye ${teams.length > 3 ? 'many' : ''}"><div class="turn-banner"></div><div class="stage"></div><div class="track">${teams.map((t, i) => `
        <div class="lane" style="--c:${t.color}"><div class="lane-name">${MA.esc(t.name)}</div><div class="road"><div class="finish"></div><div class="car" data-i="${i}" style="--f:0">${carSVG(t.color)}</div><span class="lane-pos">0/${LEN}</span></div></div>`).join('')}</div></div>`;
      const banner = c.el.querySelector('.turn-banner');
      const st = c.el.querySelector('.stage');
      const hud = () => c.hud(`<span>Ziel: <b>${LEN}</b> Felder</span>${cpu ? `<span>Du <b>${pos[0]}</b> : <b>${pos[1]}</b> Robo</span>` : `<span>Führung: <b>${Math.max(...pos) === 0 ? '–' : MA.esc(teams[pos.indexOf(Math.max(...pos))].name)}</b></span>`}`);
      const move = (i, n) => {
        pos[i] = Math.min(LEN, pos[i] + n);
        const car = c.el.querySelector(`.car[data-i="${i}"]`);
        car.style.setProperty('--f', pos[i] / LEN);
        car.classList.remove('zoom'); void car.offsetWidth; car.classList.add('zoom');
        car.parentElement.querySelector('.lane-pos').textContent = `${pos[i]}/${LEN}`;
        hud();
        if (pos[i] >= LEN && !over) { over = true; setTimeout(() => podium(i), 900); }
      };
      const podium = (winner) => {
        alive = false; clearInterval(timerIv); clearInterval(cpuIv);
        if (w) w.destroy();
        const order = teams.map((t, i) => ({ t, p: pos[i], i })).sort((a, b) => b.p - a.p);
        const humanWin = !teams[winner].cpu;
        const winTitle = (n) => (n === 'Du' ? 'DU GEWINNST!' : `${MA.esc(n).toUpperCase()} GEWINNT!`);
        if (humanWin) MA.Store.badge('rallye');
        c.hud('<span>🏁 Ziel!</span>');
        MA.result(c, {
          title: humanWin ? winTitle(teams[winner].name) : 'ROBO WAR SCHNELLER!',
          emoji: humanWin ? '🏁' : '🤖', win: humanWin,
          lines: order.map((x, k) => `${['🥇', '🥈', '🥉', '4.', '5.', '6.'][k]} <span style="color:${x.t.color}">${MA.esc(x.t.name)}</span> – ${x.p} Felder`),
          xp: humanWin ? 60 : 20,
        });
      };
      const startTimer = (onEnd) => {
        clearInterval(timerIv);
        if (!o.timer) return;
        let left = o.timer;
        const tb = banner.querySelector('.turn-timer');
        timerIv = setInterval(() => {
          if (paused) return;
          left -= 0.1;
          if (tb) { tb.style.width = Math.max(0, (left / o.timer) * 100) + '%'; tb.classList.toggle('low', left < 5); }
          if (left <= 0) { clearInterval(timerIv); onEnd(); }
        }, 100);
      };
      const ROBO = {
        ahead: ['Beep-boop! Ich bin vorne! 😎', 'Robo-Turbo aktiviert! 🔋', 'Schneller rechnen, Mensch! 🤖'],
        behind: ['Hey, nicht so schnell! 😵', 'Meine Schaltkreise glühen … 🔥', 'Du rechnest ja wie ein Supercomputer! 🖥️'],
      };
      const roboSay = (k) => {
        const el = banner.querySelector('.robo-say');
        if (!el || Math.random() < 0.4) return;
        el.textContent = '🤖 ' + U.pick(ROBO[k]);
        el.classList.remove('pop'); void el.offsetWidth; el.classList.add('pop');
      };
      /* --- Solo: gegen Robo --- */
      if (cpu) {
        const speed = { slow: 20, mid: 14, fast: 9 }[o.cpu || 'mid'];
        let acc = 0;
        cpuIv = setInterval(() => {
          if (paused || over) return;
          acc += 0.25;
          const car = c.el.querySelector('.car[data-i="1"]');
          car && car.style.setProperty('--wobble', (acc / speed).toFixed(2));
          if (acc >= speed) { acc = 0; move(1, 1); MA.Sound.tick(); roboSay(pos[1] > pos[0] ? 'ahead' : 'behind'); }
        }, 250);
      }
      const askTeam = () => {
        if (!alive) return;
        if (w) w.destroy();
        const cur = cpu ? 0 : turn % teams.length;
        const team = teams[cur];
        banner.style.setProperty('--c', team.color);
        if (cpu && banner.querySelector('.robo-say')) { /* Banner bleibt, Robo-Sprechblase behalten */ } else
        banner.innerHTML = cpu ? `<span>Rechne schneller als Robo! 🤖</span> <span class="robo-say"></span>` : `<span>🚗 <b>${MA.esc(team.name)}</b> ist dran!</span>${o.timer ? '<div class="turn-timer-wrap"><div class="turn-timer"></div></div>' : ''}`;
        const t = next();
        paused = false;
        const answered = (r) => {
          clearInterval(timerIv);
          if (w) { w.lock(); w.markChoice(r); }
          if (r.ok) {
            strk[cur]++;
            let n = 1;
            if (strk[cur] % 3 === 0) { n = 2; MA.toast(`🔥 TURBO für ${MA.esc(team.name)}! +2 Felder`, 1600); MA.Sound.boost(); } else MA.Sound.ok();
            move(cur, n);
            if (cpu) roboSay(pos[0] > pos[1] ? 'behind' : 'ahead');
          } else { strk[cur] = 0; MA.Sound.bad(); paused = true; }
          turn++;
          if (!over) MA.feedback(st, t, r, { onNext: askTeam, auto: r.ok ? 1200 : 0, nextLabel: cpu ? 'Weiter ▶' : `Weiter: ${MA.esc(teams[turn % teams.length].name)} ▶` });
        };
        w = MA.renderTask(st, t, { onAnswer: answered, hints: cpu });
        startTimer(() => answered({ ok: false, timeout: true }));
      };
      /* --- Lehrkraft-Modus (Buzzer) --- */
      const askBuzzer = () => {
        if (!alive) return;
        if (w) w.destroy();
        const t = next();
        banner.style.setProperty('--c', '#ffe600');
        banner.innerHTML = `<span>📣 Alle rechnen! Wer zuerst richtig antwortet, bekommt das Feld.</span>${o.timer ? '<div class="turn-timer-wrap"><div class="turn-timer"></div></div>' : ''}`;
        w = MA.renderTask(st, t, { display: true });
        const ctl = MA.h(`<div class="buzzer"><button type="button" class="btn btn-alt btn-reveal">👁 Lösung zeigen</button><div class="buzz-teams">${teams.map((tm, i) => `<button type="button" class="btn buzz" data-i="${i}" style="--c:${tm.color}">+1 ${MA.esc(tm.name)}</button>`).join('')}</div><button type="button" class="btn btn-ghost btn-skip">Niemand – nächste Aufgabe ▶</button></div>`);
        st.appendChild(ctl);
        ctl.querySelector('.btn-reveal').addEventListener('click', (e) => {
          e.target.disabled = true;
          ctl.insertAdjacentHTML('afterbegin', `<div class="fb fb-ok"><div class="fb-ans">Lösung: <b>${MA.answerHTML(t)}</b></div>${t.sol ? `<div class="fb-sol-inline">${t.sol}</div>` : ''}</div>`);
        });
        ctl.querySelectorAll('.buzz').forEach((b) => b.addEventListener('click', () => {
          clearInterval(timerIv);
          const i = +b.dataset.i;
          strk.forEach((_, k) => { if (k !== i) strk[k] = 0; });
          strk[i]++;
          if (strk[i] % 3 === 0) { move(i, 2); MA.toast(`🔥 TURBO für ${MA.esc(teams[i].name)}!`, 1500); MA.Sound.boost(); } else { move(i, 1); MA.Sound.ok(); }
          if (!over) setTimeout(askBuzzer, 700);
        }));
        ctl.querySelector('.btn-skip').addEventListener('click', () => { clearInterval(timerIv); askBuzzer(); });
        startTimer(() => { const b = ctl.querySelector('.btn-reveal'); if (!b.disabled) b.click(); MA.Sound.bad(); });
      };
      hud();
      (o.buzzer && !cpu ? askBuzzer : askTeam)();
      return { destroy() { alive = false; clearInterval(timerIv); clearInterval(cpuIv); if (w) w.destroy(); } };
    },
  };

  /* =======================================================
     DUELL (Partner, gleichzeitig auf einem Gerät)
     ======================================================= */
  G.duell = {
    start(c) {
      const o = c.opts;
      const target = o.target || 5;
      const names = o.names || ['Spieler 1', 'Spieler 2'];
      const cols = ['#ff3860', '#2f9bff'];
      let rope = 0, alive = true;
      const srcs = [MA.taskSource(c.topic, c.level), MA.taskSource(c.topic, c.level)];
      const ws = [null, null];
      c.el.innerHTML = `<div class="duell ${o.flip ? 'flip' : ''}">
        <div class="side s0" style="--c:${cols[0]}"><div class="side-head">${MA.esc(names[0])}</div><div class="side-task"></div></div>
        <div class="rope-wrap"><span class="rope-end" style="color:${cols[0]}">◀ ${MA.esc(names[0])}</span><div class="rope"><div class="rope-zone l"></div><div class="rope-zone r"></div><div class="knot"></div></div><span class="rope-end" style="color:${cols[1]}">${MA.esc(names[1])} ▶</span></div>
        <div class="side s1" style="--c:${cols[1]}"><div class="side-head">${MA.esc(names[1])}</div><div class="side-task"></div></div>
      </div>`;
      const knot = c.el.querySelector('.knot');
      const hud = () => c.hud(`<span>Seil: <b>${rope === 0 ? 'Mitte' : rope < 0 ? MA.esc(names[0]) + ' +' + -rope : MA.esc(names[1]) + ' +' + rope}</b></span><span>Ziel: ${target} Züge</span>`);
      const setRope = () => { knot.style.left = 50 + (rope / target) * 45 + '%'; hud(); };
      const ask = (p) => {
        if (!alive) return;
        if (ws[p]) ws[p].destroy();
        const el = c.el.querySelector(`.s${p} .side-task`);
        const t = srcs[p]();
        ws[p] = MA.renderTask(el, t, {
          keyboard: false, compact: true,
          onAnswer(r) {
            ws[p].lock(); ws[p].markChoice(r);
            if (r.ok) {
              rope += p === 0 ? -1 : 1; setRope(); MA.Sound.ok();
              el.parentElement.classList.remove('pull'); void el.offsetWidth; el.parentElement.classList.add('pull');
              if (Math.abs(rope) >= target) return win(p);
              setTimeout(() => ask(p), 350);
            } else {
              MA.Sound.bad();
              MA.feedback(el, t, r, { onNext: () => ask(p), auto: 2000 });
            }
          },
        });
      };
      const win = (p) => {
        alive = false; ws.forEach((w) => w && w.destroy());
        MA.Store.badge('duell');
        MA.result(c, { title: `${MA.esc(names[p]).toUpperCase()} GEWINNT!`, emoji: '⚔️', win: true, lines: [`${MA.esc(names[p])} hat das Seil auf die eigene Seite gezogen!`, 'Revanche?'], xp: 40 });
      };
      setRope();
      ask(0); ask(1);
      return { destroy() { alive = false; ws.forEach((w) => w && w.destroy()); } };
    },
  };

  /* =======================================================
     MEMORY (Solo / Partner / Gruppe)
     ======================================================= */
  MA.buildPairs = (topic, level, want) => {
    const pairs = [], qs = new Set(), as = new Set();
    for (let i = 0; i < 400 && pairs.length < want; i++) {
      const t = topic.gen(level);
      if (!MA.memoryOk(t)) continue;
      const a = MA.answerHTML(t);
      const qh = t.mq !== undefined && t.mq !== '' ? t.mq : t.mq === '' ? '' : t.q;
      const key = U.strip(qh) + (t.mq === '' ? t.vis : '');
      const ak = U.strip(a);
      if (qs.has(key) || as.has(ak)) continue;
      qs.add(key); as.add(ak);
      pairs.push({ q: (qh ? `<div class="mc-q">${qh}</div>` : '') + (t.mq === '' && t.vis ? `<div class="mc-vis">${t.vis}</div>` : ''), a: `<div class="mc-a">${a}</div>` });
    }
    return pairs;
  };
  G.memory = {
    start(c) {
      const o = c.opts;
      const want = o.pairs || 6;
      const pairs = MA.buildPairs(c.topic, c.level, want);
      if (pairs.length < 4) { c.el.innerHTML = '<div class="result"><h2>Dieses Thema eignet sich leider nicht für Memory.</h2></div>'; return { destroy() {} }; }
      const players = c.mode === 'solo' ? [{ name: MA.Store.data.name || 'Du', color: '#00f0ff' }] : o.teams;
      const pts = players.map(() => 0);
      let cur = 0, moves = 0, open = [], found = 0, busy = false, alive = true;
      const t0 = performance.now();
      const cards = U.shuffle(pairs.flatMap((p, i) => [{ i, html: p.q, kind: 'q' }, { i, html: p.a, kind: 'a' }]));
      c.el.innerHTML = `<div class="memory">${players.length > 1 ? `<div class="mem-players">${players.map((p, i) => `<div class="mem-p" data-i="${i}" style="--c:${p.color}">${MA.esc(p.name)}: <b>0</b></div>`).join('')}</div>` : ''}<div class="mem-grid n${cards.length}">${cards.map((cd, k) => `<div class="mcard" role="button" tabindex="0" aria-label="Karte ${k + 1}" data-k="${k}"><div class="mc-inner"><div class="mc-front"><span>?</span></div><div class="mc-back ${cd.kind}">${cd.html}</div></div></div>`).join('')}</div></div>`;
      const hud = () => c.hud(players.length > 1 ? `<span>Am Zug: <b style="color:${players[cur].color}">${MA.esc(players[cur].name)}</b></span><span>Paare ${found}/${pairs.length}</span>` : `<span>Züge <b>${moves}</b></span><span>Paare <b>${found}/${pairs.length}</b></span>`);
      const markCur = () => c.el.querySelectorAll('.mem-p').forEach((e, i) => { e.classList.toggle('cur', i === cur); e.querySelector('b').textContent = pts[i]; });
      const els = c.el.querySelectorAll('.mcard');
      els.forEach((el) => el.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); el.click(); } }));
      els.forEach((el) => el.addEventListener('click', () => {
        if (busy || !alive) return;
        const k = +el.dataset.k;
        if (el.classList.contains('flipped')) return;
        el.classList.add('flipped'); MA.Sound.click();
        open.push(k);
        if (open.length < 2) return;
        moves++;
        const [a, b] = open.map((x) => cards[x]);
        if (a.i === b.i && a.kind !== b.kind) {
          found++; pts[cur]++; MA.Sound.ok();
          open.forEach((x) => els[x].classList.add('matched'));
          open = [];
          if (found === pairs.length) return setTimeout(finish, 700);
        } else {
          busy = true; MA.Sound.bad();
          setTimeout(() => { open.forEach((x) => els[x].classList.remove('flipped')); open = []; busy = false; cur = (cur + 1) % players.length; markCur(); hud(); }, 1300);
        }
        markCur(); hud();
      }));
      const finish = () => {
        alive = false;
        const secs = (performance.now() - t0) / 1000;
        if (players.length === 1) {
          const n = pairs.length;
          const stars = moves <= n + 2 ? 3 : moves <= Math.ceil(n * 1.7) ? 2 : 1;
          MA.Store.setStars(c.topic.id + ':mem', c.level, stars);
          const rec = MA.Store.setBest(c.topic.id, c.level, 'memory', moves, true);
          if (stars === 3) MA.Store.badge('memory');
          MA.result(c, { title: 'ALLE PAARE!', emoji: '🧠', stars, record: rec, lines: [`<b>${moves}</b> Züge für ${n} Paare`, `Zeit: ${fmtTime(secs)}`], xp: 15 + stars * 10 });
        } else {
          const mx = Math.max(...pts), win = players.filter((_, i) => pts[i] === mx);
          MA.result(c, { title: win.length > 1 ? 'UNENTSCHIEDEN!' : `${MA.esc(win[0].name).toUpperCase()} GEWINNT!`, emoji: '🧠', win: true, lines: players.map((p, i) => `<span style="color:${p.color}">${MA.esc(p.name)}</span>: ${pts[i]} Paare`), xp: 30 });
        }
      };
      markCur(); hud();
      return { destroy() { alive = false; } };
    },
  };

  /* =======================================================
     ESCAPE-TRESOR (kooperativ)
     ======================================================= */
  G.tresor = {
    start(c) {
      const next = MA.taskSource(c.topic, c.level);
      const LOCKS = 5;
      const LIVES = { solo: 3, partner: 4, gruppe: 5 }[c.mode] || 3;
      const code = Array.from({ length: LOCKS }, () => U.ri(0, 9));
      let opened = 0, lives = LIVES, w = null, alive = true, penalty = 0;
      const t0 = performance.now();
      c.el.innerHTML = `<div class="tresor"><div class="vault"><div class="vault-door"><div class="vault-wheel"></div><div class="locks">${code.map((_, i) => `<div class="lock" data-i="${i}"><span class="lk">🔒</span><span class="dg">?</span></div>`).join('')}</div></div><div class="vault-inside">💎</div></div><div class="stage"></div></div>`;
      const st = c.el.querySelector('.stage');
      const hud = () => c.hud(`<span>Schlösser <b>${opened}/${LOCKS}</b></span><span class="lives">${'❤️'.repeat(lives)}${'🖤'.repeat(LIVES - lives)}</span><span>⏱ <b class="tclock">0:00</b></span>`);
      const clk = setInterval(() => { const e = c.el.ownerDocument.querySelector('.tclock'); if (e) e.textContent = fmtTime((performance.now() - t0) / 1000 + penalty); }, 500);
      const step = () => {
        if (!alive) return;
        if (w) w.destroy();
        c.el.querySelectorAll('.lock').forEach((l, i) => l.classList.toggle('cur', i === opened));
        const t = next();
        w = MA.renderTask(st, t, {
          hints: true, onHint: () => { penalty += 10; MA.toast('💡 Tipp: +10 Sekunden Strafzeit', 1400); },
          onAnswer(r) {
            w.lock(); w.markChoice(r);
            if (r.ok) {
              const l = c.el.querySelector(`.lock[data-i="${opened}"]`);
              l.classList.add('open'); l.querySelector('.lk').textContent = '🔓'; l.querySelector('.dg').textContent = code[opened];
              opened++; MA.Sound.coin(); hud();
              if (opened >= LOCKS) return setTimeout(win, 900);
              MA.feedback(st, t, r, { onNext: step, auto: 1200 });
            } else {
              lives--; MA.Sound.alarm(); hud();
              c.el.querySelector('.tresor').classList.add('alarm');
              setTimeout(() => c.el.querySelector('.tresor') && c.el.querySelector('.tresor').classList.remove('alarm'), 900);
              if (lives <= 0) return MA.feedback(st, t, r, { onNext: lose, nextLabel: 'Oh nein … ▶' });
              MA.feedback(st, t, r, { onNext: step });
            }
          },
        });
      };
      const win = () => {
        alive = false; clearInterval(clk); if (w) w.destroy();
        const secs = (performance.now() - t0) / 1000 + penalty;
        c.el.querySelector('.vault').classList.add('opened');
        st.innerHTML = '';
        MA.Sound.win();
        MA.Store.badge('tresor');
        setTimeout(() => {
          const rec = MA.Store.setBest(c.topic.id, c.level, 'tresor', Math.round(secs), true);
          MA.result(c, { title: 'TRESOR GEKNACKT!', emoji: '💎', win: true, record: rec, lines: [`Code: <b class="pixel">${code.join(' ')}</b>`, `Zeit: <b>${fmtTime(secs)}</b>${penalty ? ` (inkl. ${penalty} s Strafzeit)` : ''}`, `Übrige Leben: ${'❤️'.repeat(lives)}`], xp: 50 + lives * 10 });
        }, 1600);
      };
      const lose = () => {
        alive = false; clearInterval(clk); if (w) w.destroy();
        MA.result(c, { title: 'ALARM!', emoji: '🚨', lines: ['Der Tresor ist gesperrt.', `Ihr habt ${opened} von ${LOCKS} Schlössern geknackt.`, 'Neuer Versuch – ihr schafft das!'], xp: opened * 8 });
      };
      hud(); step();
      return { destroy() { alive = false; clearInterval(clk); if (w) w.destroy(); } };
    },
  };
})();
