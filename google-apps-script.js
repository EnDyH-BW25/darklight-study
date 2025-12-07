function doPost(e) {
  try {
    // 1. Payload sauber absichern
    let payloadStr = ""; 

    // Fall A: Formular-POST (bisheriger Weg)
    if (e && e.parameter && e.parameter.payload) {
      payloadStr = e.parameter.payload; 
    }

    // Fall B: JSON-POST per fetch (Backup)
    else if (e && e.postData && e.postData.contents) {
      payloadStr = e.postData.contents; 
    }

    // Wenn beides nicht existiert => echter Fehler
    if (!payloadStr) {
      throw new Error("Kein payload übergeben"); 
    }

    // 2. JSON in Objekt umwandeln
    const data = JSON.parse(payloadStr); 

    // 3. Demo-Daten & Antworten absichern
    const demo = data.demo || {};
    const lightAnswers = data.lightAnswers || {}; 
    const darkAnswers = data.darkAnswers || {};

    // 5. Tabelle öffnen
    const ss = SpreadsheetApp.openById("1FT_kbkZfyUIlOpXqnA1roFO3h3hzxwSaXl6suAUP8BA"); 
    const sheet = ss.getSheetByName("DarkLight_Studie_Daten"); 

    if (!sheet) {
      throw new Error("Tabellenblatt 'DarkLight_Studie_Daten' nicht gefunden.");
    }

    // 6. Daten in neue Zeile anhängen
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

    // 7. finish-html über Google ausgeben (Redirect auf GitHub Pages)
    const html = HtmlService.createHtmlOutput (`
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

    return html; 

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
