// ------------------------------
// Teilnehmer-ID generieren
// ------------------------------
if (!localStorage.getItem("participantId")) {
    const id = "p_" + Date.now() + "-" + Math.floor(Math.random() * 1000000);
    localStorage.setItem("participantId", id);
}

// -----------------------------
// index.html - Einverständnis und Start
// -----------------------------

// Zugriff auf die Checkbox & Start-Button
const checkbox = document.getElementById("consentCheckbox");
const startButton = document.getElementById("startButton");

// Prüfen, ob wir auf index.html sind
if (checkbox && startButton) {
    // Überprüft, ob die Checkbox angeklickt wurde
    checkbox.addEventListener("change", function () {

        // Wenn die Checkbox aktiviert ist...
        if (this.checked) {
            startButton.disabled = false;    // Button wird freigeschaltet
        } else {
            startButton.disabled = true     // Button bleibt gesperrt
        }
    });

    // Reaktion auf Klick auf den Start-Button
    startButton.addEventListener("click", function () {
        // Weiterleitung zur nächsten Seite (Demografie-Seite)
        window.location.href = "demo.html";
    });
}

// -------------------------------
// demo.html - Validierung + Demo-Daten
// -------------------------------

const demoForm = document.getElementById("demoForm");
const demoNextButton = document.getElementById("demoNextButton");

// Checkboxes für Sehstatus und Geräte
const visionCheckboxes = document.querySelectorAll('input[name="vision"]');
const deviceCheckboxes = document.querySelectorAll('input[name="device"]');

if (demoForm && demoNextButton) {

    demoNextButton.addEventListener("click", function () {

        // 1. Normale Pflichtfeldprüfung (required)
        const isValid = demoForm.reportValidity();
        if (!isValid) return;

        // 2. Mindestens eine Sehstatus-Checkbox?
        let visionChecked = false;
        visionCheckboxes.forEach(cb => {
            if (cb.checked) visionChecked = true;
        });
        if (!visionChecked) {
            alert("Bitte wählen Sie mindestens eine Option für Ihren Sehstatus aus.");
            return;
        }

        // 3. Mindestens ein Geräte-Checkbox?
        let deviceChecked = false;
        deviceCheckboxes.forEach(cb => {
            if (cb.checked) deviceChecked = true;
        });
        if (!deviceChecked) {
            alert("Bitte wählen Sie mindestens ein häufig genutztes Gerät aus.");
            return;
        }

        // 4. Demo-Daten in ein Objekt schreiben
        const demoData = {
            geschlecht: demoForm.gender.value,
            altersgruppe: demoForm.ageGroup.value,

            sehstatus: Array.from(visionCheckboxes)
                .filter(cb => cb.checked)
                .map(cb => cb.value)
                .join(", "),

            praeferenzModus: demoForm.prefMode.value,
            praeferenzBegruendung: demoForm.prefReason.value,

            studienfachBeruf: demoForm.background.value,
            bildschirmzeit: demoForm.screenTime.value,

            haeufigeGeraete: Array.from(deviceCheckboxes)
                .filter(cb => cb.checked)
                .map(cb => cb.value)
                .join(", "),

            teilnahmeGeraet: demoForm.currentDevice.value,
            umgebungsbeleuchtung: demoForm.lightSetting.value
        };

        // 5. Demo-Daten im Browser speichern
        localStorage.setItem("demoData", JSON.stringify(demoData));

        // 6. Weiterleitung zur Light-Seite
        window.location.href = "light.html";
    });
}

// -----------------------------------
// light.html - Pflichtprüfung für Antworten 
// + Weiterleitung (Timer & Antworten später)
// -----------------------------------

const lightAnswers = document.querySelectorAll('input[name^="answer"]');
const nextButtonLight = document.getElementById("nextButtonLight");

