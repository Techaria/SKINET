// Get package from URL parameters
const urlParams = new URLSearchParams(window.location.search);
const package = urlParams.get('package');
const price = urlParams.get('price');
document.getElementById('package-name').textContent = package
document.getElementById('package-price').textContent = price


function payWithMpesa() {
        document.getElementById('package-name').value = package
        document.getElementById('package-price').value = price
        const mobileNumber = document.getElementById('mobile-number').value;
        const fullMobileNumber = `+254${mobileNumber}`;
        if (mobileNumber === '' || !/^\d{9}$/.test(mobileNumber)) {
        alert('Please enter a valid mobile number.');
        return;
    };
        const data = {
        mobileNumber: fullMobileNumber,
        package: package,
        price: price
    };

    // Send the payment data to the server
    fetch('/process-payment', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Payment request sent. Please complete the payment on your phone.');
        } else {
            alert('Payment request failed: ' + data.error);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while processing the payment.');
    });
};
