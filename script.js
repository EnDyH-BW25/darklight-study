// -----------------------------
// index.html 
// -----------------------------

// Zugriff auf die Checkbox 
const checkbox = document.getElementById("consentCheckbox"); 

// Zugriff auf den Start-Button
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
// demo.html
// -------------------------------

// Formular und Weiter-Button nur holen, wenn existent
const demoForm = document.getElementById("demoForm");
const demoNextButton = document.getElementById("demoNextButton");

// Mehrfachauswahl holen
const visionCheckboxes = document.querySelectorAll('input[name="vision"]');
const deviceCheckboxes = document.querySelectorAll('input[name="device"]');


if (demoForm && demoNextButton) {
    demoNextButton.addEventListener("click", function () {
        
        // 1. Normale Pflichtfeldprüfung (required)
        const isValid = demoForm.reportValidity(); 

        // 2. Mindestens eine Sehstatus-Checkox?
        let visionChecked = false; 
        visionCheckboxes.forEach(function (cb) {
            if (cb.checked) visionChecked = true;
        });

        // 3. Mindestens eine Geräte-Checkbox?
        let deviceChecked = false; 
        deviceCheckboxes.forEach(function (cb) {
            if (cb.checked) deviceChecked = true;
        });

        // 4. Fehlermeldungen, falls nötig
        if (!visionChecked) {
            alert("Bitte wählen Sie mindestens eine Option für Ihren Sehstatus aus."); 
            return; 
        }

        if (!deviceChecked) {
            alert("Bitte wählen Sie mindestens ein häufig genutztes Gerät aus.");
            return; 
        }

        // 5. Weiterleitung zur Light-Seite, wenn alles richtig ist

        if (isValid && visionChecked && deviceChecked) {
            window.location.href = "light.html"; 
            // Später: hier können wir Daten an Google Sheets senden
            // Aktuell: Weiterleitung zur Light-Mode-Aufgabe
        }
    });
}

// -----------------------------------
// light.html
// -----------------------------------

// Weiter-Button auf Light-Seite
const nextButtonLight = document.getElementById("nextButtonLight");

// Nur ausführen, wenn der Button existiert
if (nextButtonLight) {
    nextButtonLight.addEventListener("click", function () {
        window.location.href = "dark.html";     // Weiterleitung zur Dark-Seite
    });
}



// ------------------------------------
// dark.html
// ------------------------------------

// Weiter-Button auf Dark-Seite
const nextButtonDark = document.getElementById("nextButtonDark");

// Nur ausführen, wenn der Button existiert
if (nextButtonDark) {
    nextButtonDark.addEventListener("click", function () {
        window.location.href = "finish.html";     // Weiterleitung zur Finish-Seite
    });
}


// ------------------------------------
// finish.html
// ------------------------------------



// ------------------------------------
// Datenübertragung und TimeStamps
// ------------------------------------

// Automatisches Erzeugen einer Teilnehmer-ID
if (!localStorage.getItem("participantID")) {
    const id = "p_" + Date.now(); + "-" + Math.floor(Math.random() * 1000000);
    localStorage.setItem("participantID", id);
}

// 9 Demo-Felder sauber speichern
const demoForm = document.getElementById("demoForm");
const demoNextButton = document.getElementById("demoNextButton");

if (demoForm && demoNextButton) {
    demoNextButton.addEventListener("click", function () {
        const demoData = {
            geschlecht: demoForm.gender.value,
            altersgruppe: demoForm.ageGroup.value,

            sehstatus: Array.from(
                document.querySelectorAll('input[name="vision"]:checked')
            ).map(cb => cb.value).join(", "),

            praeferenzModus: demoForm.prefMode.value,
            praeferenzBegruendung: demoForm.prefReason.value,

            studienfachBeruf: demoForm.background.value,
            bildschirmzeit: demoForm.screenTime.value,

            haeufigeGeraete: Array.from(
                document.querySelectorAll('input[name="device"]:checked')
            ).map(cb => cb.value).join(", "),
        
            teilnahmeGeraet: demoForm.currentDevice.value,
            umgebungsbeleuchtung: demoForm.lightSetting.value
        };

        localStorage.setItem("demoData", JSON.stringify(demoData));

        window.location.href = "light.html";
    });
}

// Daten bei Klick auf Dark-Weiter-Button senden
const nextButtonDark = document.getElementById("nextButtonDark");

if (nextButtonDark) {
   const darkStart = Date.now();

    nextButtonDark.addEventListener("click", function () {
        const darkTimeMs = Date.now() - darkStart;
        localStorage.setItem("darkTimeMs", String(darkTimeMs));

        const playload = {
            participantID: localStorage.getItem("participantID"),
            timeLightMs: Number (localStorage.getItem("lightTimeMs")),
            timeDarkMs: darkTimeMs,

            demoData: JSON.parse(localStorage.getItem("demoData")),

            answerLight: JSON.parse(localStorage.getItem("answerLight")),
            answerDark: JSON.parse(localStorage.getItem("answerDark"))
        };

        fetch("https://script.google.com/macros/s/AKfycbwXK4HbqQQfr-1sXh0BRfEYXb6m590RLpJZXSXj2A2K7uXqk_MTwSbyiQgdt57NIQv6/exec", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(playload)
        })
        .then(() => {
            window.location.href = "finish.html";
        })
        .catch(() => {
            window.location.href = "finish.html";
        });
    });
}


