/* =========================================================
   Mathe-Arena – Lernkarten „So geht's"
   Zu jedem Thema: Merksatz, Schritt-für-Schritt-Anleitung,
   durchgerechnetes Beispiel und typischer Fehler.
   Damit können Schülerinnen und Schüler selbstständig arbeiten.
   ========================================================= */
(function () {
  const F = (n, d) => `<span class="fr"><span>${n}</span><span>${d}</span></span>`;
  MA.LEARN = {
    /* ---------------- Klasse 5 ---------------- */
    'k5-kopf': {
      merke: 'Klammern zuerst, dann <b>Punkt vor Strich</b> (· und : vor + und −). Sonst von links nach rechts.',
      schritte: ['Gibt es Klammern? Rechne sie zuerst aus.', 'Suche alle Mal- und Geteilt-Aufgaben und rechne sie.', 'Rechne zum Schluss Plus und Minus von links nach rechts.', 'Große Zahlen zerlegen: 47 + 38 = 47 + 30 + 8.'],
      beispiel: '5 + 3 · 4 → erst 3 · 4 = 12 → dann 5 + 12 = <b>17</b>',
      fehler: '5 + 3 · 4 = 8 · 4 = 32 ✘ – hier wurde Punkt vor Strich vergessen.',
    },
    'k5-zahlenstrahl': {
      merke: 'Der Abstand zwischen zwei Strichen ist immer gleich groß. Finde heraus, <b>wie viel ein Strich wert ist</b>.',
      schritte: ['Suche zwei beschriftete Zahlen, z. B. 0 und 50.', 'Zähle die Schritte (Striche) dazwischen.', 'Teile: Unterschied der Zahlen : Anzahl der Schritte = Wert pro Strich.', 'Zähle von einer beschrifteten Zahl bis zu deiner Zahl.'],
      beispiel: 'Zwischen 0 und 50 sind 5 Schritte → 1 Strich = 10. Die 30 liegt 3 Striche rechts von 0.',
      fehler: 'Jeden Strich als 1 zählen, obwohl er 10 oder 50 wert ist.',
    },
    'k5-koordinaten': {
      merke: 'Ein Punkt P(x|y): <b>Zuerst x nach rechts</b> (oder links), <b>dann y nach oben</b> (oder unten). „Erst laufen, dann klettern.“',
      schritte: ['Starte im Ursprung (0|0).', 'Gehe x Kästchen nach rechts (bei negativem x nach links).', 'Gehe y Kästchen nach oben (bei negativem y nach unten).', 'Tippe auf den Gitterpunkt.'],
      beispiel: 'P(4|2): 4 nach rechts, 2 nach oben. Q(−3|1): 3 nach links, 1 nach oben.',
      fehler: 'x und y vertauschen: (4|2) ist nicht dasselbe wie (2|4)!',
    },
    'k5-flaeche': {
      merke: 'Rechteck: <b>Fläche A = a · b</b> (in cm²), <b>Umfang u = 2 · a + 2 · b</b> (in cm).',
      schritte: ['Lies die Seitenlängen ab oder zähle die Kästchen.', 'Fläche: Länge mal Breite.', 'Umfang: Einmal außen herum alle Seiten addieren.', 'Zusammengesetzte Figur: großes Rechteck minus ausgeschnittenes Stück.'],
      beispiel: 'a = 6 cm, b = 4 cm → A = 6 · 4 = <b>24 cm²</b>, u = 2 · 6 + 2 · 4 = <b>20 cm</b>',
      fehler: 'Fläche und Umfang verwechseln – auf die Einheit achten: cm² ist Fläche, cm ist Länge.',
    },
    'k5-runden': {
      merke: 'Schau auf die Ziffer <b>rechts neben</b> der Rundungsstelle: 0, 1, 2, 3, 4 → abrunden. 5, 6, 7, 8, 9 → aufrunden.',
      schritte: ['Markiere die Rundungsstelle (z. B. Hunderter).', 'Schau auf die Ziffer direkt rechts daneben.', 'Abrunden: Rundungsstelle bleibt. Aufrunden: Rundungsstelle +1.', 'Alle Ziffern rechts davon werden 0.'],
      beispiel: '3.<u>4</u>72 auf Hunderter: rechts von der 4 steht 7 → aufrunden → <b>3.500</b>',
      fehler: 'Einfach abschneiden (3.472 → 3.400) statt zu runden.',
    },
    'k5-groessen': {
      merke: 'Große Einheit → kleine Einheit: <b>malnehmen</b>. Kleine Einheit → große: <b>teilen</b>. 1 m = 100 cm, 1 km = 1000 m, 1 kg = 1000 g, 1 h = 60 min, 1 € = 100 ct.',
      schritte: ['Lies genau: Was ist gegeben, was ist gesucht?', 'Bringe alles in dieselbe Einheit.', 'Plane die Rechenschritte (erst …, dann …).', 'Schreibe einen Antwortsatz mit Einheit.'],
      beispiel: '3 Hefte zu je 1,50 €, bezahlt mit 10 €: 3 · 1,50 € = 4,50 €; 10 € − 4,50 € = <b>5,50 €</b> Rückgeld.',
      fehler: 'Bei Zeit wie mit Dezimalzahlen rechnen: 1 h 30 min sind 90 min, nicht 130 min.',
    },
    'k5-teiler': {
      merke: 'Teilbar durch <b>2</b>: letzte Ziffer gerade · <b>5</b>: endet auf 0 oder 5 · <b>10</b>: endet auf 0 · <b>3</b> bzw. <b>9</b>: Quersumme durch 3 bzw. 9 teilbar · <b>4</b>: letzte zwei Ziffern durch 4 teilbar.',
      schritte: ['Wähle die passende Regel.', 'Quersumme = alle Ziffern addieren (471 → 4 + 7 + 1 = 12).', 'ggT: Teiler beider Zahlen aufschreiben, größten gemeinsamen wählen.', 'kgV: Vielfache der größeren Zahl aufschreiben, bis die kleinere hineinpasst.'],
      beispiel: 'ggT(12; 18): T(12) = {1, 2, 3, 4, 6, 12}, T(18) = {1, 2, 3, 6, 9, 18} → <b>6</b>',
      fehler: 'Beim kgV einfach beide Zahlen malnehmen – das ist ein Vielfaches, aber oft nicht das kleinste.',
    },
    /* ---------------- Klasse 6 ---------------- */
    'k6-pizza': {
      merke: `Bruch = ${F('Zähler', 'Nenner')}. Der <b>Nenner</b> sagt, in wie viele gleiche Teile das Ganze geteilt ist. Der <b>Zähler</b> sagt, wie viele Teile gemeint sind.`,
      schritte: ['Zähle alle Stücke → das ist der Nenner.', 'Zähle die gesuchten Stücke → das ist der Zähler.', 'Kürzen: Zähler und Nenner durch dieselbe Zahl teilen.', 'Rest: Ganzes (z. B. 12/12) minus gegessene Teile.'],
      beispiel: `8 Stücke, 6 belegt → ${F(6, 8)} = ${F(3, 4)} (gekürzt mit 2)`,
      fehler: 'Belegte durch unbelegte Stücke teilen. Unten steht immer die Anzahl ALLER Stücke.',
    },
    'k6-bruchlabor': {
      merke: `Plus/Minus: erst <b>gleichnamig machen</b> (gleicher Nenner), dann Zähler rechnen. Mal: Zähler · Zähler, Nenner · Nenner. Geteilt: mit dem <b>Kehrbruch</b> malnehmen.`,
      schritte: ['Plus/Minus: Gemeinsamen Nenner suchen (kgV der Nenner).', 'Beide Brüche auf diesen Nenner erweitern.', 'Zähler addieren/subtrahieren, Nenner bleibt.', 'Ergebnis vollständig kürzen.'],
      beispiel: `${F(1, 4)} + ${F(2, 3)} = ${F(3, 12)} + ${F(8, 12)} = <b>${F(11, 12)}</b>`,
      fehler: `${F(1, 4)} + ${F(2, 3)} = ${F(3, 7)} ✘ – Nenner werden NIE addiert!`,
    },
    'k6-dezimal': {
      merke: 'Dezimalzahlen vergleichen: <b>Stelle für Stelle</b> von links. Beim Malnehmen: Nachkommastellen beider Faktoren zusammenzählen.',
      schritte: ['Vergleichen: Hänge Nullen an, bis beide gleich viele Nachkommastellen haben (0,5 = 0,50).', 'Plus/Minus: Komma unter Komma schreiben.', 'Mal: Ohne Komma rechnen, dann so viele Nachkommastellen setzen wie beide Faktoren zusammen haben.', '· 10 / · 100: Komma 1 / 2 Stellen nach rechts. : 10 / : 100: nach links.'],
      beispiel: '0,4 · 0,3 → 4 · 3 = 12 → 1 + 1 = 2 Nachkommastellen → <b>0,12</b>',
      fehler: '0,45 > 0,5, weil „45 größer als 5“ ✘ – richtig: 0,45 < 0,50.',
    },
    'k6-winkel': {
      merke: '<b>spitz</b> &lt; 90° · <b>recht</b> = 90° · <b>stumpf</b> zwischen 90° und 180° · <b>gestreckt</b> = 180° · <b>überstumpf</b> &gt; 180°. Nebenwinkel ergeben zusammen 180°, Scheitelwinkel sind gleich groß.',
      schritte: ['Vergleiche den Winkel mit einer Heftecke (90°).', 'Kleiner als die Ecke → spitz, größer → stumpf (bis zur Geraden).', 'Schätzen: Halbe Heftecke = 45°, eine Gerade = 180°.', 'Nebenwinkel: 180° − bekannter Winkel.'],
      beispiel: 'Ein Winkel hat 65° → Nebenwinkel 180° − 65° = <b>115°</b>, Scheitelwinkel <b>65°</b>.',
      fehler: 'Neben- und Scheitelwinkel verwechseln: Gegenüber = gleich groß, daneben = ergänzt zu 180°.',
    },
    'k6-diagramm': {
      merke: '<b>Mittelwert = Summe aller Werte : Anzahl der Werte</b>. Werte liest du an der senkrechten Achse ab.',
      schritte: ['Prüfe die Skala: Wie viel ist ein Kästchen wert?', 'Gehe von der Säulenspitze waagerecht nach links zur Achse.', 'Schreibe alle Werte auf.', 'Rechne: Unterschied, Summe oder Mittelwert.'],
      beispiel: 'Werte 4, 6, 8, 2 → Summe 20 → 20 : 4 = <b>5</b>',
      fehler: 'Beim Mittelwert vergessen, durch die Anzahl zu teilen.',
    },
    'k6-bruchtext': {
      merke: `„${F(3, 4)} von 20“ heißt: <b>20 : 4 · 3</b>. Rückwärts: Wenn ein Teil bekannt ist, rechne erst den Wert für ${F(1, 'n')}.`,
      schritte: ['Unterstreiche: Was ist das Ganze? Welcher Bruchteil?', 'Ganzes : Nenner = ein Teil.', 'Ein Teil · Zähler = gesuchter Bruchteil.', 'Ist nach dem Rest gefragt? Dann vom Ganzen abziehen.'],
      beispiel: `${F(3, 4)} von 24 € → 24 : 4 = 6 → 6 · 3 = <b>18 €</b>`,
      fehler: 'Nur den Bruchteil ausrechnen, obwohl nach dem Rest gefragt ist.',
    },
    /* ---------------- Klasse 7 ---------------- */
    'k7-ganz': {
      merke: '<b>Minus mal Minus = Plus</b>, Minus mal Plus = Minus. Minus einer negativen Zahl: <b>− (−3) = + 3</b>.',
      schritte: ['Löse Doppel-Vorzeichen auf: + (−) → −, − (−) → +.', 'Gleiche Vorzeichen bei Plus: Beträge addieren, Vorzeichen behalten.', 'Verschiedene Vorzeichen: Beträge subtrahieren, Vorzeichen der „stärkeren“ Zahl.', 'Bei Mal/Geteilt: Erst Beträge rechnen, dann Vorzeichen bestimmen.'],
      beispiel: '−7 − (−10) = −7 + 10 = <b>3</b> · (−4) · (−5) = <b>20</b>',
      fehler: '−7 − (−10) = −17 ✘ – das doppelte Minus wird zum Plus!',
    },
    'k7-waage': {
      merke: 'Eine Gleichung ist wie eine Waage im Gleichgewicht: Was du auf <b>einer Seite</b> machst, musst du auch auf der <b>anderen</b> machen.',
      schritte: ['Kisten x auf beiden Seiten? Nimm auf beiden Seiten gleich viele weg.', 'Ziehe auf beiden Seiten die losen Gewichte ab.', 'Teile durch die Anzahl der Kisten.', 'Probe: Setze dein Ergebnis in die Gleichung ein.'],
      beispiel: '3x + 4 = 19 | − 4 → 3x = 15 | : 3 → <b>x = 5</b>. Probe: 3 · 5 + 4 = 19 ✔',
      fehler: 'Nur auf einer Seite abziehen – dann ist die Waage nicht mehr im Gleichgewicht.',
    },
    'k7-prozent': {
      merke: '<b>Prozentwert W = Grundwert G · p : 100</b>. Der Grundwert ist immer das Ganze (100 %) – meistens der alte Preis.',
      schritte: ['Was ist das Ganze (100 %)? Das ist der Grundwert.', '1 % = Grundwert : 100.', 'p % = 1 % · p.', 'Neuer Preis nach Rabatt: alter Preis − Rabatt (oder alter Preis · (100 − p) %).'],
      beispiel: '80 € mit 25 % Rabatt: 1 % = 0,80 € → 25 % = 20 € → neuer Preis <b>60 €</b>',
      fehler: 'Rückwärts einfach p % aufschlagen: Nach 20 % Rabatt 48 € → alter Preis ist 60 €, nicht 57,60 €.',
    },
    'k7-zuordnung': {
      merke: '<b>Proportional</b>: doppelt so viel → doppelt so viel (Quotient y : x gleich). <b>Antiproportional</b>: doppelt so viel → halb so viel (Produkt x · y gleich).',
      schritte: ['Prüfe: Ist y : x überall gleich? → proportional.', 'Ist x · y überall gleich? → antiproportional.', 'Dreisatz: Rechne zuerst auf 1 zurück.', 'Dann auf die gesuchte Menge hochrechnen.'],
      beispiel: '4 Bagger: 12 Tage → 1 Bagger: 48 Tage → 6 Bagger: 48 : 6 = <b>8 Tage</b>',
      fehler: 'Bei antiproportional „normal“ rechnen: mehr Bagger brauchen nicht MEHR Tage.',
    },
    'k7-terme': {
      merke: 'Nur <b>gleichartige Glieder</b> zusammenfassen: x mit x, Zahlen mit Zahlen. Ein Faktor vor der Klammer wird mit <b>jedem</b> Glied multipliziert.',
      schritte: ['Löse Klammern auf (Vorzeichen beachten!).', 'Markiere alle x-Glieder in einer Farbe, alle Zahlen in einer anderen.', 'Fasse jede Farbe zusammen.', 'Einsetzen: Ersetze x durch die Zahl – negative Zahlen in Klammern.'],
      beispiel: '−2(3x − 5) + 4x = −6x + 10 + 4x = <b>−2x + 10</b>',
      fehler: '3x + 5 = 8x ✘ – Zahlen und x-Glieder darf man nicht zusammenfassen.',
    },
    'k7-dreieck': {
      merke: 'In jedem Dreieck gilt: <b>α + β + γ = 180°</b>. Im gleichschenkligen Dreieck sind die beiden <b>Basiswinkel gleich groß</b>.',
      schritte: ['Addiere die bekannten Winkel.', 'Ziehe die Summe von 180° ab.', 'Gleichschenklig: Basiswinkel = (180° − Spitzenwinkel) : 2.', 'Winkel mit x: Gleichung aufstellen, z. B. x + 2x + 3x = 180°.'],
      beispiel: 'α = 50°, β = 70° → γ = 180° − 50° − 70° = <b>60°</b>',
      fehler: 'Beim gleichschenkligen Dreieck vergessen, durch 2 zu teilen.',
    },
    /* ---------------- Klasse 8 ---------------- */
    'k8-gluecksrad': {
      merke: `<b>P = Anzahl günstiger Felder : Anzahl aller Felder</b> (gleich große Felder). Gegenereignis: P(nicht A) = 1 − P(A). Mehrstufig: entlang des Pfades <b>multiplizieren</b>.`,
      schritte: ['Zähle alle Felder.', 'Zähle die Felder der gesuchten Farbe(n).', 'Schreibe den Bruch und kürze.', 'Zwei Drehungen: Wahrscheinlichkeiten multiplizieren.'],
      beispiel: `8 Felder, 3 rot → P(rot) = ${F(3, 8)}. Zweimal rot: ${F(3, 8)} · ${F(3, 8)} = <b>${F(9, 64)}</b>`,
      fehler: 'Bei zwei Drehungen die Wahrscheinlichkeiten addieren statt multiplizieren.',
    },
    'k8-graph': {
      merke: '<b>y = m · x + b</b>. b = Schnittpunkt mit der y-Achse. m = Steigung: <b>1 nach rechts, m nach oben</b> (bei negativem m nach unten).',
      schritte: ['Lies b ab: Wo schneidet die Gerade die y-Achse?', 'Suche zwei Gitterpunkte auf der Geraden.', 'Steigung m = Höhenunterschied : Breitenunterschied.', 'Fällt die Gerade (von links nach rechts), ist m negativ.'],
      beispiel: `Gerade durch (0|1) und (3|3): b = 1, m = ${F(2, 3)} → <b>y = ${F(2, 3)}x + 1</b>`,
      fehler: 'm und b vertauschen oder das Vorzeichen bei fallenden Geraden vergessen.',
    },
    'k8-binom': {
      merke: '1. <b>(a + b)² = a² + 2ab + b²</b> · 2. <b>(a − b)² = a² − 2ab + b²</b> · 3. <b>(a + b)(a − b) = a² − b²</b>',
      schritte: ['Erkenne, welche Formel passt.', 'Bestimme a und b.', 'Setze ein: a², das gemischte Glied 2ab, b².', 'Faktorisieren: Rückwärts – finde a und b aus a² und b², prüfe 2ab.'],
      beispiel: '(x + 5)² = x² + 2 · x · 5 + 5² = <b>x² + 10x + 25</b>',
      fehler: '(x + 5)² = x² + 25 ✘ – das gemischte Glied 2ab fehlt!',
    },
    'k8-gleichung': {
      merke: 'Ziel: <b>x allein</b> auf einer Seite. Auf beiden Seiten immer dasselbe tun (Äquivalenzumformung).',
      schritte: ['Klammern auflösen.', 'Alle x-Glieder auf eine Seite bringen.', 'Alle Zahlen auf die andere Seite bringen.', 'Durch die Zahl vor x teilen. Probe machen!'],
      beispiel: '2(x + 3) = x + 11 → 2x + 6 = x + 11 | − x → x + 6 = 11 | − 6 → <b>x = 5</b>',
      fehler: 'Beim Ausmultiplizieren nur das erste Glied malnehmen: 2(x + 3) ≠ 2x + 3.',
    },
    'k8-zinsen': {
      merke: '<b>Zinsen Z = K · p : 100</b> (pro Jahr). Für m Monate: · m/12. Zinseszins: <b>K · (1 + p/100)ⁿ</b>.',
      schritte: ['Ordne zu: Kapital K (Grundwert), Zinssatz p, Zinsen Z.', 'Gesucht Z: K · p : 100.', 'Gesucht p: Z : K · 100. Gesucht K: Z : p · 100.', 'Mehrere Jahre mit Zinseszins: jedes Jahr · Zinsfaktor.'],
      beispiel: '2.000 € zu 3 % → Z = 2.000 · 3 : 100 = <b>60 €</b> pro Jahr',
      fehler: 'Beim Zinseszins jedes Jahr nur die Zinsen vom Anfangskapital rechnen.',
    },
    'k8-prisma': {
      merke: '<b>Volumen Quader V = a · b · c</b> · <b>Prisma V = Grundfläche · Höhe</b> · Oberfläche Quader O = 2 · (ab + ac + bc). 1 l = 1 dm³ = 1000 cm³.',
      schritte: ['Welche Fläche ist die Grundfläche? (Beim Prisma die Dreiecks- oder Vielecksfläche.)', 'Berechne die Grundfläche.', 'Mal die Höhe (Länge) des Körpers.', 'Einheiten prüfen: cm³ für Volumen, cm² für Oberfläche.'],
      beispiel: 'Dreiecksprisma: Dreieck g = 6 cm, h = 4 cm → G = 12 cm²; Länge 10 cm → <b>V = 120 cm³</b>',
      fehler: 'Bei der Dreiecksfläche das „: 2“ vergessen.',
    },
    /* ---------------- Klasse 9 ---------------- */
    'k9-pythagoras': {
      merke: 'Im rechtwinkligen Dreieck: <b>a² + b² = c²</b>. c ist die <b>Hypotenuse</b> – die längste Seite, gegenüber vom rechten Winkel.',
      schritte: ['Finde den rechten Winkel. Die Seite gegenüber ist c.', 'Gesucht c: c = √(a² + b²).', 'Gesucht eine Kathete: a = √(c² − b²).', 'Erst am Ende runden!'],
      beispiel: 'a = 6, b = 8 → c = √(36 + 64) = √100 = <b>10</b>',
      fehler: 'Für eine Kathete addieren statt subtrahieren – die Kathete muss kürzer als c sein!',
    },
    'k9-wurzel': {
      merke: '√a ist die positive Zahl, die mit sich selbst multipliziert a ergibt. <b>√(a · b) = √a · √b</b>. Teilweise Wurzelziehen: Quadratzahl herausziehen.',
      schritte: ['Kenne die Quadratzahlen 1, 4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144 …', 'Abschätzen: Suche die Quadratzahlen direkt darunter und darüber.', 'Vereinfachen: Zerlege in größte Quadratzahl · Rest.', 'Ziehe aus der Quadratzahl die Wurzel.'],
      beispiel: '√75 = √(25 · 3) = <b>5√3</b>',
      fehler: '√(a + b) = √a + √b ✘ – das gilt nur beim Malnehmen, nicht beim Addieren.',
    },
    'k9-parabel': {
      merke: 'Scheitelpunktform: <b>y = a(x − d)² + e</b> mit Scheitel <b>S(d|e)</b>. a &gt; 0: nach oben geöffnet, a &lt; 0: nach unten.',
      schritte: ['Lies den Scheitelpunkt S(d|e) ab.', 'Setze ein: In der Klammer steht x MINUS d.', 'Ist die Parabel nach unten geöffnet? Dann ein Minus vor die Klammer.', 'Punkt einsetzen, um eine Unbekannte zu bestimmen.'],
      beispiel: 'S(2|−3), nach oben → <b>y = (x − 2)² − 3</b>. S(−1|4) → y = (x + 1)² + 4',
      fehler: 'Bei S(2|…) „x + 2“ schreiben – in der Klammer kehrt sich das Vorzeichen um!',
    },
    'k9-lgs': {
      merke: 'Lösung eines linearen Gleichungssystems = das Zahlenpaar (x|y), das <b>beide</b> Gleichungen erfüllt. Grafisch: der <b>Schnittpunkt</b> der Geraden.',
      schritte: ['Additionsverfahren: Gleichungen addieren, sodass eine Variable wegfällt.', 'Einsetzungsverfahren: Eine Gleichung nach x auflösen und in die andere einsetzen.', 'Die zweite Variable durch Einsetzen bestimmen.', 'Probe in BEIDEN Gleichungen.'],
      beispiel: 'x + y = 10, x − y = 4 → addieren: 2x = 14 → x = 7 → y = 3. <b>(7|3)</b>',
      fehler: 'Die Probe nur in einer Gleichung machen.',
    },
    'k9-kreis': {
      merke: '<b>Umfang u = 2 · π · r = π · d</b> · <b>Fläche A = π · r²</b> · π ≈ 3,14. Der Durchmesser d ist doppelt so lang wie der Radius r.',
      schritte: ['Ist r oder d gegeben? Bei d: r = d : 2.', 'Wähle die passende Formel.', 'Rechne mit der π-Taste (oder 3,14).', 'Runde erst am Ende.'],
      beispiel: 'r = 5 cm → u = 2 · π · 5 ≈ <b>31,4 cm</b>, A = π · 25 ≈ <b>78,5 cm²</b>',
      fehler: 'In A = π · r² den Durchmesser einsetzen.',
    },
    'k9-strahlensatz': {
      merke: 'Bei parallelen Geraden (oder gleicher Sonne) bleiben die <b>Verhältnisse gleich</b>: Höhe : Schatten ist beim Stab wie beim Baum.',
      schritte: ['Finde die zusammengehörenden Strecken (Stab ↔ Baum, kurz ↔ lang).', 'Berechne den Faktor: lang : kurz.', 'Multipliziere die bekannte Höhe mit dem Faktor.', 'Beim Strahlensatz vom Punkt Z aus messen: ZB = ZA + AB.'],
      beispiel: 'Stab 1 m, Schatten 2 m; Baumschatten 16 m → Faktor 8 → Baum <b>8 m</b>',
      fehler: 'Nur AB statt der ganzen Strecke ZB verwenden.',
    },
    /* ---------------- Klasse 10 ---------------- */
    'k10-trigo': {
      merke: `<b>sin α = ${F('Gegenkathete', 'Hypotenuse')}</b> · <b>cos α = ${F('Ankathete', 'Hypotenuse')}</b> · <b>tan α = ${F('Gegenkathete', 'Ankathete')}</b> (Merkwort: GAGA-HüHnerHof-AG)`,
      schritte: ['Markiere den Winkel α und den rechten Winkel.', 'Benenne die Seiten: Hypotenuse (gegenüber 90°), Gegenkathete (gegenüber α), Ankathete (an α).', 'Welche zwei Seiten kommen vor (gegeben + gesucht)? Wähle sin, cos oder tan.', 'Gleichung umstellen, Taschenrechner auf DEG!'],
      beispiel: 'α = 30°, Hypotenuse 10 cm, gesucht Gegenkathete: a = 10 · sin 30° = <b>5 cm</b>',
      fehler: 'Taschenrechner im Modus RAD statt DEG – dann kommen falsche Werte heraus.',
    },
    'k10-wachstum': {
      merke: 'Exponentiell: <b>immer gleicher Faktor</b> q. Bestand nach n Schritten: <b>B = B₀ · qⁿ</b>. Wachstum um p %: q = 1 + p/100, Abnahme: q = 1 − p/100.',
      schritte: ['Linear oder exponentiell? Gleiche Differenz → linear, gleicher Faktor → exponentiell.', 'Bestimme den Faktor q.', 'Rechne B₀ · qⁿ.', 'Gesucht n: Probiere aus oder nutze den Logarithmus.'],
      beispiel: '500 €, jährlich +4 %, 3 Jahre: 500 · 1,04³ ≈ <b>562,43 €</b>',
      fehler: 'Exponentiell wie linear rechnen: 3 · 4 % = 12 % ✘ (es sind 12,49 %).',
    },
    'k10-koerper': {
      merke: '<b>Zylinder V = π r² h</b> · <b>Kegel V = ⅓ π r² h</b> · <b>Pyramide V = ⅓ G h</b> · <b>Kugel V = ⁴⁄₃ π r³</b>',
      schritte: ['Erkenne den Körper.', 'Bestimme r (Achtung: nicht den Durchmesser!) und h.', 'Spitze Körper (Kegel, Pyramide): ⅓ von „Grundfläche mal Höhe“.', 'Zusammengesetzte Körper: Teile einzeln berechnen und addieren.'],
      beispiel: 'Zylinder r = 3 cm, h = 10 cm → V = π · 9 · 10 ≈ <b>283 cm³</b>',
      fehler: 'Beim Kegel oder der Pyramide das „⅓“ vergessen.',
    },
    'k10-potenz': {
      merke: '<b>aᵐ · aⁿ = aᵐ⁺ⁿ</b> · <b>aᵐ : aⁿ = aᵐ⁻ⁿ</b> · <b>(aᵐ)ⁿ = aᵐ·ⁿ</b> · <b>a⁰ = 1</b> · <b>a⁻ⁿ = 1/aⁿ</b>',
      schritte: ['Prüfe: Gleiche Basis? Dann gelten die Potenzgesetze.', 'Malnehmen → Exponenten addieren, Teilen → subtrahieren.', 'Wissenschaftliche Schreibweise: Komma hinter die erste Ziffer ≠ 0 setzen.', 'Komma nach links verschoben → positiver Exponent, nach rechts → negativer.'],
      beispiel: '0,00052 = 5,2 · 10<sup>−4</sup> (Komma 4 Stellen nach rechts)',
      fehler: 'a³ · a⁴ = a¹² ✘ – beim Malnehmen werden Exponenten addiert: a⁷.',
    },
    'k10-quadgl': {
      merke: '<b>pq-Formel</b> für x² + px + q = 0: <b>x = −p/2 ± √((p/2)² − q)</b>. Ist die Zahl unter der Wurzel negativ, gibt es keine Lösung.',
      schritte: ['Bringe die Gleichung auf die Form x² + px + q = 0.', 'Lies p und q MIT Vorzeichen ab.', 'Berechne D = (p/2)² − q. D < 0 → L = { }.', 'x₁ = −p/2 + √D, x₂ = −p/2 − √D.'],
      beispiel: 'x² − 6x + 8 = 0: p = −6, q = 8 → x = 3 ± √(9 − 8) = 3 ± 1 → <b>L = {2; 4}</b>',
      fehler: 'Das Vorzeichen von p übersehen: Bei p = −6 ist −p/2 = +3.',
    },
    'k10-baum': {
      merke: '<b>1. Pfadregel</b>: entlang eines Pfades multiplizieren. <b>2. Pfadregel</b>: Wahrscheinlichkeiten mehrerer passender Pfade addieren. Ohne Zurücklegen ändert sich die Urne!',
      schritte: ['Zeichne/lies das Baumdiagramm.', 'Schreibe an jeden Ast die Wahrscheinlichkeit.', 'Ohne Zurücklegen: Im 2. Zug eine Kugel weniger (Nenner − 1).', 'Pfade multiplizieren, passende Pfade addieren.'],
      beispiel: `3 rot, 2 blau, ohne Zurücklegen: P(rot, rot) = ${F(3, 5)} · ${F(2, 4)} = <b>${F(3, 10)}</b>`,
      fehler: 'Ohne Zurücklegen im zweiten Zug noch mit dem alten Nenner rechnen.',
    },
    /* ---------------- Knobel-Ecke ---------------- */
    'kn-magisch': {
      merke: 'In einem magischen Quadrat hat <b>jede Zeile, Spalte und Diagonale dieselbe Summe</b>.',
      schritte: ['Suche eine vollständige Linie und addiere → magische Summe.', 'Suche eine Linie durch das ?, in der nur das ? fehlt.', 'Magische Summe minus die beiden bekannten Zahlen.', 'Prüfe mit einer anderen Linie.'],
      beispiel: 'Summe 15, in der Zeile stehen 4 und 9 → ? = 15 − 4 − 9 = <b>2</b>',
      fehler: 'Eine Linie verwenden, in der noch ein weiteres Feld fehlt.',
    },
    'kn-folgen': {
      merke: 'Untersuche die <b>Abstände</b> zwischen den Zahlen – oder den <b>Faktor</b>. Hilft das nicht: Abstände der Abstände, Quadratzahlen oder Summe der beiden Vorgänger.',
      schritte: ['Schreibe die Differenzen zwischen den Nachbarn auf.', 'Sind sie gleich? → immer + d.', 'Ist der Quotient gleich? → immer · q.', 'Sonst: Muster in den Differenzen suchen.'],
      beispiel: '2, 5, 10, 17, 26 → Abstände 3, 5, 7, 9 → nächster Abstand 11 → <b>37</b>',
      fehler: 'Nur auf die ersten zwei Zahlen schauen – prüfe das Muster an allen Zahlen.',
    },
    'kn-maschine': {
      merke: 'Rückwärts rechnen mit der <b>Umkehroperation</b>: + ↔ −, · ↔ :. Und in <b>umgekehrter Reihenfolge</b>!',
      schritte: ['Starte beim Ergebnis (rechts).', 'Gehe die Maschine von hinten nach vorne durch.', 'Mache bei jedem Schritt das Gegenteil.', 'Probe: Schicke deine Zahl vorwärts durch.'],
      beispiel: '? → · 3 → + 4 → 19. Rückwärts: 19 − 4 = 15, 15 : 3 = <b>5</b>',
      fehler: 'Die Umkehrungen in der falschen Reihenfolge ausführen.',
    },
    'kn-logik': {
      merke: 'Erst <b>verstehen</b>, dann rechnen! Mach eine <b>Skizze</b> oder probiere es mit kleinen Zahlen aus – viele Rätsel enthalten eine Denkfalle.',
      schritte: ['Lies langsam und markiere das Wichtige.', 'Zeichne eine Skizze (Zaun, Baumstamm, Waage …).', 'Probiere mit einer kleinen Zahl, ob deine Idee stimmt.', 'Prüfe dein Ergebnis mit dem Text.'],
      beispiel: 'Zaun 6 m, alle 2 m ein Pfosten: |—|—|—| → 3 Abstände, aber <b>4 Pfosten</b>.',
      fehler: 'Die erste Idee sofort nehmen, ohne sie zu überprüfen.',
    },
    'kn-mauer': {
      merke: 'Jeder Stein ist die <b>Summe der beiden Steine darunter</b>. Rückwärts: Stein oben minus Nachbar unten.',
      schritte: ['Fülle zuerst alle Steine, die du direkt berechnen kannst.', 'Fehlt unten etwas? Oberer Stein − bekannter Nachbar.', 'Fehlt zu viel? Nenne den unbekannten Stein x.', 'Stelle eine Gleichung für die Spitze auf.'],
      beispiel: 'Unten 3, x, 5, Spitze 20: (3 + x) + (x + 5) = 20 → 2x + 8 = 20 → <b>x = 6</b>',
      fehler: 'Vergessen, dass der mittlere Stein in der Spitze zweimal mitzählt.',
    },
  };
})();
