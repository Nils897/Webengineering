const bcrypt = require('bcrypt');
const UserModel = require('../Models/userModel');

/**
 * Registriert einen neuen Benutzer mit verschlüsseltem Passwort.
 * @param {Object} req - Die Anforderungsdaten.
 * @param {Object} res - Die Antwortdaten.
 */
exports.registerUser = async (req, res) => {
    const { firstName, lastName, username, email, password } = req.body;

    if (!firstName || !lastName || !username || !email || !password) {
        return res.status(400).json({ message: "Alle Felder sind erforderlich" });
    }

    try {
        const existingUsers = UserModel.loadUsers();

        if (existingUsers.some(u => u.username === username)) {
            return res.status(400).json({ message: "Benutzername bereits vergeben" });
        }

        // Passwort verschlüsseln
        const hashedPassword = await bcrypt.hash(password, 10); // 10 ist der Salt-Round-Wert

        const newUser = UserModel.addUser(firstName, lastName, username, email, hashedPassword);

        res.status(201).json({
            message: "Registrierung & Anmeldung erfolgreich",
            user: newUser
        });

    } catch (error) {
        console.error("Registrierungsfehler:", error);
        res.status(500).json({ message: "Serverfehler bei der Registrierung" });
    }
};


/**
 * Meldet einen Benutzer an.
 * @param {Object} req - Die Anforderungsdaten.
 * @param {Object} res - Die Antwortdaten.
 */
exports.loginUser = async (req, res) => {
    const { username, password } = req.body;

    const users = UserModel.loadUsers();
    const user = users.find(u => u.username === username);

    if (!user) {
        return res.status(401).json({ message: "Ungültiger Username" });
    }

    // Passwort mit dem gespeicherten Hash vergleichen
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        return res.status(401).json({ message: "Ungültiges Passwort" });
    }

    res.json({
        message: "Anmeldung erfolgreich",
        user: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            email: user.email,
            credits: user.credits
        }
    });
};


/**
 * Aktualisiert die Credits eines Benutzers.
 * @param {Object} req - Die Anforderungsdaten.
 * @param {Object} res - Die Antwortdaten.
 */
exports.writeCredits = async (req, res) => {
    const { username, credits } = req.body;

    const success = UserModel.updateCredits(username, credits);

    if (success) {
        res.json({ message: "Credits aktualisiert." });
    } else {
        res.status(404).json({ message: "Benutzer nicht gefunden." });
    }
};
