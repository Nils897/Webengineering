/**
 * Express-Server für die Benutzerverwaltung und Bereitstellung statischer Inhalte.
 * @module server
 */

const express = require("express");
const path = require("path");
const fs = require("fs");
const userRoutes = require("./Api-Routes/userRoutes"); // Import der Benutzer-Routen

const app = express();
const PORT = 3000;

// Middleware für das Parsen von JSON-Daten
app.use(express.json());

// Statische Dateien bereitstellen (Frontend)
app.use(express.static(path.join(__dirname, "View")));

// Benutzerrouten einbinden
app.use("/api", userRoutes);

/**
 * API-Route zum Abrufen von Benutzerdaten basierend auf dem Benutzernamen.
 * @name GET/api/login-data/:username
 * @function
 * @param {string} username - Der Benutzername des gesuchten Nutzers.
 * @returns {Object} - Gibt die Benutzerdaten zurück oder eine Fehlermeldung.
 */
app.get("/api/login-data/:username", (req, res) => {
    /** @const {string} username - Der angeforderte Benutzername */
    const { username } = req.params;
    /** @const {string} filePath - Pfad zur JSON-Datei mit Benutzerdaten */
    const filePath = path.join(__dirname, "Data", "userData.json");

    // Datei lesen
    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
            console.error("Fehler beim Lesen der Datei:", err);
            return res.status(500).json({ error: "Fehler beim Lesen der Datei" });
        }

        try {
            /** @const {Object} jsonData - Geparste JSON-Daten */
            const jsonData = JSON.parse(data);
            /** @const {Object|null} user - Gefundener Benutzer oder null */
            const user = jsonData.users.find(u => u.username === username);

            if (!user) {
                return res.status(404).json({ error: "Benutzer nicht gefunden" });
            }

            res.json(user);
        } catch (parseErr) {
            console.error("Fehler beim Parsen der JSON-Daten:", parseErr);
            res.status(500).json({ error: "Fehler beim Parsen der JSON-Daten" });
        }
    });
});

// Server starten
app.listen(PORT, () => console.log(`API läuft auf http://localhost:${PORT}`));
