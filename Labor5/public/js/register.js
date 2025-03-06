document.getElementById('registerForm').addEventListener('submit', function(e){
    e.preventDefault();

    // Überprüfen, ob die Nutzungsbedingungen akzeptiert wurden
    if (!document.getElementById('terms').checked) {
        document.getElementById('registerMessage').innerText = 'Bitte akzeptieren Sie die Nutzungsbedingungen.';
        return;
    }

    const formData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        username: document.getElementById('username').value,
        password: document.getElementById('password').value,
        gender: document.querySelector('input[name="gender"]:checked').value,
        interest: document.getElementById('interest').value,
        comments: document.getElementById('comments').value
    };

    fetch('/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
    })
        .then(response => response.json())
        .then(data => {
            if(data.success){
                document.getElementById('registerMessage').innerHTML = data.message + ' Gehen Sie zurück zur <a href="index.html">Login-Seite</a>.';
            } else {
                document.getElementById('registerMessage').innerText = data.message;
            }
        })
        .catch(err => console.error(err));
});
