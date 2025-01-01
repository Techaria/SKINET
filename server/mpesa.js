// mpesa.js
const axios = require('axios');
const moment = require('moment');
const { v4: uuidv4 } = require('uuid');
const { Buffer } = require('buffer');

const consumerKey = 'zD5mf3utFAPC0NStLlUF6Bs2AIDknujzy1GjxTjeAVZL6eaO';
const consumerSecret = 'z2drCsV9tksGX8hfAzynM3AM0H1NWnJnu78vIbwE95kDGPqWHDbRCs3SoJbes5Pv';
const shortCode = 'YOUR_SHORT_CODE';
const passkey = 'YOUR_PASSKEY';
const callbackURL = 'https://skinet.com/payment';  // URL to handle M-Pesa payment notifications

const generateAccessToken = async () => {
    const url = 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials';
    const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');

    try {
        const response = await axios.get(url, {
            headers: {
                Authorization: `Basic ${auth}`,
            },
        });
        return response.data.access_token;
    } catch (error) {
        console.error('Error generating access token:', error);
        throw new Error('Could not generate access token');
    }
};

const stkPush = async (mobileNumber, price) => {
    const accessToken = await generateAccessToken();
    const timestamp = moment().format('YYYYMMDDHHmmss');
    const password = Buffer.from(`${shortCode}${passkey}${timestamp}`).toString('base64');
    const transactionId = uuidv4();

    const url = 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest';
    const data = {
        BusinessShortCode: 174379,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: price,
        PartyA: mobileNumber,
        PartyB: 174379,
        PhoneNumber: mobileNumber,
        CallBackURL: "https://skinet.com/payment",
        AccountReference: "payment id",
        TransactionDesc: 'Payment for internet package',
    };

    try {
        const response = await axios.post(url, data, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error initiating STK push:', error);
        throw new Error('Could not initiate STK push');
    }
};

module.exports = {
    stkPush,
};
