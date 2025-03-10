const user = JSON.parse(sessionStorage.getItem('user'));
if (!user) {
    window.location.href = 'index.html';
}

document.getElementById('userInfo').innerText = `Hallo, ${user.firstName} ${user.lastName}. Dein Interessenschwerpunkt ist ${user.interest}.`;

// Zeige das passende Themengebiet basierend auf dem gewählten Interessenschwerpunkt
const interestTopic = document.getElementById(user.interest);
if (interestTopic) {
    interestTopic.style.display = 'block';
}

// Zeige die entsprechende PDF für jedes Themengebiet an
function displayPDF(topic, pdfName) {
    const pdfContainer = document.createElement('div');
    pdfContainer.style.height = '600px';
    pdfContainer.style.width = '100%';

    const pdfIframe = document.createElement('iframe');
    pdfIframe.src = `pdfs/${pdfName}.pdf`;
    pdfIframe.width = '100%';
    pdfIframe.height = '100%';

    pdfContainer.appendChild(pdfIframe);
    topic.appendChild(pdfContainer); // Die PDF wird in das Themengebiet eingefügt
}

// Je nach Interessenschwerpunkt eine PDF anzeigen
if (user.interest === 'HTML5') {
    displayPDF(document.getElementById('HTML5'), 'html_inhalte');
} else if (user.interest === 'CSS') {
    displayPDF(document.getElementById('CSS'), 'css_inhalte');
} else if (user.interest === 'JavaScript') {
    displayPDF(document.getElementById('JavaScript'), 'javascript_inhalte');
}

// Anzeige von Systemzeit und Geokoordinaten
function updateTime() {
    const now = new Date();
    document.getElementById('geoTime').innerText = `Aktuelle Systemzeit: ${now.toLocaleString()}`;
}
updateTime();
setInterval(updateTime, 60000);

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
        const coords = position.coords;
        const geoText = `Deine Geokoordinaten: Breite ${coords.latitude.toFixed(4)}, Länge ${coords.longitude.toFixed(4)}`;
        document.getElementById('geoTime').innerText += '\n' + geoText;
    }, function(error) {
        console.error('Geolocation error:', error);
        document.getElementById('geoTime').innerText += '\nGeolocation konnte nicht ermittelt werden.';
    });
} else {
    document.getElementById('geoTime').innerText += '\nGeolocation wird von diesem Browser nicht unterstützt.';
}
