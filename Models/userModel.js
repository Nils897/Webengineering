const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, "../Data/userData.json");

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

function saveUsers(users) {
    try {
        fs.writeFileSync(filePath, JSON.stringify(users, null, 4));
    } catch (error) {
        console.error("Fehler beim Speichern der Benutzer:", error);
    }
}

function getNextId() {
    const users = loadUsers();
    if (users.length === 0) return 1;
    return Math.max(...users.map(u => u.id)) + 1;
}

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
    return newUser; // Rückgabe des erstellten Users
}

module.exports = { loadUsers, addUser, getNextId };