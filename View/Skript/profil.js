document.addEventListener("DOMContentLoaded", function() {
    fetch('path/to/userData.json')
        .then(response => response.json())
        .then(data => {
            // Setze die Benutzerdaten in die entsprechenden span-Elemente
            document.getElementById('firstNameHeader').textContent = data.firstName;
            document.getElementById('lastNameHeader').textContent = data.lastName;
            document.getElementById('firstName').textContent = data.firstName;
            document.getElementById('lastName').textContent = data.lastName;
            document.getElementById('username').textContent = data.username;
            document.getElementById('email').textContent = data.email;
            document.getElementById('credits').textContent = data.credits + ' Credits';
        })
        .catch(error => console.error('Fehler beim Laden der Benutzerdaten:', error));
});
