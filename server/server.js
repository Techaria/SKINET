require('rootpath')();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const errorHandler = require('_middleware/error-handler');
const { stkPush } = require('./mpesa');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.urlencoded({ extended: true }));
app.use(cors());


//API Routes
app.use('/users', require('../users/users.controller'));
//app.use("/auth", require("../auth/route"))

// global error handler
app.use(errorHandler);

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

app.get('/combined.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'combined.html'));
});

app.get('/payment', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'payment.html'));
    console.log('GET /payment - Sent payment.html');
});
app.post('/process-payment', async (req, res) => {
    const { mobileNumber, package, price } = req.body;

    try {
        const response = await stkPush(mobileNumber, price);
        if (response.ResponseCode === '0') {
            res.json({ success: true, mobileNumber });
            console.log(`POST /process-payment - Payment request sent: ${mobileNumber}, ${package}, ${price}`);
        } else {
            res.json({ success: false, error: response.ResponseDescription });
            console.error(`POST /process-payment - Payment request failed: ${response.ResponseDescription}`);
        }
    } catch (error) {
        console.error('Error processing payment:', error);
        res.status(500).json({ success: false, error: 'Error processing payment. Please try again.' });
    }
});
app.post('/confirm-payment', async (req, res) => {
    const { mobileNumber } = req.body;

    try {
        const user = await User.findOne({ where: { mobileNumber } });
        if (user) {
            user.status = 'active';
            await user.save();
            res.json({ success: true });
            console.log(`POST /confirm-payment - Payment confirmed: ${mobileNumber}`);
        } else {
            res.status(404).json({ success: false, error: 'User not found' });
            console.error(`POST /confirm-payment - User not found: ${mobileNumber}`);
        }
    } catch (error) {
        console.error('Error confirming payment:', error);
        res.status(500).json({ success: false, error: 'Error confirming payment. Please try again.' });
    }
});



// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});