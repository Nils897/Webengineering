const user = JSON.parse(sessionStorage.getItem('user'));
if (!user) {
    window.location.href = 'index.html';
}
document.getElementById('userInfo').innerText = `Hallo, ${user.firstName} ${user.lastName}. Dein Interessenschwerpunkt ist ${user.interest}.`;

// Zeige das passende Themengebiet basierend auf dem gewählten Interessenschwerpunkt
document.getElementById(user.interest).style.display = 'block';

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
    });
} else {
    document.getElementById('geoTime').innerText += '\nGeolocation wird von diesem Browser nicht unterstützt.';
}
