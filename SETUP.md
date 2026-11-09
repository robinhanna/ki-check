# KI-Check — Einrichtung (einmalig, ca. 10 Minuten)

Die Seite läuft auf GitHub Pages. Damit die Antworten ankommen, braucht sie eine Google-Tabelle mit einem kleinen Apps Script. Ohne diesen Schritt zeigt die Seite das Ergebnis trotzdem an, meldet aber „Testmodus“.

## 1. Tabelle anlegen
1. In Google Drive eine neue Tabelle anlegen, Name z. B. **KI-Check Antworten**.
2. **Erweiterungen → Apps Script** öffnen.

## 2. Code einfügen
1. Den Inhalt von `apps-script/Code.gs` komplett in `Code.gs` einfügen (alten Inhalt ersetzen) und speichern.
2. Oben die Funktion **setupSheet** auswählen → **Ausführen**. Beim ersten Mal nach Berechtigung fragen lassen → zulassen.
3. Die Funktion **testInsert** auswählen → **Ausführen**. Im Ausführungsprotokoll muss „OK: Testzeile …“ stehen. Die Testzeile in der Tabelle danach löschen.

## 3. Als Web-App bereitstellen
1. **Bereitstellen → Neue Bereitstellung** → Zahnrad → **Web-App**.
2. Ausführen als: **Ich**. Zugriff: **Jeder**.
3. **Bereitstellen** → die **Web-App-URL** kopieren (endet auf `/exec`).
4. Die URL an Claude geben. Claude trägt sie in `index.html` (`API_URL`) ein und veröffentlicht neu.

## Später den Code ändern
Einfügen allein reicht nicht. Nach jeder Änderung: **Bereitstellen → Bereitstellungen verwalten → Stift → Version: Neue Version → Bereitstellen**. Die URL bleibt gleich.

## Link für Benny
Mit vorausgefüllten Feldern:
`https://robinhanna.github.io/ki-check/?buero=BWP%20Landschaftsarchitektur&web=https%3A%2F%2Fwww.bub-landschaftsarchitektur.de&team=4%E2%80%9310`

Für das Team denselben Link weitergeben. Jede Person füllt einzeln aus.

## Datenschutz
Die Antworten landen nur in deiner Tabelle. Die Seite setzt keine Cookies und lädt nichts von Dritten. Auf Wunsch einzelne Zeilen löschen.
