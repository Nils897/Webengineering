const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(express.static('public')); // Statische Dateien aus dem Ordner "public"
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const usersFile = path.join(__dirname, 'users.json');

function readUsers() {
    if (!fs.existsSync(usersFile)) {
        return [];
    }
    const data = fs.readFileSync(usersFile);
    return JSON.parse(data);
}

function writeUsers(users) {
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
}

// Login-Endpunkt
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const users = readUsers();
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        res.json({ success: true, interest: user.interest, firstName: user.firstName, lastName: user.lastName });
    } else {
        res.json({ success: false, message: 'Benutzername oder Passwort falsch.' });
    }
});

// Registrierungs-Endpunkt
app.post('/register', (req, res) => {
    const { firstName, lastName, username, password, gender, interest, comments } = req.body;

    // Basisvalidierung
    if (!firstName || !lastName || !username || !password || !gender || !interest) {
        return res.json({ success: false, message: 'Bitte füllen Sie alle erforderlichen Felder aus.' });
    }
    const users = readUsers();
    if (users.some(u => u.username === username)) {
        return res.json({ success: false, message: 'Benutzername bereits vergeben.' });
    }
    // Neuen Benutzer speichern
    const newUser = { firstName, lastName, username, password, gender, interest, comments };
    users.push(newUser);
    writeUsers(users);
    res.json({
        success: true,
        message: `Herzlichen Glückwunsch, ${gender === 'male' ? 'Herr' : gender === 'female' ? 'Frau' : ''} ${firstName} ${lastName}! Registrierung erfolgreich.`
    });
});

app.listen(PORT, () => {
    console.log(`Server läuft auf http://localhost:${PORT}`);
});
