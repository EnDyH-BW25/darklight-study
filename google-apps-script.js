function doPost(e) {
  try {
    // 1a. Prüfen, ob das e-Objekt und die Parameter vorhanden sind.
    // e.paramter sollte immer existieren, wenn ein Formular gesendet wird.
    if (!e || !e.parameter) {
      throw new Error("POST-Anfrage enthielt keine Parameter (e.parameter).");
    }

    // 1b. Prüfen, ob spezifischer payload-Name 'payload' vorhanden ist.
    if (!e.parameter.payload) {
      // Wenn der Fehler hier auftritt, bedeutet es, dass das Hidden-Feld fehlt. 
      throw new Error("Fehlende Formulardaten (z. B. Payload).");
    }

    // 2. Wenn Payload da ist, parsen und Rest des Scripts weiterlaufen lassen
    var data = JSON.parse(e.parameter.payload);

    // 2b. Prüfen, ob die kritischen Daten im geparsten Objekt sind
    if (!data.participantId) {
      throw new Error("Participant ID fehlt im Payload.");
    }

    // Daten vorbereiten
    var demo = data.demo || {};
    var lightAnswers = data.lightAnswers || {};
    var darkAnswers = data.darkAnswers || {};

    // 3. Tabelle öffnen
    // TODO: Replace with your own Spreadsheet ID here
    // Spreadsheet ID für Studie aktuell: 1DCB-6I1zTGv9FV0dhtg2hJrwf277V6HFU587kPcEZXs
    var ss = SpreadsheetApp.openById("1DCB-6I1zTGv9FV0dhtg2hJrwf277V6HFU587kPcEZXs");
    var sheet = ss.getSheetByName("Studie_LM-DM_Daten");

    if (!sheet) {
      throw new Error("Tabellenblatt 'Studie_LM-DM_Daten' nicht gefunden.");
    }



    // 4. Daten in neue Zeile anhängen
    sheet.appendRow([
      new Date(),               // Timestamp
      data.participantId || "", // Participant ID

      // Demo-Daten - exakt nach Frontend-Objekt-Benennung 
      demo.geschlecht || "",              // Geschlecht
      demo.altersgruppe || "",            // Altersgruppe
      demo.sehstatus || "",               // Sehstatus
      demo.praeferenzModus || "",         // PräferenzModus
      demo.praeferenzBegruendung || "",   // Begründung d. Präferenz
      demo.studienfachBeruf || "",        // Studienfach / Beruf
      demo.bildschirmzeit || "",          // Bildschirmzeit
      demo.haeufigeGeraete || "",         // Häufig genutzte Geräte
      demo.teilnahmeGeraet || "",         // Teilnahme-Gerät
      demo.umgebungsbeleuchtung || "",    // Umgebungsbeleuchtung 

      // Zeit-Messung (Frontend: lightTimeMS, darkTimeMs)
      data.lightTimeMs || "",   // Zeit LM in ms
      data.darkTimeMs || "",    // Zeit DM in ms

      // Light-Antworten
      lightAnswers.q1 || "",
      lightAnswers.q2 || "",
      lightAnswers.q3 || "",
      lightAnswers.q4 || "",

      // Dark-Antworten
      darkAnswers.q1 || "",
      darkAnswers.q2 || "",
      darkAnswers.q3 || "",
      darkAnswers.q4 || "",
    ]);

    // 5. JSON-Antwort zurückgeben
    return ContentService.createTextOutput(JSON.stringify({
      "status": "success",
      "message": "Daten erfolgreich gesendet."
    }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    // Fehler ins Log schreiben und einf Fehlermeldung ausgeben
    console.error(err);
    return ContentService.createTextOutput(JSON.stringify({
      "status": "error",
      "message": err.message
    }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Nur, damit die Web-App-URL in Browser keinen Fehler zeigt: 
function doGet(e) {
  return HtmlService.createHtmlOutput("<html><body><p>Diese Web-App erwartet POST-Anfragen von der Studie.</p></body></html>"
  );
}

// Information: 
// Diese Google Apps Script Datei enthält die serverseitige Logik für die Datenerfassung
// und wurde mit Hilfe von ChatGPT erstellt. Zum Debugging wurde zusätzlich Gemini
// zur Hilfe genommen. Ebenfalls hatten wir auf den letzten Metern vor Veröffentlichung 
// der Website Hilfe eines professionellen Entwicklers (Danke an dieser Stelle an 
// Daniel Vollmer), der uns bei der finalen Fehlersuche unterstützt hat.