/* Prüft alle Aufgabengeneratoren automatisch.
   Aufruf: node tools/check-generators.js            */
const fs = require('fs');
const path = require('path');
global.window = global;
const root = path.join(__dirname, '..', 'js');
const load = (f) => eval(fs.readFileSync(path.join(root, f), 'utf8'));
load('util.js');
['k5', 'k6', 'k7', 'k8', 'k9', 'k10', 'knobel'].forEach((f) => load('topics/' + f + '.js'));
const U = MA.U;
const RUNS = +process.argv[2] || 400;
let errors = 0;
const err = (t, l, msg, task) => { errors++; if (errors < 60) console.log(`✘ ${t.id} L${l}: ${msg}`, task ? JSON.stringify(task).slice(0, 300) : ''); };
const bad = /NaN|undefined|Infinity|\[object/;

for (const t of MA.topics) {
  for (const l of [1, 2, 3]) {
    const seen = new Set();
    let mem = 0;
    for (let i = 0; i < RUNS; i++) {
      let task;
      try { task = t.gen(l); } catch (e) { err(t, l, 'Exception ' + e.message); break; }
      const txt = [task.q, task.vis, task.sol, ...(task.hints || []), ...(task.options || []), task.mq].join(' ');
      if (bad.test(txt)) { err(t, l, 'Text enthält NaN/undefined', task); continue; }
      if (!task.hints || !task.hints.length) err(t, l, 'keine Tipps');
      if (!task.sol) err(t, l, 'keine Lösung');
      seen.add(task.q + (task.vis || '') + JSON.stringify(task.answer));
      switch (task.type) {
        case 'num':
          if (typeof task.answer !== 'number' || !isFinite(task.answer)) err(t, l, 'Antwort keine Zahl', task);
          else {
            // Ist die gerundete Antwort im Toleranzbereich (Schüler tippen gerundet)?
            const tol = task.tol || 1e-6;
            const shown = U.parse(U.fmt(task.answer, tol >= 1 ? 0 : tol >= 0.05 ? 1 : tol >= 0.005 ? 2 : 6).replace(/−/g, '-'));
            if (Math.abs(shown - task.answer) > tol + 1e-9) err(t, l, `gerundete Antwort ${shown} außerhalb Toleranz (${task.answer}, tol ${tol})`);
            if (!task.tol && Math.abs(task.answer * 1e6 - Math.round(task.answer * 1e6)) > 1e-4) err(t, l, 'krumme Antwort ohne Toleranz ' + task.answer, task);
          }
          break;
        case 'frac':
          if (!Number.isInteger(task.answer.n) || !Number.isInteger(task.answer.d) || task.answer.d <= 0) err(t, l, 'Bruch ungültig', task);
          break;
        case 'choice':
          if (!Array.isArray(task.options) || task.options.length < 2) err(t, l, 'zu wenige Optionen', task);
          else if (!(task.answer >= 0 && task.answer < task.options.length)) err(t, l, 'answer-Index falsch', task);
          else if (new Set(task.options.map(U.strip)).size !== task.options.length) err(t, l, 'doppelte Optionen', task.options);
          break;
        case 'grid': {
          const g = task.grid, [x, y] = task.answer;
          if (!Number.isInteger(x) || !Number.isInteger(y) || x < g.xmin || x > g.xmax || y < g.ymin || y > g.ymax) err(t, l, 'Gitterpunkt außerhalb', task);
          break;
        }
        case 'line': {
          const L = task.line, v = task.answer;
          if (v < L.min || v > L.max || Math.abs(((v - L.min) / L.step) - Math.round((v - L.min) / L.step)) > 1e-9) err(t, l, 'Zahlenstrahl-Wert ungültig', task);
          break;
        }
        default: err(t, l, 'unbekannter Typ ' + task.type);
      }
      if (task.memOk !== false && (task.type === 'num' || task.type === 'frac' || task.type === 'choice') && (task.mq !== undefined ? (task.mq !== '' || task.vis) : true)) mem++;
    }
    const variety = seen.size;
    if (variety < Math.min(15, RUNS / 10)) err(t, l, `wenig Abwechslung (${variety} verschiedene)`);
    if (l === 2) console.log(`${String(t.grade).padEnd(2)} ${t.id.padEnd(18)} Vielfalt L2: ${String(variety).padStart(4)}   memory-tauglich: ${Math.round((mem / RUNS) * 100)}%`);
  }
}
console.log(`\n${MA.topics.length} Themen geprüft, ${errors} Fehler.`);
process.exit(errors ? 1 : 0);
