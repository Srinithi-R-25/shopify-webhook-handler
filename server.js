
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

// Root route for testing the server
app.get('/', (req, res) => {
    res.send('Server is running!');
});

// Webhook endpoint
app.post('/shopify-webhook', (req, res) => {
    const orderData = req.body;
    console.log('Order update received:', orderData);

    // Process the order data and send to Freshmarketer
    sendToFreshmarketer(orderData);

    res.status(200).send('Webhook received');
});

const sendToFreshmarketer = (orderData) => {
    const freshmarketerUrl = 'https://eshipz-713335337469684609.myfreshworks.com/crm/sales';
    const apiKey = 'JMNI1QCCdOcpJYIjbkqnqg';

    const data = {
        email: orderData.email,
        order_id: orderData.id,
        tracking_number: orderData.fulfillments[0]?.tracking_number,
        // Add more fields as necessary
    };

    axios.post(freshmarketerUrl, data, {
        headers: {
            'Authorization': `Token token=${apiKey}`,
            'Content-Type': 'application/json'
        }
    }).then(response => {
        console.log('Data sent to Freshmarketer:', response.data);
    }).catch(error => {
        console.error('Error sending data to Freshmarketer:', error.response ? error.response.data : error.message);
    });
};

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
