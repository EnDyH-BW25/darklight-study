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

