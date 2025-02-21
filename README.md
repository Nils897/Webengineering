# Webengineering
Repo für Labore und die Website

Labor 1 - Nils  
Labor 2 - Linus  
Labor 3 - Janne  
Labor 4 - Justin  
Labor 5 - ???  

## Plan:

#### Aufteilung:
Front-end: Nils, Justin  
Back-end: Janne, Linus  

#### Spiele:
Blackjack  
Slot-Machine  
Roulette  

#### Aufbau:
Fester Header und Footer für jede Seite gleich in extra Datei  
Verschiedene Seiteninhate werden dazwischen eingefügt  
Anmeldemöglichkeit / Registrierung (Speicherung in JSON-Datei)  
Header: Anmelde-Button (Registrierung), Home- und Shop-Button, Logo, Titel  
Footer: Impressum, Datenschutzerklärung, Über uns

## Node.js:
- Server, auf dem Backend, wie Json-Datei für User-Informationen liegt
- Controller navigiert zwischen View und Model und macht auch die Anfrage an den Server (soweit ich des verstanden hab)
- Abfrage an die Json-Datei wird über eine API mit Express.js gemacht
- Express.js ist ne Form von Node.js und ist in der Server.js Datei implemetiert
#### Installation (Webstorm):
1. Node.js downloaden über https://nodejs.org/en
2. In Settings -> Languages & Frameworks -> Node.js
3. Bei Interpreter den Pfad zur nodejs\node.exe
4. Bestätigen
5. Wenn man jetzt den Server ausführen will, muss man oben bei der Debug-Configuration die Server.js Datei auswählen. Wenn die gestartet wird, kann man unsere Website im Browser unter http://localhost:3000 öffnen.