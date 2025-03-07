const express = require("express");
const path = require("path");
const fs = require("fs");
const userRoutes = require('./Api-Routes/userRoutes'); // Fügen Sie diese Zeile hinzu

const app = express();
const PORT = 3000;

// Middleware für das Parsen von JSON-Daten
app.use(express.json());

// Statische Dateien bereitstellen
app.use(express.static(path.join(__dirname, "View")));

// Benutzerrouten einbinden
app.use("/api", userRoutes); // Fügen Sie diese Zeile hinzu

// API-Route zum Abrufen von Benutzerdaten
app.get("/api/login-data/:username", (req, res) => {
    const { username } = req.params;
    const filePath = path.join(__dirname, "Data", "userData.json");

    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
            console.error("Fehler beim Lesen der Datei:", err);
            return res.status(500).json({ error: "Fehler beim Lesen der Datei" });
        }

        try {
            const jsonData = JSON.parse(data);
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