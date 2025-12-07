function doPost(e) {
  try {
    // 1. Rohdaten ansehen
    const rawBody = e.postData ? e.postData.contents : "";
    const paramPayload = e.parameter ? e.parameter.payload : "";

    // Logging zum Debuggen (in GAS unter "Ausführungen" einsehbar)
    Logger.log("rawBody: " + rawBody); 
    Logger.log("paramePayload: " + paramPayload); 

    // 2. payload-String ermitteln
    let payloadStr = ""; 

    if (paramPayload) {
      // Schönster Fall: Formular-Feld "payload" wurde normal geparst
      payloadStr = paramPayload; 
    } else if (rawBody) {
      // Fallback: Body selbst parsen, z.B. "payload=%7B%22...%7D"
      if (rawBody.startsWith("payload=")) {
        payloadStr = decodeURIComponent(rawBody.substring("payload=".length)); 
      } else {
        payloadStr = rawBody;
      }
    }

    if (!payloadStr) {
      throw new Error("Kein payload übergeben"); 
    }

    // 3. JSON in Objekt umwandeln
    const data = JSON.parse(payloadStr); 

    // 4. Demo-Daten & Antworten absichern
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
