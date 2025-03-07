const UserModel = require('../Models/userModel');

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

        const newUser = UserModel.addUser(firstName, lastName, username, email, password);
        res.status(201).json({
            message: "Registrierung & Anmeldung erfolgreich",
            user: newUser // Gibt alle Benutzerdaten inkl. ID und Credits zurück
        });
    } catch (error) {
        console.error("Registrierungsfehler:", error);
        res.status(500).json({ message: "Serverfehler bei der Registrierung" });
    }
};

exports.loginUser = async (req, res) => {
    const { username, password } = req.body;
    const users = UserModel.loadUsers();
    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
        return res.status(401).json({ message: "Ungültige Anmeldedaten" });
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

exports.writeCredits = async (req, res) => {
    const { username, credits } = req.body;
    const success = UserModel.updateCredits(username, credits);
    if (success) {
        res.json({ message: "Credits aktualisiert." });
    } else {
        res.status(404).json({ message: "Benutzer nicht gefunden." });
    }
};