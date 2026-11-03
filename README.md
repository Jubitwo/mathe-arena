# 🕹️ Mathe-Arena – Teste dich selbst!

Eine Mathe-Spielesammlung im Arcade-Look für die **Klassen 5 bis 10** (Bildungsplan Baden-Württemberg 2016).
Läuft komplett im Browser – ohne Anmeldung, ohne Server, ohne Tracking. Ideal für Beamer, Whiteboard, iPad und zu Hause.

## Was steckt drin?

| | |
|---|---|
| **Klassen** | 5, 6, 7, 8, 9, 10 + Knobel-Ecke |
| **Themen** | 42 Themen-Spiele + je ein Zufalls-Mix pro Klasse |
| **Niveaus** | ★ G (grundlegend) · ★★ M (mittel) · ★★★ E (erweitert) |
| **Modi** | 👤 Solo · 👥 Partner · 👨‍👩‍👧‍👦 Gruppe |
| **Formate** | 🎯 Training · ⚡ Blitz-Runde · 🏎️ Mathe-Rallye · ⚔️ Tauzieh-Duell · 🧠 Mathe-Memory · 🔐 Escape-Tresor |

Alle Aufgaben werden zufällig erzeugt – es gehen nie die Aufgaben aus. Jede Aufgabe hat gestufte Tipps, einen Lösungsweg und erkennt typische Fehler (z. B. „Nenner nicht addieren!“).

### Spielformate

- **Training (Solo):** 10 Aufgaben, Tipps, bis zu 3 Sterne.
- **Blitz-Runde (Solo):** 60 Sekunden, Serien geben Zeitbonus, Highscore.
- **Mathe-Rallye:** Rennbahn unten am Bildschirm. Jede richtige Antwort = ein Feld, 3 in Folge = TURBO.
  Solo gegen „Robo“, Partner reihum, Gruppe mit 2–6 Teams – wahlweise mit **Buzzer-Modus** (Lehrkraft vergibt Felder) und Zeitlimit.
- **Tauzieh-Duell (Partner):** Zwei rechnen gleichzeitig auf einem Gerät. Option „gegenüber sitzen“ dreht eine Hälfte.
- **Mathe-Memory:** Aufgabe ↔ Ergebnis (z. B. Pizza-Bild ↔ Bruch). Solo, Partner oder Teams.
- **Escape-Tresor:** 5 Schlösser, begrenzte Leben – kooperativ, ideal als Stundeneinstieg.

## Benutzen

- **Online:** über GitHub Pages (siehe unten).
- **Offline:** Ordner herunterladen und `index.html` doppelklicken – funktioniert ohne Internet.
- Im Unterricht oben rechts **📺 Beamer-Modus** (große Schrift) und **⛶ Vollbild** einschalten.
- Auf dem iPad: In Safari „Teilen → Zum Home-Bildschirm“ – dann startet die Arena wie eine App.

## Veröffentlichen mit GitHub Pages

Der Workflow `.github/workflows/pages.yml` prüft bei jedem Push auf `main` alle Aufgabengeneratoren und veröffentlicht die Seite.
Einmalig nötig: **Settings → Pages → Build and deployment → Source: „GitHub Actions“**.
Danach ist die Seite unter `https://<benutzername>.github.io/<repo-name>/` erreichbar.

## Projektstruktur

```
index.html                 Einstieg
css/style.css              Arcade-Design
assets/                    Pixel-Schrift (selbst erstellt), Icons
js/util.js                 Zufall, Brüche, deutsche Zahlformate, SVG-Helfer
js/core.js                 Speicher (localStorage), Sound, Abzeichen, Konfetti
js/input.js                Aufgaben-Anzeige, Zahlentastatur, Antwortprüfung
js/topics/k5.js … k10.js   Aufgabengeneratoren je Klasse
js/topics/knobel.js        Knobel-Ecke
js/games.js                Die sechs Spielformate
js/app.js                  Bildschirme & Navigation
tools/check-generators.js  Automatischer Test aller Generatoren (node)
tools/build_font.py        Erzeugt die Pixel-Schrift ArenaPixel
```

## Ein neues Thema hinzufügen

In der passenden Datei unter `js/topics/` ein Thema registrieren:

```js
R({
  id: 'k7-beispiel', icon: '🧪', title: 'Mein Thema', tags: ['Rechnen'],
  bp: 'Zahl – Variable – Operation', desc: 'Kurzbeschreibung',
  gen(l) {            // l = 1 (G), 2 (M), 3 (E)
    const a = U.ri(2, 9), b = U.ri(2, 9);
    return {
      type: 'num',                 // num | frac | choice | grid | line
      q: U.expr(`${a} · ${b} = ?`),// Aufgabentext (HTML erlaubt)
      answer: a * b,
      hints: ['Denk an das Einmaleins!'],
      sol: `${a} · ${b} = ${a * b}`,
      mistakes: [{ v: a + b, msg: 'Du hast addiert statt multipliziert.' }],
      mq: `${a} · ${b}`,           // Kurzform für Memory-Karten (optional)
    };
  },
});
```

Danach testen: `node tools/check-generators.js`

## Datenschutz

Keine Cookies, keine externen Schriften oder Skripte, keine Datenübertragung. Fortschritt (Sterne, XP, Abzeichen) liegt nur im `localStorage` des jeweiligen Geräts und kann unter „📘 Für Lehrkräfte“ gelöscht werden.

## Lizenz

Code und Pixel-Schrift: frei für den Unterricht nutzbar.
