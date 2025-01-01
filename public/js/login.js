document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    // Retrieve user input from the login form
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    // Send the login request to the backend
    fetch('/users/login', {  
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
    })
    .then(response => {
        if (response.ok) {
            return response.json();  // Parse the JSON response
        } else {
            return response.json().then(data => { throw new Error(data.message); });
        }
    })
    .then(data => {
        // Handle successful login, data contains the JWT token and user info
        console.log('Login successful:', data);

        // Store the token in localStorage (or cookies) for later use in authenticated requests
        localStorage.setItem('token', data.token);

        // Redirect to a different page after successful login, e.g., the payment page
        window.location.href = `/payment.html`;
    })
    .catch(error => {
        // Handle errors
        console.error('Error:', error);
    });
});