if (nextButtonLight) {

    // Timer-Start beim Laden der Seite
    const lightStart = Date.now();

    // Button standardmäßig erstmal gesperrt
    nextButtonLight.disabled = true;

    function checkLightFilled() {
        let allFilled = true;

        lightAnswers.forEach(input => {
            if (input.value.trim() === "") {
                allFilled = false;
            }
        });

        // Button nur aktivieren, wenn alle Felder ausgefüllt sind
        nextButtonLight.disabled = !allFilled;
    }

    // Bei jeder Eingabe prüfen
    lightAnswers.forEach(input => {
        input.addEventListener("input", checkLightFilled);
    });

    // Klick: nur wenn Button aktiv ist
    nextButtonLight.addEventListener("click", function () {
        if (nextButtonLight.disabled) return; // Sicherheitsnetz

        //Zeit stoppen & speichern
        const lightTimeMs = Date.now() - lightStart;
        localStorage.setItem("lightTimeMs", String(lightTimeMs));

        // Debug:
        // console.log("Light-Time", lightTimeMs);

        // Light-Antworten auslesen & speichern
        const lightPayloadAnswers = {
            q1: document.getElementById("lightQuestion1").value.trim(),
            q2: document.getElementById("lightQuestion2").value.trim(),
            q3: document.getElementById("lightQuestion3").value.trim(),
            q4: document.getElementById("lightQuestion4").value.trim()
        };
        localStorage.setItem("lightAnswers", JSON.stringify(lightPayloadAnswers));

        // weiter zur Dark-Seite
        window.location.href = "dark.html";
    });
}




// ------------------------------------
// dark.html - Zeit + Daten senden (Timer & Antworten später)
// ------------------------------------

const darkAnswers = document.querySelectorAll('input[name^="answer"]');
// Daten bei Klick auf Dark-Weiter-Button senden
const nextButtonDark = document.getElementById("nextButtonDark");

if (nextButtonDark) {

    nextButtonDark.disabled = true; // Button standardmäßig erstmal gesperrt
    const darkStart = Date.now(); // Startzeit für Dark-Seite

    function checkDarkFilled() {
        let allFilled = true;

        darkAnswers.forEach(input => {
            if (input.value.trim() === "") {
                allFilled = false;
            }
        });

        nextButtonDark.disabled = !allFilled;
    }

    // Bei jeder Eingabe prüfen
    darkAnswers.forEach(input => {
        input.addEventListener("input", checkDarkFilled);
    });

    // CLICK-HANDLER:
    // Klick => Zeit stoppen + Daten sendeen + Weiterleitung 
    nextButtonDark.addEventListener("click", function () {
        if (nextButtonDark.disabled) return; // Sicherheitsnetz

        // Dark-Zeit speichern
        const darkTimeMs = Date.now() - darkStart;
        localStorage.setItem("darkTimeMs", String(darkTimeMs));

        // Dark-Antworten auslesen & speichern (mit neuem Namen)
        const darkPayloadAnswers = {
            q1: document.getElementById("darkQuestion1").value.trim(),
            q2: document.getElementById("darkQuestion2").value.trim(),
            q3: document.getElementById("darkQuestion3").value.trim(),
            q4: document.getElementById("darkQuestion4").value.trim()
        };
        localStorage.setItem("darkAnswers", JSON.stringify(darkPayloadAnswers));

        //Payload für Google Apps Script 
        const payload = {
            participantId: localStorage.getItem("participantId"),
            lightTimeMs: Number(localStorage.getItem("lightTimeMs") || 0),
            darkTimeMs: darkTimeMs,
            demo: JSON.parse(localStorage.getItem("demoData") || "{}"),
            lightAnswers: JSON.parse(localStorage.getItem("lightAnswers") || "{}"),
            darkAnswers: JSON.parse(localStorage.getItem("darkAnswers") || "{}")
        };

        // Daten in das für GAS benötigte FormData-Format verpacken
        const formData = new FormData();
        // Der Schlüssel 'payload' ist der Name, den GAS in e.parameter.payload erwartet
        formData.append("payload", JSON.stringify(payload));

        // GAS URL muss immer aktuell sein
        const gasUrl = "https://script.google.com/macros/s/AKfycbzOOKj-mSgH9u-NoLmyw-CNCZt6gnNBdAsyou5go8hG4nRNoQsX7nD5sMRyzp5B_0bm/exec";

        // Debugging: 
        console.log("Sende Payload über Fetch:", JSON.stringify(payload));

        // 2. Fetch-Request an GAS senden
        fetch(gasUrl, {
            method: "POST",
            body: formData
        })
            .then(response => response.json()) // Wir erwarten jetzt JSON
            .then(data => {
                if (data.status === "success") {
                    // Nur bei explizitem Erfolg weiterleiten
                    window.location.href = "finish.html";
                } else {
                    // Fehler vom Server anzeigen
                    throw new Error(data.message || "Unbekannter Server-Fehler");
                }
            })
            .catch(error => {
                console.error("Fehler beim Senden:", error);
                alert("Fehler beim Speichern der Daten: " + error.message + "\nBitte wenden Sie sich an den Studienleiter.");
            });
    });
}



