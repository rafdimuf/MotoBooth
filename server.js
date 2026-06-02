const express = require('express');
const cors = require('cors');
const midtransClient = require('midtrans-client');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS and JSON body parser
app.use(cors());
app.use(express.json());

// Serve static HTML/CSS/JS files from the root directory
app.use(express.static(__dirname));

// Serve motobooth.html for root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'motobooth.html'));
});

// Midtrans Snap endpoint to create a transaction token
app.post('/api/place-order', async (req, res) => {
  try {
    const { package: packageId } = req.body;

    if (!packageId) {
      return res.status(400).json({
        status: 'error',
        message: 'Paket langganan harus dipilih.'
      });
    }

    // Determine price based on selected package
    let price = 0;
    let packageName = '';

    if (packageId === '5') {
      price = 8000;
      packageName = 'MotoBooth Premium 5 Hari';
    } else if (packageId === '30') {
      price = 30000;
      packageName = 'MotoBooth Premium 30 Hari';
    } else {
      return res.status(400).json({
        status: 'error',
        message: 'Paket tidak valid. Silakan pilih paket 5 hari atau 30 hari.'
      });
    }

    // Generate a unique order ID: MB-[timestamp]-[random]
    const orderId = `MB-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;

    // Initialize Midtrans Snap client
    const snap = new midtransClient.Snap({
      isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
      serverKey: process.env.MIDTRANS_SERVER_KEY,
      clientKey: process.env.MIDTRANS_CLIENT_KEY
    });

    // Construct Midtrans transaction parameters
    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: price
      },
      item_details: [
        {
          id: `premium_${packageId}d`,
          price: price,
          quantity: 1,
          name: packageName
        }
      ],
      credit_card: {
        secure: true
      }
    };

    // Create transaction token on Midtrans
    const transaction = await snap.createTransaction(parameter);

    console.log(`[Success] Created transaction for order ${orderId}. Token: ${transaction.token}`);

    return res.json({
      status: 'success',
      snap_token: transaction.token,
      redirect_url: transaction.redirect_url,
      order_id: orderId,
      gross_amount: price
    });

  } catch (error) {
    console.error('[Midtrans Error] Failed to create transaction:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Gagal membuat transaksi pembayaran di server.',
      error: error.message
    });
  }
});

// Start the MotoBooth Express server
app.listen(PORT, () => {
  console.log(`===================================================`);
  console.log(` MotoBooth local server is running on port ${PORT}`);
  console.log(` Open http://localhost:${PORT}/payment.html to test!`);
  console.log(`===================================================`);
});
