const midtransClient = require('midtrans-client');

module.exports = async (req, res) => {
  // Support both GET for status checks (if any) and POST for token creation
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({
      status: 'error',
      message: 'Method Not Allowed. Use POST instead.'
    });
  }

  try {
    const { package: packageId } = req.body;

    if (!packageId) {
      return res.status(400).json({
        status: 'error',
        message: 'Paket langganan harus dipilih.'
      });
    }

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

    const orderId = `MB-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;

    const snap = new midtransClient.Snap({
      isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
      serverKey: process.env.MIDTRANS_SERVER_KEY,
      clientKey: process.env.MIDTRANS_CLIENT_KEY
    });

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

    const transaction = await snap.createTransaction(parameter);

    // Set CORS headers for serverless environment
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    return res.status(200).json({
      status: 'success',
      snap_token: transaction.token,
      redirect_url: transaction.redirect_url,
      order_id: orderId,
      gross_amount: price
    });

  } catch (error) {
    console.error('[Midtrans Serverless Error] Failed to create transaction:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Gagal membuat transaksi pembayaran di server.',
      error: error.message
    });
  }
};
