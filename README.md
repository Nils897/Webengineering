# Webengineering

# Node.js Installation auf Ubuntu

Wir gehen davon aus, dass in der gleichen Umgebung wie in den Laboren gearbeitet wird, d.h. eine VM in der Ubuntu läuft.

## 1. Systemaktualisierung

Stelle sicher, dass dein System auf dem neuesten Stand ist:

```bash
sudo apt update
sudo apt upgrade
```

## 2. Installation über das Ubuntu-Paketrepository
```bash
sudo apt install nodejs
sudo apt install npm
```

## 3. Überprüfung der Installation
```bash
node -v
npm -v
```

## 4. Starten der Website
In Webstorm das Terminal öffnen und folgende Befehle eingeben:
```bash
npm install
node server.js
```
Dies erstellt den order node_modules und startet den Server. Am Ende erscheint folgendes:
API läuft auf http://localhost:3000
Somit läuft der Server und Sie können die Website über den Link aufrufen.