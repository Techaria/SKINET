document.getElementById('signupForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value; // Don't forget to add confirm password

    fetch('/users/signup', {  // This should match your backend route
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
            title: 'User', // Or any title you want to pass
            firstName, 
            lastName, 
            role: 'User',
            email, 
            password,
            confirmPassword // Include confirmPassword in the request
        }),
    })
    .then(response => {
        if (response.ok) {
            // Redirect to payment.html upon successful signup
            window.location.href = `/payment.html?`;
        } else {
            return response.json().then(data => { throw new Error(data.message); });
        }
    })
    .catch(error => console.error('Error:', error));
});
