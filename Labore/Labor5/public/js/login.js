document.getElementById('loginForm').addEventListener('submit', function(e){
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    })
        .then(response => response.json())
        .then(data => {
            if(data.success){
                // Benutzerinformationen in Session Storage speichern und weiterleiten
                sessionStorage.setItem('user', JSON.stringify(data));
                window.location.href = 'main.html';
            } else {
                document.getElementById('loginMessage').innerText = data.message;
            }
        })
        .catch(err => console.error(err));
});
