/**
 * Modul zur Verwaltung von Benutzerdaten in einer JSON-Datei.
 * @module userService
 */

const fs = require("fs");
const path = require("path");

/** @const {string} filePath - Pfad zur JSON-Datei mit Benutzerdaten */
const filePath = path.join(__dirname, "../Data/userData.json");

/**
 * Lädt alle Benutzer aus der JSON-Datei.
 * @returns {Array<Object>} - Ein Array mit Benutzerobjekten.
 */
function loadUsers() {
    try {
        if (!fs.existsSync(filePath)) return [];
        const fileContent = fs.readFileSync(filePath, "utf8");
        return JSON.parse(fileContent || "[]");
    } catch (error) {
        console.error("Fehler beim Laden der Benutzer:", error);
        return [];
    }
}

/**
 * Speichert eine Benutzerliste in der JSON-Datei.
 * @param {Array<Object>} users - Die zu speichernden Benutzer.
 */
function saveUsers(users) {
    try {
        fs.writeFileSync(filePath, JSON.stringify(users, null, 4));
    } catch (error) {
        console.error("Fehler beim Speichern der Benutzer:", error);
    }
}

/**
 * Ermittelt die nächste freie Benutzer-ID.
 * @returns {number} - Die nächste verfügbare ID.
 */
function getNextId() {
    const users = loadUsers();
    if (users.length === 0) return 1;
    return Math.max(...users.map(u => u.id)) + 1;
}

/**
 * Erstellt einen neuen Benutzer und speichert ihn in der JSON-Datei.
 * @param {string} firstName - Vorname des Benutzers.
 * @param {string} lastName - Nachname des Benutzers.
 * @param {string} username - Benutzername.
 * @param {string} email - E-Mail-Adresse.
 * @param {string} password - Passwort des Benutzers.
 * @returns {Object} - Das neu erstellte Benutzerobjekt.
 */
function addUser(firstName, lastName, username, email, password) {
    const users = loadUsers();
    const newUser = {
        id: getNextId(),
        firstName,
        lastName,
        username,
        email,
        password,
        credits: 0
    };
    users.push(newUser);
    saveUsers(users);
    return newUser; // Rückgabe des erstellten Benutzers
}

/**
 * Aktualisiert die Credits eines Benutzers.
 * @param {string} username - Benutzername des Nutzers.
 * @param {number} newCredits - Die neuen Credits des Nutzers.
 * @returns {boolean} - Gibt zurück, ob die Aktualisierung erfolgreich war.
 */
function updateCredits(username, newCredits) {
    const users = loadUsers();
    const user = users.find(u => u.username === username);
    if (!user) {
        console.error("User not found:", username);
        return false;
    }
    user.credits = newCredits;
    saveUsers(users);
    return true;
}

module.exports = { loadUsers, addUser, getNextId, updateCredits };
