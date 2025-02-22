const express = require("express");
const path = require("path");
const app = express();

app.use(express.static(path.join(__dirname, "View")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(3000, () => console.log("API läuft auf http://localhost:3000"));