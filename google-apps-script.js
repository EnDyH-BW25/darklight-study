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
    var ss = SpreadsheetApp.openById("1FT_kbkZfyUIlOpXqnA1roFO3h3hzxwSaXl6suAUP8BA"); 
    var sheet = ss.getSheetByName("DarkLight_Studie_Daten"); 

    if (!sheet) {
      throw new Error("Tabellenblatt 'DarkLight_Studie_Daten' nicht gefunden.");
    }

    sheet.appendRow(["TEST_POST_SUCCESS"])

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

    // 5. einfache Textbestätigung 
    return ContentService.createTextOutput("Daten erfolgreich gesendet.")
    .setMimeType(ContentService.MimeType.TEXT);

  } catch (err) {
    // Fehler ins Log schreiben und einf Fehlermeldung ausgeben
    console.error(err);
    return HtmlService.createHtmlOutput(
      '<DOCTYPE html><html><body>' + 
      '<h2>Fehler bei der Datenübertragung</h2>' +
      '<p>' + err.message + '</p>' + 
      '</body></html>'
    );
  }
}

// Nur, damit die Web-App-URL in Browser keinen Fehler zeigt: 
function doGet(e) {
  return HtmlService.createHtmlOutput("<html><body><p>Diese Web-App erwartet POST-Anfragen von der Studie.</p></body></html>"
  );
}