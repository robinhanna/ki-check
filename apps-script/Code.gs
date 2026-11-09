/**
 * KI-Check für Planungsbüros — Backend
 * Nimmt die Antworten der Seite entgegen und schreibt sie in das Blatt "Antworten".
 * Das Skript läuft als Robin; niemand sonst braucht Zugriff auf die Tabelle.
 */
const CODE_VERSION = 1;
const SHEET_NAME = 'Antworten';
const HEADERS = [
  'Zeitpunkt', 'Score', 'Name', 'Büro', 'Website', 'Team', 'Rolle',
  'Zeit (Top 3)', 'Schreibstunden/Woche', 'Ablauf', 'Häufigkeit', 'Beteiligte', 'Vorlage', 'Programme',
  'Engpässe', 'Wunsch an KI', 'KI-Nutzung', 'KI-Tools', 'Account', 'Projektdaten in KI',
  'Quelle (Link-Parameter)', 'Seitenversion'
];
const MAX_LEN = 4000;

function doGet() {
  return json_({ ok: true, version: CODE_VERSION });
}

function doPost(e) {
  try {
    const d = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    if (d.hp) return json_({ ok: true }); // Honeypot: Bots still ignorieren
    if (!d.website || !d.ablauf) return json_({ ok: false, error: 'Pflichtfelder fehlen' });

    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      const sh = sheet_();
      sh.appendRow([
        new Date(), num_(d.score), s_(d.name), s_(d.buero), s_(d.website), s_(d.team), s_(d.rolle),
        list_(d.zeit), s_(d.schreibstunden), s_(d.ablauf), s_(d.haeufigkeit), s_(d.beteiligte), s_(d.vorlage), s_(d.tools),
        list_(d.engpass), s_(d.wunsch), s_(d.nutzung), list_(d.tools_ki), s_(d.account), s_(d.daten),
        s_(d.quelle), s_(d.version)
      ]);
    } finally {
      lock.releaseLock();
    }
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

/** Einmal ausführen: legt das Blatt mit Kopfzeile an. */
function setupSheet() {
  const sh = sheet_();
  sh.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]).setFontWeight('bold');
  sh.setFrozenRows(1);
  sh.setColumnWidth(10, 420);
  return 'Blatt "' + SHEET_NAME + '" ist bereit.';
}

/** Testlauf ohne Seite: schreibt eine Testzeile und liest sie zurück. */
function testInsert() {
  const before = sheet_().getLastRow();
  doPost({ postData: { contents: JSON.stringify({
    score: 1, name: 'TEST', website: 'https://example.org', ablauf: 'Testeintrag, bitte löschen', version: 'test'
  }) } });
  const after = sheet_().getLastRow();
  if (after !== before + 1) throw new Error('Testzeile wurde nicht geschrieben');
  const v = sheet_().getRange(after, 10).getValue();
  if (v !== 'Testeintrag, bitte löschen') throw new Error('Testzeile falsch gelesen: ' + v);
  return 'OK: Testzeile in Zeile ' + after + ' geschrieben und gelesen. Bitte löschen.';
}

// ---- Hilfen ----
function sheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  return ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
}
function s_(v) {
  let t = (v == null ? '' : String(v)).slice(0, MAX_LEN);
  if (/^[=+\-@]/.test(t)) t = "'" + t; // Formel-Injection verhindern
  return t;
}
function list_(v) { return Array.isArray(v) ? s_(v.join(', ')) : s_(v); }
function num_(v) { const n = Number(v); return isFinite(n) ? n : ''; }
function json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
