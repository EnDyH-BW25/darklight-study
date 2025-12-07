function doPost(e) {
  try {
    // 1. Sicherstellen, dass Parameter und Payload vorhanden sind
    if (!e || !e.parameter || !e.parameter.payload) {
      throw new Error("Fehlende Formulardaten (z.B. Payload).");
    }

    // 2. JSON-String in Objekt umwandeln
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

    // 5. Redirect auf finish.html
    return HtmlService.createHtmlOutput (`
      <!DOCTYPE html>
      <html lang="de">
        <head>
          <meta charset="UTF-8">
          <meta http-equiv="refresh" content="0;url=https://endyh-bw25.github.io/darklight-study/finish.html">
          <title>Abschluss unserer Studie</title>
          <script>
            // Fallback, falls meta-refresh vom Browser blockiert wird
            window.location.href="https://endyh-bw25.github.io/darklight-study/finish.html";
          </script>
        </head>
        <body>
          <p>Weiterleitung zur Abschlussseite...</p>
        </body>
      </html>
    `);

  } catch (err) {
    // Fehler ins Log schreiben und einf Fehlermeldung ausgeben
    console.error(err);
    return HtmlService.createHtmlOutput(
      '<DOCTYPE html><html><body>' + 
      '<h2>Fehler bei der Datenübertragung</h2>‚' +
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