const express = require("express");
const path = require("path");
const fs = require("fs");  // <- Wichtig! Hier wird das fs-Modul geladen

const app = express();
const PORT = 3000;

// Statische Dateien bereitstellen
app.use(express.static(path.join(__dirname, "View")));

// API-Route zum Abrufen Daten eines Users aus der JSON-Datei
app.get("/api/login-data/:username", (req, res) => {
    const { username } = req.params; // Username aus der URL holen
    const filePath = path.join(__dirname, "Data", "sampleUser.json");

    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
            console.error("Fehler beim Lesen der Datei:", err);
            return res.status(500).json({ error: "Fehler beim Lesen der Datei" });
        }

        try {
            const jsonData = JSON.parse(data);
            const user = jsonData.users.find(u => u.username === username); // User suchen

            if (!user) {
                return res.status(404).json({ error: "Benutzer nicht gefunden" });
            }

            res.json(user); // Gibt nur den gefundenen User zurück
        } catch (parseErr) {
            console.error("Fehler beim Parsen der JSON-Daten:", parseErr);
            res.status(500).json({ error: "Fehler beim Parsen der JSON-Daten" });
        }
    });
});

// Server starten
app.listen(PORT, () => console.log(`API läuft auf http://localhost:${PORT}`));
