const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, "../Data/userData.json");

function loadUser() {
    if (!fs.existsSync(filePath)) return [];
    const fileContent = fs.readFileSync(filePath, "utf8");
    return JSON.parse(fileContent || "[]");
}

function saveUser(user) {
    fs.writeFileSync(filePath, JSON.stringify(user, null, 4));
}

function addUser(username, password) {
    const user = loadUser();
    user.push({username, password});
    saveUser(user);
}

module.exports = { loadUser, addUser };